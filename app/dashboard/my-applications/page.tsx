"use client"
import React, {useState}  from "react";
import {motion} from 'framer-motion';

const MyApplications: React.FC = () => {
    //const modalClass = isOpen ? 'opacity-100' : ''
    const [activeTab, setActiveTab] = useState(1);
    const delta = activeTab
    const handleTabClick = (tabNumber: number) => {
        setActiveTab(tabNumber);
    }
    return(
        <main className="mx-10 mt-10">
            <div className="text-lg font-medium text-center text-gray-500 border-b border-gray-200">
                <ul className="flex flex-wrap -mb-px">
                    <li className="me-2">
                        <button
                        className={`w-full`}
                        onClick={() => handleTabClick(1)}
                        >
                            Submitted
                        </button>
                    </li>
                    <li className="me-2">
                        <button
                        
                        >
                            Drafts
                        </button>
                    </li>
                </ul>
            </div>
        </main>
    )
}
export default MyApplications;