"use client"

import React, { useState } from "react";
import {Stepper } from "./Stepper";
import {motion} from 'framer-motion';
import { FormDataSchema, formSchema } from "../lib/schema";
import { InformationCard } from "./InformationCard";

import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { steps} from "../lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {useForm} from 'react-hook-form';
import { 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage,  
    Form, 
    FormDescription} from "@/components/ui/form";
import { 
    SelectValue, 
    SelectTrigger,
    SelectContent, 
    SelectItem, 
    Select } from "@/components/ui/select";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
  } from "@/components/ui/command";
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { 
    RadioGroup, 
    RadioGroupItem } from "@/components/ui/radio-group"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarIcon } from "@radix-ui/react-icons"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

interface RegistrationFormProps{
    onClose: () => void;
}


  const disabilities = [
    { label: "Visual Impairment", value: "visual_impairment" },
    { label: "Hearing Impairment", value: "hearing_impairment" },
    { label: "Mobility Impairment", value: "mobility_impairment" },
    { label: "Cognitive Impairment", value: "cognitive_impairment" },
    { label: "Neurodevelopmental Disorders", value: "neurodevelopmental_disorders" },
    { label: "Chronic Illnesses", value: "chronic_illnesses" },
    { label: "Psychiatric Disabilities", value: "psychiatric_disabilities" },
    { label: "Learning Disabilities", value: "learning_disabilities" },
    { label: "Speech Impairment", value: "speech_impairment" },
    { label: "Intellectual Disability", value: "intellectual_disability" },
    { label: "Deafblindness", value: "deafblindness" },
    { label: "Epilepsy", value: "epilepsy" },
    { label: "Musculoskeletal Disorders", value: "musculoskeletal_disorders" },
    { label: "Multiple Sclerosis", value: "multiple_sclerosis" },
    { label: "Cerebral Palsy", value: "cerebral_palsy" }
] as const;

