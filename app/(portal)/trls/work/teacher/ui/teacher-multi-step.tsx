"use client"
import { Role } from "@/app/lib/store";
import { TeacherResponse } from "../types/teacher-type";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {  BriefcaseBusiness, Star} from 'lucide-react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TriangleDownIcon } from "@radix-ui/react-icons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Text } from "../components/text";

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
    name: 'Contact Information',
    fields: ['primary_phone', 'primary_physical', 'primary_postal']
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
    name: 'Background Check',
    fields: ['disability', 'student_related_offence', 'drug_related_offence', 'license_flag', 'misconduct_flag', 'national_id_copy']
  },
  { 
    id: 'Step 6', 
    name: 'Review & Complete', 
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

    const next = async () => {
        if(currentStep < steps.length - 1){
            setPreviousStep(currentStep)
            setCurrentStep(step => step + 1)
        }
    }

    const prev = () => {
        if(currentStep > 0){
            setPreviousStep(currentStep)
            setCurrentStep(step => step - 1)
        }
    }
    const examples: Stages[] = [
        { stage: 0, label: 'Just created account' },
        { stage: 1, label: 'Currently in screening' },
        { stage: 2, label: 'Under assessment' },
        { stage: 3, label: 'Awaiting approval' },
        { stage: 4, label: 'Being endorsed' }
  ];

    return (
        <section className="bg-gray-50 md:p-2 max-h-screen">
            <div className="max-w-9xl mx-auto flex gap-6">
            
                {/* Main Content */}
                <div className="flex-1 rounded-lg shadow-lg">
                    {/* Case Header */}
                    <Card className="rounded-none">
                        <CardHeader>
                            <div className="flex justify-between">
                                {/* Left Items */}
                                <div className="flex justify-between space-x-2">
                                    {/* Icon */}
                                    <div className="p-1 bg-gray-300 rounded-lg">
                                        <BriefcaseBusiness className="w-10 h-10 text-white"/>
                                    </div>
                                    {/* Case ID and Case Type */}
                                    <div className="">
                                        <span className="text-sm font-thin">TR-440418213</span>
                                        <h1 className="font-bold">Teacher Registrations</h1>
                                    </div>
                                </div>
                                {/* Right Items */}
                                <div className="flex">
                                    <div>
                                        <Actions caseId="440418213"/>
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

                    {/* Stages */}
                    {/* <TeacherRegistrationStages currentStage={3} /> */}
                    
                    {/* Case */}
                    <ScrollArea className="md:[h-500px] p-4">
                        <Card className="rounded-none">
                            {/* Progress Steps */}
                            <CardHeader>
                                <nav aria-label='Progress' className='md:px-6 py-6 space-y-5 border-b md:block hidden'>

                                    {/* Current step */}
                                    <div className="flex space-x-2 justify-start items-center">
                                        <div className="flex bg-gray-700 flex-shrink-0 text-white w-6 h-6 items-center justify-center text-xs rounded-full">
                                            BT
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
                            

                            
                            <CardContent className="space-y-10">
                                {/* Step 1: Personal Information */}
                                {currentStep === 0 && (
                                    <motion.div
                                        initial={{x: delta ? '50%':'-50%', opacity: 0}}
                                        animate={{x: 0, opacity: 1}}
                                        transition={{ duration: 0.3, ease: 'easeInOut'}}
                                    >
                                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
                                            <Text label={"First Name"} value={"Bopaki"}/>
                                            <Text label={"Last Name"} value={"Tebalo"}/>
                                            <Text label={"Middle Name"} value={null}/>
                                            <Text label={"Citizenship"} value={"Citizen"}/>
                                            <Text label={"Nationality"} value={"Botswana"}/>
                                            <Text label={"National/Passport ID"} value={"440418213"}/>
                                            <Text label={"Gender"} value={"Male"}/>
                                            <Text label={"Date of birth"} value={"28/09/1996"}/>
                                        </div>                                    
                                    </motion.div>
                                )}

                                {/* Step 1: Contact Information */}
                                {currentStep === 1 && (
                                    <motion.div
                                        initial={{x: delta ? '50%':'-50%', opacity: 0}}
                                        animate={{x: 0, opacity: 1}}
                                        transition={{ duration: 0.3, ease: 'easeInOut'}}
                                    >
                                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
                                            <Text label={"First Name"} value={"Bopaki"}/>
                                            <Text label={"Last Name"} value={"Tebalo"}/>
                                            <Text label={"Middle Name"} value={"--"}/>
                                            <Text label={"Citizenship"} value={"Citizen"}/>
                                            <Text label={"Nationality"} value={"Botswana"}/>
                                            <Text label={"National/Passport ID"} value={"440418213"}/>
                                            <Text label={"Gender"} value={"Male"}/>
                                            <Text label={"Date of birth"} value={"28/09/1996"}/>
                                        </div>                                
                                    </motion.div>
                                )}

                                {/* Navigation */}
                                <div className='md:px-6 py-6 border-t bg-gray-50'>
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
                                    <Button 
                                    type='button'
                                    className='flex items-center gap-2 rounded-full'
                                    variant={"outline"}
                                    > 
                                        <>
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
                                        </>
                                    </Button>
                                    {currentStep < steps.length - 1 ? (
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
                                    ) : (
                                    <>
                                    </>
                                    )}
                                    </div>
                                </div>
                                </div>
                            </CardContent>
                        </Card>
                    </ScrollArea>
                </div>
            </div>
        </section>
    )
}

interface ActionsParam{
    caseId: string
}

function Actions({caseId}:ActionsParam){
    return (
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
                <DropdownMenuItem>
                    View audit trail
                </DropdownMenuItem>
                <DropdownMenuItem>
                    View attachments
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}