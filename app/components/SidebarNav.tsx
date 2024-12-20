'use client'
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Briefcase, ClipboardList, Settings, LayoutDashboard } from 'lucide-react';

interface SideBarItem { 
    path: string;
    icon: React.ReactElement;
    title: string;
    roles: string[];
}

interface SidebarProps {
    currentPersona: string;
    activeLinkColor?: string;
    inactiveLinkColor?: string;
}

const sidebarItems: SideBarItem[] = [
    { 
        path: '/trls/home', 
        icon: <Home size={24} color="#FFFFFF" />, 
        title: 'Home', 
        roles: ['*'] 
    },
    { 
        path: '/trls/work', 
        icon: <Briefcase size={24} color="#FFFFFF" />, 
        title: 'My Work', 
        roles: ['*'] 
    },
    { 
        path: '/trls/registration', 
        icon: <Briefcase size={24} color="#FFFFFF" />, 
        title: 'Registrations', 
        roles: [
            'REGISTRATION_OFFICER', 
            'SNR_REGISTRATION_OFFICER', 
            'MANAGER', 
            'DIRECTOR', 
            'REGISTRAR'
        ] 
    },
    { 
        path: '/trls/dashboard', 
        icon: <LayoutDashboard size={24} color="#FFFFFF" />, 
        title: 'Dashboard', 
        roles: [
            'MANAGER', 
            'REGISTRATION_OFFICER', 
            'SNR_REGISTRATION_OFFICER', 
            'DIRECTOR', 
            'REGISTRAR', 
            'INVESTIGATIONS_OFFICER', 
            'SENIOR_INVESTIGATIONS_OFFICER', 
            'INVESTIGATIONS_MANAGER', 
            'ADMIN'
        ] 
    },
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

const SidebarNav: React.FC<SidebarProps> = ({ currentPersona }) => {
    const currentPath = usePathname();

    const hasAccess = (itemRoles: string[]) => {
        return itemRoles.includes('*') || itemRoles.includes(currentPersona.toUpperCase());
    }

    const isActivePath = (path: string) => {
        // Handle exact matches for home
        if (path === '/trls/home') {
            return currentPath === path;
        }
        // For other paths, check if the current path starts with the item path
        return currentPath.startsWith(path);
    }

    return (
        <nav className="h-full">
            <ul className="space-y-2 font-medium">
                {sidebarItems.map((item, index) => (
                    hasAccess(item.roles) && (
                        <li key={index} className="flex space-x-2">
                            <div className={`${
                                isActivePath(item.path) 
                                    ? 'bg-sky-200 w-2 md:h-18 lg:h-12 my-1 rounded-lg'
                                    : ''
                            }`}></div>
                            <Link
                                href={item.path}
                                className={`
                                    flex items-center w-full px-2 py-2 rounded-lg 
                                    justify-start space-x-2 transition-colors 
                                    duration-200 ease-in-out
                                    ${isActivePath(item.path) 
                                        ? 'bg-sky-300 text-gray-900' 
                                        : 'text-gray-100 hover:bg-sky-300/10'
                                    }
                                `}
                            >
                                {React.cloneElement(item.icon, { 
                                    color: isActivePath(item.path) ? "#1e293b" : "#FFFFFF",
                                    className: "shrink-0"  // Prevent icon from shrinking
                                })}
                                <div className="flex justify-center">
                                    <span className={`
                                        text-xs lg:text-base lg:font-semibold
                                        ${isActivePath(item.path) 
                                            ? 'text-gray-900' 
                                            : 'text-gray-100'
                                        }
                                    `}>
                                        {item.title}
                                    </span>
                                </div>
                            </Link>
                        </li>
                    )
                ))}
            </ul>      
        </nav>
    );
}

export default SidebarNav;