"use client"

import React, { useRef, useState } from 'react';
import { Role } from "@/app/lib/store";
import { TeacherResponse } from "../types/teacher-type";
import { Button } from "@/components/ui/button";
import {  BriefcaseBusiness, GraduationCap, Star, FileCheck} from 'lucide-react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TriangleDownIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { Text } from "../components/text";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DownloadLink } from "../components/attachment";
import { Separator } from "@/components/ui/separator";
import TeacherActions from "../actions/mutli-step-flow-actions";
import AuditTrail from "@/components/case/audit-trail";
import { CommentSection } from "@/components/case/comments-multi-step";

interface Teacher{
    data: TeacherResponse,
    userRole: Role
}

const steps = [
  {
    id: 'Step 1',
    name: 'Personal Information',
    fields: ['first_name', 'last_name', 'primary_email', 'citizenship', 'middle_name', 'date_of_birth', 'username', 'gender'] // 'surname',
  },
  {
    id: 'Step 2',
    name: 'Registration Information',
    fields: ['license_link', 'payment_amount', 'payment_name','paid_at', 'payment_ref', 'payment_link', 'subscription_due_date', 'license_expiry_date', 'registration_type', 'institution_verification', 'course_verification', 'license_status', 'pending_customer_action']
  },
  {
    id: 'Step 3',
    name: 'Professional Details',
    fields: ['practice_category', 'sub_category', 'experience_years', 'district', 'institution_type', 'school_level']
  },
  {
    id: 'Step 4',
    name: 'Qualifications',
    fields: ['qualification_certificate', 'institution', 'qualification_year', 'major_subjects', 'qualifications', 'level']
  },
  {
    id: 'Step 5',
    name: 'Declarations & Disclosures',
    fields: ['disability', 'student_related_offence', 'drug_related_offence', 'license_flag', 'misconduct_flag', 'national_id_copy']
  },
  { 
    id: 'Step 6', 
    name: 'Complete', 
    fields: ['declaration', 'profile_data_consent'] 
  }
]

interface Stages {
  stage: number;
  label: string;
}

