"use client"
import React, {useState}  from "react";
import {motion} from 'framer-motion';

interface RowData {
    id: string;
    title: string;
    date: string;
    status: string;
}

const Drafts: React.FC = () => {
    const rowData: RowData[] = [
        { id: '67bf7nfe74unf843m', title: 'Teacher registration', date: '02 Feb 2024 - 12:48', status: 'Draft' },
        { id: '67bf7nfe74unf657g', title: 'Teacher registration', date: '02 Feb 2024 - 12:48', status: 'Draft' },
    ];
    return(
        <div>
            <div className="border-b-2 font-bold">
                <h3 className="text-gray-900 px-4">Total: 2</h3>
            </div>
            <table className="relative overflow-x-auto">
                <thead className="text-xs text-gray-900 uppercase">
                    <tr>
                        <th scope="col" className="pr-10 pl-4 py-3">
                            Submission Id
                        </th>
                        <th scope="col" className="px-10 py-3">
                            Title
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Saved
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Status
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="space-y-2">
                    {rowData.map((row)=>(
                        <tr key={row.id} className="bg-gray-100 border shadow-lg rounded-lg text-gray-900 text-xs font-light whitespace-nowrap">
                            <th scope="row" className="px-6 py-4 font-normal">
                                {row.id}
                            </th>
                            <th className="px-10 py-4 font-normal">
                                {row.title}
                            </th>
                            <th className="px-6 py-4 font-normal">
                                {row.date}
                            </th>
                            <th className="px-6 py-4 font-normal text-gray-100">
                                <div className="bg-green-300 rounded-lg px-2 py-0">
                                    {row.status}
                                </div>
                            </th>
                            <th className="px-6 py-4 font-normal">
                                <button
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-3 py-0.5 text-center me-2 mb-0"
                                >
                                    Continue
                                </button>
                            </th>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

const Submission: React.FC = () =>{
    const rowData: RowData[] = [
        { id: '67bf7nfe74unf843m', title: 'Teacher registration', date: '02 Feb 2024 - 12:48', status: 'Pending-Approval' },
        { id: '67bf7nfe74unf843m', title: 'Teacher registration', date: '02 Feb 2024 - 12:48', status: 'Pending-Approval' },
    ];
    return(
        <div>
            <div className="border-b-2 font-bold">
                <h3 className="text-gray-900 px-4">Total: 2</h3>
            </div>
            <table className="relative overflow-x-auto">
                <thead className="text-xs text-gray-900 uppercase">
                    <tr>
                        <th scope="col" className="pr-10 pl-4 py-3">
                            Submission Id
                        </th>
                        <th scope="col" className="px-10 py-3">
                            Title
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Submitted
                        </th>

                        <th scope="col" className="px-6 py-3">
                            Status
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="space-y-2">
                    {rowData.map((row)=>(
                        <tr key={row.id} className="bg-gray-100 border shadow-lg rounded-lg text-gray-900 text-xs font-light whitespace-nowrap">
                            <th scope="row" className="px-6 py-4 font-normal">
                                {row.id}
                            </th>
                            <th className="px-10 py-4 font-normal">
                                {row.title}
                            </th>
                            <th className="px-6 py-4 font-normal">
                                {row.date}
                            </th>
                            <th className="px-6 py-4 font-normal text-gray-100">
                                <div className="bg-green-300 rounded-lg px-2 py-0">
                                    {row.status}
                                </div>
                            </th>
                            <th className="px-6 py-4 font-normal">
                                <button
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-0.5 text-center me-2 mb-0"
                                >
                                    View
                                </button>
                            </th>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
const MyApplications: React.FC = () => {
    //const modalClass = isOpen ? 'opacity-100' : ''
    const [activeTab, setActiveTab] = useState(1);
    const delta = activeTab
    const handleTabClick = (tabNumber: number) => {
        setActiveTab(tabNumber);
    }
    return(
        <main className="mx-10 mt-10 space-y-3">
            <div className="text-lg font-medium text-center text-gray-500 border-b border-gray-50">
                <ul className="flex flex-wrap -mb-px">
                    <li className="me-2">
                        <button
                        className={`w-full transition ${
                            activeTab ===1 ? 'inline-block px-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active':'inline-block px-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300'
                        }`}
                        onClick={() => handleTabClick(1)}
                        >
                            Submitted
                        </button>
                    </li>
                    <li className="me-2">
                        <button
                        className={`w-full transition ${
                            activeTab ===2 ? 'inline-block px-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active':'inline-block px-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300'
                        }`}
                        onClick={() => handleTabClick(2)}
                        >
                            Drafts
                        </button>
                    </li>
                </ul>
            </div>
            <div className="">
                {activeTab===1 && <Submission/>}
                {activeTab===2 && <Drafts/>}
            </div>
        </main>
    )
}
export default MyApplications;