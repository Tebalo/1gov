"use client"
import React, {useState} from "react";
import {FaDiceFour, FaChalkboardTeacher } from 'react-icons/fa';
import ServiceList from "@/app/components/ServiceList";
const Home: React.FC = () => {
    const [isServiceListOpen, setIsServiceListOpen] = useState(false);

    const handleToggleServiceList = () => {
        setIsServiceListOpen(!isServiceListOpen);
    };
    const handleCloseLoginServiceList = () => {
        setIsServiceListOpen(false);
    }
    return(
        <main className="mx-10 mt-2">
            <div className="flex mb-32">
                <div className="bg-gray-200 p-2 rounded-lg w-1/2">
                    <label htmlFor="base-input" className="block mb-2 text-sm font-medium text-gray-900">Search e-Services</label>
                    <input type="text" id="base-input" placeholder="Search all available e-Services by name, category, description etc.." className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
                </div>
            </div>
            <div className="flex items-center space-x-2 mb-2">
                <FaDiceFour style={{ fontSize: '2.5rem', color: '#66CCFF' }} />
                <span className="text-lg text-gray-900 font-semibold">Service Categories</span>
            </div>
            <div className="bg-gray-200 h-72 rounded-lg grid md:grid-cols-3 p-10">
                <div className="w-80 h-28 bg-white rounded-lg p-3 hover:cursor-pointer shadow-lg" onClick={handleToggleServiceList}>
                    <div className="flex  space-x-2 mb-2 items-center">
                        <div className="bg-sky-100 p-2 rounded-lg">
                            <FaChalkboardTeacher style={{ fontSize: '2rem', color: '#66CCFF' }} />
                        </div>
                        <span className="text-gray-900 font-semibold">Teacher Professional Services</span>
                    </div>
                    <div className="flex mx-10">
                        <div className="bg-sky-300 rounded-full px-3 text-sm">5 services</div>
                    </div>
                </div>
            </div>
            <ServiceList isOpen={isServiceListOpen} onClose={handleCloseLoginServiceList}/ >
        </main>
    )
}
export default Home;