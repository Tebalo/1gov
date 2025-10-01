'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  label: string;
  children: ReactNode;
}

export function NavItem({ href, label, children }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/development' && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className="group relative flex flex-col items-center gap-1 transition-all duration-200"
    >
      {/* Icon container */}
      <div className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200",
        isActive 
          ? "bg-sky-500 text-white shadow-sm" 
          : "text-gray-400 hover:text-sky-500 hover:bg-sky-50"
      )}>
        {children}
      </div>
      
      {/* Label */}
      <span className={cn(
        "text-[10px] font-medium transition-colors duration-200",
        isActive 
          ? "text-sky-600" 
          : "text-gray-400 group-hover:text-sky-500"
      )}>
        {label}
      </span>

      <span className="sr-only">{label}</span>
    </Link>
  );
}