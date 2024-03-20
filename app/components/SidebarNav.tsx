'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import { FaCogs, FaComments, FaCube, FaHome, FaLayerGroup, FaUser } from 'react-icons/fa';
import { GrDashboard } from "react-icons/gr";

interface SideBarItem { 
    path: string;
    icon: React.ReactElement;
    title: string;
}

interface SidebarProps {
    //sidebarItems: SideBarItem[];
    //currentPath: string;
    userRole: string;
    activeLinkColor?: string;
    inactiveLinkColor?: string;
}
const user: SideBarItem[] = [
    { path: '/trls/home', icon: <FaHome style={{ fontSize: '1.5rem', color: '#FFFFFF' }} />, title: 'Home' },
    { path: '/trls/my-applications', icon: <FaLayerGroup style={{ fontSize: '1.5rem', color: '#FFFFFF' }} />, title: 'My Applications' },
    { path: '/trls/spaces', icon: <FaComments style={{ fontSize: '1.5rem', color: '#FFFFFF' }} />, title: 'Spaces' },
]

const SidebarNav: React.FC<SidebarProps> = ({ userRole}) => {
    const currentPath = usePathname();
    const staffRoles = ['registration_officer','snr_registration_officer','manager','director','registrar','admin']
    return(
    <ul className="space-y-2 font-medium">
        {/*{sidebarItems.map((item) =>(
            <li key={item.path} className="flex space-x-2">
                <div className={`${currentPath === item.path ? 'bg-sky-200 w-2 md:h-18 lg:h-12 my-1 rounded-lg':''}`}></div>
                <Link href={item.path} className={`lg:flex items-center w-full lg:px-2 py-1 rounded-lg justify-start space-x-2 ${currentPath === item.path ? 'bg-sky-300':'text-gray-100'}`}>
                    <div className="flex justify-center">{item.icon}</div>
                    <div className="flex justify-center"><span className="text-gray-100  text-xs lg:text-base lg:font-semibold">{item.title}</span></div>
                </Link>
            </li>
            )
        )}*/}
        <li className="flex space-x-2">
            <div className={`${currentPath === '/trls/home' ? 'bg-sky-200 w-2 md:h-18 lg:h-12 my-1 rounded-lg': ''}}`}></div>
            <Link
                href="/trls/home"
                className={`flex items-center w-full px-2 py-2 rounded-lg justify-start space-x-2 ${currentPath === '/trls/home' ? 'bg-sky-300' : 'text-gray-100'}`}
            >
            <FaHome style={{fontSize: '1.5rem' , color: '#FFFFFF'}}/>
            <div className="flex justify-center"><span className="text-gray-100  text-xs lg:text-base lg:font-semibold">
                Home
            </span>
            </div>
            </Link>
        </li>
        {staffRoles.includes(userRole) && <li className="flex space-x-2">
            <div className={`${currentPath === '/trls/dashboard' ? 'bg-sky-200 w-2 md:h-18 lg:h-12 my-1 rounded-lg': ''}}`}></div>
            <Link
                href="/trls/dashboard"
                className={`flex items-center w-full px-2 py-2 rounded-lg justify-start space-x-2 ${currentPath === '/trls/dashboard' ? 'bg-sky-300' : 'text-gray-100'}`}
            >
                <GrDashboard  style={{fontSize: '1.5rem' , color: '#FFFFFF'}}/>
                <div className="flex justify-center">
                    <span className="text-gray-100  text-xs lg:text-base lg:font-semibold">
                        Dashboard
                    </span>
                </div>
            </Link>
        </li>}
        <li className="flex space-x-2">
            <div className={`${currentPath === '/trls/applications' ? 'bg-sky-200 w-2 md:h-18 lg:h-12 my-1 rounded-lg': ''}}`}></div>
            <Link
                href="/trls/applications"
                className={`flex items-center w-full px-2 py-2 rounded-lg justify-start space-x-2 ${currentPath === '/trls/applications' ? 'bg-sky-300' : 'text-gray-100'}`}                        >
                <FaLayerGroup style={{fontSize: '1.5rem', color: '#FFFFFF'}}/>
                <div className="flex justify-center">
                    <span className="text-gray-100  text-xs lg:text-base lg:font-semibold">
                        Applications
                    </span>
                </div>
            </Link>
        </li>
        {staffRoles.includes(userRole) && <li className="flex space-x-2">
            <div className={`${currentPath === '/trls/profile' ? 'bg-sky-200 w-2 md:h-18 lg:h-12 my-1 rounded-lg': ''}}`}></div>
            <Link
                href="/trls/reports"
                className={`flex items-center w-full px-2 py-2 rounded-lg justify-start space-x-2 ${currentPath === '/trls/reports' ? 'bg-sky-300' : 'text-gray-100'}`}                        >
                <FaUser style={{fontSize: '1.5rem', color: '#FFFFFF'}}/>
                <div className="flex justify-center">
                    <span className="text-gray-100  text-xs lg:text-base lg:font-semibold">
                        Reports
                    </span>
                </div>
            </Link>
        </li>}
    </ul>      
  )
}

export default SidebarNav;