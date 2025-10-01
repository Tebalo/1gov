'use client'

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { getSession, logout, updateAccessGroup } from "@/app/auth/auth";
import { AccessGroup } from '@/app/lib/types';
import { ChevronRight, LogOut, User, Settings as SettingsIcon } from 'lucide-react';
import { portalNames } from '@/app/lib/store';
import { Badge } from '@/components/ui/badge';

interface NavUtilsProps {
  accessProfile: AccessGroup | null;
}

const NavUtils: React.FC<NavUtilsProps> = ({ accessProfile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [isLoggingOut, setIsLogOut] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isPortalSwitchDialogOpen, setIsPortalSwitchDialogOpen] = useState(false);
  const [selectedPortal, setSelectedPortal] = useState<string | null>(null);
  const [isSwitchingPortal, setIsSwitchingPortal] = useState(false);
  const env = process.env.environment;

  const handleLogout = async () => {
    try {
      setIsLogOut(true);
      await logout();
    } catch (error) {
      setIsLogOut(false);
      console.error('Error during logout:', error);
    }
  };

  const handlePortalSwitch = (persona: string) => {
    setSelectedPortal(persona);
    setIsPortalSwitchDialogOpen(true);
    setIsPortalOpen(false);
    setIsOpen(false);
  };

  const switchPortal = async (persona: string) => {
    try {
      setIsSwitchingPortal(true);
      await updateAccessGroup(persona);
    } catch (error) {
      console.error('Error switching portal:', error);
    } finally {
      setIsSwitchingPortal(false);
      setIsPortalSwitchDialogOpen(false);
      setSelectedPortal(null);
    }
  };

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="h-14 w-14 p-0 flex flex-col items-center justify-center gap-1">
            <Avatar className="h-6 w-6">
              <AvatarImage src="/avatars/011.png" alt="Avatar" />
              <AvatarFallback>{accessProfile?.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-[10px] text-center font-medium text-muted-foreground">Profile</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48" side='right' align="start">
          <div className="grid gap-2">

            {accessProfile && (
              <div className="px-2 py-1.5 mb-1">
                <p className="text-sm font-medium truncate">{accessProfile.username}</p>
                <p className="text-xs text-muted-foreground truncate text-wrap">
                  {accessProfile.current && portalNames[accessProfile.current]}
                </p>
                <div className='flex items-end gap-1 justify-end'>
                  <Badge variant={env?.toLowerCase() === 'uat' ? 'default' : env?.toLowerCase() === 'production' ? 'destructive' : 'outline'}>
                    {env?.toUpperCase()}
                  </Badge>
                </div>
              </div>
            )}
            <Separator />
            <div className="grid gap-1">
              <Link href="#" className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-accent">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
              
              <Popover open={isPortalOpen} onOpenChange={setIsPortalOpen}>
                <PopoverTrigger asChild>
                  <div className="flex items-center justify-between gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-accent cursor-pointer">
                    <div className="flex items-center gap-2">
                      <SettingsIcon className="h-4 w-4" />
                      <span>Switch Portal</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-72" side='right' align="start">
                  <div className="space-y-1">
                    {accessProfile?.persona.map((persona) => (
                      <div
                        key={persona}
                        className="cursor-pointer px-3 py-2 rounded-md hover:bg-accent flex items-center justify-between"
                        onClick={() => handlePortalSwitch(persona)}
                      >
                        <span className="text-sm">
                          {portalNames[persona] || persona}
                        </span>
                        {persona === accessProfile.current && (
                          <span className="flex w-3 h-3 bg-green-500 rounded-full"></span>
                        )}
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              
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

      {/* Logout Dialog */}
      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isLoggingOut ? "Logging Out..." : "Confirm Logout"}</DialogTitle>
            <DialogDescription>
              {isLoggingOut ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Removing session...</span>
                </div>
              ) : (
                "Are you sure you want to log out? This will end your current session."
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
                  Processing...
                </>
              ) : (
                'Logout'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Portal Switch Dialog */}
      <Dialog open={isPortalSwitchDialogOpen} onOpenChange={setIsPortalSwitchDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Switch Portal</DialogTitle>
            <DialogDescription>
              {isSwitchingPortal ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Switching portal...</span>
                </div>
              ) : (
                <>Are you sure you want to switch to {selectedPortal && portalNames[selectedPortal]}?</>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsPortalSwitchDialogOpen(false)}
              disabled={isSwitchingPortal}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => selectedPortal && switchPortal(selectedPortal)}
              disabled={isSwitchingPortal}
            >
              {isSwitchingPortal ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Confirm'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NavUtils;