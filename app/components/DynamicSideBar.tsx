"use client"
import React,{useState} from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { FaHome, FaCube, FaUser, FaCogs} from "react-icons/fa";
import { usePathname } from "next/navigation";

interface SideBarItem {
    path: string;
    icon: JSX.Element;
    title: string;
}

const customerPortalSItems: SideBarItem[] = [
    { path: '/portal/dashboard/home', icon: <FaHome style={{ fontSize: '2rem', color: '#FFFFFF' }} />, title: 'Home' },
    { path: '/portal/dashboard/my-applications', icon: <FaCube style={{ fontSize: '2rem', color: '#FFFFFF' }} />, title: 'My Applications' },
    { path: '/portal/dashboard/profile', icon: <FaUser style={{ fontSize: '2rem', color: '#FFFFFF' }} />, title: 'Profile' },
    { path: '/portal/dashboard/settings', icon: <FaCogs style={{ fontSize: '2rem', color: '#FFFFFF' }} />, title: 'Settings' },
]

const DynamicSidebar: React.FC = ({}) => {
    const currentPath = usePathname();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };
    return (
        <aside id="dynamic-sidebar" className="top-0 left-0 w-60 shadow-xl transition-transform -translate-x-full sm:translate-x-0">
            <div className="h-screen px-0 bg-sky-400 shadow-lg rounded-r-lg">
                <div className="md:rounded-r-lg rounded-b-lg bg-white p-5 w-48">
                    <Logo
                    width={350}
                    height={350}
                    />
                </div>
                <div className="my-10 ml-5">
                    <ul className="space-y-5 font-medium">
                        {customerPortalSItems.map((item) =>(
                            <li key={item.path} className="flex space-x-2">
                                <div className={`${currentPath === item.path ? 'bg-sky-200 w-2 h-12 my-1 rounded-lg':''}`}></div>
                                <Link href={item.path} className={`flex items-center w-full px-2 py-2 rounded-lg justify-start space-x-2 ${currentPath === item.path ? 'bg-sky-300':'text-gray-100'}`}>
                                    {item.icon}
                                    <span className="text-gray-100 text-lg">{item.title}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="ml-5 relative">
                    <button 
                        type="button" 
                        id="dropDownButton"
                        className="flex items-center w-full p-2 text-base text-gray-100 transition duration-75 rounded-lg group" 
                        aria-controls="dropdown-example" 
                        data-dropdown-toggle="doubleDropdown"
                        onClick={toggleDropdown}
                    >
                        <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Switch Portal</span>
                        <svg className="w-2.5 h-2.5 ms-3 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                        </svg>
                    </button>
                    <div className={`absolute top-full border -mt-40 -mr-60 right-0 ${isDropdownOpen ? '' : 'hidden'} z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-lg w-60`}>
                        <ul id="dropdown-example" aria-labelledby="dropDownButton">
                            <li>
                                <a href="/portal/dashboard/home" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100">Customer Portal</a>
                            </li>
                            <li>
                                <a href="/portal/dashboard/home-o" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100">Registration Officer Portal</a>
                            </li>
                            <li>
                                <a href="/portal/dashboard/home-o" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100">Admin Portal</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default DynamicSidebar;