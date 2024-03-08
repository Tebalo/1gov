"use client"
import React, {useState} from 'react';
import StatusHistory from './StatusHistory';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

const Preliminary: React.FC = () => {
    return(
        <div className='h-full w-full'>
            <Card className='h-full'>
            <div className='grid grid-cols-2 m-10 gap-y-5'>
                <div className='flex flex-col space-y-1'>
                    <Label>Application Type:</Label>
                    <span className='font-light text-sm'>Teacher</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Work status:</Label>
                    <span className='font-light text-sm'>Serving</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Practice category:</Label>
                    <span className='font-light text-sm'>Primary</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Practice sub-category:</Label>
                    <span className='font-light text-sm'>Teacher Aide</span>
                </div>
            </div>
            </Card>
        </div>
    );
}
const Bio: React.FC = () => {
    return(
        <div className='h-full w-full'>
            <Card className='h-full'>
            <div className='grid grid-cols-4 m-10 gap-y-5'>
                <div className='flex flex-col space-y-1'>
                    <Label>National ID:</Label>
                    <span className='font-light text-sm'>Teacher</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Forenames:</Label>
                    <span className='font-light text-sm'>Oaitse</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Surname:</Label>
                    <span className='font-light text-sm'>Serala</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Date of birth:</Label>
                    <span className='font-light text-sm'>1996-02-15</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Place of birth:</Label>
                    <span className='font-light text-sm'>Mahalapye</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Gender:</Label>
                    <span className='font-light text-sm'>Male</span>
                </div>
            </div>
            </Card>
        </div>
    );
}
const Employment: React.FC = () => {
    return(
        <div className='border rounded-lg h-full w-full'>

        </div>
    );
}
const Qualifications: React.FC = () => {
    return(
        <div className='border rounded-lg h-full w-full'>

        </div>
    );
}
const Disability: React.FC = () => {
    return(
        <div className='border rounded-lg h-full w-full'>

        </div>
    );
}
const Offence: React.FC = () => {
    return(
        <div className='border rounded-lg h-full w-full'>

        </div>
    );
}
const Attachments: React.FC = () => {
    return(
        <div className='border rounded-lg h-full w-full'>

        </div>
    );
}
const Declaration: React.FC = () => {
    return(
        <div className='border rounded-lg h-full w-full'>

        </div>
    );
}
interface StatusChange {
    newStatus: string; 
    timestamp: Date; 
    changedBy: string; 
}

interface CaseData {
    // ... other case properties
    statusHistory: StatusChange[];
}
const caseData: CaseData = {
    // ... other case properties
    statusHistory: [
        { newStatus: "Pending-Review", timestamp: new Date('2023-10-31T10:20:00'), changedBy: 'Oaitse Segala' },
        { newStatus: "In Progress", timestamp: new Date('2023-11-02T16:05:00'), changedBy: 'Masego Sam' },
        { newStatus: "Needs Additional Info", timestamp: new Date('2023-11-05T09:12:00'), changedBy: 'System' } // Example of a system-generated change
    ]
};

const WorkArea: React.FC = () => {
    const [activeTab, setActiveTab] = useState(1);
    const handleTabClick = (tabNumber: number) => {
        setActiveTab(tabNumber);
    }

    return (                    
    <div className="flex-row w-full font-sans items-start h-auto rounded bg-gray-50">
        <div className='flex items-center justify-around space-x-0 mx-2 mt-5 text-xs'>
            <ul className='flex flex-wrap -mb-px'>
                <li>
                    <button
                    className={`w-full transition ${
                        activeTab ===1 ? 'inline-block px-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active':'inline-block px-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300'
                    }`}
                    onClick={() => handleTabClick(1)}
                    >
                        PRELIMINARY
                    </button>
                </li>
                <li>
                    <button
                    className={`w-full transition ${
                        activeTab ===2 ? 'inline-block px-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active':'inline-block px-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300'
                    }`}
                    onClick={() => handleTabClick(2)}
                    >
                        BIO DATA
                    </button>
                </li>
                <li>
                    <button
                    className={`w-full transition ${
                        activeTab ===3 ? 'inline-block px-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active':'inline-block px-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300'
                    }`}
                    onClick={() => handleTabClick(3)}
                    >
                        EMPLOYMENT
                    </button>
                </li>
                <li>
                    <button
                    className={`w-full transition ${
                        activeTab ===4 ? 'inline-block px-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active':'inline-block px-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300'
                    }`}
                    onClick={() => handleTabClick(4)}
                    >
                        QUALIFICATIONS
                    </button>
                </li>
                <li>
                    <button
                    className={`w-full transition ${
                        activeTab ===5 ? 'inline-block px-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active':'inline-block px-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300'
                    }`}
                    onClick={() => handleTabClick(5)}
                    >
                        DISABILITY
                    </button>
                </li>
                <li>
                    <button
                    className={`w-full transition ${
                        activeTab ===6 ? 'inline-block px-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active':'inline-block px-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300'
                    }`}
                    onClick={() => handleTabClick(6)}
                    >
                        OFFENCE
                    </button>
                </li>
                <li>
                    <button
                    className={`w-full transition ${
                        activeTab ===7 ? 'inline-block px-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active':'inline-block px-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300'
                    }`}
                    onClick={() => handleTabClick(7)}
                    >
                        ATTACHMENTS
                    </button>
                </li>
                <li>
                    <button
                    className={`w-full transition ${
                        activeTab ===8 ? 'inline-block px-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active':'inline-block px-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300'
                    }`}
                    onClick={() => handleTabClick(8)}
                    >
                        DECLARATION
                    </button>
                </li>
            </ul>
        </div>
        <div className='h-80 mx-8 my-2'>
            {activeTab===1 && <Preliminary/>}
            {activeTab===2 && <Bio/>}
            {activeTab===3 && <Employment/>}
            {activeTab===4 && <Qualifications/>}
            {activeTab===5 && <Disability/>}
            {activeTab===6 && <Offence/>}
            {activeTab===7 && <Attachments/>}
            {activeTab===8 && <Declaration/>}
        </div>
        <div className='p-1 mx-8 mb-2'>
            <div className='flex space-x-2 justify-end'>
                <button type="button" className="py-2 px-4 me-2 mb-0 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200">Reject</button>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2 text-center">Approve</button>
            </div>
        </div>
        <ScrollArea className="mx-8 h-40">
            <StatusHistory  />
        </ScrollArea>
    </div>
    );
}
export default WorkArea;