import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Appbar from "@/app/components/appbar"; // Pending executive decision
import DynamicSidebar from "@/app/components/DynamicSideBar";
import { Suspense } from "react";
import { LoadingSkeleton } from "@/app/components/LoadingSkeleton";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TRLS",
  description: "Teacher registration and licensing system",
  icons: {
    icon: '/Code-of-Arms-colour.png'
  }
};

export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {

    return(
    <div className="flex h-screen bg-slate-100">
        <div>
          <DynamicSidebar/>
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
