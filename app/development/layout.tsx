import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { LoadingSkeleton } from "@/app/components/LoadingSkeleton";
import { Toaster } from "@/components/ui/toaster";
import DevSidebar from "./components/DevSidebar";
import Link from "next/link";
import Image from 'next/image';
import { NavItem } from "./components/nav-item";
import { Home, Settings, SprayCanIcon, UserCheck2, Warehouse, WindIcon } from "lucide-react";

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
            src={'/subtle-prism.png'}
            alt=""
            fill
            className="object-cover"
            quality={100}
            priority
          />
          {/* Overlay for better readability */}
          <div className="absolute inset bg-sky-400/55"/>
        </div>
        <DesktopNav/>
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">

          </header>
          <main className="grid flex-1 items-start gap-2 md:p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40">
            <Suspense fallback={<LoadingSkeleton/>}>{children}</Suspense>
          </main>
          <Toaster />
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

        <NavItem href="/development" label="Home">
          <Home className="h-9 w-9"/>
        </NavItem>

        <NavItem href="/development/accesscontrol" label="Roles">
          <UserCheck2 className="h-9 w-9 rounded-lg"/>
        </NavItem>

        
        <NavItem href="/development/components" label="Interface">
          <SprayCanIcon className="h-9 w-9 rounded-lg"/>
        </NavItem>

        <NavItem href="/development/viewers" label="Views">
          <WindIcon className="h-9 w-9 rounded-lg"/>
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
