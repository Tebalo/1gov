"use client"

import React, { useState } from "react";
import {Stepper } from "./Stepper";
import { DynamicRadioButtons } from "./DynamicRadioButtons";
import { DynamicDropdownButtons } from "./DynamicDropdownButton";
import {z} from 'zod'
import {motion} from 'framer-motion';
import { zodResolver } from "@hookform/resolvers/zod";
import {useForm, SubmitHandler} from 'react-hook-form';
import { FormDataSchema } from "../lib/schema";

type Inputs = z.infer<typeof FormDataSchema>

interface Option {
    label: string;
    value: string;
}

const steps = [
    {
        id: 'Step 1',
        name: 'PRELIMINARY INFO',
        fields: ['Citizenry','Status','Categories of Practice','Sub-categories']
    },
    {
        id: 'Step 2',
        name: 'EMPLOYMENT DETAILS',
        fields: ['Citizenry','Status','Categories of Practice','Sub-categories']
    },
    {
        id: 'Step 3',
        name: 'QUALIFICATIONS',
        fields: ['Citizenry','Status','Categories of Practice','Sub-categories']
    },
    {
        id: 'Step 4',
        name: 'DISABILITY',
        fields: ['Citizenry','Status','Categories of Practice','Sub-categories']
    },
    {
        id: 'Step 5',
        name: 'OFFENCE DECLARATION',
        fields: ['Citizenry','Status','Categories of Practice','Sub-categories']
    },
    {
        id: 'Step 5',
        name: 'ATTACHMENTS',
        fields: ['Citizenry','Status','Categories of Practice','Sub-categories']
    },
    {
        id: 'Step 5',
        name: 'DECLARATION',
        fields: ['Citizenry','Status','Categories of Practice','Sub-categories']
    },
    {
        id: 'Step 6',
        name: 'CONFIRMATION'
    },
    {
        id: 'Step 7',
        name: 'COMPLETE'
    },
]

const citizenOptions = [
    {label: 'Citizen', value: 'citizen'},
    {label: 'Non-citizen', value: 'non-citizen'},
]

const statusOptions = [
    {label: 'Student', value: 'student'},
    {label: 'Unemployed', value: 'unemployed'},
    {label: 'Serving', value: 'serving'},
    {label: 'Retired', value: 'retired'},
]

const areaOfPractice = [
    {label: 'Pre-primary', value: 'student'},
    {label: 'Primary', value: 'primary'},
    {label: 'Junior Secondary', value: 'junior secondary'},
    {label: 'Secondary', value: 'secondary'},
]

const registrationCategory = [
    {label: 'Teacher Aide', value: 'Teacher Aide'},
    {label: 'Early Childhood Teacher', value: 'Early Childhood Teacher'},
    {label: 'Primary School Teacher', value: 'Primary School Teacher'},
    {label: 'Junior Secondary Teacher', value: 'Junior Secondary Teacher'},
    {label: 'Senior Secondary Teacher', value: 'Senior Secondary Teacher'},
    {label: 'Special Education/Guidance and Counselling Teacher', value: 'Special Education/Guidance and Counselling Teacher'},
    {label: 'Education Administrator', value: 'Education Administrator'},
]

export const RegistrationForm = () => {
    const [selectedCitizenOption, setSelectedCitizenOption] = useState<string | null>(null);
    const [selectedStatusOption, setSelectedStatusOption] = useState<string | null>(null);
    const [selectedAreOfPracticeOption, setSelectedAreaOfPracticeOption] = useState<string | null>(null);
    const [selectedRegistrationCategoryOption, setSelectedRegistrationCategoryOption] = useState<string | null>(null);

    const [previousStep, setPreviousStep] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const delta = currentStep - previousStep

    const {
        register,
        handleSubmit,
        watch,
        reset,
        trigger,
        formState: {errors}
    } = useForm<Inputs>({
        resolver: zodResolver(FormDataSchema)
    })

    type FieldName = keyof Inputs

    const next = async () => {
        const fields = steps[currentStep].fields
        const output = await trigger(fields as FieldName[], {shouldFocus: true})

        if(!output) return

        if (currentStep < steps.length - 1){
            if(currentStep === steps.length - 2){
                await handleSubmit(processForm)()
            }
            setPreviousStep(currentStep)
            setCurrentStep(step => step + 1)
        }
    }

    const prev = () => {
        if (currentStep > 0){
            setPreviousStep(step => step + 1)
            setCurrentStep(step => step - 1)
        }
    }

    const processForm: SubmitHandler<Inputs> = data => {
        console.log(data)
        reset()
    }



    const handleCitizenOptionSelect = (value: string) => {
        setSelectedCitizenOption(value);
    };
    const handleStatusOptionSelect = (value: string) => {
        setSelectedStatusOption(value);
    };
    const handleAreOfPracticeOptionSelect = (value: string) => {
        setSelectedAreaOfPracticeOption(value);
    };
    const handleRegistrationCategoryOptionSelect = (value: string) => {
        setSelectedRegistrationCategoryOption(value);
    };

    return(
        <div className="flex m-5 space-x-1">
            <nav aria-label="Progress">
                <Stepper currentStep={0} steps={steps}/>
            </nav>
            <form>
                <div className="bg-slate-100 p-2 rounded-lg h-full mb-2">
                    <div className="grid gap-6 mb-6 md:grid-cols-2 sm:grid-cols-1">
                        <div className=''>
                            <DynamicRadioButtons options={citizenOptions} onSelect={handleCitizenOptionSelect} name="Citizenry"/>
                        </div>
                        <div className=''>
                            <DynamicRadioButtons options={statusOptions} onSelect={handleStatusOptionSelect} name="Status"/>
                        </div>
                        <div className=''>
                            <DynamicDropdownButtons options={areaOfPractice} onChange={handleAreOfPracticeOptionSelect} defaultPractice="Select..." name="Categories of Practice"/>
                        </div>  
                        <div className=''>
                            <DynamicDropdownButtons options={registrationCategory} onChange={handleRegistrationCategoryOptionSelect} defaultPractice="Select..." name="Sub-categories"/>
                        </div>
                    </div>
                </div>
                <div className='flex float-end space-x-2'>
                    <button type="button" className="py-2 px-4 me-2 mb-0 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200">Save</button>
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2 text-center">Next</button>
                </div>
            </form>
        </div>
    );
}