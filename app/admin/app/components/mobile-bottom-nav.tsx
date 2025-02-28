"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Settings,
  BarChart3,
  UserCheck2,
  Home
} from 'lucide-react';
import { AccessGroup } from '@/app/lib/types';
import { cn } from '@/lib/utils';

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
      path: '/admin/app/home', 
      icon: <Home size={24} />, 
      title: 'Home', 
      roles: ['ADMIN'] 
    },
    { 
      path: '/admin/app/roles', 
      icon: <UserCheck2 size={24} />, 
      title: 'Users', 
      roles: ['ADMIN'] 
    },
    { 
      path: '/admin/app/reports', 
      icon: <BarChart3 size={24} />, 
      title: 'Reports', 
      roles: ['ADMIN'] 
    },
    { 
      path: '/admin/app/settings', 
      icon: <Settings size={24} />, 
      title: 'Settings', 
      roles: ['ADMIN'] 
    },
  ];

  // Check if user has access to the item
  const hasAccess = (itemRoles: string[]) => {
    return itemRoles.includes('*') || itemRoles.includes(currentPersona.toUpperCase());
  };

  // Check if path is active
  const isActivePath = (path: string) => {
    if (path === '/admin/app/roles') {
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
      </div>
    </div>
  );
};

export default MobileBottomNav;