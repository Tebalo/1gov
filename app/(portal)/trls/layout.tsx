import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import { Suspense } from "react";
import { LoadingSkeleton } from "@/app/components/LoadingSkeleton";
import { Toaster } from "@/components/ui/toaster";
import DesktopNav from "./desktop-sidebar";
import { AccessGroup, Session } from "@/app/lib/types";
import { getAccessGroups, getRole } from "@/app/auth/auth";
import MobileBottomNav from "./mobile-bottom-nav";
import Appbar from "@/app/components/appbar";

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
      console.warn('No access profile found');
    }
  } catch (error) {
    console.error('Error fetching session or role:', error);
  }

  // return (
  //   <div className="flex h-screen bg-slate-100">
  //     {/* Desktop Navigation - Hidden on mobile */}
  //     {access_profile && (
  //       <div className="hidden md:block">
  //         <DesktopNav 
  //           currentPersona={access_profile.current || ''} 
  //           access_profile={access_profile} 
  //         />
  //       </div>
  //     )}
      
  //     {/* Main Content Area */}
  //     <div className="flex-1 flex flex-col overflow-hidden md:ml-16">
  //       {/* App Bar - Fixed at top */}
  //       {/* <div className="sticky top-0 z-30">
  //         <Appbar />
  //       </div> */}
        
  //       {/* Main Content with Background */}
  //       <main className="flex-1 overflow-auto relative">
  //         {/* Background Image Container - Fixed to cover entire main area */}
  //         <div className="fixed inset-0 w-full h-full md:left-16">
  //           <Image
  //             src={'/subtle-prism1.png'}
  //             alt=""
  //             fill
  //             className="object-cover object-center blur-sm"
  //             quality={100}
  //             priority
  //           />
  //         </div>
          
  //         {/* Content Container */}
  //         <div className="relative min-h-full">
  //           <div className="container mx-auto p-4 lg:p-0 max-w-7xl">
  //             <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-sm p-6">
  //               <Suspense fallback={<LoadingSkeleton />}>
  //                 {children}
  //               </Suspense>
  //             </div>
  //           </div>
  //         </div>
  //       </main>
  //     </div>
      
  //     {/* Mobile Bottom Navigation - Only on mobile */}
  //     {access_profile && (
  //       <div className="md:hidden">
  //         <MobileBottomNav 
  //           currentPersona={access_profile.current || ''} 
  //           access_profile={access_profile} 
  //         />
  //       </div>
  //     )}
      
  //     {/* Toast Notifications */}
  //     <Toaster />
  //   </div>
  // );
  return (
    <main className="flex min-h-screen w-full flex-col relative bg-slate-100">
      {/* Background Image Container */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={'/subtle-prism1.png'}
          alt=""
          fill
          className="object-cover object-center blur-sm opacity-40"
          quality={100}
          priority
        />
        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/80 via-white/60 to-slate-100/80"/>
      </div>
      
      {/* Content wrapper */}
      <div className="flex relative z-10 h-screen overflow-hidden">
        {/* Desktop Navigation - Hidden on mobile */}
        {access_profile && (
          <div className="hidden md:block">
            <DesktopNav 
              currentPersona={access_profile.current || ''} 
              access_profile={access_profile} 
            />
          </div>
        )}
        
        <div className="flex flex-col flex-grow relative md:pl-16">
          {/* App Bar - Fixed at top */}
          {/* <div className="sticky top-0 z-30">
            <Appbar />
          </div> */}
          
          <main className="flex-grow overflow-auto md:p-6">
            <div className="max-w-full mx-auto p-4 lg:p-0">
              <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-sm p-6">
                <Suspense fallback={<LoadingSkeleton />}>
                  {children}
                </Suspense>
              </div>
            </div>
          </main>
          
          <Toaster />
        </div>
      </div>
      
      {/* Mobile Bottom Navigation - Only on mobile */}
      {access_profile && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
          <MobileBottomNav 
            currentPersona={access_profile.current || ''} 
            access_profile={access_profile} 
          />
        </div>
      )}
    </main>
  )
}