"use client"
import { Role } from "@/app/lib/store";
import { TeacherResponse } from "../types/teacher-type";
import { useState } from "react";
import { Button } from "@/components/ui/button";

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

    return (
        <section className="bg-gray-50 md:p-2 max-h-screen">
            <div className="max-w-9xl mx-auto flex gap-6">
                {/* Main Content */}
                <div className="flex-1 bg-white rounded-lg shadow-lg">
                    {/* Progress Steps */}
                    <nav aria-label='Progress' className='md:px-6 py-6 border-b md:block hidden'>
                        <ol role='list' className='space-y-4 md:flex md:space-x-0 md:space-y-0'>
                        {steps.map((step, index) => (
                            <li key={step.name} className='md:flex-1'>
                            {currentStep > index ? (
                                <div>
                                <div className="flex items-center justify-center">
                                    {index > 0 ? (
                                    <div className="w-full h-1 bg-blue-600"></div>
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
                                <div className="flex justify-center mt-2">
                                    <span className="text-xs font-light text-blue-600">{step.name}</span>
                                </div>
                                </div>
                            ) : currentStep === index ? (
                                <div>
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
                                <div className="flex justify-center mt-2">
                                    <span className="text-xs font-light text-blue-600">{step.name}</span>
                                </div>
                                </div>
                            ) : (
                                <div>
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
                                <div className="flex justify-center mt-2">
                                    <span className="text-xs font-light text-gray-500">{step.name}</span>
                                </div>
                                </div>
                            )}
                            </li>
                        ))}
                        </ol>
                    </nav>


                    {/* Navigation */}
                    <div className='md:px-6 py-6 border-t bg-gray-50'>
                    <div className='flex justify-between items-center'>
                        <Button
                        type='button'
                        onClick={prev}
                        disabled={currentStep === 0}
                        variant='outline'
                        className='flex items-center gap-2'
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
                        className='bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2'
                        > 
                            <>Save
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
                        </svg></>
                        </Button>
                        {currentStep < steps.length - 1 ? (
                        <Button
                            type='button'
                            onClick={next}
                            className='flex items-center gap-2'
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
                </div>
            </div>
        </section>
    )
}