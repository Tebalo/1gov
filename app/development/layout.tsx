import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { LoadingSkeleton } from "@/app/components/LoadingSkeleton";
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";
import Image from 'next/image';
import { NavItem } from "./components/nav-item";
import { BriefcaseBusiness, Hammer, Home, Search, Settings } from "lucide-react";

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
    <main className="flex min-h-screen w-full flex-col relative bg-slate-50">
      {/* Background Image Container */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={'/subtle-prism1.png'}
          alt=""
          fill
          className="object-cover opacity-30"
          quality={100}
          priority
        />
        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white/60 to-indigo-50/80"/>
      </div>
      
      {/* Content wrapper */}
      <div className="flex relative z-10 h-screen overflow-hidden">
        <DesktopNav/>
        <div className="flex flex-col flex-grow relative md:pl-20">
          <main className="flex-grow overflow-auto md:p-6">
            <div className="max-w-full mx-auto">
              <Suspense fallback={<LoadingSkeleton/>}>
                {children}
              </Suspense>
            </div>
          </main>
          <Toaster />
        </div>
      </div>
    </main>
  );
}

function DesktopNav() {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-20 flex-col border-r border-white/20 bg-white/95 backdrop-blur-xl shadow-xl sm:flex">
      {/* Decorative border accent */}
      <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 opacity-60"></div>
      
      <nav className="flex flex-col items-center gap-6 px-3 py-6">
        {/* Logo Section */}
        <Link
          href={'/development'}
          className="group flex h-16 w-16 shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <div className="w-12 h-12 items-center justify-center">
            <Image
              src="/botepco.png"
              alt='Coat-of-arms'
              width={48}
              height={48}
              className="w-full h-full object-contain filter brightness-0 invert"
              priority
            />
          </div>
          <span className="sr-only">TRLS DEV</span>
        </Link>

        {/* Navigation Divider */}
        <div className="w-8 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

        {/* Navigation Items */}
        <div className="flex flex-col gap-4">
          <NavItem href="/development/search" label="Search">
            <Search className="h-6 w-6"/>
          </NavItem>

          <NavItem href="/development" label="Home">
            <Home className="h-6 w-6"/>
          </NavItem>

          <NavItem href="/development/components" label="Queues">
            <Hammer className="h-6 w-6"/>
          </NavItem>

          <NavItem href="/development/viewers" label="Cases">
            <BriefcaseBusiness className="h-6 w-6"/>
          </NavItem>
        </div>
      </nav>
      
      {/* Bottom Section */}
      <nav className="mt-auto flex flex-col items-center gap-4 px-3 py-6">
        <div className="w-8 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        <Link
          href={"#"}
          className="flex h-12 w-12 items-center justify-center rounded-xl text-gray-500 transition-all duration-300 hover:text-gray-700 hover:bg-gray-100 hover:scale-105"
        >
          <Settings className="h-5 w-5"/>
          <span className="sr-only">Settings</span>
        </Link>
      </nav>
    </aside>
  );
}