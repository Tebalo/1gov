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
      className={cn(
        "group relative flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 hover:scale-105",
        isActive 
          ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25" 
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
      )}
    >
      {/* Active indicator */}
      {isActive && (
        <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-l-full"></div>
      )}
      
      {/* Icon */}
      <div className={cn(
        "transition-transform duration-300",
        isActive ? "scale-110" : "group-hover:scale-110"
      )}>
        {children}
      </div>
      
      {/* Tooltip */}
      <div className={cn(
        "absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 pointer-events-none transition-all duration-300 whitespace-nowrap z-50",
        "group-hover:opacity-100 group-hover:translate-x-1"
      )}>
        {label}
        {/* Tooltip arrow */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
      </div>

      <span className="sr-only">{label}</span>
    </Link>
  );
}