export default function TeacherRegistration({data, userRole}:Teacher){
    const [previousStep, setPreviousStep] = useState(0)
    const [currentStep, setCurrentStep] = useState(0)
    const delta = currentStep - previousStep
const scrollContainerRef = useRef<HTMLDivElement>(null);
    const next = async () => {
        if(currentStep < steps.length - 1){
            setPreviousStep(currentStep)
            setCurrentStep(step => step + 1)
            scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    const prev = () => {
        if(currentStep > 0){
            setPreviousStep(currentStep)
            setCurrentStep(step => step - 1)
            scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
//     const examples: Stages[] = [
//         { stage: 0, label: 'Just created account' },
//         { stage: 1, label: 'Currently in screening' },
//         { stage: 2, label: 'Under assessment' },
//         { stage: 3, label: 'Awaiting approval' },
//         { stage: 4, label: 'Being endorsed' }
//   ];

    return (
<section className="w-full h-screen overflow-hidden bg-gray-50">
    <div className="h-full flex gap-6 p-2 md:p-2">
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 h-full">
            {/* Case Header - Fixed */}
            <Card className="rounded-lg shadow-lg flex-shrink-0">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        {/* Left Items */}
                        <div className="flex space-x-2">
                            {/* Icon */}
                            <div className="p-1 bg-gray-300 rounded-lg flex-shrink-0">
                                <BriefcaseBusiness className="w-10 h-10 text-white"/>
                            </div>
                            {/* Case ID and Case Type */}
                            <div>
                                <span className="text-sm font-thin">TR-{data.teacher_registrations?.national_id}</span>
                                <h1 className="font-bold">Teacher Registrations</h1>
                            </div>
                        </div>
                        {/* Right Items */}
                        <div className="flex flex-shrink-0">
                            <div>
                                <Actions data={data}/>
                            </div>
                            <div>
                                <Button className="rounded-full" variant={"ghost"}>
                                    <Star className="w-5 h-5"/>
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Scrollable Content Area */}
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto mt-4 min-h-0">
                <Card className="rounded-lg shadow-lg">
                    {/* Progress Steps */}
                    <CardHeader className="">
                        <nav aria-label='Progress' className='md:px-6 py-6 space-y-5 border-b md:block hidden'>

                            {/* Current step */}
                            <div className="flex space-x-2 justify-start items-center">
                                <div className="flex bg-gray-700 flex-shrink-0 text-white w-6 h-6 items-center justify-center text-xs rounded-full">
                                    TR
                                </div>
                                <span className="font-bold text-gray-700 text-sm">{steps[currentStep].name}</span>
                            </div>

                            {/* Steps */}
                            <ol role='list' className='space-y-4 md:flex md:space-x-0 md:space-y-0'>
                            {steps.map((step, index) => (
                                <li key={step.name} className='md:flex-1'>
                                {currentStep > index ? (
                                    <div>
                                        <div className="flex justify-center mt-2">
                                            <span className="text-xs font-light text-blue-600">{step.name}</span>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            {index > 0 ? (
                                            <div className="w-full h-0.5 bg-blue-600"></div>
                                            ) : (
                                            <div className="w-full"></div>
                                            )}
                                            <div className="w-4 h-4 bg-blue-600 rounded-full flex-shrink-0"></div>
                                            {index < steps.length - 1 ? (
                                            <div className="w-full h-0.5 bg-blue-600"></div>
                                            ) : (
                                            <div className="w-full"></div>
                                            )}
                                        </div>
                                    </div>
                                ) : currentStep === index ? (
                                    <div>
                                        <div className="flex justify-center mt-2">
                                            <span className="text-xs font-light text-blue-600">{step.name}</span>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            {index > 0 ? (
                                            <div className="w-full h-0.5 bg-blue-600"></div>
                                            ) : (
                                            <div className="w-full"></div>
                                            )}
                                            <div className="w-4 h-4 border-2 border-blue-600 bg-white rounded-full flex-shrink-0 hover:cursor-pointer"></div>
                                            {index < steps.length - 1 ? (
                                            <div className="w-full h-0.5 bg-gray-300"></div>
                                            ) : (
                                            <div className="w-full"></div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="flex justify-center mt-2">
                                            <span className="text-xs font-light text-gray-500">{step.name}</span>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            {index > 0 ? (
                                            <div className="w-full h-0.5 bg-gray-300"></div>
                                            ) : (
                                            <div className="w-full"></div>
                                            )}
                                            <div className="w-4 h-4 border-2 border-gray-300 bg-white rounded-full flex-shrink-0 hover:cursor-pointer"></div>
                                            {index < steps.length - 1 ? (
                                            <div className="w-full h-0.5 bg-gray-300"></div>
                                            ) : (
                                            <div className="w-full"></div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                </li>
                            ))}
                            </ol>
                        </nav>
                    </CardHeader>
                    
                    <CardContent className="space-y-10 py-10 px-4 md:px-20">
                        {/* Step 0: Personal Information */}
                        {currentStep === 0 && (
                            <motion.div
                                initial={{x: delta ? '50%':'-50%', opacity: 0}}
                                animate={{x: 0, opacity: 1}}
                                transition={{ duration: 0.3, ease: 'easeInOut'}}
                            >
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
                                    <Text label={"First Name"} value={data?.bio_datas?.forenames}/>
                                    <Text label={"Last Name"} value={data?.bio_datas?.surname}/>
                                    <Text label={"Middle Name"} value={null}/>
                                    <Text label={"Citizenship"} value={data?.teacher_preliminary_infos?.citizen_status}/>
                                    <Text label={"Nationality"} value={data?.bio_datas?.nationality}/>
                                    <Text label={"National/Passport ID"} value={data?.bio_datas?.national_id}/>
                                    <Text label={"Gender"} value={data?.bio_datas?.gender}/>
                                    <Text label={"Date of birth"} value={data?.bio_datas?.dob}/>
                                    <Text label={"Primary Phone"} value={data.bio_datas?.mobile}/>
                                    <Text label={"Physical Address"} value={data.bio_datas?.physical_address}/>
                                    <Text label={"Postal Address"} value={data.bio_datas?.postal_address}/>
                                    <Text label={"Email"} value={data.bio_datas?.email}/>
                                    <DownloadLink 
                                        label="National ID Copy" 
                                        url={data.attachments?.national_id_copy}
                                        variant="default"
                                    />
                                </div>                                    
                            </motion.div>
                        )}

                        {/* Step 1: Registration Information */}
                        {currentStep === 1 && (
                            <motion.div
                                initial={{x: delta ? '50%':'-50%', opacity: 0}}
                                animate={{x: 0, opacity: 1}}
                                transition={{ duration: 0.3, ease: 'easeInOut'}}
                            >
                                <div className="flex-row space-y-6">
                                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
                                        <Text label={"Status"} value={data.teacher_registrations?.reg_status}/>
                                        <Text label={"Endorsement"} value={data.teacher_registrations?.endorsement_status}/>
                                        <Text label={"License Link"} value={data.teacher_registrations?.license_link}/>
                                        <Text label={"Payment Amount (BWP)"} value={data.teacher_registrations?.payment_amount}/>
                                        <Text label={"Payment Name"} value={data.teacher_registrations?.payment_name}/>
                                        <Text label={"Payment Reference"} value={data.teacher_registrations?.payment_ref}/>
                                        <Text label={"Payment Link"} value={data.teacher_registrations?.payment_link}/>
                                        <Text label={"Subscription Due Date"} value={data.teacher_registrations?.subscription_due_date}/>
                                        <Text label={"License Expiry Date"} value={data.teacher_registrations?.license_expiry_date}/>
                                        <Text label={"Registration Type"} value={data.teacher_registrations?.registration_type}/>
                                        <Text label={"Submitted Via"} value={data.teacher_registrations?.submitted_via}/>
                                        {/* <Text label={"Pending Customer Action"} value={data.teacher_registrations?.pending_customer_action}/> */}
                                    </div> 
                                    <Separator/>
                                    <Card className="p-4">
                                        <CardHeader className="border-b bg-gradient-to-r from-emerald-50 to-teal-50">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                                    <FileCheck className="w-6 h-6 text-emerald-600"/> 
                                                </div>
                                                <div>
                                                    <h1 className="text-xl font-semibold text-gray-800">Automated Background Checks</h1>
                                                    <p className="text-xs text-gray-600 mt-0.5">System verification of submitted information</p>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                        {data?.background_checks && data?.background_checks?.length > 0 ? (
                                        <Table>
                                            <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Description</TableHead>
                                                <TableHead>Checked By</TableHead>
                                                <TableHead>Date</TableHead>
                                            </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                            {data.background_checks?.map((check, index) => (
                                                <TableRow key={index}>
                                                <TableCell>{check.name}</TableCell>
                                                <TableCell>{check.description}</TableCell>
                                                <TableCell>{check.checked_by}</TableCell>
                                                <TableCell>{new Date(check.created_at || '').toLocaleDateString()}</TableCell>
                                                </TableRow>
                                            ))}
                                            </TableBody>
                                        </Table>
                                        ) : (
                                            <div className="flex items-center justify-center p-4 text-muted-foreground">
                                            No background checks data available
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                                </div>   
                            </motion.div>
                        )}

                        {/* Step 2: Professional Details */}
                        {currentStep === 2 && (
                            <motion.div
                                initial={{x: delta ? '50%':'-50%', opacity: 0}}
                                animate={{x: 0, opacity: 1}}
                                transition={{ duration: 0.3, ease: 'easeInOut'}}
                            >
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
                                    <Text label={"Employment Status"} value={data.teacher_registrations?.work_status}/>
                                    <Text label={"Practice Category"} value={data.teacher_preliminary_infos?.practice_category}/>
                                    <Text label={"Sub Category"} value={data.teacher_preliminary_infos?.sub_category}/>
                                    <Text label={"Experience"} value={data.employment_details?.experience_years}/>
                                    <Text label={"Region"} value={data.employment_details?.region}/>
                                    <Text label={"Institution"} value={data.employment_details?.institution_type}/>
                                    <Text label={"School"} value={data.employment_details?.current_institution}/>
                                </div>                                
                            </motion.div>
                        )}

                        {/* Step 3: Qualifications */}
                        {currentStep === 3 && (
                            <motion.div
                                initial={{x: delta ? '50%':'-50%', opacity: 0}}
                                animate={{x: 0, opacity: 1}}
                                transition={{ duration: 0.3, ease: 'easeInOut'}}
                            >
                                <div className="flex-row space-y-6">
                                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
                                        <Text label={"Teaching Qualification Level"} value={data.edu_pro_qualifications?.level}/>
                                        <Text label={"Bachelor's Degree"} value={data.edu_pro_qualifications?.qualification}/>
                                        <Text label={"Name of Institution"} value={data.edu_pro_qualifications?.institution}/>
                                        <Text label={"Qualification Year"} value={data.edu_pro_qualifications?.qualification_year}/>
                                        <Text label={"Subject Specialization"} value={data.edu_pro_qualifications?.major_subjects}/>
                                        <Text label={"Institution"} value={data.edu_pro_qualifications?.institution}/>
                                        <Text label={"Institution Verification"} value={data.teacher_registrations?.institution_verification}/>
                                        <Text label={"Course Verification"} value={data.teacher_registrations?.course_verification}/>
                                        <DownloadLink 
                                            label="Qualification Document" 
                                            url={data.edu_pro_qualifications?.attachments}
                                            variant="default"
                                            />
                                    </div>
                                    <Separator/>
                                    <Card className="p-4">
                                        <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                                    <GraduationCap className="w-6 h-6 text-indigo-600"/> 
                                                </div>
                                                <div>
                                                    <h1 className="text-xl font-semibold text-gray-800">Additional Qualifications</h1>
                                                    <p className="text-xs text-gray-600 mt-0.5">Supplementary educational credentials</p>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                        {data?.other_qualifications && data.other_qualifications.length > 0 ? (
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                    <TableHead>Level</TableHead>
                                                    <TableHead>Qualification</TableHead>
                                                    <TableHead>Attachment</TableHead>
                                                    <TableHead>Institution</TableHead>
                                                    <TableHead>Year</TableHead>
                                                    <TableHead>Subjects</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {data.other_qualifications.map((qual, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{qual.level ?? '-'}</TableCell>
                                                        <TableCell>{qual.qualification ?? '-'}</TableCell>
                                                        <TableCell className="w-32">
                                                            <DownloadLink 
                                                                label="" 
                                                                url={qual.attachments}
                                                                variant="compact"
                                                                />
                                                        </TableCell>
                                                        <TableCell>{qual.institution ?? '-'}</TableCell>
                                                        <TableCell>{qual.qualification_year ?? '-'}</TableCell>
                                                        <TableCell>{qual.major_subjects ?? '-'}</TableCell>
                                                    </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        ) : (
                                            <div className="flex items-center justify-center p-4 text-muted-foreground">
                                            No qualifications data available
                                            </div>
                                        )}
                                        </CardContent>
                                    </Card>   
                                </div>                             
                            </motion.div>
                        )}

                        {/* Step 4: Declarations & Disclosures */}
                        {currentStep === 4 && (
                            <motion.div
                                initial={{x: delta ? '50%':'-50%', opacity: 0}}
                                animate={{x: 0, opacity: 1}}
                                transition={{ duration: 0.3, ease: 'easeInOut'}}
                            >
                                <div className='grid grid-cols-1 gap-4 sm:gap-6'>
                                    <Text label={"Are you living with any form of disability"} value={data.bio_datas?.disability}/>
                                    {data.bio_datas?.disability?.toUpperCase()==="YES" && <Text label={"Have you been convicted of a criminal offense against a learner or minor?"} value={data.bio_datas?.disability_description}/>}
                                    <Separator/>
                                    <Text label={"Have you been convicted of a drug related criminal offense?"} value={data.offence_convictions?.drug_related_offence}/>
                                    {data.offence_convictions?.drug_related_offence_attachments?.toUpperCase()==="YES" && (
                                    <>
                                        <Text label={"If yes, please provide full details"} value={data.offence_convictions?.drug_related_offence_details}/>
                                        <DownloadLink 
                                            label="Provide supporting evidence/documentation if any (Upload in pdf format) Attachments (optional)" 
                                            url={data.offence_convictions?.drug_related_offence_attachments}
                                            variant="default"
                                            />
                                    </>
                                    )}
                                    <Separator/>
                                    <Text 
                                    label={"Have you ever had your teaching license revoked, suspended, invalidated, cancelled or denied license by any Teaching Council or Authority?"} 
                                    value={data.offence_convictions?.license_flag}/>                                            
                                    {data.offence_convictions?.license_flag?.toUpperCase()==="YES" && <DownloadLink 
                                        label="If yes, please attach a letter giving full details and official documentation of the action taken. Attachments (optional)" 
                                        url={data.offence_convictions?.license_flag_details}
                                        variant="default"
                                    />}
                                    <Separator/>
                                    <Text label={"Are you currently the subject of any review, enquiry or investigations by any Teaching Council or any Authority?"} value={data.offence_convictions?.misconduct_flag}/>
                                    {data.offence_convictions?.license_flag?.toUpperCase()==="YES" && <DownloadLink 
                                        label="If yes, please attach a letter giving full details and any official documentation available regarding the matter. Attachments (optional)" 
                                        url={data.offence_convictions?.misconduct_flag_details}
                                        variant="default"
                                    />}
                                </div>                                
                            </motion.div>
                        )}

                        {/* Step 5: Complete */}
                        {currentStep === 5 && (
                            <motion.div
                                initial={{x: delta ? '50%':'-50%', opacity: 0}}
                                animate={{x: 0, opacity: 1}}
                                transition={{ duration: 0.3, ease: 'easeInOut'}}
                            >
                                <div className='grid grid-cols-1 gap-4 sm:gap-6'>
                                    <TeacherActions recordId={data?.teacher_registrations?.national_id ?? ''} userRole={userRole} current_status={data?.teacher_registrations?.reg_status ?? ''}/>
                                </div>                                
                            </motion.div>
                        )}

                        {/* Navigation */}
                        <div className='md:px-6 py-6 border-t bg-gray-50 rounded-lg'>
                            <div className='flex justify-between items-center'>
                                <Button
                                type='button'
                                onClick={prev}
                                disabled={currentStep === 0}
                                variant='outline'
                                className='flex items-center gap-2 rounded-full'
                                >
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    strokeWidth='1.5'
                                    stroke='currentColor'
                                    className='h-4 w-4'
                                >
                                    <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='M15.75 19.5L8.25 12l7.5-7.5'
                                    />
                                </svg>
                                Back
                                </Button>
                                
                                <div className='flex items-center gap-2'>
                                <span className='text-sm text-gray-500'>
                                    Step {currentStep + 1} of {steps.length}
                                </span>
                                </div>
                                <div className='flex items-center gap-2'>
                                {/* <Button 
                                type='button'
                                className='flex items-center gap-2 rounded-full'
                                variant={"outline"}
                                > 
                                    Save
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        strokeWidth='1.5'
                                        stroke='currentColor'
                                        className='h-4 w-4'
                                    >
                                        <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        d='M4.5 12.75l6 6 9-13.5'
                                        />
                                    </svg>
                                </Button> */}
                                {currentStep == steps.length - 1 && <Button 
                                    type="submit" 
                                    className="flex items-center gap-2 rounded-full" 
                                    form="flow-action-form"
                                >
                                    Submit
                                </Button>} 
                                {currentStep < steps.length - 1 && (
                                <Button
                                    type='button'
                                    onClick={next}
                                    className='flex items-center gap-2 rounded-full'
                                >
                                    Continue
                                    <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    strokeWidth='1.5'
                                    stroke='currentColor'
                                    className='h-4 w-4'
                                    >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        d='M8.25 4.5l7.5 7.5-7.5 7.5'
                                    />
                                    </svg>
                                </Button>
                                )}
                                </div>
                            </div>
                        </div>
                        <Separator/>
                        {/* Comments */}
                        <div>
                            <CommentSection
                            caseId={data.teacher_registrations?.national_id ?? ''}
                            caseType={"teacher"}
                            />
                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
</section>
    )
}

interface ActionsParam{
    data: TeacherResponse | undefined
}

function Actions({data}:ActionsParam){
    // const handleCommentAdded = () => {
    //     console.log('Comment added!');
    // };
    return (
        <div className="flex items-center gap-2">
            <AuditTrail caseId={data?.teacher_registrations?.national_id ?? ''} caseType={"teacher"}/>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"}>
                        Actions
                        <TriangleDownIcon className="w-5 h-5"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuLabel>Case Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem disabled>
                        View attachments
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                        Send notification
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}