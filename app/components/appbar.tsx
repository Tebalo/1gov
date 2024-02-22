import React from "react";
import Image from "next/image";
import { FaBell, FaSignOutAlt } from "react-icons/fa";
import Link from "next/link";

const Appbar: React.FC= () => {
    return(
        <nav className="bg-white shadow-xl md:top-0 md:right-0 sm:translate-x-0 z-10 w-full h-20 flex justify-between">
            <div className="flex items-center">
                <div className="md:w-fit w-48 mx-10">
                    <Image
                        src="/main-icon.png"
                            width={50}
                            height={350}
                            alt="Picture of the coat of arms"
                        />
                    <span className="font-bold -ml-1 text-gray-900">Bo</span><span className="text-gray-900">tepco</span>
                </div>
                <div className="">
                    <span className="md:text-3xl text-gray-900">Welcome to Botepco, Michael!</span>
                </div>
            </div>
            <div className="flex items-center space-x-2 mr-2">
                <div className="rounded-lg w-10 h-10 bg-white items-center shadow-xl py-2 hover:cursor-pointer relative">
                    <span className="px-2 text-lg font-bold text-sky-400">MI</span>
                    <div className="rounded-full text-gray-900 bg-white border shadow-lg h-5 w-5 z-10 absolute bottom-0 right-0 -mb-2 -mr-1  flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                        </svg>
                    </div>
                </div>
                <div className="rounded-lg w-10 h-10 bg-white items-center shadow-xl px-1 hover:cursor-pointer flex justify-center py-2 relative">
                    <FaBell style={{fontSize: '1.5rem', color: '#66CCFF'}}/>
                    <div className="rounded-full bg-sky-400 h-5 w-5 z-10 absolute top-0 right-0 -mt-1 -mr-1 flex items-center justify-center">
                        <span className="text-xs">44</span>
                    </div>
                </div>
                <Link
                href="/welcome"
                >
                    <div className="rounded-lg w-10 h-10 bg-red-600 shadow-xl px-1 hover:cursor-pointer flex justify-center py-2">
                        <FaSignOutAlt style={{fontSize: '1.5rem', color: '#FFFFFF'}}/>
                    </div>
                </Link>
            </div>
        </nav>      
    )
}
export default Appbar;