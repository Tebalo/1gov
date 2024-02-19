"use client"
import React,{useState} from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { FaBeer, FaHome, FaCube, FaUser, FaCogs} from "react-icons/fa";
import { usePathname } from "next/navigation";

const Sidebar: React.FC= () => {
    const currentPath = usePathname()
    return(
    <aside
    id="gov-sidebar"
    className="top-0 left-0 w-80 shadow-2xl"
    >
        <div className="h-screen px-0 bg-sky-400 shadow-lg rounded-r-lg">
            <div className="md:rounded-r-lg rounded-b-lg bg-white p-5 w-48">
                <Logo width={350} height={350}/>
            </div>
            <div className="my-10 ml-5">
                <ul className="space-y-5 font-medium">
                    <li className="flex space-x-2">
                        <div className={`${currentPath === '/dashboard/home' ? 'bg-sky-200 w-2 h-12 my-1 rounded-lg': ''}}`}></div>
                        <Link
                            href="/dashboard/home"
                            className={`flex items-center w-full px-2 py-2 rounded-lg justify-start space-x-2 ${currentPath === '/dashboard/home' ? 'bg-sky-300' : 'text-gray-100'}`}
                        >
                            <FaHome style={{fontSize: '2rem' , color: '#FFFFFF'}}/>
                            <span className="text-gray-100 text-lg">
                                Home
                            </span>
                        </Link>
                    </li>
                    <li className="flex space-x-2">
                        <div className={`${currentPath === '/dashboard/my-applications' ? 'bg-sky-200 w-2 h-12 my-1 rounded-lg': ''}}`}></div>
                        <Link
                            href="/dashboard/my-applications"
                            className={`flex items-center w-full px-2 py-2 rounded-lg justify-start space-x-2 ${currentPath === '/dashboard/my-applications' ? 'bg-sky-300' : 'text-gray-100'}`}                        >
                            <FaCube style={{fontSize: '2rem', color: '#FFFFFF'}}/>
                            <span className="text-gray-100 text-lg">
                                My Applications
                            </span>
                        </Link>
                    </li>
                    <li className="flex space-x-2">
                        <div className={`${currentPath === '/dashboard/profile' ? 'bg-sky-200 w-2 h-12 my-1 rounded-lg': ''}}`}></div>
                        <Link
                            href="/dashboard/profile"
                            className={`flex items-center w-full px-2 py-2 rounded-lg justify-start space-x-2 ${currentPath === '/dashboard/profile' ? 'bg-sky-300' : 'text-gray-100'}`}                        >
                            <FaUser style={{fontSize: '2rem', color: '#FFFFFF'}}/>
                            <span className="text-gray-100 text-lg">
                                Profile
                            </span>
                        </Link>
                    </li>
                    <li className="flex space-x-2">
                        <div className={`${currentPath === '/dashboard/settings' ? 'bg-sky-200 w-2 h-12 my-1 rounded-lg': ''}}`}></div>
                        <Link
                            href="/dashboard/settings"
                            className={`flex items-center w-full px-2 py-2 rounded-lg justify-start space-x-2 ${currentPath === '/dashboard/settings' ? 'bg-sky-300' : 'text-gray-100'}`}                        >
                            <FaCogs style={{fontSize: '2rem', color: '#FFFFFF'}}/>
                            <span className="text-gray-100 text-lg">
                                Settings
                            </span>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    </aside>
    );
}
export default Sidebar;