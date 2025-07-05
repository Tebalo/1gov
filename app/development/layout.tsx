import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { LoadingSkeleton } from "@/app/components/LoadingSkeleton";
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";
import Image from 'next/image';
import { NavItem } from "./components/nav-item";
import { BriefcaseBusiness, Hammer, Home, Search, Settings } from "lucide-react";
import AppBar from "./components/appbar";

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
    <main className="flex min-h-screen w-full flex-col relative">
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
        {/* Content wrapper */}
        <div className="flex relative z-10 h-screen overflow-hidden">
          <DesktopNav/>
          <div className="flex flex-col flex-grow relative md:pl-16">
            <AppBar/>
            <main className="flex-grow overflow-auto p-4 bg-white dark:bg-gray-900">
              <Suspense fallback={<LoadingSkeleton/>}>{children}</Suspense>
            </main>
            <Toaster />
          </div>
        </div>
    </main>
  );
}

function DesktopNav() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-16 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href={'/development'}
          className="group flex h-14 w-14 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold text-primary-foreground md:h-14 md:w-14 md:text-base"
        >
         <div className="w-40 h-40 items-center justify-center">
            <Image
              src="/botepco.png"
              alt='Coat-of-arms'
              width={100}
              height={100}
              className="w-full h-full object-contain"
              priority
            />
         </div>
         <span className="sr-only">TRLS DEV</span>
        </Link>

        <NavItem href="/development/search" label="Search">
          <Search className="h-9 w-9"/>
        </NavItem>

        <NavItem href="/development" label="Home">
          <Home className="h-9 w-9"/>
        </NavItem>

        {/* <NavItem href="/development/accesscontrol" label="Roles">
          <UserCheck2 className="h-9 w-9 rounded-lg"/>
        </NavItem> */}

        
        <NavItem href="/development/components" label="Queues">
          <Hammer className="h-9 w-9 rounded-lg"/>
        </NavItem>

        <NavItem href="/development/viewers" label="Cases">
          <BriefcaseBusiness className="h-9 w-9 rounded-lg"/>
        </NavItem>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
        href={"#"}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
        >
        
        </Link>
        <Settings className="h-5 w-5"/>
        <span className="sr-only">Settings</span>
      </nav>
    </aside>
  );
}
