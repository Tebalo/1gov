"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Settings,
  BarChart3,
  UserCheck2,
  Home,
  FolderOpenDot,
  Building,
  ClipboardSignature,
  ClipboardList
} from 'lucide-react';
import { AccessGroup } from '@/app/lib/types';
import { cn } from '@/lib/utils';
import NavUtils from '@/app/components/NavComponents/NavUtilis';

interface NavItemProps {
  href: string;
  isActive?: boolean;
  label: string;
  children: React.ReactNode;
}

// Mobile navigation item component
const MobileNavItem: React.FC<NavItemProps> = ({ 
  href, 
  isActive = false, 
  label, 
  children 
}) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center p-2 w-full",
        isActive 
          ? "text-primary border-t-2 border-primary" 
          : "text-gray-500 hover:text-gray-900"
      )}
    >
      <div className="w-6 h-6">{children}</div>
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
};

interface MobileBottomNavProps {
  currentPersona: string;
  access_profile: AccessGroup;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ 
  currentPersona, 
  access_profile 
}) => {
  const currentPath = usePathname();

  // Define navigation items
  const navItems = [
      { 
        path: '/trls/home', 
        icon: <Building size={24} color="#FFFFFF" />, 
        title: 'Home', 
        roles: ['*'] 
    },
    { 
        path: '/trls/dashboard', 
        icon: <BarChart3 size={24} color="#FFFFFF" />, 
        title: 'Reports', 
        roles: [
            'MANAGER', 
            'REGISTRATION_OFFICER', 
            'SNR_REGISTRATION_OFFICER', 
            'DIRECTOR', 
            'REGISTRAR', 
            // 'INVESTIGATIONS_OFFICER', 
            // 'SENIOR_INVESTIGATIONS_OFFICER', 
            // 'INVESTIGATIONS_MANAGER', 
            'ADMIN'
        ] 
    },
    { 
        path: '/trls/work', 
        icon: <FolderOpenDot size={24} color="#FFFFFF" />, 
        title: 'Work', 
        roles: ['*'] 
    },
    // { 
    //     path: '/trls/registration', 
    //     icon: <ClipboardSignature size={24} color="#FFFFFF" />, 
    //     title: 'Teacher', 
    //     roles: [
    //         'REGISTRATION_OFFICER', 
    //         'SNR_REGISTRATION_OFFICER', 
    //         'MANAGER', 
    //         'DIRECTOR', 
    //         'REGISTRAR'
    //     ] 
    // },
    { 
        path: '/trls/activity', 
        icon: <ClipboardList size={24} color="#FFFFFF" />, 
        title: 'My Activities', 
        roles: [
            'INVESTIGATIONS_OFFICER', 
            'SENIOR_INVESTIGATIONS_OFFICER', 
            'INVESTIGATIONS_MANAGER',
            'INVESTIGATIONS_DIRECTOR',
            'DISCIPLINARY_COMMITTEE'
        ] 
    },
    { 
        path: '/trls/settings', 
        icon: <Settings size={24} color="#FFFFFF" />, 
        title: 'Settings', 
        roles: [] 
    },
  ];

  // Check if user has access to the item
  const hasAccess = (itemRoles: string[]) => {
    return itemRoles.includes('*') || itemRoles.includes(currentPersona.toUpperCase());
  };

  // Check if path is active
  const isActivePath = (path: string) => {
    if (path === '/trls') {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white z-20 shadow-lg border-t">
      <div className="flex justify-around">
        {navItems.map((item, index) => (
          hasAccess(item.roles) && (
            <MobileNavItem 
              key={index} 
              href={item.path} 
              isActive={isActivePath(item.path)} 
              label={item.title}
            >
              {React.cloneElement(item.icon as React.ReactElement, { 
                color: isActivePath(item.path) ? "#0284c7" : undefined,
                size: 20
              })}
            </MobileNavItem>
          )
        ))}
        {/* Bottom nav section for settings */}
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <NavUtils accessProfile={access_profile} />
        </nav>
      </div>

    </div>
  );
};

export default MobileBottomNav;