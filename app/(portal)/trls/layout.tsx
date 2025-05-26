import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import Appbar from "@/app/components/appbar"; 
import { Suspense } from "react";
import { LoadingSkeleton } from "@/app/components/LoadingSkeleton";
import { Toaster } from "@/components/ui/toaster";
import DesktopNav from "./desktop-sidebar";
import { AccessGroup, Session } from "@/app/lib/types";
import { getAccessGroups, getRole } from "@/app/auth/auth";
import MobileBottomNav from "./mobile-bottom-nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TRLS",
  description: "Teacher registration and licensing system",
  icons: {
    icon: '/Code-of-Arms-colour.png'
  }
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let session: Session | null = null;
  let userRole: string = '';
  let access_profile: AccessGroup | null = null;

  try {
    userRole = await getRole() || '';
    access_profile = await getAccessGroups() || null;
    
    if(!access_profile) {
      // Uncomment when logout function is available
      // await logout()
      console.warn('No access profile found');
    }
  } catch (error) {
    console.error('Error fetching session or role:', error);
    // Handle error appropriately, maybe show an error message or redirect
  }

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Desktop Navigation */}
      {access_profile && <DesktopNav currentPersona={access_profile.current || ''} access_profile={access_profile} />}
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden md:pl-16"> {/* Added padding-left to account for sidebar width */}
        {/* Uncomment when Appbar is ready */}
        {/* <Appbar /> */}
        
        <main className="flex-1 overflow-auto p-4">
          {/* Background Image Container */}
          <div className="absolute inset-0 w-full h-full ">
            <Image
              src={'/subtle-prism1.png'}
              alt=""
              fill
              className="object-cover"
              quality={100}
              priority
            />
            {/* Overlay for better readability */}
            {/* <div className="absolute inset-0 bg-sky-400/55"/> */}
          </div>
          <div className="container mx-auto pt-10 max-w-full max-h-fit bg-white/95 relative z-10">
            <Suspense fallback={<LoadingSkeleton />}>
              {children}
            </Suspense>
          </div>
          <Toaster />
        </main>
      </div>
        {/* Mobile Bottom Navigation */}
        {access_profile && (
        <MobileBottomNav 
          currentPersona={access_profile.current || ''} 
          access_profile={access_profile} 
        />
      )}
    </div>
  );
}