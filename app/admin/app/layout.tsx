import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import { Suspense } from "react";
import { LoadingSkeleton } from "@/app/components/LoadingSkeleton";
import { Toaster } from "@/components/ui/toaster";
import { AccessGroup, Session } from "@/app/lib/types";
import { getAccessGroups, getRole } from "@/app/auth/auth";
import AdminNav from "./components/admin-siderbar";
import MobileBottomNav from "./components/mobile-bottom-nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin",
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
      {access_profile && <AdminNav currentPersona={access_profile.current || ''} access_profile={access_profile} />}
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden md:pl-16"> {/* Added padding-left to account for sidebar width */}
        {/* Uncomment when Appbar is ready */}
        {/* <Appbar /> */}
        
        <main className="flex-1 overflow-auto md:p-4 p-1 pb-16 md:pb-4"> {/* Added bottom padding for mobile nav */}
          {/* Background Image Container */}
          {/* Mobile Top Navigation Bar - Optional for breadcrumbs or title */}
          <div className="md:hidden fixed top-0 left-0 right-0 bg-white z-20 shadow-md">
            <div className="flex items-center justify-center p-4">
              <Image
                src="/botepco.png"
                alt='Logo'
                width={40}
                height={40}
                className="object-contain"
                priority
              />
              <h1 className="text-lg font-bold ml-2">TRLS Admin</h1>
            </div>
          </div>

          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={'/admin/subtle-prism.png'}
              alt=""
              fill
              className="object-cover"
              quality={100}
              priority
            />
          </div>
          
          <div className="container md:mx-auto md:max-w-7xl bg-white/95 relative mt-16 md:mt-0"> {/* Added top margin for mobile header */}
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