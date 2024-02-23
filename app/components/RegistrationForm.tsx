"use client"

import React, { useState } from "react";
import {Stepper } from "./Stepper";
import { DynamicRadioButtons } from "./DynamicRadioButtons";
import { DynamicDropdownButtons } from "./DynamicDropdownButton";
import { DynamicTextInputArea, DynamicTextInputField } from "./DynamicTextInputControl";
import {z} from 'zod'
import {motion} from 'framer-motion';
import { zodResolver } from "@hookform/resolvers/zod";
import {useForm, SubmitHandler} from 'react-hook-form';
import { FormDataSchema } from "../lib/schema";
import { InformationCard } from "./InformationCard";
import FileUploader from "./FileUploader";
import { DiplomaLevel, CertificationLevel, PostGradDiplomaLevel, DegreeLevel, PostGradCertificateLevel, PhDLevel, MastersLevel} from "./QualificationLevelComponents";

type Inputs = z.infer<typeof FormDataSchema>

interface Option {
    label: string;
    value: string;
}

const url = "/api/upload";

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
        name: 'CONSENT'
    },
    {
        id: 'Step 7',
        name: 'COMPLETE'
    },
]

const citizenOptions = [
    {label: 'Citizen', value: 'citizen'},
    {label: 'Non-citizen', value: 'non_citizen'},
]

const institutionOptions = [
    {label: 'Private', value: 'private'},
    {label: 'Public', value: 'public'},
]

const statusOptions = [
    {label: 'Student-Teacher', value: 'student'},
    {label: 'Unemployed', value: 'unemployed'},
    {label: 'Serving', value: 'serving'},
    {label: 'Retired', value: 'retired'},
]

const areaOfPractice = [
    {label: 'Select...', value: ''},
    {label: 'Pre-primary', value: 'student'},
    {label: 'Primary', value: 'primary'},
    {label: 'Junior Secondary', value: 'junior_secondary'},
    {label: 'Secondary', value: 'secondary'},
]

