"use client"
import React, {Suspense, useState} from 'react';
import StatusHistory from './StatusHistory';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { LoadingSkeleton } from '../LoadingSkeleton';
import { ToastAction } from '@/components/ui/toast';
import { toast, useToast } from '@/components/ui/use-toast';

import { FaFilePdf } from "react-icons/fa";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { UpdateStatus } from '@/app/lib/actions';
import Link from 'next/link';
import { roundToNearestMinutes } from 'date-fns';

const Preliminary: React.FC<Preliminary> = (pre: Preliminary) => {
    return(
        <div className='h-full w-full'>
            <div className='grid md:grid-cols-2 m-10 gap-y-5'>
                <div className='flex flex-col space-y-1'>
                    <Label>Application Type:</Label>
                    <span className='font-light text-sm'>{pre.type}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Name of institution:</Label>
                    <span className='font-light text-sm'>{pre.institution_name}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Select type of institution:</Label>
                    <span className='font-light text-sm'>{pre.institution_type}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Select area of study:</Label>
                    <span className='font-light text-sm'>{pre.study_area}</span>
                </div>
            </div>
        </div>
    );
}
interface Bio {
    surname: string;
    forenames: string;
    id: string;
    dob: string; 
    pob: string;
    gender: string;
    nationality: string;
    postalAddress: string;
    physicalAddress: string;
    email: string;
    mobile: string;
    maritalStatus: string;
    nextOfKinName: string;
    nextOfKinRelation: string;
    nextOfKinContact: string;
    disability: string;
    disabilityDescription: string;
  }
const Bio: React.FC<Bio> = (bio: Bio) => {
    return(
        <div className='h-full w-full'>
            <div className='grid md:grid-cols-4 m-10 gap-y-5'>
                <div className='flex flex-col space-y-1'>
                    <Label>National ID:</Label>
                    <span className='font-light text-sm'>{bio.id}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Forenames:</Label>
                    <span className='font-light text-sm'>{bio.forenames}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Surname:</Label>
                    <span className='font-light text-sm'>{bio.surname}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Date of birth:</Label>
                    <span className='font-light text-sm'>{bio.dob}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Place of birth:</Label>
                    <span className='font-light text-sm'>{bio.pob}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Gender:</Label>
                    <span className='font-light text-sm'>{bio.gender}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Nationality:</Label>
                    <span className='font-light text-sm'>{bio.nationality}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Postal address:</Label>
                    <span className='font-light text-sm'>{bio.postalAddress}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Physical address:</Label>
                    <span className='font-light text-sm'>{bio.physicalAddress}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Email:</Label>
                    <span className='font-light text-sm'>{bio.email}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Mobile:</Label>
                    <span className='font-light text-sm'>{bio.mobile}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Marital status:</Label>
                    <span className='font-light text-sm'>{bio.maritalStatus}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Next of kin name:</Label>
                    <span className='font-light text-sm'>{bio.nextOfKinName}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Next of kin relation:</Label>
                    <span className='font-light text-sm'>{bio.nextOfKinRelation}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Next of kin contact:</Label>
                    <span className='font-light text-sm'>{bio.nextOfKinContact}</span>
                </div>
            </div>
        </div>
    );
}

