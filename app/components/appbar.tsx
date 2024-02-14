import React from "react";
import Image from "next/image";
import { FaBell, FaSignOutAlt } from "react-icons/fa";

const Appbar: React.FC= () => {
    return(
        <nav className="bg-white shadow-xl top-0 right-0 z-10 w-full h-20 flex justify-between">
            <div className="flex items-center">
                <div className="md:w-fit w-48 mx-10">
                    <Image
                        src="/main-icon.png"
                            width={50}
                            height={350}
                            alt="Picture of the coat of arms"
                        />
                    <span className="font-bold ml-2 text-gray-900">1</span><span className="text-gray-900">Gov</span>
                </div>
                <div className="">
                    <span className="text-3xl text-gray-900">Welcome to 1Gov, Michael!</span>
                </div>
            </div>
            <div className="flex items-center space-x-2 mr-2">
                <div className="rounded-lg w-10 h-10 bg-white items-center shadow-xl py-2 hover:cursor-pointer">
                    <span className="px-2 text-lg font-bold text-sky-400">MI</span>
                </div>
                <div className="rounded-lg w-10 h-10 bg-white items-center shadow-xl py-1 px-1 hover:cursor-pointer">
                    <FaBell style={{fontSize: '2rem', color: '#66CCFF'}}/>
                </div>
                <div className="rounded-lg w-10 h-10 bg-red-600 py-1 shadow-xl px-1 hover:cursor-pointer">
                    <FaSignOutAlt style={{fontSize: '2rem', color: '#FFFFFF'}}/>
                </div>
            </div>
        </nav>      
    )
}
export default Appbar;