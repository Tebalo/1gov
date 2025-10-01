"use client"
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Settings,
  BarChart3,
  Building,
  FolderOpenDot,
  ClipboardSignature,
  ClipboardList,
} from 'lucide-react';
import { NavItem } from '@/app/development/components/nav-item';
import NavUtils from '@/app/components/NavComponents/NavUtilis';
import { AccessGroup } from '@/app/lib/types';
import { SearchFormModal } from '@/app/components/search-teacher';

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
  
  const sidebarItems: SideBarItem[] = [
    { 
        path: '/trls/home', 
        icon: <Building size={20} />, 
        title: 'Home', 
        roles: ['*'] 
    },
    { 
        path: '/trls/dashboard', 
        icon: <BarChart3 size={20} />, 
        title: 'Reports', 
        roles: [
            'MANAGER', 
            'REGISTRATION_OFFICER', 
            'SNR_REGISTRATION_OFFICER', 
            'DIRECTOR', 
            'REGISTRAR', 
            'ADMIN'
        ] 
    },
    { 
        path: '/trls/work', 
        icon: <FolderOpenDot size={20} />, 
        title: 'Work', 
        roles: ['*'] 
    },
    { 
        path: '/trls/registers', 
        icon: <ClipboardSignature size={20} />, 
        title: 'Registers', 
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
        icon: <ClipboardList size={20} />, 
        title: 'Activities', 
        roles: [
            'INVESTIGATIONS_OFFICER', 
            'SENIOR_INVESTIGATIONS_OFFICER', 
            'INVESTIGATIONS_MANAGER',
            'INVESTIGATIONS_DIRECTOR',
            'DISCIPLINARY_COMMITTEE'
        ] 
    },
  ];

  const hasAccess = (itemRoles: string[]) => {
    return itemRoles.includes('*') || itemRoles.includes(currentPersona.toUpperCase());
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-20 flex-col border-r border-gray-200 bg-white sm:flex">
      <nav className="flex flex-col items-center gap-3 px-2 py-4">
        {/* Logo */}
        <Link
          href={'/trls/home'}
          className="mb-2 flex h-12 w-12 shrink-0 items-center justify-center"
        >
          <div className="w-10 h-10">
            <Image
              src="/botepco.png"
              alt='Coat-of-arms'
              width={40}
              height={40}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <span className="sr-only">TRLS</span>
        </Link>

        {/* Divider */}
        <div className="w-8 h-px bg-gray-200 mb-1" />
        
        {/* Search */}
        <SearchFormModal/>
        
        {/* Navigation Items */}
        {sidebarItems.map((item, index) => (
          hasAccess(item.roles) && (
            <NavItem 
              key={index} 
              href={item.path} 
              label={item.title}
            >
              {item.icon}
            </NavItem>
          )
        ))}
      </nav>
      
      {/* Bottom section */}
      <nav className="mt-auto flex flex-col items-center gap-3 px-2 py-4">
        <div className="w-8 h-px bg-gray-200 mb-1" />
        <NavUtils accessProfile={access_profile} />
      </nav>
    </aside>
  );
}

export default DesktopNav;