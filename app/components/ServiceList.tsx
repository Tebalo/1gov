import React from "react";
import {FaChalkboardTeacher, FaRegListAlt } from 'react-icons/fa';
import Link from "next/link";

interface ModalProps{
    isOpen: boolean;
    onClose: () => void;
}
interface ServiceCardProps{
    title:string;
    ministry:string;
    serviceFees: string;
    verification: string;
    path: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({title,ministry, serviceFees, verification, path}) => {
    return(
        <Link
        href={path}
        >
        <div className="bg-gray-200 w-full h-24 mb-2 rounded-lg hover:cursor-pointer">
            <div className="pl-5 py-5 flex space-x-2">
                <FaRegListAlt style={{ fontSize: '2rem', color: '#66CCFF' }} />
                <div className="flex flex-col">
                    <span className="text-gray-800">{title}</span>
                    <div className="space-x-1">
                        <span className="text-xs bg-sky-400 rounded-lg text text px-2 w-fit">{ministry}</span>
                        <span className="text-xs bg-lime-500 rounded-lg text text px-2 w-fit">{serviceFees}</span>
                        <span className="text-xs bg-lime-500 rounded-lg text text px-2 w-fit">{verification}</span>
                    </div>
                </div>
            </div>
        </div>
        </Link>
    );
}

const ServiceList: React.FC<ModalProps>= ({ isOpen, onClose }) => {
    const modalClass = isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none';
    return(
        <div id="service-list-modal" tabIndex={-1} aria-hidden="true" className={`shadow-lg fixed inset-0 overflow-y-auto overflow-x-hidden z-50 flex items-center justify-center ${modalClass} transition-opacity duration-300 ease-in-out`}>
            <div className="relative p-4 w-full max-w-lg max-h-full">
                <div className="relative bg-white rounded-lg shadow">
                    <div className="flex items-center justify-between p-4 md:p-5 rounded-t ">
                        <div className="flex space-x-2 items-center">
                            <div className="bg-sky-100 p-2 rounded-lg">
                                <FaChalkboardTeacher style={{ fontSize: '2rem', color: '#66CCFF' }} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Teacher Professional Services
                            </h3>
                        </div>
                        <button 
                        type="button" 
                        className="text-red-700 bg-transparent hover:bg-red-300 hover:text-white rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center " 
                        data-modal-toggle="crypto-modal"
                        onClick={onClose}>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="p-4 md:p-5">
                        <div className="bg-gray-200 p-2 rounded-lg w-full mb-2">
                            <input type="text" id="base-input" placeholder="Search by service name or description..." className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"/>
                        </div>
                        <div className="mx-1">
                            <ServiceCard title="Teacher registration" ministry="Ministry of Education" serviceFees="Service Fees" verification="EID Verification" path="/dashboard/teacher-registration"/>
                            <ServiceCard title="Student-Teacher registration" ministry="Ministry of Education" serviceFees="Service Fees" verification="EID Verification" path="/dashboard/teacher-registration"/>
                            <ServiceCard title="Teacher License Renewal" ministry="Ministry of Education" serviceFees="Service Fees" verification="EID Verification" path="/dashboard/teacher-registration"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ServiceList;