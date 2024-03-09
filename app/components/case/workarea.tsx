"use client"
import React, {Suspense, useState} from 'react';
import StatusHistory from './StatusHistory';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { LoadingSkeleton } from '../LoadingSkeleton';

const Preliminary: React.FC = () => {
    return(
        <div className='h-full w-full'>
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
        </div>
    );
}
const Bio: React.FC = () => {
    return(
        <div className='h-full w-full'>
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
                <div className='flex flex-col space-y-1'>
                    <Label>Nationality:</Label>
                    <span className='font-light text-sm'>Motswana</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Postal address:</Label>
                    <span className='font-light text-sm'>P O Box 7886, Mahalapye</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Physical address:</Label>
                    <span className='font-light text-sm'>Block 10, Gaborone</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Email:</Label>
                    <span className='font-light text-sm'>johndoe@gmail.com</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Mobile:</Label>
                    <span className='font-light text-sm'>26774217788</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Marital status:</Label>
                    <span className='font-light text-sm'>Single</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Next of kin name:</Label>
                    <span className='font-light text-sm'>Sarah Cornor</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Next of kin relation:</Label>
                    <span className='font-light text-sm'>Mother</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Next of kin contact:</Label>
                    <span className='font-light text-sm'>26776554321</span>
                </div>
            </div>
        </div>
    );
}
const Employment: React.FC = () => {
    return(
        <div className='h-full w-full'>
            <div className='grid grid-cols-3 m-10 gap-y-5'>
                 <div className='flex flex-col space-y-1'>
                    <Label>Years in service:</Label>
                    <span className='font-light text-sm'>Teacher</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Type of institution:</Label>
                    <span className='font-light text-sm'>Oaitse</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Current station/institution:</Label>
                    <span className='font-light text-sm'>Serala</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Region:</Label>
                    <span className='font-light text-sm'>1996-02-15</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>District:</Label>
                    <span className='font-light text-sm'>Mahalapye</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>City/Town/Village:</Label>
                    <span className='font-light text-sm'>Male</span>
                </div>
            </div>
        </div>
    );
}
const Qualifications: React.FC = () => {
    return(
        <div className='h-full w-full'>
            <div className='grid grid-cols-2 m-10 gap-y-5'>
                <div className='flex flex-col space-y-1'>
                    <Label>Qualification level:</Label>
                    <span className='font-light text-sm'>Diploma</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Qualification name:</Label>
                    <span className='font-light text-sm'>Diploma in Primary Education</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Awarding Institution:</Label>
                    <span className='font-light text-sm'>Tonota college of education</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Year Of Completion:</Label>
                    <span className='font-light text-sm'>2015</span>
                </div>
            </div>
        </div>
    );
}
const Disability: React.FC = () => {
    return(
        <div className='h-full w-full'>
            <div className='grid grid-cols-1 m-10 gap-y-5'>
                <div className='flex flex-col space-y-1'>
                    <Label>Are you living with any form of disability:</Label>
                    <span className='font-light text-sm'>Yes</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Nature of Disability:</Label>
                    <span className='font-light text-sm'>Visual Impairment</span>
                </div>
            </div>
        </div>
    );
}
const Offence: React.FC = () => {
    return(
        <div className='h-full w-full'>
            <div className='grid grid-cols-2 m-10 gap-y-5 gap-x-5'>
                <div className='flex flex-col space-y-1'>
                    <Label>1. Have you been convicted of, or entered a plea of guilty or no contest to, or a criminal offense against a learner/ a minor?:</Label>
                    <span className='font-light text-sm'>Yes, Sexual Offence</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>2. Have you been convicted of, or entered a plea of guilty or no contest to, or a criminal offense of possession of and or of drugs use?:</Label>
                    <span className='font-light text-sm'>Yes</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>3. Have you ever had a teaching license revoked, suspended, invalidated, cancelled or denied by any teaching council or any authority; surrendered such a license or the right to apply for such a license; or had any other adverse action taken against such a license. Please note that this includes a reprimand, warning, or reproval and any order denying the right to apply or reapply for a license?:</Label>
                    <span className='font-light text-sm'>Yes, Drug manufacturing</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>4. Are you currently the subject of any review, inquiry, investigation, or appeal of alleged misconduct that could warrant discipline or termination by your employer. Please note that this includes any open investigation by or pending proceeding with a child protection agency and any pending criminal charges?:</Label>
                    <span className='font-light text-sm'>Yes</span>
                </div>
            </div>
        </div>
    );
}
const Attachments: React.FC = () => {
    return(
        <div className='h-full w-full'>

        </div>
    );
}
const Declaration: React.FC = () => {
    return(
        <div className='h-full w-full'>
            <div className='grid grid-cols-1 m-10 gap-y-5 gap-x-5'>
                <div className='flex flex-col space-y-1'>
                    <Label>I O.Serala hereby declare that the information I have provided in this application form is true and correct to the best of my knowledge and belief. I understand that providing false or misleading information may result in the refusal of my application or the cancellation of my registration. I am aware that the Council may collect and verify information about my qualifications, experience, and fitness to teach. I consent to the Council collecting and verifying this information and I authorize the Council to share this information with other relevant organizations, such as employers and educational institutions.</Label>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Accept the above terms and conditions</Label>
                    <span className='font-light text-sm'>Yes</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>I agree to submit the listed profile information along with this application.</Label>
                    <span className='font-light text-sm'>Yes</span>
                </div>
            </div>
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
        <ScrollArea className='h-screen'>
            <Card className='mx-8 my-2'>
            <div className=''>
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
            </Card>
            <Card className='mx-8 mb-2'>
                <ScrollArea className="h-72">
                <Suspense fallback={<LoadingSkeleton/>}>
                    <StatusHistory reg_number='7378566' />
                    </Suspense>
                </ScrollArea>
            </Card>
        </ScrollArea>
    </div>
    );
}
export default WorkArea;