const STUDYPROGRAMME: React.FC<StudyProgramme> = (prog: StudyProgramme) => {
    return(
        <div className='h-full w-full'>
            <div className='grid md:grid-cols-3 m-10 gap-y-5'>
                 <div className='flex flex-col space-y-1'>
                    <Label>Programme level:</Label>
                    <span className='font-light text-sm'>{prog.level}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Name of programme:</Label>
                    <span className='font-light text-sm'>{prog.name}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Duration(In Years):</Label>
                    <span className='font-light text-sm'>{prog.duration}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Expected year of completion:</Label>
                    <span className='font-light text-sm'>{prog.completionYear}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Mode of study:</Label>
                    <span className='font-light text-sm'>{prog.modeOfStudy}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Subject specialization (Junior&Sec):</Label>
                    <span className='font-light text-sm'>{prog.specialization}</span>
                </div>
            </div>
        </div>
    );
}
const RECOMMENDATION: React.FC<Recommendation> = (rec: Recommendation) => {
    return(
        <div className='h-full w-full'>
            <div className='grid md:grid-cols-3 mx-10 mt-10 mb-2 gap-y-5'>
                <div className='flex flex-col space-y-1'>
                    <Label>Recommended:</Label>
                    <span className='font-light text-sm'>{rec.recommended}</span>
                </div>
                <div className=''>
                    <Link
                        href={rec.attachment}
                        target='_blank'
                        rel="noreferrer noopener"
                        className='cursor-pointer'
                        >
                            <div className='flex space-x-1'>
                                <FaFilePdf style={{ fontSize: '1.5rem', color: '#FF6666' }}/>
                                <span>document.pdf</span>
                            </div>
                            <span className='text-xs font-thin italic'>
                               click to open in a new tab.{" "}
                            </span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
const Declaration: React.FC<Declarations> = (dec: Declarations) => {
    return(
        <div className='h-full w-full'>
            <div className='grid grid-cols-1 m-10 gap-y-5 gap-x-5'>
                <div className='flex flex-col space-y-1'>
                    <Label>I <span className='italic'>{dec.signature}</span> hereby declare that the information I have provided in this application form is true and correct to the best of my knowledge and belief. I understand that providing false or misleading information may result in the refusal of my application or the cancellation of my registration. I am aware that the Council may collect and verify information about my qualifications, experience, and fitness to teach. I consent to the Council collecting and verifying this information and I authorize the Council to share this information with other relevant organizations, such as employers and educational institutions.</Label>
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
interface Preliminary {
    institution_name:string; 
    institution_type:string; 
    citizenry:string; 
    study_area:string; 
}

interface StudyProgramme{
    name: string;
    completionYear: string;
    level: string;
    duration: number;// Assuming duration is numerical
    modeOfStudy: string;
    specialization: string;
}

interface Recommendation{
    recommended:string;
    attachment: string;
}
  
interface Declarations {
    agreement: boolean;
    signature: string;
}

interface Preliminary {
    institution_name:string;
    type: string;
    id: string;
    institution_type:string;
    citizenry:string;
    study_area:string;
}

interface Props {
    preliminary: Preliminary;
    bio: Bio;
    declarations: Declarations;
    studyprogramme: StudyProgramme;
    recommedation: Recommendation;
  }

const StudentWorkArea: React.FC<Props> = (data: Props) => {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState(1);
    const handleTabClick = (tabNumber: number) => {
        setActiveTab(tabNumber);
    }
    const { toast } = useToast()
    const handleStatusChange=async (id:string, status:string)=>{
        const res = await UpdateStatus(data.preliminary.id, status, '')
        if(!res){
            toast({
                title: "Failed!!!",
                description: "Something went wrong",
                action: (
                  <ToastAction altText="Ok">Ok</ToastAction>
                ),
            })
        }else{
            toast({
                title: "Routed successfully",
                description: "The record has been routed with the status: "+status,
                action: (
                <ToastAction altText="Ok">Ok</ToastAction>
                ),
            })
            router.prefetch('/portal/dashboard/home-o')
            router.push('/portal/dashboard/home-o')
        }
    }

    const new_status = 'Pending-Screening'
    const prev_status = 'Customer-Action-Pending'
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
                        STUDY PROGRAMME
                    </button>
                </li>
                <li>
                    <button
                    className={`w-full transition ${
                        activeTab ===4 ? 'inline-block px-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active':'inline-block px-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300'
                    }`}
                    onClick={() => handleTabClick(4)}
                    >
                        DECLARATION
                    </button>
                </li>
                <li>
                    <button
                    className={`w-full transition ${
                        activeTab ===5 ? 'inline-block px-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active':'inline-block px-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300'
                    }`}
                    onClick={() => handleTabClick(5)}
                    >
                        RECOMMENDATION
                    </button>
                </li>
            </ul>
        </div>
        <ScrollArea className='h-screen'>
            <Card className='mx-8 my-2'>
            <div className=''>
                {activeTab===1 && <Preliminary {...data.preliminary}/>}
                {activeTab===2 && <Bio {...data.bio}/>}
                {activeTab===3 && <STUDYPROGRAMME {...data.studyprogramme}/>}
                {activeTab===4 && <Declaration {...data.declarations}/>}
                {activeTab===5 && <RECOMMENDATION {...data.recommedation}/>}
            </div>
            <div className='p-1 mx-8 mb-2'>
                <div className='flex space-x-2 justify-end'>
                    {/*<button 
                    type="button" 
                    onClick={async () => await handleStatusChange(data.preliminary.id, prev_status)}
                    className="py-2 px-4 me-2 mb-0 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200">Reject</button>
                    <button 
                    type="submit" 
                    onClick={async () => await handleStatusChange(data.preliminary.id, new_status)}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2 text-center">Approve</button>*/}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline">Reject</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action will change the status to <span className='italic font-medium'>{prev_status}</span>, and this will route the application to the previous level.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                            className='bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300'
                            onClick={async () => await handleStatusChange(data.preliminary.id, prev_status)}
                            >Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="default" className='bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300'>Approve</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action will change the status to <span className='italic font-medium'>{new_status}</span>, and this will route the application to the next level.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                            className='bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300'
                            onClick={async () => await handleStatusChange(data.preliminary.id, new_status)}
                            >Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    </div>
                </div>
                </Card>
                <Card className='mx-8 mb-2'>
                    <ScrollArea className="h-72">
                    <Suspense fallback={<LoadingSkeleton/>}>
                        <StatusHistory reg_number={data.preliminary.id} />
                        </Suspense>
                    </ScrollArea>
                </Card>
            </ScrollArea>
    </div>
    );
}
export default StudentWorkArea;