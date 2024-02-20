"use client"
import React,{useState} from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { FaBeer, FaHome, FaCube, FaUser, FaCogs} from "react-icons/fa";
import { usePathname } from "next/navigation";

interface SideBarItem {
    path: string;
    icon: JSX.Element;
    title: string;
}

const customerPortalSItems: SideBarItem[] = [
    { path: '/dashboard/home', icon: <FaHome style={{ fontSize: '2rem', color: '#FFFFFF' }} />, title: 'Home' },
    { path: '/dashboard/my-applications', icon: <FaCube style={{ fontSize: '2rem', color: '#FFFFFF' }} />, title: 'My Applications' },
    { path: '/dashboard/profile', icon: <FaUser style={{ fontSize: '2rem', color: '#FFFFFF' }} />, title: 'Profile' },
    { path: '/dashboard/settings', icon: <FaCogs style={{ fontSize: '2rem', color: '#FFFFFF' }} />, title: 'Settings' },
]

const DynamicSidebar: React.FC = () => {
    const currentPath = usePathname();

    return (
        <aside id="dynamic-sidebar" className="top-0 left-0 w-80 shadow-xl">
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
            </div>
        </aside>
    );
}

export default DynamicSidebar;