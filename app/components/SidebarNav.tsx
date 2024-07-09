'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaCogs, FaComments, FaHome, FaLayerGroup, FaUsers } from 'react-icons/fa';
import { GrDashboard } from "react-icons/gr";

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
    { path: '/trls/home', icon: <FaHome style={{ fontSize: '1.5rem', color: '#FFFFFF' }} />, title: 'Home', roles: ['*'] },
    { path: '/trls/dashboard', icon: <GrDashboard style={{ fontSize: '1.5rem', color: '#FFFFFF' }} />, title: 'Dashboard', roles: ['MANAGER', 'REGISTRATION_OFFICER', 'SNR_REGISTRATION_OFFICER', 'DIRECTOR', 'REGISTRAR', 'LICENSE_OFFICER', 'SNR_LICENSE_OFFICER', 'LICENSE_MANAGER', 'ADMIN'] },
    { path: '/trls/my-applications', icon: <FaLayerGroup style={{ fontSize: '1.5rem', color: '#FFFFFF' }} />, title: 'My Applications', roles: ['ADMIN'] },
    { path: '/trls/spaces', icon: <FaComments style={{ fontSize: '1.5rem', color: '#FFFFFF' }} />, title: 'Spaces', roles: ['ADMIN'] },
    { path: '/trls/users', icon: <FaUsers style={{ fontSize: '1.5rem', color: '#FFFFFF' }} />, title: 'Users', roles: ['ADMIN'] },
    { path: '/trls/settings', icon: <FaCogs style={{ fontSize: '1.5rem', color: '#FFFFFF' }} />, title: 'Settings', roles: ['ADMIN'] },
]

const SidebarNav: React.FC<SidebarProps> = ({ currentPersona }) => {
    const currentPath = usePathname();

    const hasAccess = (itemRoles: string[]) => {
        return itemRoles.includes('*') || itemRoles.includes(currentPersona.toUpperCase());
    }

    return (
        <ul className="space-y-2 font-medium">
            {sidebarItems.map((item, index) => (
                hasAccess(item.roles) && (
                    <li key={index} className="flex space-x-2">
                        <div className={`${currentPath === item.path ? 'bg-sky-200 w-2 md:h-18 lg:h-12 my-1 rounded-lg': ''}`}></div>
                        <Link
                            href={item.path}
                            className={`flex items-center w-full px-2 py-2 rounded-lg justify-start space-x-2 ${currentPath === item.path ? 'bg-sky-300' : 'text-gray-100'}`}
                        >
                            {item.icon}
                            <div className="flex justify-center">
                                <span className="text-gray-100 text-xs lg:text-base lg:font-semibold">
                                    {item.title}
                                </span>
                            </div>
                        </Link>
                    </li>
                )
            ))}
        </ul>      
    )
}

export default SidebarNav;