const regionOptions = [
    {label: 'Select...', value: ''},
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
    {label: 'Select...', value: ''},
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

const yearsOptions = [
    {value:"2024"},
    {value:"2023"},
    {value:"2022"},
    {value:"2021"},
    {value:"2020"},
    {value:"2019"},
    {value:"2018"},
    {value:"2017"},
    {value:"2016"},
    {value:"2015"},
]
const placeOptions = [
    {label: 'Select...', value: ''},
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
    {label: 'Select...', value: ''},
    {label: 'Teacher Aide', value: 'Teacher Aide'},
    {label: 'Early Childhood Teacher', value: 'Early Childhood Teacher'},
    {label: 'Primary School Teacher', value: 'Primary School Teacher'},
    {label: 'Junior Secondary Teacher', value: 'Junior Secondary Teacher'},
    {label: 'Senior Secondary Teacher', value: 'Senior Secondary Teacher'},
    {label: 'Special Education/Guidance and Counselling Teacher', value: 'Special Education/Guidance and Counselling Teacher'},
    {label: 'Education Administrator', value: 'Education Administrator'},
]

interface RegistrationFormProps{
    onClose: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({onClose}) => {
    const [selectedCitizenOption, setSelectedCitizenOption] = useState<string | null>(null);
    const [selectedStatusOption, setSelectedStatusOption] = useState<string | null>(null);
    const [selectedAreOfPracticeOption, setSelectedAreaOfPracticeOption] = useState<string | null>(null);
    const [selectedRegistrationCategoryOption, setSelectedRegistrationCategoryOption] = useState<string | null>(null);
    const [selectedEmploymentOption, setSelectedEmployementOption] = useState<string | null>(null);
    const [selectedInstitutionOption, setSelectedInstitutionOption] = useState<string | null>(null);

    const [previousStep, setPreviousStep] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const delta = currentStep - previousStep

    const handleCitizenOptionSelect = (value: string) => {
        setSelectedCitizenOption(value);
    };

    const [selectedLicenseRevokedOption, setSelectedLicenseRevokedOption] = useState(false);
    const handleLicenseRevokedOptionSelect = (value: string) => {
        if(value === 'yes'){
            setSelectedLicenseRevokedOption(true);
        }else{
            setSelectedLicenseRevokedOption(false);
        }
        
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
        setSelectedInstitutionOption(value);
    };
    const [selectDiploma, setSelectDiploma] = useState(false);
    const handleDiplomaCheckboxSelect = (value: boolean) => {
        if(value){
            setSelectDiploma(true);
        }else{
            setSelectDiploma(false);
        }
    }
    const [selectedMisconduct, setSelectedMisconductFlag] = useState(false);

    const handleMisconductFlag = (value: string) => {
        if(value === 'yes'){
            setSelectedMisconductFlag(true);
        }else{
            setSelectedMisconductFlag(false);
        }
    }

    const [showTextInputArea, setShowTextInputArea] = useState(false);
    const [disabilitySelected, setSelectedDisabilityOption] = useState(false);

    const handleDisabilityOptionSelect = (value: string) => {
        if(value === 'yes'){
            setShowTextInputArea(true);
            setSelectedDisabilityOption(true);
        }else{
            setShowTextInputArea(false);
            setSelectedDisabilityOption(false);
        }
    }
    const [selectedConvictionOfMinorOption, setSelectedConvictionOfMinorOption] = useState(false);
    const [showIncidentTextInputArea, setShowIncidentTextInputArea] = useState(false);
    const handleConvictionOfMinorOptionSelect = (value: string) => {
        if(value === 'yes'){
            setShowIncidentTextInputArea(true);
            setSelectedConvictionOfMinorOption(true);
        }else{
            setShowIncidentTextInputArea(false);
            setSelectedDisabilityOption(false);
        }
        //setSelectedConvictionOfMinorOption(false);
    };
    const [selectedConvictionOfDrugsOption, setSelectedConvictionOfDrugsOption] = useState(false);
    const [showDrugsTextInputArea, setShowDrugsTextInputArea] = useState(false);
    const handleConvictionOfDrugsOptionSelect = (value: string) => {
        if(value === 'yes'){
            setShowDrugsTextInputArea(true);
            //setSelectedConvictionOfMinorOption(true);
        }else{
            setShowDrugsTextInputArea(false);
            //setSelectedDisabilityOption(false);
        }
        //setSelectedConvictionOfDrugsOption(false);
    };
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
            if(errors){
                console.log("Errors detected")
                console.log(errors)
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
        console.log("Form submitted")
        console.log(data)
        reset()
    }
    const [showDiplomaLevel, setShowDiplomaLevel] = useState(false);
    const handleDiplomaCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShowDiplomaLevel(event.target.checked)
    }
    const [showCertificationLevel, setShowCertificationLevel] = useState(false);
    const handleCertificationCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShowCertificationLevel(event.target.checked)
    }
    const [showPostGradDiplomaLevel, setShowPostGradDiplomaLevel] = useState(false);
    const handlePostGradDiplomaCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShowPostGradDiplomaLevel(event.target.checked)
    }
    const [showPostGradCertificateLevel, setShowPostGradCertificateLevel] = useState(false);
    const handlePostGradCertificateCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShowPostGradCertificateLevel(event.target.checked)
    }
    const [showDegreeLevel, setShowDegreeLevel] = useState(false);
    const handleDegreeCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShowDegreeLevel(event.target.checked)
    }
    const [showMastersLevel, setShowMastersLevel] = useState(false);
    const handleMastersCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShowMastersLevel(event.target.checked)
    }
    const [showPhDLevel, setShowPhDLevel] = useState(false);
    const handlePhDCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShowPhDLevel(event.target.checked)
    }
    return(
        <div>
            <div className="flex md:m-5 w-full  space-x-1 md:h-96 h-full">
                {/* steps */}
                <nav aria-label="Progress" className="w-48 hidden md:block">
                    <Stepper currentStep={currentStep} steps={steps}/>
                </nav>
                {/* forms */}   
                <form className="w-[calc(100%-5rem)]" onSubmit={handleSubmit(processForm)}> 
                    {/*PRELIMINARY INFORMATION*/}
                    {currentStep === 0 && (
                        <motion.div
                            initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{duration: 0.3, ease: 'easeInOut'}}
                        >
                        <div className="bg-slate-100 p-2 rounded-lg mb-2">
                            <div className="grid gap-y-10 gap-x-10 mb-6 md:grid-cols-2 sm:grid-cols-1">
                                <div className=''>
                                    <DynamicRadioButtons options={citizenOptions} onSelect={handleCitizenOptionSelect} name="Citizenry" register={register} errors={errors} schema_name="citizenry"/>
                                </div>
                                <div className=''>
                                    <DynamicRadioButtons options={statusOptions} onSelect={handleStatusOptionSelect} name="Status" register={register} errors={errors} schema_name="status"/>
                                </div>
                                <div className=''>
                                    <DynamicDropdownButtons options={areaOfPractice} schema_name="practice_category" onChange={handleAreOfPracticeOptionSelect} defaultPractice="Select..." name="Categories of Practice" register={register} errors={errors}/>
                                </div>  
                                <div className=''>
                                    <DynamicDropdownButtons options={registrationCategory} schema_name="sub_cateogry" onChange={handleRegistrationCategoryOptionSelect} defaultPractice="Select..." name="Sub-categories" register={register} errors={errors}/>
                                </div>
                            </div>  
                            </div>
                        </motion.div>           
                    )}
                    {/*EMPLOYMENT DETAILS*/}
                    {currentStep === 1 && (
                        <motion.div
                            initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{duration: 0.3, ease: 'easeInOut'}}
                        >
                        <div className="bg-slate-100 w-full  p-2 rounded-lg h-96 mb-2">
                                <div className="grid gap-y-10 gap-x-10 mb-6 md:grid-cols-3 sm:grid-cols-1">
                                    <div className=''>
                                        <DynamicRadioButtons options={employmentOptions} onSelect={handleEmploymentOptionSelect} name="Employment status" register={register} errors={errors} schema_name="work_status"/>
                                    </div>
                                    <div className=''>
                                        <DynamicRadioButtons options={institutionOptions} onSelect={handleInstitutionOptionSelect} name="Type of institution" register={register} errors={errors} schema_name="institution_type"/>
                                    </div>  
                                    <div className=''>
                                        <DynamicTextInputField errors={errors} register={register} name="Current station/Institution" schema_name="current_institution"/>
                                    </div>
                                    <div className=''>
                                        <DynamicDropdownButtons options={regionOptions} schema_name="region" onChange={handleAreOfPracticeOptionSelect} defaultPractice="Select..." name="Region" register={register} errors={errors}/>
                                    </div>
                                    <div className=''>
                                        <DynamicDropdownButtons options={districtOptions} schema_name="district" onChange={handleAreOfPracticeOptionSelect} defaultPractice="Select..." name="District" register={register} errors={errors}/>
                                    </div>
                                    <div className=''>
                                        <DynamicDropdownButtons options={placeOptions} schema_name="city_or_town" onChange={handleAreOfPracticeOptionSelect} defaultPractice="Select..." name="City/Town/Village" register={register} errors={errors}/>
                                    </div>
                                </div> 
                            </div>
                        </motion.div>             
                    )}
                    {/*QUALIFICATIONS*/}
                    {currentStep === 2 && (
                        <motion.div
                            initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{duration: 0.3, ease: 'easeInOut'}}
                        >
                            <div className="bg-slate-100 w-full  px-2 py-1 rounded-lg h-96 mb-2 space-y-2">
                                <div className="hidden">
                                    <InformationCard Information="All the qualifications indicated below must be attached to the application and must be
                                    verified by the issuing institutions if they’re locally obtained and by the Botswana
                                    Qualifications Authority (BQA) if foreign obtained."/>
                                </div>
                                <div className="">
                                    <label className="text-gray-900 text-sm">Select your Qualifications Levels</label>
                                    <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex">
                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
                                            <div className="flex items-center ps-3">
                                                <input onChange={handleCertificationCheckboxChange} id="certificate" type="checkbox" value="certificate" className="w-4 h-4 text-blue-600 bg-gray-300 rounded focus:ring-blue-500"/>
                                                <label htmlFor="certificate" className="w-full py-3 ms-2 text-xs font-medium text-gray-900">Certification</label>
                                            </div>
                                        </li>
                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
                                            <div className="flex items-center ps-3">
                                                <input onChange={handleDiplomaCheckboxChange} id="diploma" type="checkbox" value="diploma" className="w-4 h-4 text-blue-600 bg-gray-300 rounded focus:ring-blue-500"/>
                                                <label htmlFor="diploma" className="w-full py-3 ms-2 text-xs font-medium text-gray-900">Diploma</label>
                                            </div>
                                        </li>
                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
                                            <div className="flex items-center ps-3">
                                                <input onChange={handlePostGradDiplomaCheckboxChange} id="post-grad-diploma" type="checkbox" value="post-grad-diploma" className="w-4 h-4 text-blue-600 bg-gray-300 rounded focus:ring-blue-500"/>
                                                <label htmlFor="post-grad-diploma" className="w-full py-1 ms-2 text-xs font-medium text-gray-900">Post Grad Diploma</label>
                                            </div>
                                        </li>
                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
                                            <div className="flex items-center ps-3">
                                                <input onChange={handleDegreeCheckboxChange} id="degree" type="checkbox" value="degree" className="w-4 h-4 text-blue-600 bg-gray-300 rounded focus:ring-blue-500"/>
                                                <label htmlFor="degree" className="w-full py-3 ms-2 text-xs font-medium text-gray-900">Degree</label>
                                            </div>
                                        </li>
                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
                                            <div className="flex items-center ps-3">
                                                <input onChange={handlePostGradCertificateCheckboxChange} id="post-grad-certificate" type="checkbox" value="post-grad-certificate" className="w-4 h-4 text-blue-600 bg-gray-300 rounded focus:ring-blue-500"/>
                                                <label htmlFor="post-grad-certificate" className="w-full py-1 ms-2 text-xs font-medium text-gray-900">Post Grad Certificate</label>
                                            </div>
                                        </li>
                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
                                            <div className="flex items-center ps-3">
                                                <input onChange={handleMastersCheckboxChange} id="masters" type="checkbox" value="masters" className="w-4 h-4 text-blue-600 bg-gray-300 rounded focus:ring-blue-500"/>
                                                <label htmlFor="masters" className="w-full py-3 ms-2 text-xs font-medium text-gray-900">Masters</label>
                                            </div>
                                        </li>
                                        <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r">
                                            <div className="flex items-center ps-3">
                                                <input onChange={handlePhDCheckboxChange} id="phd" type="checkbox" value="phd" className="w-4 h-4 text-blue-600 bg-gray-300 rounded focus:ring-blue-500"/>
                                                <label htmlFor="phd" className="w-full py-3 ms-2 text-xs font-medium text-gray-900">PhD</label>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                {/*Visible when conditions here*/}
                                <div className="overflow-auto h-72">
                                    {showDiplomaLevel && <DiplomaLevel/>}
                                    {showCertificationLevel && <CertificationLevel/>}
                                    {showPostGradDiplomaLevel && <PostGradDiplomaLevel/>}
                                    {showDegreeLevel && <DegreeLevel/>}
                                    {showMastersLevel && <MastersLevel/>}
                                    {showPostGradCertificateLevel && <PostGradCertificateLevel/>}
                                    {showPhDLevel && <PhDLevel/>}
                                </div>
                            </div>
                        </motion.div>             
                    )}
                    {/*DISABILITY*/}
                    {currentStep === 3 && (
                        <motion.div
                            initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{duration: 0.3, ease: 'easeInOut'}}
                        >
                        <div className="bg-slate-100 w-full  p-2 rounded-lg h-96 mb">
                            <DynamicRadioButtons options={disabilityOptions} onSelect={handleDisabilityOptionSelect} name="Are you living with any form of Disability?" register={register} errors={errors} schema_name="disability_check"/>
                            {disabilitySelected && showTextInputArea && (
                            <DynamicTextInputArea errors={errors} name="Specify" schema_name="disability_specification" register={register}/>
                            )}
                        </div>
                        </motion.div>             
                    )}
                    {/*OFFENCE DECLARATION*/}
                    {currentStep === 4 && (
                        <motion.div
                            initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{duration: 0.3, ease: 'easeInOut'}}
                        >
                        <div className="bg-slate-100 w-full overflow-y-scroll p-2 h-96 rounded-lg mb-2 space-y-2 text-wrap">
                            <DynamicRadioButtons 
                            options={convitionOptions} 
                            onSelect={handleConvictionOfMinorOptionSelect} 
                            name="Have you been convicted of, or entered a plea of guilty or no contest to, or a criminal
                                offense against a learner/ a minor?" 
                                register={register} 
                                errors={errors} 
                                schema_name="student_related_offence"/>
                            {showIncidentTextInputArea &&(
                                <DynamicTextInputArea errors={errors} name="Give full details about the incident" schema_name="student_related_offence_details" register={register}/>
                            )}
                            <DynamicRadioButtons 
                            options={convitionOptions} 
                            onSelect={handleConvictionOfDrugsOptionSelect} 
                            name="Have you been convicted of, or entered a plea of guilty or no contest to, or a criminal
                                offense of possession of and or of drugs use?" 
                                register={register} 
                                schema_name="drug_related_offence"
                                errors={errors}/>
                            {showDrugsTextInputArea && (
                                <DynamicTextInputArea errors={errors} name="Give full details about the incident" schema_name="drug_related_offence_details" register={register}/>
                            )}
                            <DynamicRadioButtons
                             options={convitionOptions} 
                             onSelect={handleLicenseRevokedOptionSelect}
                              name="Have you ever had a teaching license revoked, suspended, invalidated, cancelled or denied
                              by any teaching council or any authority; surrendered such a license or the right to apply for
                              such a license; or had any other adverse action taken against such a license. Please note
                              that this includes a reprimand, warning, or reproval and any order denying the right to apply
                              or reapply for a license?" 
                                register={register}
                                schema_name="license_flag"
                                 errors={errors}/>
                            <div className="mb-6 space-y-2">
                                {selectedLicenseRevokedOption &&(
                                <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-gray-900">Please attach a letter giving full details and official documentation of the action taken</label>
                                )}
                                {selectedLicenseRevokedOption &&(
                                    <FileUploader
                                    url={url}
                                    acceptedFileTypes={[
                                        "image/png",
                                        "image/jpeg",
                                    ]}
                                    maxFileSize={100}
                                    label="Max File Size: 1MB"
                                    labelAlt="Accepted File Types: png, jpeg"
                                    />
                                )}
                            </div>
                            <DynamicRadioButtons 
                            options={convitionOptions} 
                            onSelect={handleMisconductFlag}
                             name="Are you currently the subject of any review, inquiry, investigation, or appeal of alleged
                                misconduct that could warrant discipline or termination by your employer. Please note that
                                this includes any open investigation by or pending proceeding with a child protection agency
                                and any pending criminal charges?" 
                                register={register} 
                                schema_name="misconduct_flag"
                                errors={errors}/>
                            <div className="mb-6 space-y-2">
                            { selectedMisconduct && (       
                            <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-gray-900">Please attach a letter giving full details and any official documentation available regarding
                                the matter.</label>
                            )}
                            { selectedMisconduct && (                            
                            <FileUploader
                                url={url}
                                acceptedFileTypes={[
                                    "image/png",
                                    "image/jpeg",
                                ]}
                                maxFileSize={100}
                                label="Max File Size: 1MB"
                                labelAlt="Accepted File Types: png, jpeg"
                                />
                            )}
                            </div>
                        </div>
                        </motion.div>             
                    )}
                    {/*ATTACHMENTS*/}
                    {currentStep === 5 && (
                        <motion.div
                            initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{duration: 0.3, ease: 'easeInOut'}}
                        >
                        <div className="bg-slate-100 w-full p-2 rounded-lg mb-2 grid gap-y-2 gap-x-10 md:grid-cols-2">
                            <div className="mb-6 space-y-2 text-wrap">
                                <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-gray-900">Certified copy of OMANG or passport (for non-citizens)</label>
                                <FileUploader
                                url={url}
                                acceptedFileTypes={[
                                    "image/png",
                                    "image/jpeg",
                                ]}
                                maxFileSize={100}
                                label="Max File Size: 1MB"
                                labelAlt="Accepted File Types: png, jpeg"
                                />
                            </div>
                            <div className="mb-6 space-y-2">
                                <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-gray-900">Verification of qualification from BQA.</label>
                                <FileUploader
                                    url={url}
                                    acceptedFileTypes={[
                                        "image/png",
                                        "image/jpeg",
                                    ]}
                                    maxFileSize={100}
                                    label="Max File Size: 1MB"
                                    labelAlt="Accepted File Types: png, jpeg"
                                    />
                            </div>
                            <div className="mb-6 space-y-2">
                                <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-gray-900">Proof of payment of Registration fee.</label>
                                <FileUploader
                                    url={url}
                                    acceptedFileTypes={[
                                        "image/png",
                                        "image/jpeg",
                                    ]}
                                    maxFileSize={100}
                                    label="Max File Size: 1MB"
                                    labelAlt="Accepted File Types: png, jpeg"
                                    />
                            </div>
                        </div>
                        </motion.div>             
                    )}
                    {/*DECLARATION*/}
                    {currentStep === 6 && (
                        <motion.div
                            initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{duration: 0.3, ease: 'easeInOut'}}
                        >
                        <div className="bg-slate-100 w-full h-full p-2 rounded-lg text-gray-900">
                            <span className="text-wrap">I Michael hereby declare that the information I have
                            provided in this application form is true and correct to the best of my knowledge and
                            belief. I understand that providing false or misleading information may result in the
                            refusal of my application or the cancellation of my registration.
                            I am aware that the Council may collect and verify information about my qualifications,
                            experience, and fitness to teach. I consent to the Council collecting and verifying this
                            information and I authorize the Council to share this information with other relevant
                            organizations, such as employers and educational institutions.</span>
                            <div className="space-x-2">
                                <input id="agreement" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-400 rounded focus:ring-blue-500"/>
                                <span className="text-xs">I agree to the terms and conditions.</span>
                            </div>
                        </div>
                        </motion.div>             
                    )}
                    {/*CONSCENT*/}
                    {currentStep === 7 && (
                        <motion.div
                            initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{duration: 0.3, ease: 'easeInOut'}}
                        >
                        <div className="bg-slate-100 w-full p-2 rounded-lg text-gray-900">
                            <ol className="ps-5 mt-2 space-y-1 list-decimal list-inside mb-2 text-sm">
                                <li>Processing of the application will be done within 30 days;</li>
                                <li>You will receive electronic feedback once your application has been processed;</li>
                                <li>Once registered and licensed, the teacher has full responsibility of ensuring it is
                                    renewed before it expires in accordance with the Regulations.</li>
                            </ol>
                            <div className="items-center me-4 space-y-1 ps-5 justify-start">
                                <h3 className="text-sm font-medium text-gray-900">Profile Information</h3>
                                <div className="space-x-2">
                                    <input id="inline-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-400 rounded focus:ring-blue-500"/>
                                    <span className="text-xs">I agree to submit the listed profile information along with this application.</span>
                                </div>
                            </div>
                        </div>

                        </motion.div>             
                    )}
                    {/*COMPLETE*/}
                    {currentStep === 8 && (
                        <motion.div
                            initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{duration: 0.3, ease: 'easeInOut'}}
                        >
                        <div className="bg-slate-100 p-2 rounded-lg text-gray-900">
                            <h2 className='text-base font-semibold leading-7 text-gray-900'>
                            Complete
                            </h2>
                            <p className='mt-1 text-sm leading-6 text-gray-600'>
                            Thank you for your submission.
                            </p>
                        </div>
                        </motion.div>             
                    )}
                </form>
            </div>
                {/* Navigation */}
            <div className='flex float-end space-x-2'>
            <button 
                type="button" 
                hidden={currentStep !== steps.length - 1}
                onClick={onClose}
                className="py-2 px-4 me-2 mb-0 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
                >Close</button>
                <button 
                type="button" 
                hidden={currentStep === 0 || currentStep === steps.length - 1}
                className="py-2 px-4 me-2 mb-0 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
                >Save</button>
                <button 
                type="button" 
                onClick={prev}
                hidden={currentStep === 0 || currentStep === steps.length - 1}
                className="py-2 px-4 me-2 mb-0 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
                >Prev</button>
                <button 
                type="button" 
                hidden={currentStep === steps.length - 1 || currentStep === steps.length - 2 || currentStep === steps.length - 1}
                onClick={next}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2 text-center"
                >Next</button>
                <button 
                type="submit" 
                onClick={next}
                hidden={currentStep !== steps.length - 2}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2 text-center"
                >Submit</button>
            </div>
        </div>
    );
}