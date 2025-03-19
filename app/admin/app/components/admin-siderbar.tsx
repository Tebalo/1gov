"use client"
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Settings,
  BarChart3,
  UserCheck2,
  Home,
} from 'lucide-react';
import { NavItem } from '@/app/development/components/nav-item';
import { AccessGroup } from '@/app/lib/types';
import NavAdmin from './nav-admin';
import { FaDocker } from 'react-icons/fa';

// Define the type for sidebar items
interface SideBarItem {
  path: string;
  icon: React.ReactNode;
  title: string;
  roles: string[];
}

interface DesktopNavProps {
  currentPersona: string
  access_profile: AccessGroup
}

const AdminNav: React.FC<DesktopNavProps> = ({ currentPersona, access_profile }) => {
  const currentPath = usePathname();

  // Define sidebar items
  const sidebarItems: SideBarItem[] = [
    { 
      path: '/admin/app/home', 
      icon: <Home size={24} />, 
      title: 'Home', 
      roles: ['ADMIN'] 
    },
    { 
        path: '/admin/app/roles', 
        icon: <UserCheck2 size={24} color="#FFFFFF" />, 
        title: 'Users', 
        roles: ['ADMIN'] 
    },
    { 
      path: '/admin/app/docker-images', 
      icon: <FaDocker size={24} color="#FFFFFF" />, 
      title: 'Services', 
      roles: ['ADMIN'] 
    },
    { 
        path: '/admin/app/reports', 
        icon: <BarChart3 size={24} color="#FFFFFF" />, 
        title: 'Reports', 
        roles: [
            'ADMIN'
        ] 
    },
    { 
        path: '/admin/app/settings', 
        icon: <Settings size={24} color="#FFFFFF" />, 
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
    if (path === '/development') {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-16 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href={'/development'}
          className="group flex h-14 w-14 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold text-primary-foreground md:h-14 md:w-14 md:text-base"
        >
          <div className="w-12 h-12 items-center justify-center">
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

        {/* Map through sidebar items */}
        {sidebarItems.map((item, index) => (
          hasAccess(item.roles) && (
            <NavItem 
              key={index} 
              href={item.path} 
            //   isActive={isActivePath(item.path)} 
              label={item.title}
            >
              {React.cloneElement(item.icon as React.ReactElement, { 
                color: isActivePath(item.path) ? "#0284c7" : undefined 
              })}
            </NavItem>
          )
        ))}
      </nav>
      
      {/* Bottom nav section for settings */}
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
            <NavAdmin accessProfile={access_profile} />
        </nav>
    </aside>
  );
}

export default AdminNav;