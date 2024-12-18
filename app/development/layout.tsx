import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { LoadingSkeleton } from "@/app/components/LoadingSkeleton";
import { Toaster } from "@/components/ui/toaster";
// import { NavigationMenuTRLS } from "./components/navigation-menu";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TRLS DEV",
  description: "Teacher registration and licensing system",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="flex flex-col min-h-screen">
        <nav className="sticky top-0 z-50 backdrop-blur-sm bg-white/75 border-b">
          {/* <NavigationMenuTRLS /> */}
        </nav>
        
        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="rounded-lg bg-white shadow-sm border">
            <div className="p-6">
              <Suspense fallback={<LoadingSkeleton />}>
                {children}
              </Suspense>
            </div>
          </div>
          <Toaster />
        </main>
      </div>
    </div>
  );
}