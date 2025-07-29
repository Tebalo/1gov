"use client"
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Settings,
  LayoutDashboard,
  Briefcase,
  ClipboardSignature,
  ClipboardList,
  BarChart3,
  Building,
  FolderOpenDot,
} from 'lucide-react';
import { NavItem } from '@/app/development/components/nav-item';
import NavUtils from '@/app/components/NavComponents/NavUtilis';
import { AccessGroup } from '@/app/lib/types';

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

const DesktopNav: React.FC<DesktopNavProps> = ({ currentPersona, access_profile }) => {
  const currentPath = usePathname();
  // Define sidebar items
  const sidebarItems: SideBarItem[] = [
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
        title: 'Activities', 
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
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-16 flex-col border-r bg-background sm:flex">
      {/* Decorative border accent */}
      <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-blue-500 via-indigo-300 to-purple-300 opacity-60"></div>
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href={'/trls/home'}
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
                color: isActivePath(item.path) ? "#FFFFFF" : undefined 
              })}
            </NavItem>
          )
        ))}
      </nav>
      
      {/* Bottom nav section for settings */}
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <NavUtils accessProfile={access_profile} />
      </nav>
    </aside>
  );
}

export default DesktopNav;