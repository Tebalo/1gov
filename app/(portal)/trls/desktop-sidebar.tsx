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

// NavItem component for individual navigation links
// const NavItem = ({ 
//   href, 
//   isActive, 
//   children, 
//   label 
// }: { 
//   href: string; 
//   isActive: boolean; 
//   children: React.ReactNode; 
//   label: string;
// }) => {
//   return (
//     <Link
//       href={href}
//       className={`
//         flex h-14 w-14 items-center justify-center rounded-lg transition-colors
//         ${isActive 
//           ? 'bg-primary text-primary-foreground' 
//           : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
//         }
//       `}
//       title={label}
//     >
//       {children}
//       <span className="sr-only">{label}</span>
//     </Link>
//   );
// };

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
    { 
        path: '/trls/registration', 
        icon: <ClipboardSignature size={24} color="#FFFFFF" />, 
        title: 'Teacher', 
        roles: [
            'REGISTRATION_OFFICER', 
            'SNR_REGISTRATION_OFFICER', 
            'MANAGER', 
            'DIRECTOR', 
            'REGISTRAR'
        ] 
    },
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