const institutions = [
    { label: "Botho University", value: "botho_university" },
    { label: "Limkokwing University", value: "limkokwing_univerisity" },
    { label: "Botswana Accountancy College", value: "botswana_accountancy_college" },
    { label: "University of Botswana", value: "university_of_botswana" },
    { label: "New Era College", value: "new_era_college" },
    { label: "Boitekanelo College", value: "boitekanelo_college" },
    { label: "Logan Business College", value: "logan_business_college" },
    { label: "Mega Size College", value: "mega_size_college" },
    { label: "BA ISAGO University", value: "ba_isago_university" },
    { label: "Tonota College of Education", value: "tonota_college_of_education" },
    { label: "Serowe College of Education", value: "serowe_college_of_education" },
    { label: "Tlokweng College of Education", value: "tlokweng_college_of_education" },
    { label: "Maruapula School", value: "marua_pula" },
    { label: "Rainbow Secondary School", value: "rainbow_secondary_school" },
    { label: "Francistown Senior School", value: "francistown_senior_school" },
    { label: "St Joseph's College", value: "st_joseph_college" },
    { label: "Bosele Secondary School", value: "bosele_secondary_school" },
    { label: "John Mackenzie School", value: "john_mackenzie_school" },
    { label: "Bokamoso Junior Secondary School", value: "bokamoso_junior_secondary_school" },
    { label: "Mogoditshane Senior Secondary Sc", value: "mogoditshane_senior_secondary_school" },
    { label: "Kgaswe International High", value: "kgaswe_international_high" },
    { label: "Motsumi Secondary School", value: "motsumi_secondary_school" },
    { label: "Lobatse Senior Secondary School", value: "lobatse_senior_secondary_school" },
] as const; // Google: list of secondary schools in botswana


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

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            teacher_preliminary_infos: {

            },
            employment_details: {
                //region: "",
                //district: "",
                //city_or_town: "",
                current_institution: "",
                experience_years: 0
            },
            offence_convictions: {
                conviction_status: "",
                court_jurisdiction: "",
                date_of_conviction: undefined,
                offence_type: "",
                sentence_outcome: "",
                drug_conviction_status: "",
                jurisdiction_drugs: "",
                substance_involved: "",
            }
        }
    })

    // Watch function, for dynamic changes
    const registrationType = form.watch("teacher_preliminary_infos.work_status");
    const practiceCategory = form.watch("teacher_preliminary_infos.practice_category")
    const disabilityFlag = form.watch("teacher_registrations.disability");
    const institutionType = form.watch("employment_details.institution_type");
    const studentRelatedOffence = form.watch("offence_convictions.student_related_offence");
    const drugRelatedOffence = form.watch("offence_convictions.drug_related_offence");
    const licenseFlag = form.watch("offence_convictions.license_flag");
    const misconductFlag = form.watch("offence_convictions.misconduct_flag");


    const fileRef = form.register("offence_convictions.license_flag_details");
    const misconduct = form.register("offence_convictions.misconduct_flag_details");

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        console.log("Clicked")
        console.log({values})
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(values, null, 2)}</code>
                </pre>
            )
        })
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
                        <div className="border md:h-96 p-2 rounded-lg mb-2 mr-1">
                            <div className="grid gap-y-10 gap-x-10 mb-6 md:grid-cols-2 sm:grid-cols-1">
                                <div className=''>
                                    <FormField
                                        control={form.control}
                                        name="teacher_preliminary_infos.work_status"
                                        render={({field}) =>{
                                            return <FormItem>
                                                    <FormLabel>Select status</FormLabel>
                                                    <Select onValueChange={field.onChange}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select an employment status">

                                                                </SelectValue>
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="student/teacher">Student/Teacher</SelectItem>
                                                            <SelectItem value="unemployed">Unemployed</SelectItem>
                                                            <SelectItem value="serving">Serving</SelectItem>
                                                            <SelectItem value="retired">Retired</SelectItem>
                                                            <SelectItem value="educational consultant">Educational Consultant</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        }}
                                        />
                                </div>
                                <div className=''>
                                    <FormField
                                        control={form.control}
                                        name="teacher_preliminary_infos.practice_category"
                                        render={({field}) =>{
                                            return <FormItem>
                                                    <FormLabel>Select practice category</FormLabel>
                                                    <Select onValueChange={field.onChange}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select category of practice">

                                                                </SelectValue>
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="pre-primary">Pre-primary</SelectItem>
                                                            <SelectItem value="primary">Primary</SelectItem>
                                                            <SelectItem value="junior secondary">Junior Secondary</SelectItem>
                                                            <SelectItem value="secondary">Secondary</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        }}
                                        />
                                </div>
                                <div className=''>
                                    <FormField
                                        control={form.control}
                                        name="teacher_preliminary_infos.sub_category"
                                        render={({field}) =>{
                                            return <FormItem>
                                                    <FormLabel>Select practice sub-category</FormLabel>
                                                    <Select onValueChange={field.onChange}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select sub-category of practice">
                                                                </SelectValue>
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="teacher-aide">Teacher Aide</SelectItem>
                                                            <SelectItem value="tutor">Tutor</SelectItem>
                                                            <SelectItem value="special education">Special Education</SelectItem>
                                                            <SelectItem value="educational support services">Educational Support Services</SelectItem>
                                                            <SelectItem value="education administrator">Education Administrator</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        }}
                                        />
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
                        <div className="border md:h-96 p-2 rounded-lg mb-2 mr-1">
                                <div className="grid gap-y-10 gap-x-10 mb-6 md:grid-cols-3 sm:grid-cols-1">
                                    <div className=''>
                                        <FormField
                                        control={form.control}
                                        name="employment_details.experience_years"
                                        render={({field}) =>{
                                            return <FormItem>
                                                <FormLabel>Indicate years in service</FormLabel>
                                                <FormControl>
                                                    <Input
                                                    placeholder="Indicate years in service"
                                                    type="number"
                                                    {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        }}
                                        />                                  
                                    </div> 
                                    <div className=''>
                                        <FormField
                                            control={form.control}
                                            name="employment_details.institution_type"
                                            render={({field}) =>{
                                                return <FormItem className="space-y-3">
                                                    <FormLabel>Select type of institution</FormLabel>
                                                    <FormControl>
                                                        <RadioGroup>
                                                        <RadioGroup
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                            className="flex flex-col space-y-1"
                                                            >
                                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                                <FormControl>
                                                                <RadioGroupItem value="public" />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">
                                                                Public
                                                                </FormLabel>
                                                            </FormItem>
                                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                                <FormControl>
                                                                <RadioGroupItem value="private" />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">
                                                                Private
                                                                </FormLabel>
                                                            </FormItem>
                                                            </RadioGroup>
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            }}
                                        /> 
                                    </div>
                                    <div className=''>
                                        {/*Use next-ui autocomplete component*/}
                                            <FormField
                                            control={form.control}
                                            name="employment_details.current_institution"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col space-y-3 mt-2">
                                                    <FormLabel>Current station/institution</FormLabel>
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
                                                                    form.setValue("employment_details.current_institution", institution.value)
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
                                    <div className=''>
                                        <FormField
                                            control={form.control}
                                            name="employment_details.region"
                                            render={({field}) =>{
                                                return <FormItem>
                                                        <FormLabel>Region</FormLabel>
                                                        <Select onValueChange={field.onChange}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select region">
                                                                    </SelectValue>
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="gaborone">Gaborone</SelectItem>
                                                                <SelectItem value="francistown">Francistown</SelectItem>
                                                                <SelectItem value="palapye">Palapye</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    <FormMessage/>
                                                </FormItem>
                                            }}
                                            />
                                    </div>
                                    <div className=''>
                                        <FormField
                                            control={form.control}
                                            name="employment_details.district"
                                            render={({field}) =>{
                                                return <FormItem>
                                                        <FormLabel>District</FormLabel>
                                                        <Select onValueChange={field.onChange}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select district">
                                                                    </SelectValue>
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="chobe">Chobe District</SelectItem>
                                                                <SelectItem value="ghanzi">Ghanzi District</SelectItem>
                                                                <SelectItem value="ngamiland">Ngamiland District</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    <FormMessage/>
                                                </FormItem>
                                            }}
                                            />
                                    </div>
                                    <div className=''>
                                        <FormField
                                            control={form.control}
                                            name="employment_details.city_or_town"
                                            render={({field}) =>{
                                                return <FormItem>
                                                        <FormLabel>City/Town/Village</FormLabel>
                                                        <Select onValueChange={field.onChange}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select City/Town/Village">
                                                                    </SelectValue>
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="mahalapye">Chobe District</SelectItem>
                                                                <SelectItem value="serowe">Ghanzi District</SelectItem>
                                                                <SelectItem value="orapa">Ngamiland District</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    <FormMessage/>
                                                </FormItem>
                                            }}
                                            />
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
                            <div className="border md:h-96 p-2 rounded-lg mb-2 mr-1 space-y-2">
                                <div className="hidden">
                                    <InformationCard Information="All the qualifications indicated below must be attached to the application and must be
                                    verified by the issuing institutions if they’re locally obtained and by the Botswana
                                    Qualifications Authority (BQA) if foreign obtained."/>
                                </div>
                                <div className="">

                                </div>
                                {/*Visible when conditions here*/}
                                <div className="overflow-auto h-72">

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
                        <div className="border md:h-96 p-2 rounded-lg mb-2 mr-1 space-y-5">
                            <div>
                                <FormField
                                    control={form.control}
                                    name="teacher_registrations.disability"
                                    render={({field}) =>{
                                        return <FormItem className="space-y-3">
                                            <FormLabel>Are you living with any form of disability</FormLabel>
                                            <FormControl>
                                                <RadioGroup>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex flex-col space-y-1"
                                                    >
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                        <RadioGroupItem value="yes" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                        Yes
                                                        </FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                        <RadioGroupItem value="no" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                        No
                                                        </FormLabel>
                                                    </FormItem>
                                                    </RadioGroup>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    }}
                                /> 
                        </div>
                        <div>
                            {disabilityFlag === "yes" && 
                            <FormField
                                control={form.control}
                                name="teacher_registrations.disability_description"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Nature of Disability</FormLabel>
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
                                                    ? disabilities.find(
                                                        (disability) => disability.value === field.value
                                                    )?.label
                                                    : "Select disability"}
                                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                                <CommandInput
                                                placeholder="Search framework..."
                                                className="h-9"
                                                />
                                                <ScrollArea className="h-60 w-48 rounded-md">
                                                <CommandEmpty>No framework found.</CommandEmpty>
                                                <CommandGroup>
                                                {disabilities.map((disability) => (
                                                    <CommandItem
                                                    value={disability.label}
                                                    key={disability.value}
                                                    onSelect={() => {
                                                        form.setValue("teacher_registrations.disability_description", disability.value)
                                                    }}
                                                    >
                                                    {disability.label}
                                                    <CheckIcon
                                                        className={cn(
                                                        "ml-auto h-4 w-4",
                                                        disability.value === field.value
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
                                        <FormDescription>
                                            This information will be kept confidential.
                                        </FormDescription>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />  
                                }  
                                </div>
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
                        
                        <div className="border rounded-lg mb-2 mr-1 space-y-2 text-wrap">
                            <ScrollArea className="md:h-96  p-2">
                            <div className="border-b pb-2 mb-2">
                            {/**Conviction against learner*/}
                            <div className="mb-2">
                                <FormField
                                    control={form.control}
                                    name="offence_convictions.student_related_offence"
                                    render={({field}) =>{
                                        return <FormItem className="space-y-3">
                                            <FormLabel>1. Have you been convicted of, or entered a plea of guilty or no contest to, or a criminal offense against a learner/ a minor?</FormLabel>
                                            <FormControl>
                                                <RadioGroup>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex flex-col space-y-1 ml-3"
                                                    >
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                        <RadioGroupItem value="yes" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                        Yes
                                                        </FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                        <RadioGroupItem value="no" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                        No
                                                        </FormLabel>
                                                    </FormItem>
                                                    </RadioGroup>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    }}
                                />   
                            </div>
                            {studentRelatedOffence === "yes" && 
                            <div className="grid md:grid-cols-3 grid-col-1 gap-2 ml-3">
                            <FormField
                                control={form.control}
                                name="offence_convictions.offence_type"
                                render={({field}) =>{
                                    return <FormItem>
                                            <FormLabel>Select Offence type</FormLabel>
                                            <Select onValueChange={field.onChange}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Offence type">
                                                        </SelectValue>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="sexual_offence">Sexual Offense</SelectItem>
                                                    <SelectItem value="physical_assault">Physical Assault</SelectItem>
                                                    <SelectItem value="verbal_abuse">Verbal Abuse</SelectItem>
                                                    <SelectItem value="emotional_abuse">Emotional Abuse</SelectItem>
                                                    <SelectItem value="neglect">Neglect</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        <FormMessage/>
                                    </FormItem>
                                }}
                                />
                                <FormField
                                control={form.control}
                                name="offence_convictions.conviction_status"
                                render={({field}) =>{
                                    return <FormItem>
                                            <FormLabel>Select Conviction status</FormLabel>
                                            <Select onValueChange={field.onChange}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Conviction status">
                                                        </SelectValue>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="convicted">Convicted</SelectItem>
                                                    <SelectItem value="pleaded_guilty">Pleaded Guilty</SelectItem>
                                                    <SelectItem value="pleaded_no_contest">Pleaded No Contest</SelectItem>
                                                    <SelectItem value="pending _trial">Pending Trial</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        <FormMessage/>
                                    </FormItem>
                                }}
                                />
                                <FormField
                                control={form.control}
                                name="offence_convictions.sentence_outcome"
                                render={({field}) =>{
                                    return <FormItem>
                                            <FormLabel>Select Sentence/Outcome</FormLabel>
                                            <Select onValueChange={field.onChange}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Sentence/Outcome">
                                                        </SelectValue>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="incarceration">Incarceration</SelectItem>
                                                    <SelectItem value="probation">Probation</SelectItem>
                                                    <SelectItem value="fine">Fine</SelectItem>
                                                    <SelectItem value="community Service">Community Service</SelectItem>
                                                    <SelectItem value="rehabilitation_program">Rehabilitation Program</SelectItem>
                                                    <SelectItem value="no_sentence_yet">No Sentence Yet</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        <FormMessage/>
                                    </FormItem>
                                }}
                                />
                                <div className="mt-2">
                                <FormField
                                        control={form.control}
                                        name="offence_convictions.date_of_conviction"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                            <FormLabel className="mb-1">Date of Conviction/Plea</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[240px] pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                    >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    </div>
                                    <FormField
                                    control={form.control}
                                    name="offence_convictions.court_jurisdiction"
                                    render={({field}) =>{
                                        return <FormItem>
                                                <FormLabel>Court Jurisdiction</FormLabel>
                                                <Select onValueChange={field.onChange}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Court Jurisdiction">
                                                            </SelectValue>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="local_court">Local Court</SelectItem>
                                                        <SelectItem value="district court">District Court</SelectItem>
                                                        <SelectItem value="high court">High Court</SelectItem>
                                                        <SelectItem value="supreme court">Supreme Court</SelectItem>
                                                        <SelectItem value="other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    }}
                                    />
                                </div> }{/**End grid div(Option controls)*/}
                            </div>
                            <div className="border-b pb-2 mb-2">
                                {/** Second question*/}
                                <div className="mb-2">
                                    <FormField
                                        control={form.control}
                                        name="offence_convictions.drug_related_offence"
                                        render={({field}) =>{
                                            return <FormItem className="space-y-3">
                                                <FormLabel>2. Have you been convicted of, or entered a plea of guilty or no contest to, or a criminal offense of possession of and or of drugs use?</FormLabel>
                                                <FormControl>
                                                    <RadioGroup>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex flex-col space-y-1 ml-3"
                                                        >
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                            <RadioGroupItem value="yes" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                            Yes
                                                            </FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                            <RadioGroupItem value="no" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                            No
                                                            </FormLabel>
                                                        </FormItem>
                                                        </RadioGroup>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        }}
                                    />   
                                </div>
                                {/**Optional*/}
                                {drugRelatedOffence === "yes" && 
                                <div className="grid md:grid-cols-3 grid-col-1 gap-2 ml-3">
                                    <FormField
                                    control={form.control}
                                    name="offence_convictions.conviction_status"
                                    render={({field}) =>{
                                        return <FormItem>
                                                <FormLabel>Type of Drug Offense</FormLabel>
                                                <Select onValueChange={field.onChange}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Conviction status">
                                                            </SelectValue>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="possession">Possession of Controlled Substances</SelectItem>
                                                        <SelectItem value="distribution">Drug Trafficking/Distribution</SelectItem>
                                                        <SelectItem value="manufacturing">Drug Manufacturing/Cultivation</SelectItem>
                                                        <SelectItem value="abuse">Prescription Drug Abuse</SelectItem>
                                                        <SelectItem value="other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    }}
                                    />
                                    <FormField
                                    control={form.control}
                                    name="offence_convictions.drug_conviction_status"
                                    render={({field}) =>{
                                        return <FormItem>
                                                <FormLabel>Select Conviction status</FormLabel>
                                                <Select onValueChange={field.onChange}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Conviction status">
                                                            </SelectValue>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="convicted">Convicted</SelectItem>
                                                        <SelectItem value="pleaded guilty">Pleaded Guilty</SelectItem>
                                                        <SelectItem value="pleaded no contest">Pleaded No Contest</SelectItem>
                                                        <SelectItem value="pending trial">Pending Trial</SelectItem>
                                                        <SelectItem value="other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    }}
                                    />
                                    <FormField
                                    control={form.control}
                                    name="offence_convictions.substance_involved"
                                    render={({field}) =>{
                                        return <FormItem>
                                                <FormLabel>Substances involved</FormLabel>
                                                <Select onValueChange={field.onChange}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Conviction status">
                                                            </SelectValue>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="marijuana">Marijuana</SelectItem>
                                                        <SelectItem value="cocaine">Cocaine</SelectItem>
                                                        <SelectItem value="heroin">Heroin</SelectItem>
                                                        <SelectItem value="methamphetamine">Methamphetamine</SelectItem>
                                                        <SelectItem value="prescription drugs">Prescription drugs</SelectItem>
                                                        <SelectItem value="other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    }}
                                    />
                                    <div className="mt-2">
                                    <FormField
                                            control={form.control}
                                            name="offence_convictions.date_of_drug_conviction"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                <FormLabel className="mb-1">Date of Conviction/Plea</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-[240px] pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                        >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                        date > new Date() || date < new Date("1900-01-01")
                                                        }
                                                        initialFocus
                                                    />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                    control={form.control}
                                    name="offence_convictions.jurisdiction_drugs"
                                    render={({field}) =>{
                                        return <FormItem>
                                                <FormLabel>Court Jurisdiction</FormLabel>
                                                <Select onValueChange={field.onChange}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Court Jurisdiction">
                                                            </SelectValue>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="local_court">Local Court</SelectItem>
                                                        <SelectItem value="district court">District Court</SelectItem>
                                                        <SelectItem value="high court">High Court</SelectItem>
                                                        <SelectItem value="supreme court">Supreme Court</SelectItem>
                                                        <SelectItem value="other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    }}
                                    />
                                </div>
                                }
                            </div>
                            <div className="border-b pb-2 mb-2">
                                {/** Third question*/}
                                <div className="mb-2">
                                    <FormField
                                        control={form.control}
                                        name="offence_convictions.license_flag"
                                        render={({field}) =>{
                                            return <FormItem className="space-y-3">
                                                <FormLabel>3. Have you ever had a teaching license revoked, suspended, invalidated, cancelled or denied by any teaching council or any authority; surrendered such a license or the right to apply for such a license; or had any other adverse action taken against such a license. Please note that this includes a reprimand, warning, or reproval and any order denying the right to apply or reapply for a license?</FormLabel>
                                                <FormControl>
                                                    <RadioGroup>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex flex-col space-y-1 ml-3"
                                                        >
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                            <RadioGroupItem value="yes" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                            Yes
                                                            </FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                            <RadioGroupItem value="no" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                            No
                                                            </FormLabel>
                                                        </FormItem>
                                                        </RadioGroup>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                            }}
                                        />   
                                    </div>
                                    {licenseFlag === "yes" &&
                                    <div className="grid w-full max-w-sm items-center gap-1.5 ml-3">
                                        <FormField
                                        control={form.control}
                                        name="offence_convictions.license_flag_details"
                                        render={({ field }) => {
                                            return (
                                            <FormItem>
                                                <FormLabel>Please attach a letter giving full details and official documentation of the action taken</FormLabel>
                                                <FormControl>
                                                <Input
                                                type="file"
                                                placeholder="Attach a file"
                                                {...fileRef}
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
                                    }
                                </div>
                                <div className="border-b pb-2 mb-2">
                                {/** Forth question*/}
                                <div className="mb-2">
                                    <FormField
                                        control={form.control}
                                        name="offence_convictions.misconduct_flag"
                                        render={({field}) =>{
                                            return <FormItem className="space-y-3">
                                                <FormLabel>4. Are you currently the subject of any review, inquiry, investigation, or appeal of alleged misconduct that could warrant discipline or termination by your employer. Please note that this includes any open investigation by or pending proceeding with a child protection agency and any pending criminal charges?</FormLabel>
                                                <FormControl>
                                                    <RadioGroup>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="flex flex-col space-y-1 ml-3"
                                                        >
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                            <RadioGroupItem value="yes" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                            Yes
                                                            </FormLabel>
                                                        </FormItem>
                                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                            <RadioGroupItem value="no" />
                                                            </FormControl>
                                                            <FormLabel className="font-normal">
                                                            No
                                                            </FormLabel>
                                                        </FormItem>
                                                        </RadioGroup>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                            }}
                                        />   
                                    </div>
                                    {misconductFlag === "yes" &&
                                        <FormField
                                        control={form.control}
                                        name="offence_convictions.misconduct_flag_details"
                                        render={({ field }) => {
                                            return (
                                            <FormItem>
                                                <FormLabel>Please attach a letter giving full details and official documentation of the action taken</FormLabel>
                                                <FormControl>
                                                <Input
                                                type="file"
                                                placeholder="Attach a file"
                                                {...misconduct}
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
                                    }
                                </div>
                            </ScrollArea>
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
                        <div className="border md:h-96 p-2  rounded-lg mb-2 mr-1 grid gap-y-2 gap-x-10 md:grid-cols-2">
                            {/*<div className="mb-6 space-y-2 text-wrap ml-3">
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <FormLabel htmlFor="picture">Certified copy of OMANG or Passport(for non-citizens)</FormLabel>
                                    <FormControl>
                                        <Input 
                                        id="misconduct_flag_details" 
                                        name="attachments.national_id_copy"
                                        type="file" />
                                    </FormControl>
                                    <FormDescription>
                                        Max File Size: 5MB Accepted File Types: .pdf, .doc, and .docx
                                    </FormDescription>
                                    <FormMessage/>
                                </div>
                            </div>
                            <div className="mb-6 space-y-2 text-wrap ml-3">
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <FormLabel htmlFor="picture">Verification of qualification from BQA.</FormLabel>
                                    <FormControl>
                                        <Input 
                                        id="misconduct_flag_details" 
                                        name="offence_convictions.qualification_copy"
                                        type="file" />
                                    </FormControl>
                                    <FormDescription>
                                        Max File Size: 5MB Accepted File Types: .pdf, .doc, and .docx
                                    </FormDescription>
                                    <FormMessage/>
                                </div>
                            </div>
                            <div className="mb-6 space-y-2 text-wrap ml-3">
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <FormLabel htmlFor="picture">Proof of payment of Registration fee.</FormLabel>
                                    <FormControl>
                                        <Input 
                                        id="misconduct_flag_details" 
                                        name="offence_convictions.php"
                                        type="file" />
                                    </FormControl>
                                    <FormDescription>
                                        Max File Size: 5MB Accepted File Types: .pdf, .doc, and .docx
                                    </FormDescription>
                                    <FormMessage/>
                                </div>
                            </div>*/}
                            <Button type="submit" className="w-full">Submit</Button>
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
                        <div className="border md:h-96 p-2 rounded-lg mb-2 mr-1">

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
                        <div className="border md:h-96 p-2 rounded-lg mb-2 mr-1">

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
                        <div className="border md:h-96 p-2 rounded-lg mb-2 mr-1">
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