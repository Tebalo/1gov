"use client"
import React, {useState} from "react";
import {FaChalkboardTeacher } from 'react-icons/fa';
import ServiceList from "@/app/components/ServiceList";

export const ServiceListWrapper: React.FC = () => {
    const [isServiceListOpen, setIsServiceListOpen] = useState(false);
    const [date, setDate] = React.useState<Date | undefined>(new Date())

    const handleToggleServiceList = () => {
        setIsServiceListOpen(!isServiceListOpen);
    };
    const handleCloseLoginServiceList = () => {
        setIsServiceListOpen(false);
    }
    return(
        <div>
            <div className="bg-gray-200 h-auto rounded-lg grid md:grid-cols-3 grid-cols-1 md:p-10 p-1">
                <div className="md:w-80 w-full md:h-28 h-full bg-white rounded-lg md:p-3 p-1 hover:cursor-pointer shadow-lg" onClick={handleToggleServiceList}>
                    <div className="flex  space-x-2 md:space-y-0 space-y-2 mb-2">
                        <div className="bg-sky-100 p-2 rounded-lg md:full w-14 flex justify-center">
                            <FaChalkboardTeacher style={{ fontSize: '2rem', color: '#66CCFF' }} />
                        </div>
                        <span className="text-gray-900 md:font-semibold">Teacher Professional Services</span>
                    </div>
                    <div className="flex md:mx-10 justify-end">
                        <div className="bg-sky-300 rounded-full px-3 text-sm">5 services</div>
                    </div>
                </div>
            </div>
            <ServiceList isOpen={isServiceListOpen} onClose={handleCloseLoginServiceList}/ >
        </div>
    )
}