"use client"

import React, { useState } from "react";
import {Stepper } from "./Stepper";
import {motion} from 'framer-motion';
import { FormDataSchema } from "../lib/schema";
import { InformationCard } from "./InformationCard";
import { DiplomaLevel, CertificationLevel, PostGradDiplomaLevel, DegreeLevel, PostGradCertificateLevel, PhDLevel, MastersLevel} from "./QualificationLevelComponents";

import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { steps } from "../lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {useForm} from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage,  Form } from "@/components/ui/form";
import { SelectValue, SelectTrigger, SelectContent, SelectItem, Select } from "@/components/ui/select";

interface RegistrationFormProps{
    onClose: () => void;
}

const formSchema = z.object({
    emailAddress: z.string().email(),
    password: z.string().min(3),
    passwordConfirm: z.string(),
    accountType: z.enum(["personal", "company"]),
    companyName: z.string().optional()
}).refine((data) => {
    return data.password === data.passwordConfirm
},{
    message: 'Passwords do not match',
    path: ["passwordConfirm"]
}).refine((data) =>{
    if(data.accountType === "company"){
        return !!data.companyName;
    }
    return true;
},{
    message: "Company name is required",
    path: ["companyName"],
})

export const ApplicationForRegistrationForm: React.FC<RegistrationFormProps> = ({onClose}) => {
    const [previousStep, setPreviousStep] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const delta = currentStep - previousStep

    const next = async () => {
        const fields = steps[currentStep].fields

        //if(!output) return
        if (currentStep < steps.length - 1){
            if(currentStep === steps.length - 2){
                
                //await handleSubmit(processForm)()
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

    //const processForm: SubmitHandler<Inputs> = data => {
        //console.log("Form submitted")
        //console.log(data)
        //reset()
    //}
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
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            emailAddress: "",
            password: "",
            passwordConfirm: "",
            companyName:""
        }
    })

    // Watch function, for dynamic changes
    const accountType = form.watch("accountType");

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        console.log({values})
    }
    return(
        <div>
            <div className="flex md:m-5 w-full  space-x-1 md:h-full ">
                {/* steps */}
                <nav aria-label="Progress" className="w-48 hidden md:block">
                    <Stepper currentStep={currentStep} steps={steps}/>
                </nav>
                {/* forms */}   
                <Form {...form}>
                <form className="w-[calc(100%-5rem)]" onSubmit={form.handleSubmit(handleSubmit)}> 
                    {/*PRELIMINARY INFORMATION*/}
                    {currentStep === 0 && (
                        <motion.div
                            initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{duration: 0.3, ease: 'easeInOut'}}
                        >
                        <div className="bg-slate-100 p-2 rounded-lg mb-2 mr-1">
                            <div className="grid gap-y-10 gap-x-10 mb-6 md:grid-cols-3 sm:grid-cols-1">
                                <div className=''>
                                    <FormField
                                    control={form.control}
                                    name="emailAddress"
                                    render={({field}) =>{
                                        return <FormItem>
                                                <FormLabel>Email Address</FormLabel>
                                                <FormControl>
                                                    <Input
                                                    placeholder="Email address"
                                                    type="email"
                                                    {...field}/>
                                                </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    }}
                                    />
                                </div>
                                <div className=''>
                                    <FormField
                                        control={form.control}
                                        name="accountType"
                                        render={({field}) =>{
                                            return <FormItem>
                                                    <FormLabel>Account type</FormLabel>
                                                    <Select onValueChange={field.onChange}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select an account type">

                                                                </SelectValue>
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="personal">Personal</SelectItem>
                                                            <SelectItem value="company">Company</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        }}
                                        />
                                </div>
                                <div>
                                    {accountType === "company" &&
                                        <FormField
                                            control={form.control}
                                            name="companyName"
                                            render={({field}) =>{
                                                return <FormItem>
                                                        <FormLabel>Company name</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                            placeholder="Company name"
                                                            {...field}/>
                                                        </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            }}
                                            />
                                }
                                </div>
                                <div className=''>
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({field}) =>{
                                        return <FormItem>
                                            <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input
                                                    placeholder="Password"
                                                    type="password"
                                                    {...field}/>
                                                </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    }}
                                    />
                                </div>
                                <div className=''>
                                <FormField
                                    control={form.control}
                                    name="passwordConfirm"
                                    render={({field}) =>{
                                        return <FormItem>
                                            <FormLabel>Password Confirm</FormLabel>
                                                <FormControl>
                                                    <Input
                                                    placeholder="Password confirm"
                                                    type="password"
                                                    {...field}/>
                                                </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    }}
                                    />
                                </div>  
                            </div>  
                            <Button
                            type="submit"
                            className="w-full"
                            >
                                Submit
                            </Button>
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
                                    </div>
                                    <div className=''>
                                    </div>  
                                    <div className=''>
                                    </div>
                                    <div className=''>
                                    </div>
                                    <div className=''>
                                    </div>
                                    <div className=''>
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
                                <div key={index} className="w-full grid grid-cols-3 gap-x-5 gap-y-2 border border-dashed border-gray-500 p-1 mt-1 rounded-lg">
                                                <div>
                                                    <FormField
                                                    control={form.control}
                                                    name="edu_pro_qualifications.qualification"
                                                    render={({field}) =>{
                                                        return <FormItem>
                                                            <FormLabel>Qualification</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                placeholder="Qualification name"
                                                                {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    }}
                                                />  
                                                </div>
                                                <div>                                                       
                                                    <FormField
                                                        control={form.control}
                                                        name="edu_pro_qualifications.institution"
                                                        render={({ field }) => (
                                                            <FormItem className="flex flex-col space-y-3 mt-2">
                                                                <FormLabel>Awarding Institution</FormLabel>
                                                                <Popover>
                                                                    <PopoverTrigger asChild>
                                                                    <FormControl>
                                                                        <Button
                                                                        variant="outline"
                                                                        role="combobox"
                                                                        className={cn(
                                                                            "w-[200px] justify-between",
                                                                            !field.value && "text-muted-foreground"
                                                                        )}
                                                                        >
                                                                        {field.value
                                                                            ? institutions.find(
                                                                                (institution) => institution.value === field.value
                                                                            )?.label
                                                                            : "Select institution"}
                                                                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                        </Button>
                                                                    </FormControl>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent className="w-[200px] p-0">
                                                                    <Command>
                                                                        <CommandInput
                                                                        placeholder="Search institution..."
                                                                        className="h-9"
                                                                        />
                                                                        <ScrollArea className="h-60 w-48 rounded-md">
                                                                        <CommandEmpty>No institution found.</CommandEmpty>
                                                                        <CommandGroup>
                                                                        {institutions.map((institution) => (
                                                                            <CommandItem
                                                                            value={institution.label}
                                                                            key={institution.value}
                                                                            onSelect={() => {
                                                                                form.setValue("edu_pro_qualifications.institution", institution.value)
                                                                            }}
                                                                            >
                                                                            {institution.label}
                                                                            <CheckIcon
                                                                                className={cn(
                                                                                "ml-auto h-4 w-4",
                                                                                institution.value === field.value
                                                                                    ? "opacity-100"
                                                                                    : "opacity-0"
                                                                                )}
                                                                            />
                                                                            </CommandItem>
                                                                        ))}
                                                                        </CommandGroup>
                                                                        </ScrollArea>
                                                                    </Command>
                                                                    </PopoverContent>
                                                                </Popover>
                                                                <FormMessage />
                                                            </FormItem>
                                                            )}
                                                        />  
                                                </div>
                                                <div>
                                                    <div>
                                                        <FormField
                                                            control={form.control}
                                                            name="edu_pro_qualifications.qualification_year"
                                                            render={({field}) =>{
                                                                return <FormItem>
                                                                    <FormLabel>Year Of Completion</FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                        type="number"
                                                                        placeholder="Year..."
                                                                        {...field}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            }}
                                                        />  
                                                    </div>
                                                </div>
                                                <div className="">
                                                    <FormField
                                                    control={form.control}
                                                    name="edu_pro_qualifications.teaching_subjects"
                                                    render={({field}) =>{
                                                        return <FormItem>
                                                            <FormLabel>Teaching Subjects</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                placeholder="Minor and Major subjects"
                                                                {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    }}
                                                />  
                                                </div>
                                                <div className="">
                                                <FormField
                                                    control={form.control}
                                                    name="edu_pro_qualifications.attachment"
                                                    render={({ field }) => {
                                                        return (
                                                        <FormItem>
                                                            <FormLabel>Attach a Qualification document</FormLabel>
                                                            <FormControl>
                                                            <Input
                                                            type="file"
                                                            placeholder="Attach a file"
                                                            {...AttachmentFile}
                                                            onChange={(event) => {
                                                                field.onChange(event.target?.files?.[0] ?? undefined);
                                                            }}
                                                            />
                                                            </FormControl>
                                                            <FormDescription>
                                                                Max File Size: 5MB Accepted File Types: .pdf, .doc, and .docx
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                        );
                                                    }}
                                                    />
                                                </div>
                                                <div className="flex justify-center my-5">
                                                    <button 
                                                    type="button" 
                                                    hidden
                                                    className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2 text-center"
                                                    >Remove</button>
                                                </div>
                                            </div>
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

                            </div>
                            <div className="mb-6 space-y-2">

                            </div>
                            <div className="mb-6 space-y-2">

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
                </Form>
            </div>
            {/* Navigation Buttons*/}
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