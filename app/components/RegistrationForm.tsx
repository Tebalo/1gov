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
import { InformationCard } from "./InformationCard";

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

const institutionOptions = [
    {label: 'Private', value: 'private'},
    {label: 'Public', value: 'public'},
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

const regionOptions = [
    {label: 'Chobe', value: 'Chobe'},
    {label: 'Central', value: 'Central'},
    {label: 'City of Francistown', value: 'City of Francistown'},
    {label: 'Gaborone', value: 'Gaborone'},
    {label: 'Ghanzi', value: 'Ghanzi'},
    {label: 'Jwaneng', value: 'Jwaneng'},
    {label: 'Kgalagadi', value: 'Kgalagadi'},
    {label: 'Kgatleng', value: 'Kgatleng'},
    {label: 'Kweneng', value: 'Kweneng'},
    {label: 'Lobatse', value: 'Lobatse'},
    {label: 'Ngwaketsi', value: 'Ngwaketsi'},
    {label: 'North-East', value: 'North-East'},
    {label: 'North-West', value: 'North-West'},
    {label: 'Selibe Phikwe', value: 'Selibe Phikwe'},
    {label: 'South-East', value: 'South-East'},
    {label: 'Sowa Town', value: 'Sowa Town'},
]

const districtOptions = [
    {label: 'Chobe District', value: 'Chobe District'},
    {label: 'Ghanzi District', value: 'Ghanzi District'},
    {label: 'Kgalagadi District', value: 'Kgalagadi District'},
    {label: 'Kgatleng District', value: 'Kgatleng District'},
    {label: 'Kweneng District', value: 'Kweneng District'},
    {label: 'North-East District', value: 'North-East District'},
    {label: 'Ngamiland District', value: 'Ngamiland District'},
    {label: 'South-East District', value: 'South-East District'},
    {label: 'Southern District', value: 'Southern District'},
]

const placeOptions = [
    {label: 'Gaborone', value: 'Gaborone'},
    {label: 'Maun', value: 'Maun'},
    {label: 'Orapa', value: 'Orapa'},
    {label: 'Gantsi', value: 'Lobatse'},
    {label: 'Letlhakane', value: 'Letlhakane'},
    {label: 'Mopipi', value: 'Mopipi'},
    {label: 'Jwaneng', value: 'Jwaneng'},
    {label: 'Serowe', value: 'Serowe'},
    {label: 'Palapye', value: 'Palapye'},
]

const employmentOptions = [
    {label: 'Employed', value: 'employed'},
    {label: 'Un-Employed', value: 'un-employed'},
]

const disabilityOptions = [
    {label: 'Yes', value: 'yes'},
    {label: 'No', value: 'no'},
]

const convitionOptions = [
    {label: 'Yes', value: 'yes'},
    {label: 'No', value: 'no'},
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
    const [selectedEmploymentOption, setSelectedEmployementOption] = useState<string | null>(null);
    const [selectedInstitutionOption, setSelectedInstitutionOption] = useState<string | null>(null);


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
            console.log("plus 1")
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
    const handleEmploymentOptionSelect = (value: string) => {
        setSelectedEmployementOption(value);
    };
    const handleInstitutionOptionSelect = (value: string) => {
        setSelectedEmployementOption(value);
    };

    return(
        <div>
            <div className="flex m-5 space-x-1 h-96">
                {/* steps */}
                <nav aria-label="Progress">
                    <Stepper currentStep={currentStep} steps={steps}/>
                </nav>
                {/* forms */}
                <form className="" onSubmit={handleSubmit(processForm)}> 
                    {currentStep === 0 && (
                        <motion.div
                            initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{duration: 0.3, ease: 'easeInOut'}}
                        >
                        <div className="bg-slate-100 p-2 rounded-lg h-96 mb-2">
                            <div className="grid gap-y-2 gap-x-10 mb-6 md:grid-cols-2 sm:grid-cols-1">
                                <div className=''>
                                    <DynamicRadioButtons options={citizenOptions} onSelect={handleCitizenOptionSelect} name="Citizenry" register={register} errors={errors}/>
                                </div>
                                <div className=''>
                                    <DynamicRadioButtons options={statusOptions} onSelect={handleStatusOptionSelect} name="Status" register={register} errors={errors}/>
                                </div>
                                <div className=''>
                                    <DynamicDropdownButtons options={areaOfPractice} onChange={handleAreOfPracticeOptionSelect} defaultPractice="Select..." name="Categories of Practice"/>
                                </div>  
                                <div className=''>
                                    <DynamicDropdownButtons options={registrationCategory} onChange={handleRegistrationCategoryOptionSelect} defaultPractice="Select..." name="Sub-categories"/>
                                </div>
                            </div>  
                            </div>
                        </motion.div>           
                    )}
                    {currentStep === 1 && (
                        <motion.div
                            initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{duration: 0.3, ease: 'easeInOut'}}
                        >
                        <div className="bg-slate-100 p-2 rounded-lg h-96 mb-2">
                                <div className="grid gap-y-2 gap-x-10 mb-6 md:grid-cols-3 sm:grid-cols-1">
                                    <div className=''>
                                        <DynamicRadioButtons options={employmentOptions} onSelect={handleEmploymentOptionSelect} name="Employment status" register={register} errors={errors}/>
                                    </div>
                                    <div className=''>
                                        <DynamicRadioButtons options={institutionOptions} onSelect={handleInstitutionOptionSelect} name="Type of institution" register={register} errors={errors}/>
                                    </div>  
                                    <div className=''>
                                        <div>
                                            <label htmlFor="company" className="block text-sm font-medium text-gray-900">Current station/Institution</label>
                                            <input type="text" id="company" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5" placeholder="" required/>
                                        </div>
                                    </div>
                                    <div className=''>
                                        <DynamicDropdownButtons options={areaOfPractice} onChange={handleAreOfPracticeOptionSelect} defaultPractice="Select..." name="Categories of Practice"/>
                                    </div>
                                    <div className=''>
                                        <DynamicDropdownButtons options={regionOptions} onChange={handleAreOfPracticeOptionSelect} defaultPractice="Select..." name="Region"/>
                                    </div>
                                    <div className=''>
                                        <DynamicDropdownButtons options={districtOptions} onChange={handleAreOfPracticeOptionSelect} defaultPractice="Select..." name="District"/>
                                    </div>
                                    <div className=''>
                                        <DynamicDropdownButtons options={placeOptions} onChange={handleAreOfPracticeOptionSelect} defaultPractice="Select..." name="City/Town/Village"/>
                                    </div>
                                </div> 
                            </div>
                        </motion.div>             
                    )}
                    {currentStep === 2 && (
                        <motion.div
                            initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{duration: 0.3, ease: 'easeInOut'}}
                        >
                        <div className="bg-slate-100 p-2 rounded-lg h-96 w-96 mb-2">
                            <InformationCard Information="All the qualifications indicated below must be attached to the application and must be
                                verified by the issuing institutions if they’re locally obtained and by the Botswana
                                Qualifications Authority (BQA) if foreign obtained."/>
                        </div>
                        </motion.div>             
                    )}
                    {currentStep === 3 && (
                        <motion.div
                            initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{duration: 0.3, ease: 'easeInOut'}}
                        >
                        <div className="bg-slate-100 p-2 rounded-lg h-96 w-96 mb-2">
                            <DynamicRadioButtons options={disabilityOptions} onSelect={handleInstitutionOptionSelect} name="Are you living with any form of Disability?" register={register} errors={errors}/>
                            <div className="mb-6 space-y-2">
                                <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-gray-900">Specify</label>
                                <input type="text" id="large-input" className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"/>
                            </div>
                        </div>
                        </motion.div>             
                    )}
                    {currentStep === 4 && (
                        <motion.div
                            initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{duration: 0.3, ease: 'easeInOut'}}
                        >
                        <div className="bg-slate-100 p-2 rounded-lg h-96 w-96 mb-2">
                            <DynamicRadioButtons options={convitionOptions} onSelect={handleInstitutionOptionSelect} name="Have you been convicted of, or entered a plea of guilty or no contest to, or a criminal
offense against a learner/ a minor.?" register={register} errors={errors}/>

                        </div>
                        </motion.div>             
                    )}
                </form>
            </div>
                {/* Navigation */}
            <div className='flex float-end space-x-2'>
                <button 
                type="button" 
                className="py-2 px-4 me-2 mb-0 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
                >Save</button>
                <button 
                type="button" 
                onClick={prev}
                hidden={currentStep === 0}
                className="py-2 px-4 me-2 mb-0 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
                >Prev</button>
                <button 
                type="button" 
                hidden={currentStep === steps.length - 1}
                onClick={next}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2 text-center"
                >Next</button>
                <button 
                type="submit" 
                onClick={next}
                hidden={currentStep < steps.length - 1}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2 text-center"
                >Submit</button>
            </div>
        </div>
    );
}