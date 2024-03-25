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
import { apiUrl } from '@/app/lib/store';

const Preliminary: React.FC<Props> = (pre: Props) => {
    return(
        <div className='h-full w-full'>
            <div className='grid md:grid-cols-2 m-10 gap-y-5'>
                <div className='flex flex-col space-y-1'>
                    <Label>Application Type:</Label>
                    <span className='font-light text-sm'>{pre.teacher_registrations.registration_type}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Work status:</Label>
                    <span className='font-light text-sm'>{pre.teacher_preliminary_infos.work_status}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Practice category:</Label>
                    <span className='font-light text-sm'>{pre.teacher_preliminary_infos.practice_category}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Practice sub-category:</Label>
                    <span className='font-light text-sm'>{pre.teacher_preliminary_infos.sub_category}</span>
                </div>
            </div>
        </div>
    );
}

const Bio: React.FC<bio_datas> = (bio: bio_datas) => {
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

const Employment: React.FC<employment_details> = (emp: employment_details) => {
    return(
        <div className='h-full w-full'>
            <div className='grid md:grid-cols-3 m-10 gap-y-5'>
                 <div className='flex flex-col space-y-1'>
                    <Label>Years in service:</Label>
                    <span className='font-light text-sm'>{emp.experience_years}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Type of institution:</Label>
                    <span className='font-light text-sm'>{emp.institution_type}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Current station/institution:</Label>
                    <span className='font-light text-sm'>{emp.current_institution}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Region:</Label>
                    <span className='font-light text-sm'>{emp.region}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>District:</Label>
                    <span className='font-light text-sm'>{emp.district}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>City/Town/Village:</Label>
                    <span className='font-light text-sm'>{emp.city_or_town}</span>
                </div>
            </div>
        </div>
    );
}
const Qualifications: React.FC<Props> = (data: Props) => {
    const path = `${apiUrl}/Qualifications/`
    return (
        <div >
        <ScrollArea className='h-96'>
          {data.edu_pro_qualifications.map((qual, index) => (
            <div key={index} className='h-full bg-slate-100 rounded-lg py-2 px-5 mb-2'>
                <span className='font-light mr-2'>{index+1}.</span>
              <div className='grid md:grid-cols-3 mx-10 mt-1 mb-2 gap-y-5'>
                <div className='flex flex-col space-y-1'>
                  <Label>Qualification level:</Label>
                  <span className='font-light text-sm'>{qual.level}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                  <Label>Qualification name:</Label>
                  <span className='font-light text-sm'>{qual.qualification}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                  <Label>Awarding Institution:</Label>
                  <span className='font-light text-sm'>{qual.institution}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                  <Label>Year Of Completion:</Label>
                  <span className='font-light text-sm'>{qual.qualification_year}</span>
                </div>
                <div className=''>
                  <Link
                    href={path+qual.attachments}
                    target='_blank'
                    rel="noreferrer noopener"
                    className='cursor-pointer'
                  >
                    <div className='flex space-x-1'>
                      <FaFilePdf style={{ fontSize: '1.5rem', color: '#FF6666' }} />
                      <span>{qual.attachments}</span>
                    </div>
                    <span className='text-xs font-thin italic'>
                      click to open in a new tab.{" "}
                    </span>
                  </Link>
                </div>
              </div>
              <div className='mx-10 flex space-x-24'>
                <div>
                  <Label>Minor subjects:</Label>
                  <ol type='1'>
                    {qual.minor_subjects.map((subject, index) => (
                      <li key={index}>
                        <span className='font-light mr-2'>{index+1}.</span>
                        <span className='font-light text-sm'>{subject}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <div>
                  <Label>Major subjects:</Label>
                  <ol type='1'>
                    {qual.major_subjects.map((subject, index) => (
                      <li key={index}>
                        <span className='font-light mr-2'>{index+1}.</span>
                        <span className='font-light text-sm'>{subject}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          ))}
          </ScrollArea>
        </div>
      );
}
const Disability: React.FC<bio_datas> = (dis: bio_datas) => {
    return(
        <div className='h-full w-full'>
            <div className='grid md:grid-cols-1 m-10 gap-y-5'>
                <div className='flex flex-col space-y-1'>
                    <Label>Are you living with any form of disability:</Label>
                    <span className='font-light text-sm'>{dis.disability}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>Nature of Disability:</Label>
                    <span className='font-light text-sm'>{dis.disability_description}t</span>
                </div>
            </div>
        </div>
    );
}
const Offence: React.FC<offence_convictions> = (off:offence_convictions) => {
    return(
        <div className='h-full w-full'>
            <div className='grid md:grid-cols-2 m-10 gap-y-5 gap-x-5'>
                <div className='flex flex-col space-y-1'>
                    <Label>1. Have you been convicted of, or entered a plea of guilty or no contest to, or a criminal offense against a learner/ a minor?:</Label>
                    <span className='font-light text-sm'>{off.drug_related_offence}, {off.drug_related_offence_details}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>2. Have you been convicted of, or entered a plea of guilty or no contest to, or a criminal offense of possession of and or of drugs use?:</Label>
                    <span className='font-light text-sm'>{off.drug_related_offence}, {off.drug_related_offence_details}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>3. Have you ever had a teaching license revoked, suspended, invalidated, cancelled or denied by any teaching council or any authority; surrendered such a license or the right to apply for such a license; or had any other adverse action taken against such a license. Please note that this includes a reprimand, warning, or reproval and any order denying the right to apply or reapply for a license?:</Label>
                    <span className='font-light text-sm'>{off.license_flag}</span>
                </div>
                <div className='flex flex-col space-y-1'>
                    <Label>4. Are you currently the subject of any review, inquiry, investigation, or appeal of alleged misconduct that could warrant discipline or termination by your employer. Please note that this includes any open investigation by or pending proceeding with a child protection agency and any pending criminal charges?:</Label>
                    <span className='font-light text-sm'>{off.misconduct_flag}</span>
                </div>
            </div>
        </div>
    );
}
const Attachments: React.FC = () => {
    return(
        <div className='h-full w-full'>
            <div className='grid md:grid-cols-2 m-10 gap-y-5 gap-x-5'>
                <div className='space-y-2'>
                    <Label>Certified copy of OMANG or passport</Label>
                    <div className='flex space-x-1'>
                        <FaFilePdf style={{ fontSize: '2rem', color: '#FF6666' }}/>
                        <span>Omang.pdf</span>
                    </div>
                    <span className='text-xs font-thin italic'>
                        click to open in a new tab.{" "}
                    </span>
                </div>
                <div className='space-y-2'>
                    <Label>Verification of qualification from BQA</Label>
                    <div className='flex space-x-1'>
                        <FaFilePdf style={{ fontSize: '2rem', color: '#FF6666' }}/>
                        <span>Omang.pdf</span>
                    </div>
                    <span className='text-xs font-thin italic'>
                        click to open in a new tab.{" "}
                    </span>
                </div>
            </div>
        </div>
    );
}
const Declaration: React.FC<declarations> = (dec: declarations) => {
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

interface teacher_preliminary_infos {
    id: string,
    national_id: string;
    citizen_status: string,
    work_status: string,
    practice_category: string,
    sub_category: string,
    created_at: string,
    updated_at: string
}
  
interface declarations {
    agreement: boolean;
    signature: string;
}

interface offence_convictions {
    id: string,
    student_related_offence: string;
    student_related_offence_details: string;
    drug_related_offence: string;
    drug_related_offence_details: string;
    license_flag: string;
    license_flag_details: string;
    misconduct_flag: string;
    misconduct_flag_details: string;
}

interface edu_pro_qualifications{
    id: string,
    level: string,
    qualification: string,
    institution: string,
    qualification_year: string,
    attachments: string,
    minor_subjects: [],
    major_subjects: [],
}

interface bio_datas {
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
    disability_description: string;
}
interface employment_details {
    experience_years: number;
    current_institution: string;
    institution_type: string;
    region: string;
    district: string;
    city_or_town: string;
}
interface teacher_registrations {
    national_id: string;
    reg_number: string;
    registration_type: string;
    reg_status: string;
    created_at: string;
    updated_at: string;
}
interface attachments{
    national_id: string,
    national_id_copy: string,
    qualification_copy: string,
    proof_of_payment: string,
    created_at: string,
    updated_at: string
}
interface Props {
    teacher_registrations: teacher_registrations,
    teacher_preliminary_infos: teacher_preliminary_infos,
    edu_pro_qualifications: edu_pro_qualifications[],
    bio_datas: bio_datas,
    declarations: declarations,
    offence_convictions: offence_convictions,
    employment_details: employment_details,
    attachments: attachments,
    userRole:string
}
interface Work{
    data: Props,
    userRole: string
}
interface StatusTransition {
    [key: string]: {
        prev_status: string;
        next_status: string;
    };
  }
  
  const statusTransitions: StatusTransition = {
    'Default': {
        prev_status: 'Default',
        next_status: 'Default',
    },
    'registration_officer': {
        prev_status: 'Customer-Action-Pending',
        next_status: 'Pending-Screening',
    },
    'snr_registration_officer': {
        prev_status: 'Pending-Review',
        next_status: 'Pending-Manager-Review',
    },
    'manager': {
        prev_status: 'Pending-Screening',
        next_status: 'Pending-Director-Review',
    },
    'director': {
        prev_status: 'Pending-Manager-Review',
        next_status: 'Pending-Registrar-Review',
    },
    'registrar': {
        prev_status: 'Pending-Director-Review',
        next_status: 'Registration-Case-Complete',
    },
  };


  export const getNextStatus = (userRole: string): { prev_status: string; next_status: string } => {
    const statusTransition = statusTransitions[userRole] || statusTransitions['Default'];
    return statusTransition;
  };
const WorkArea: React.FC<Work> = (data, userRole) => {
    console.log('role', data.userRole)
    const { prev_status, next_status } = getNextStatus(data.userRole);
    const router = useRouter()
    const [activeTab, setActiveTab] = useState(1);
    const handleTabClick = (tabNumber: number) => {
        setActiveTab(tabNumber);
    }
    const { toast } = useToast()
    const handleStatusChange=async (id:string, status:string)=>{
        const res = await UpdateStatus(data.data.teacher_preliminary_infos.national_id, status)
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
            router.prefetch('/trls/home')
            router.push('/trls/home')
        }
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
                {activeTab===1 && <Preliminary {...data.data}/>}
                {activeTab===2 && <Bio {...data.data.bio_datas}/>}
                {activeTab===3 && <Employment {...data.data.employment_details}/>}
                {activeTab===4 && <Qualifications {...data.data}/>}
                {activeTab===5 && <Disability {...data.data.bio_datas}/>}
                {activeTab===6 && <Offence {...data.data.offence_convictions}/>}
                {activeTab===7 && <Attachments/>}
                {activeTab===8 && <Declaration {...data.data.declarations}/>}
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
                            onClick={async () => await handleStatusChange(data.data.teacher_preliminary_infos.national_id, prev_status)}
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
                                This action will change the status to <span className='italic font-medium'>{next_status}</span>, and this will route the application to the next level.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                            className='bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300'
                            onClick={async () => await handleStatusChange(data.data.teacher_preliminary_infos.national_id, next_status)}
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
                        <StatusHistory reg_number=""/>
                        </Suspense>
                    </ScrollArea>
                </Card>
            </ScrollArea>
    </div>
    );
}
export default WorkArea;