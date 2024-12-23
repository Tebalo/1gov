import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { LoadingSkeleton } from "@/app/components/LoadingSkeleton";
import { Toaster } from "@/components/ui/toaster";
import DevSidebar from "./components/DevSidebar";
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
    <div className="flex h-screen bg-slate-100">
        <div >
          <DevSidebar/>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          {/*<Appbar/>*/}
          <main className="p-4 rounded-lg">
            <div className="p-0">
              <Suspense fallback={<LoadingSkeleton/>}>{children}</Suspense>
              <Toaster />
            </div>
          </main>
        </div>
    </div>
  );
}