import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import { Suspense } from "react";
import { LoadingSkeleton } from "@/app/components/LoadingSkeleton";
import { Toaster } from "@/components/ui/toaster";
import NavigationWrapper from "./navigation-wrapper"; // Import the wrapper
import { AccessGroup, Session } from "@/app/lib/types";
import { getAccessGroups, getRole } from "@/app/auth/auth";

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
        {/* Navigation Components */}
        {access_profile && (
          <NavigationWrapper 
            currentPersona={access_profile.current || ''} 
            access_profile={access_profile} 
          />
        )}
        
        <div className="flex flex-col flex-grow relative md:pl-16">
          <main className="flex-grow overflow-auto md:py-2 md:px-6">
            <div className="max-w-full mx-auto">
              <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-sm px-6 py-4">
                <Suspense fallback={<LoadingSkeleton />}>
                  {children}
                </Suspense>
              </div>
            </div>
          </main>
          
          <Toaster />
        </div>
      </div>
    </main>
  )
}