"use client"

import DesktopNav from "./desktop-sidebar";
import MobileBottomNav from "./mobile-bottom-nav";
import { AccessGroup } from "@/app/lib/types";

interface NavigationWrapperProps {
  currentPersona: string;
  access_profile: AccessGroup;
}

export default function NavigationWrapper({ currentPersona, access_profile }: NavigationWrapperProps) {
  return (
    <>
      {/* Desktop Navigation - Hidden on mobile */}
      <div className="hidden md:block">
        <DesktopNav 
          currentPersona={currentPersona} 
          access_profile={access_profile} 
        />
      </div>
      
      {/* Mobile Bottom Navigation - Only on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <MobileBottomNav 
          currentPersona={currentPersona} 
          access_profile={access_profile} 
        />
      </div>
    </>
  );
}