'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBriefcase, FaCogs, FaComments, FaHome, FaLayerGroup, FaUsers } from 'react-icons/fa';
import { GrDashboard } from "react-icons/gr";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface SideBarItem {
    path: string;
    icon: React.ReactElement;
    title: string;
    roles: string[];
}

interface SidebarProps {
    currentPersona: string;
    isCollapsed: boolean;
}

const sidebarItems: SideBarItem[] = [
    { path: '/trls/home', icon: <FaHome style={{ fontSize: '1.5rem', color: '#FFFFFF' }} />, title: 'Home', roles: ['*'] },
    { path: '/trls/work', icon: <FaBriefcase style={{ fontSize: '1.5rem', color: '#FFFFFF' }} />, title: 'My Work', roles: ['MANAGER', 'REGISTRATION_OFFICER', 'SNR_REGISTRATION_OFFICER', 'DIRECTOR', 'REGISTRAR', 'LICENSE_OFFICER', 'SNR_LICENSE_OFFICER', 'LICENSE_MANAGER', 'INVESTIGATIONS_OFFICER', 'ADMIN'] },
    { path: '/trls/dashboard', icon: <GrDashboard style={{ fontSize: '1.5rem', color: '#FFFFFF' }} />, title: 'Dashboard', roles: ['MANAGER', 'REGISTRATION_OFFICER', 'SNR_REGISTRATION_OFFICER', 'DIRECTOR', 'REGISTRAR', 'LICENSE_OFFICER', 'SNR_LICENSE_OFFICER', 'LICENSE_MANAGER', 'INVESTIGATIONS_OFFICER', 'ADMIN'] },
    { path: '/trls/my-applications', icon: <FaLayerGroup style={{ fontSize: '1.5rem', color: '#FFFFFF' }} />, title: 'My Applications', roles: ['ADMINC'] },
    { path: '/trls/spaces', icon: <FaComments style={{ fontSize: '1.5rem', color: '#FFFFFF' }} />, title: 'Spaces', roles: ['ADMINC'] },
    { path: '/trls/users', icon: <FaUsers style={{ fontSize: '1.5rem', color: '#FFFFFF' }} />, title: 'Users', roles: ['ADMINC'] },
    { path: '/trls/settings', icon: <FaCogs style={{ fontSize: '1.5rem', color: '#FFFFFF' }} />, title: 'Settings', roles: ['ADMINC'] },
]

const SidebarNav: React.FC<SidebarProps> = ({ currentPersona, isCollapsed }) => {
    const currentPath = usePathname();

    const hasAccess = (itemRoles: string[]) => {
        return itemRoles.includes('*') || itemRoles.includes(currentPersona.toUpperCase());
    }

    return (
        <ul className="space-y-2 font-medium justify-center">
            {sidebarItems.map((item, index) => (
                hasAccess(item.roles) && (
                    <li key={index} className={`flex space-x-2 ${isCollapsed ? 'justify-center' : ''}`}>
                        {isCollapsed ? (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={item.path}
                                        className={cn(
                                            'flex items-center h-9 w-9 rounded-lg justify-center transition-colors duration-300',
                                            currentPath === item.path ? 'bg-slate-900 hover:bg-sky-600' : 'hover:bg-transparent hover:underline'
                                        )}
                                    >
                                        {item.icon}
                                        <span className="sr-only">{item.title}</span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="bg-gray-900 text-white px-2 py-1 rounded text-sm">
                                    {item.title}
                                </TooltipContent>
                            </Tooltip>
                        ) : (
                            <Link
                                href={item.path}
                                className={cn(
                                    'flex items-center w-full px-2 py-2 rounded-lg justify-start space-x-2 transition-colors duration-300',
                                    currentPath === item.path ? 'bg-slate-900 before:content-[""] before:absolute before:w-1 before:h-full before:bg-sky-500 before:left-0 before:rounded-l' : 'text-gray-100 hover:bg-sky-300/30'
                                )}
                            >
                                {item.icon}
                                <div className="flex justify-center">
                                    <span className="text-gray-100 text-xs lg:text-base lg:font-semibold">
                                        {item.title}
                                    </span>
                                </div>
                            </Link>
                        )}
                    </li>
                )
            ))}
        </ul>
    )
}

export default SidebarNav;