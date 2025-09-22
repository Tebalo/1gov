'use client'

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { LogOut, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AccessGroup, Session } from '@/app/lib/types';
import { getAccessGroups, getRole, logout } from '@/app/auth/auth';
import { Profile } from './profile'; // Import the Profile component

export function UserProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLogOut] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // State for Profile dialog
  const [userProfile, setUserProfile] = useState<{
    username: string;
    email: string;
    initials: string;
    id: number | null;  // Add ID field
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const env = process.env.NODE_ENV || 'development';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const userRole = await getRole() || '';
        const access_profile = await getAccessGroups() || null;
        const userData = await sessionStorage.getItem('user_data')

        if (!access_profile) {
          console.warn('No access profile found');
        }
        
        const profile = {
          username: access_profile?.username || "Guest",
          email: access_profile?.username || "No email provided",
          initials: access_profile?.username ? access_profile.username.charAt(0).toUpperCase() : "G",
          id: userData ? JSON.parse(userData).id: null,
        };

        setUserProfile(profile);

      } catch (error) {
        console.error('Error fetching session or role:', error);
        // Set fallback profile
        setUserProfile({
          username: "Guest",
          email: "No email provided",
          initials: "G",
          id: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // UPDATED: Enhanced logout function to completely clear user session
  const handleLogout = async () => {
    try {
      setIsLogOut(true);
      
      // UPDATED: Clear session storage first
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('refresh_token');
      sessionStorage.removeItem('user_data');
      
      // UPDATED: Clear cookies by setting them to expire
      document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'user_data=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      
      // UPDATED: Call the existing logout function for additional cleanup
      await logout();
      
      console.log('✅ User session deleted successfully');
      
      // UPDATED: Redirect to login page after successful logout
      setTimeout(() => {
        window.location.href = '/customer/login';
      }, 1000);
      
    } catch (error) {
      setIsLogOut(false);
      console.error('Error during logout:', error);
      
      // UPDATED: Force cleanup even if logout API fails
      sessionStorage.clear();
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      // UPDATED: Redirect to login page even on error
      setTimeout(() => {
        window.location.href = '/customer/login';
      }, 500);
    }
  };

  if (isLoading) {
    return (
      <Button variant="ghost" className="h-14 w-14 p-0 flex flex-col items-center justify-center gap-1" disabled>
        <Avatar className="h-6 w-6">
          <AvatarFallback>...</AvatarFallback>
        </Avatar>
        <span className="text-[10px] text-center font-medium text-muted-foreground">Loading</span>
      </Button>
    );
  }

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="h-14 w-14 p-0 flex flex-col items-center justify-center gap-1">
            <Avatar className="h-6 w-6">
              <AvatarImage src="/avatars/01.png" alt="Avatar" />
              <AvatarFallback>{userProfile?.initials}</AvatarFallback>
            </Avatar>
            <span className="text-[10px] text-center font-medium text-muted-foreground">Profile</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48" side='left' align="start">
          <div className="grid gap-2">
            <div className="px-2 py-1.5 mb-1">
              <p className="text-sm font-medium truncate">{userProfile?.username}</p>
              <p className="text-xs text-muted-foreground truncate">
                {userProfile?.email}
              </p>
            </div>
            <Separator />
            <div className="grid gap-1">
              <div 
                className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-accent cursor-pointer" 
                onClick={() => {
                  setIsOpen(false);
                  setIsProfileOpen(true);
                }}
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </div>
              
              <div 
                className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-accent cursor-pointer" 
                onClick={() => setIsLogoutDialogOpen(true)}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Profile Dialog - This is where we call the Profile component */}
      <Profile 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        userId={userProfile?.id || 0} 
      />

      {/* UPDATED: Enhanced Logout Dialog with better session deletion messaging */}
      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isLoggingOut ? "Clearing Session..." : "Confirm Logout"}</DialogTitle>
            <DialogDescription>
              {isLoggingOut ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Deleting user session...</span>
                </div>
              ) : (
                "Are you sure you want to log out? This will completely delete your current session and redirect you to the login page."
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLogoutDialogOpen(false)} disabled={isLoggingOut}>
              Cancel
            </Button>
            <Button onClick={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting Session...
                </>
              ) : (
                'Logout'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}