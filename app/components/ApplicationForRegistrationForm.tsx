"use client"

import React, { useCallback, useState } from "react";
import {Stepper } from "./Stepper";
import {motion} from 'framer-motion';
import { FormDataSchema, formSchema, teacherPreliminaryInfoSchema, studentStudyProgrammes, offenceConvictions,teacherRegistrations,declarations,employmentDetails,attachments, studentPreliminaryInfos, institutionRecommendations, qualificationSchema   } from "../lib/schema";
import { InformationCard } from "./InformationCard";
import { DiplomaLevel, CertificationLevel, PostGradDiplomaLevel, DegreeLevel, PostGradCertificateLevel, PhDLevel, MastersLevel} from "./QualificationLevelComponents";

import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { steps, studentSteps, hiddenSteps} from "../lib/store";
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
import { toast, useToast } from "@/components/ui/use-toast";
import { 
    RadioGroup, 
    RadioGroupItem } from "@/components/ui/radio-group"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarIcon } from "@radix-ui/react-icons"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Checkbox } from "@/components/ui/checkbox"
import { Control as RHFControl } from 'react-hook-form';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { Label } from "@radix-ui/react-label";
import {
    Alert,
    AlertDescription,
    AlertTitle,
  } from "@/components/ui/alert"

import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import axios from 'axios';
import { resolve } from "path";
import { rejects } from "assert";

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

const subjects = [
    { label: "Accounting", value: "Accounting" },
    { label: "French", value: "French" },
    { label: "Drama", value: "Drama" },
    { label: "Physics", value: "Physics" },
    { label: "Economics", value: "Economics" },
    { label: "Setswana", value: "Setswana" },
    { label: "English Language", value: "English Language" },
    { label: "Business Studies", value: "Business Studies" },
    { label: "Mathematics", value: "Mathematics" },
    { label: "Chemistry", value: "Chemistry" },
    { label: "Additional Maths", value: "Additional Maths" },
    { label: "Geography", value: "Geography" },
    { label: "Art and Design", value: "Art and Design" },
    { label: "History", value: "History" },
    { label: "Biology", value: "Biology" },
    { label: "Information, and Communication Technology (ICT)", value: "Information, and Communication Technology (ICT)" },
    { label: "Literature in English", value: "Literature in English" },
    { label: "Music", value: "Music" },
    { label: "Computer Science", value: "Computer Science" },
] as const; 

// Institution and study programmes: https://www.bou.ac.bw/index.php/schools/school-of-education
// https://www.ub.bw/programmes/education/primary-education/bachelor-primary-education-bpe
const programmes = [
    { label: "BED PRIMARY (BED-PRI)", value: "BED PRIMARY (BED-PRI)", institution:"Botswana Open University"},
    { label: "CERTIFICATE FOR DISTANCE EDUCATION PRACTITIONERS (CDEP)", value: "CERTIFICATE FOR DISTANCE EDUCATION PRACTITIONERS (CDEP)", institution:"Botswana Open University"},
    { label: "BED – SPECIAL & INCLUSIVE EDUCATION (BED-SIE)", value: "BED – SPECIAL & INCLUSIVE EDUCATION (BED-SIE)", institution:"Botswana Open University" },
    { label: "DIPLOMA IN INTEGRATED EARLY CHILDHOOD DEVELOPMENT (DIECD)", value: "university_of_botswana" },
    { label: "MED EDUCATIONAL LEADERSHIP (MED-EL)", value: "POST GRADUATE CERTIFICATE IN QUALITY ASSURANCE IN EDUCATION (PGCQAE)", institution:"Botswana Open University" },
    { label: "BED INTEGRATED EARLY CHILDHOOD DEVELOPMENT (BED IECD)", value: "BED INTEGRATED EARLY CHILDHOOD DEVELOPMENT (BED IECD)" },
    
    // https://www.ub.bw/programmes/education/educational-foundations/post-graduate-diploma-education
    { label: "Bachelor of Primary Education (BPE)", value: "Bachelor of Primary Education (BPE)",institution:"University of Botswana" },
    { label: "Post Graduate Diploma in Education", value: "Post Graduate Diploma in Education", institution:"University of Botswana" },
    
    // https://baisago.ac.bw/faculty-of-education/
    { label: "Certificate in Early Childhood Education", value: "Certificate in Early Childhood Education", institution:"BA ISAGO University" },
    { label: "Bachelor of Education in Early Childhood Education", value: "Bachelor of Education in Early Childhood Education" , institution:"BA ISAGO University" },
    { label: "Diploma in Early Childhood Education", value: "Diploma in Early Childhood Education" , institution:"Baisago" },
    { label: "Certificate in Vocational Education and Training (CVET)", value: "Certificate in Vocational Education and Training (CVET)", institution:"BA ISAGO University"  },
    { label: "Post Graduate Certificate in Curriculum Design and Development", value: "Post Graduate Certificate in Curriculum Design and Development", institution:"BA ISAGO University"},
    { label: "Post Graduate Diploma in Educational Leadership and Management", value: "Post Graduate Diploma in Educational Leadership and Management", institution:"BA ISAGO University"},
    { label: "National Professional Diploma in National Professional Diploma in Education (NPDE)", value: "National Professional Diploma in National Professional Diploma in Education (NPDE)", institution:"BA ISAGO University" },
    { label: "Bachelor of Education in (English Language)", value: " Bachelor of Education in (English Language)", institution:"BA ISAGO University" },
    { label: "Bachelor of Education in (General)", value: "Bachelor of Education in (General)", institution:"BA ISAGO University" },
    { label: "Bachelor of Education in (Mathematics)", value: "Bachelor of Education in (Mathematics)", institution:"BA ISAGO University" },
    { label: "Bachelor of Arts in Counselling", value: "Bachelor of Arts in Counselling", institution:"BA ISAGO University" },
    { label: "Bachelor of Education in Social Studies", value: "Bachelor of Education in Social Studies", institution:"BA ISAGO University" },
    { label: "Bachelors Degree in Special and Inclusive Education", value: "Bachelors Degree in Special and Inclusive Education", institution:"BA ISAGO University" },
    { label: "Master of Educational Leadership and Management", value: "Master of Educational Leadership and Management", institution:"BA ISAGO University" },
] as const;

const Signature = "O.Serala";

async function getSchool(){
    const schools = await fetch('http://66.179.253.57/api/public_schools/', { next: { tags: ['collection'] }})
    if(!schools.ok){
       // schools = institutions;
       throw new Error('Failed to fetch data')
    }
    return schools.json()
}

export const ApplicationForRegistrationForm: React.FC<RegistrationFormProps> = ({onClose}) => {
    //const schools = await getSchool()
    //console.log(schools)
    const [previousStep, setPreviousStep] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const delta = currentStep - previousStep

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isProfileChecked, setIsProfileChecked] = useState(false);

    const handleProfileCheckboxClick = () => {
        setIsProfileChecked(!isProfileChecked); // Toggle the state when the checkbox is clicked
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
                citizen_status: "Citizen",
                sub_cateogry: "",
                practice_category: "",
                work_status: ""
            },
            employment_details: {
                current_institution: "",
                institution_type: "",
                experience_years: 0,
                region: "",
                district: "",
                city_or_town: ""
            },
            offence_convictions: {
                student_related_offence: "",
                student_related_offence_details: "",
                drug_related_offence: "",
                drug_related_offence_details: "",
                license_flag: "",
                misconduct_flag:"",
            },
            declarations:{
                signature: "0.Serala",
                //agreement: false,
            },
            edu_pro_qualifications: [
                {
                    level: "",
                    qualification: "",
                    institution: "",
                    qualification_year: "",
                    minor_subjects:[
                        ""
                    ],
                    major_subjects: [
                        ""
                    ]
                }
            ],
            student_study_programmes: {
                name: "",
                completion_year: "",
                level: "",
                duration: 0,
                mode_of_study:"",
                specialization: ""
            }, 
            teacher_registrations: {
                registration_type: ""
                //reg_number: "N/A",
                //reg_status: "N/A",
                //disability_description:"N/A",
            },
            institution_recommendations:{
                recommended: "",
                //signature: ""
            },
            student_preliminary_infos:{
                institution_name:"",
                institution_type: "",
                citizenry: "",
                study_area: ""
            },
            bio_datas:{
                national_id: "440418213",
                surname: "Serala",
                forenames: "Oaitse",
                dob: "1996-02-15",
                pob: "Mahalapye",
                gender: "Male",
                nationality: "Motswana",
                postal_address: "P O Box 7886, Mahalapye",
                physical_address: "Block 10, Gaborone",
                email: "johndoe@gmail.com",
                mobile: "26774217788",
                marital_status: "Single",
                next_of_kin_name: "Sarah Cornor",
                next_of_kin_relation: "Mother",
                next_of_kin_contact: "26776554321",
                disability: "",
                disability_description: "",
            }
        }
    })

    // Watch function, for dynamic changes
    const disabilityFlag = form.watch("bio_datas.disability");
    
    const fileRef = form.register("offence_convictions.license_flag_details");
    const fileID = form.register("attachments.national_id_copy");
    const fileBQA = form.register("attachments.qualification_copy");
    const filePHP = form.register("attachments.proof_of_payment");
    const misconduct = form.register("offence_convictions.misconduct_flag_details");
    //const AttachmentFile = form.watch("edu_pro_qualifications.attachment");
    const registrationType = form.watch("teacher_preliminary_infos.work_status"); // Switch between teacher and student registration form
    const Recommended = form.watch("institution_recommendations.recommended");
    const IsAgreement = form.watch("declarations.agreement");

    // Stundent-Teacher registration
    const RecommendationFile = form.watch("institution_recommendations.attachment");

    // Teacher registration
    // Teacher Priliminary Infos
    const workStatus = form.watch("teacher_preliminary_infos.work_status");
    const practiceCategory = form.watch("teacher_preliminary_infos.practice_category");
    const subCategory = form.watch("teacher_preliminary_infos.sub_cateogry");
    const applicationType = form.watch("teacher_registrations.registration_type");

    // Employment Details
    const experienceYears = form.watch("employment_details.experience_years");
    const institutionType = form.watch("employment_details.institution_type");
    const currentInstitution = form.watch("employment_details.current_institution");
    const region = form.watch("employment_details.region");
    const district = form.watch("employment_details.district");
    const cityOrTown = form.watch("employment_details.city_or_town");

    // Qualifications
   // const qualification = form.watch("edu_pro_qualifications.qualification");
   // const institution = form.watch("edu_pro_qualifications.institution");
   // const qualificationYear = form.watch("edu_pro_qualifications.qualification_year");
   // const teachingSubjects = form.watch("edu_pro_qualifications.teaching_subjects");
    //const attachment = form.watch("edu_pro_qualifications.attachment");


    // Disability
    const disability = form.watch("bio_datas.disability");
    const disabilityDescription = form.watch("bio_datas.disability_description");

    // Offence
    // 1st question
    const studentRelatedOffence = form.watch("offence_convictions.student_related_offence");
    const studentRelatedOffenceType = form.watch("offence_convictions.student_related_offence_details");
    //const convictionStatus = form.watch("offence_convictions.conviction_status");
    //const sentenceOutcome = form.watch("offence_convictions.sentence_outcome");
    //const dateOfConviction = form.watch("offence_convictions.date_of_conviction");
    //const courtJurisdiction = form.watch("offence_convictions.court_jurisdiction");
    // 2nd question
    const drugRelatedOffence = form.watch("offence_convictions.drug_related_offence");
    const drugRelatedOffenceType = form.watch("offence_convictions.drug_related_offence_details");
    //const substanceInvolved = form.watch("offence_convictions.substance_involved");
    //const dateOfDrugConviction = form.watch("offence_convictions.date_of_drug_conviction");
    //const jurisdictionDrugs = form.watch("offence_convictions.jurisdiction_drugs");
    // 3rd question
    const licenseFlag = form.watch("offence_convictions.license_flag");
    const licenseFlagDetails = form.watch("offence_convictions.license_flag_details");

    // 4th question
    const misconductFlag = form.watch("offence_convictions.misconduct_flag");
    const misconductFlagDetails = form.watch("offence_convictions.misconduct_flag_details");

    // Attachments
    const nationalIdCopy = form.watch("attachments.national_id_copy");
    const qualificationCopy = form.watch("attachments.qualification_copy");
    const proofOfPayment = form.watch("attachments.proof_of_payment");

    // Declaration
    const agreement = form.watch("declarations.agreement");

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
    const [isErrorAlert, setIsErrorAlert] = useState(false);
    const imp = {
        "teacher_registrations":{
            "reg_number":"GH6778888",
            "reg_status":"Pending-Screening",
            "registration_type":"Teacher",
            "disability":"Yes",
            "disability_description":"left eye is impaired and dont see clearly on cold conditions"
    
        },
        "bio_datas":{
            "national_id":"436415528",
            "surname":"Motlalepuo",
            "forenames":"Garenosi",
            "dob":"1996-02-15",
            "pob":"Maun",
            "gender":"Male",
            "nationality":"Motswana",
            "postal_address":"P O Box 7886, Mahalapye",
            "physical_address":"Block 10, Gaborone",
            "email":"johndoe@gmail.com",
            "mobile":"26774217788",
            "marital_status":"Single",
            "next_of_kin_name":"Sarah Cornor",
            "next_of_kin_relation":"Mother",
            "next_of_kin_contact":"26776554321"
           
        },
        "declarations":{
            "agreement":true,
            "signature":"J. Doe"
        },
        "attachments":{
            "national_id_copy":"nationalID_copy.pdf",
            "qualification_copy":"Qualification_copy.pdf",
            "proof_of_payment":"FNB_proof.pdf"
            
        },
        "edu_pro_qualifications":{
            "level":"masters",
            "qualification":"MSc. Applied Sciences",
            "institution":"University of Botswana",
            "qualification_year":"2019",
            "teaching_subjects":"Mathematics and Sciences"
        },
        "employment_details":{
            "experience_years":4,
            "current_institution":"Moeding Colledge",
            "institution_type":"Public",
            "region":"South East",
            "district":"South East District",
            "city_or_town":"Gaborone"
        },
        "institution_recommendations":{
            "recommended":"Yes",
            "comment":"An exceptional and hard worker",
            "name":"Dr. W Wendy",
            "signature":"W. Wendy"
        },
        "offence_convictions": {
            "national_id": "empty",
            "student_related_offence": "No",
            "student_related_offence_details": "N/A",
            "drug_related_offence": "No",
            "drug_related_offence_details": "N/A",
            "license_flag": "No",
            "license_flag_details": "N/A",
            "misconduct_flag": "No",
            "misconduct_flag_details": "N/A"
        },
        "student_preliminary_infos":{
            "institution_name":"N/A",
            "institution_type":"N/A",
            "citizenry":"N/A",
            "study_area":"N/A"
        },
        "student_study_programmes":{
            "name":"N/A",
            "completion_year":"N/A",
            "level":"N/A",
            "duration":0,
            "mode_of_study":"N/A",
            "specialization":"N/A"
        },
        "teacher_preliminary_infos":{
            "citizen_status":"Citizen",
            "work_status":"Serving",
            "practice_category":"Senior Secondary",
            "sub_cateogry":"N/A"
        }   
    }

    /**
     * 
     * @param file 
     * @returns base64
     * @description Base64 Encoding
     */
    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file); // Read as Data URL (includes Base64 encoding)
            //reader.readAsText(file)
            //reader.onload = () => resolve((reader.result as string));
            //console.log('Base64Log',reader.result)
            reader.onload = () => {
                const base64 = (reader.result as string).split(',')[1];
                resolve(base64);
            };
            reader.onerror = error => reject(error);
        });
    };
    
    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true); // Change state to indicate submitting
        setIsErrorAlert(false);
        //console.log(values.attachments.national_id_copy);
        const formData = new FormData();
        //console.log('File: ',values.institution_recommendations.attachment)
        if(values.institution_recommendations.attachment !== (null || undefined) ){
            values.institution_recommendations.attachment = convertFileToBase64(values.institution_recommendations.attachment);
        }
        //console.log('Encoded',JSON.stringify(values.institution_recommendations.attachment))
        //const binaryData = Buffer.from(values.institution_recommendations.attachment, 'base64');
        //console.log(binaryData);
    
        try{
        formSchema.parse(values); // vValidate form values using zod
        /**const valueswithBio = {
            ...values,
            bio_datas: {
                national_id: "440418213",
                surname: "Serala",
                forenames: "Oaitse",
                dob: "1996-02-15",
                pob: "Mahalapye",
                gender: "Male",
                nationality: "Motswana",
                postal_address: "P O Box 7886, Mahalapye",
                physical_address: "Block 10, Gaborone",
                email: "johndoe@gmail.com",
                mobile: "26774217788",
                marital_status: "Single",
                next_of_kin_name: "Sarah Cornor",
                next_of_kin_relation: "Mother",
                next_of_kin_contact: "26776554321"
              }
        }*/
        //const formData = new FormData();
        //Object.keys(valueswithBio).forEach(key =>{
        //formData.append("DOB", valueswithBio.bio_datas.dob);
        //formData.append("ID", valueswithBio.attachments.national_id_copy);
       // })
        //formData.append(values.attachments.national_id_copy,values.attachments.national_id_copy);
        //formData.append(values.attachments.proof_of_payment,values.attachments.proof_of_payment);
        console.log({values})
        
        const registrationEndpoint = `http://66.179.253.57/api/teacher_registrations/`;
        const response = await fetch(registrationEndpoint,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                //'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive'
            },
            //body: formData,
            //body: valueswithBio,
            body: JSON.stringify({...values}), // Spread the valueswithBio object to remove the nesting key.
        })
        if(!response.ok){
            //setCurrentStep(step => step + 1)
            throw new Error("Failed to register");
        }
        form.reset();
        setCurrentStep(step => step + 1) // Advance to the complete stage only if the response is successful
      }catch (error:any){
        //console.error('Error registering', error.message);
        setIsErrorAlert(true);
      }finally{
        setIsSubmitting(false); // Change state back after submission is completed
      }
    }

    // const handleSubmit1 = async (values: z.infer<typeof formSchema>) => {
    //     setIsSubmitting(true); // Change state to indicate submitting
    //     setIsErrorAlert(false);

    //     try {
    //         formSchema.parse(values); // Validate with Zod
    
    //         const formData = new FormData();
    //         const registrationEndpoint = `http://66.179.253.57/api/teacher_registrations/`;
    //         // Add JSON data
    //         const valuesWithBio = {
    //             ...values,
    //             //bio_datas: { 
    //                 // ... your bio_datas fields
    //             //}
    //         };
    
    //         // Add files (assuming file input fields are named appropriately)
    //         if (values.attachments?.national_id_copy) { 
    //             formData.append('national_id_copy', values.attachments.national_id_copy[0]);
    //         }
    //         // ... add other file fields similarly
    
    //         // Send the request using fetch
    //         const response = await fetch(registrationEndpoint, { 
    //             method: 'POST',
    //             body: formData 
    //         });
    
    //        // ... handle response and errors as before 
    
    //    } catch (error) {
    //        // ... handle errors
    //    } finally {
    //        setIsSubmitting(false);
    //    }
    // }


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

    const [numOfQualifications, setNumOfQualifications] = useState(1); // State to track the number of qualifications

    const handleAddQualification = () => {
        setNumOfQualifications(prevNum => prevNum + 1)
    }
    const handleSubtractQualification = () => {
        setNumOfQualifications(prevNum => prevNum - 1)
    }

    const [BQAFileName, setBQAFileName] = useState('');
    const [OMANGFileName, setOMANGFileName] = useState('');
    const [ProofOfPayment, setProofOfPayment] = useState('');
    const [licenseFlagLetter, setLicenseFlagLetter] = useState('');
    const [misconductFlagLetter, setMisconductFlagLetter] = useState('');

    //const [applicationType, setApplicationType] = useState('');

    return(
        <div>
            <div className="flex md:m-5 w-full  space-x-1 md:h-full ">
                {/* steps */}
                <nav aria-label="Progress" className="w-48 hidden md:block">
                    {applicationType === 'teacher' && 
                        <Stepper currentStep={currentStep} steps={steps}/>
                    }
                    {applicationType === 'student' && 
                        <Stepper currentStep={currentStep} steps={studentSteps}/>
                    }
                    {applicationType !== 'student' && applicationType !== 'teacher' &&
                        <Stepper currentStep={currentStep} steps={hiddenSteps}/>
                    }
                </nav>
                {/* forms */}   
                <Form {...form}>
                <form className="w-[calc(100%-5rem)]" onSubmit={form.handleSubmit(handleSubmit)}> 
                    {/*BOTH-PRELIMINARY INFORMATION*/}
                    {currentStep === 0 && (
                        <motion.div
                            initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{duration: 0.3, ease: 'easeInOut'}}
                        >
                        <div className="border md:h-96 md:w-full w-96 p-2 rounded-lg mb-2 mr-1">
                            <div className="grid gap-y-10 gap-x-10 mb-6 md:grid-cols-2 sm:grid-cols-1">
                                <FormField
                                    control={form.control}
                                    name="teacher_registrations.registration_type"
                                    render={({field}) =>{
                                        return <FormItem className="space-y-3">
                                            <FormLabel>Select Application Type</FormLabel>
                                            <FormControl>
                                                <RadioGroup>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex flex-col space-y-1"
                                                    >
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                        <RadioGroupItem value="student" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                        Student/Teacher
                                                        </FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                        <RadioGroupItem value="teacher" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                        Teacher
                                                        </FormLabel>
                                                    </FormItem>
                                                    </RadioGroup>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    }}
                                />
                                {applicationType === 'student' && <FormField
                                control={form.control}
                                name="student_preliminary_infos.institution_name"
                                render={({ field }) => (
                                    <FormItem className="flex overflow-auto flex-col space-y-3 mt-2">
                                        <FormLabel>Name of institution</FormLabel>
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
                                                        form.setValue("student_preliminary_infos.institution_name", institution.value)
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
                                />}
                                {applicationType === 'student' &&                 
                                <FormField
                                    control={form.control}
                                    name="student_preliminary_infos.institution_type"
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
                                /> }
                                {applicationType === 'teacher' &&
                                <FormField
                                    control={form.control}
                                    name="teacher_preliminary_infos.work_status"
                                    render={({field}) =>{
                                        return <FormItem>
                                                <FormLabel>Select work status</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select an employment status">

                                                            </SelectValue>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="unemployed">Unemployed</SelectItem>
                                                        <SelectItem value="serving">Serving</SelectItem>
                                                        <SelectItem value="retired">Retired</SelectItem>
                                                        <SelectItem value="educational consultant">Educational Consultant</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    }}
                                />}
                                {applicationType === 'teacher' &&
                                <div className=''>
                                    <FormField
                                        control={form.control}
                                        name="teacher_preliminary_infos.practice_category"
                                        render={({field}) =>{
                                            return <FormItem>
                                                    <FormLabel>Select practice category</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
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
                                </div>}
                                {applicationType === 'student' &&
                                <div className=''>
                                    <FormField
                                        control={form.control}
                                        name="student_preliminary_infos.study_area"
                                        render={({field}) =>{
                                            return <FormItem>
                                                    <FormLabel>Select area of study</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
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
                                                            <SelectItem value="secondary">Guidance and Counseling</SelectItem>
                                                            <SelectItem value="secondary">Special Education</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        }}
                                    />
                                </div>}
                                <div className=''>
                                {applicationType === 'teacher' &&
                                    <FormField
                                        control={form.control}
                                        name="teacher_preliminary_infos.sub_cateogry"
                                        render={({field}) =>{
                                            return <FormItem>
                                                    <FormLabel>Select practice sub-category</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
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
                                    />}
                                </div> 
                            </div>  
                            </div>
                        </motion.div>           
                    )}
                    {/*BIO DATAS*/}
                    {currentStep === 1  && (
                        <motion.div
                            initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{duration: 0.3, ease: 'easeInOut'}}
                        >
                        <div className="border md:h-96 h-96  p-2 rounded-lg mb-2 mr-1">
                            <div className="grid gap-y-10 gap-x-10 mb-6 md:grid-cols-2 sm:grid-cols-1">
                            <FormField
                                control={form.control}
                                name="bio_datas.national_id"
                                render={({field}) =>{
                                    return <FormItem>
                                        <FormLabel>National ID</FormLabel>
                                        <FormControl>
                                            <Input
                                            placeholder="national id"
                                            {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                }}
                            />  
                            <FormField
                                control={form.control}
                                name="bio_datas.surname"
                                render={({field}) =>{
                                    return <FormItem>
                                        <FormLabel>Surname</FormLabel>
                                        <FormControl>
                                            <Input
                                            placeholder="surname"
                                            {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                }}
                            />  
                            <FormField
                                control={form.control}
                                name="bio_datas.forenames"
                                render={({field}) =>{
                                    return <FormItem>
                                        <FormLabel>Fornames</FormLabel>
                                        <FormControl>
                                            <Input
                                            placeholder="surname"
                                            {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                }}
                            />  
                            </div>
                        </div>
                        </motion.div>
                    )}
                    {/*STUDENT-STUDY PROGRAMME DETAILS*/}
                    {currentStep === 2 && applicationType === 'student' && (
                        <motion.div
                            initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{duration: 0.3, ease: 'easeInOut'}}
                        >
                        <div className="border md:h-96 h-96  p-2 rounded-lg mb-2 mr-1">
                            <div className="grid gap-y-10 gap-x-10 mb-6 md:grid-cols-2 sm:grid-cols-1">
                            <FormField
                                    control={form.control}
                                    name="student_study_programmes.level"
                                    render={({field}) =>{
                                        return <FormItem className="space-y-3">
                                            <FormLabel>Programme level</FormLabel>
                                            <FormControl>
                                                <RadioGroup>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex flex-col space-y-1"
                                                    >
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                        <RadioGroupItem value="diploma" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                        Diploma
                                                        </FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                        <RadioGroupItem value="degree" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                        Degree
                                                        </FormLabel>
                                                    </FormItem>
                                                    </RadioGroup>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    }}
                                /> 
                            <FormField
                                control={form.control}
                                name="student_study_programmes.name"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col space-y-3 mt-2">
                                        <FormLabel>Name of programme</FormLabel>
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
                                                    ? programmes.find(
                                                        (programme) => programme.value === field.value
                                                    )?.label
                                                    : "Select programme"}
                                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                                <CommandInput
                                                placeholder="Search programme..."
                                                className="h-9"
                                                />
                                                <ScrollArea className="h-60 w-48 rounded-md">
                                                <CommandEmpty>No programme found.</CommandEmpty>
                                                <CommandGroup>
                                                {programmes.map((programme) => (
                                                    <CommandItem
                                                    value={programme.label}
                                                    key={programme.value}
                                                    onSelect={() => {
                                                        form.setValue("student_study_programmes.name", programme.value)
                                                    }}
                                                    >
                                                    {programme.label}
                                                    <CheckIcon
                                                        className={cn(
                                                        "ml-auto h-4 w-4",
                                                        programme.value === field.value
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
                                    <FormField
                                        control={form.control}
                                        name="student_study_programmes.duration"
                                        render={({field}) =>{
                                            return <FormItem>
                                                <FormLabel>Duration(In Years)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                    placeholder="programme duration"
                                                    type="number"
                                                    {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        }}
                                    />  
                                    <FormField
                                        control={form.control}
                                        name="student_study_programmes.completion_year"
                                        render={({field}) =>{
                                            return <FormItem>
                                                <FormLabel>Expected year of completion</FormLabel>
                                                <FormControl>
                                                    <Input
                                                    placeholder="year of completion"
                                                    type="number"
                                                    {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        }}
                                    /> 
                                    <FormField
                                        control={form.control}
                                        name="student_study_programmes.mode_of_study"
                                        render={({field}) =>{
                                            return <FormItem>
                                                    <FormLabel>Mode of study</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select mode of study">
                                                                </SelectValue>
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="full-time">Full-time</SelectItem>
                                                            <SelectItem value="part-time">Part-time</SelectItem>
                                                            <SelectItem value="online-distance">Online or Distance Learning</SelectItem>
                                                            <SelectItem value="exchange-programs">Exchange Programs</SelectItem>
                                                            <SelectItem value="other">Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        }}
                                    />
                            <FormField
                                control={form.control}
                                name="student_study_programmes.specialization"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col space-y-3 mt-2">
                                        <FormLabel>Subject specialization (Junior&Sec)</FormLabel>
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
                                                    ? subjects.find(
                                                        (subject) => subject.value === field.value
                                                    )?.label
                                                    : "Select specialization"}
                                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                                <CommandInput
                                                placeholder="Search specialization..."
                                                className="h-9"
                                                />
                                                <ScrollArea className="h-60 w-48 rounded-md">
                                                <CommandEmpty>No subject found.</CommandEmpty>
                                                <CommandGroup>
                                                {subjects.map((subject) => (
                                                    <CommandItem
                                                    value={subject.label}
                                                    key={subject.value}
                                                    onSelect={() => {
                                                        form.setValue("student_study_programmes.specialization", subject.value)
                                                    }}
                                                    >
                                                    {subject.label}
                                                    <CheckIcon
                                                        className={cn(
                                                        "ml-auto h-4 w-4",
                                                        subject.value === field.value
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
                        </div>
                        </motion.div>
                    )}
                    {/*DECLARATION*/}
                    {currentStep === 3 && applicationType === 'student' && (
                    <motion.div
                            initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{duration: 0.3, ease: 'easeInOut'}}
                        >
                        
                        <div className="border md:h-96 p-2 rounded-lg mb-2 mr-1">
                        <ScrollArea className="h-96">
                            <p className="leading-7 [&:not(:first-child)]:mt-6 mb-2 text-xs">
                             I <em className="underline">{Signature}</em> hereby declare that the information I have provided in this application form is true and correct to the best of my knowledge and belief. I understand that providing false or misleading information may result in the refusal of my application or the cancellation of my registration.
I declare that I have read and understood the Teacher Performance Standards and the Code of Professional Conduct and Ethics and I am committed to upholding these standards in my professional practice.
I further declare that I have never been convicted of a criminal offense and has never been involved in any criminal activity. 
I am aware that the Council may collect and verify information about my qualifications, experience, and fitness to teach. I consent to the Council collecting and verifying this information and I authorize the Council to share this information with other relevant organizations, such as employers and educational institutions.
                            </p>
                            <FormField
                                control={form.control}
                                name="declarations.agreement"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                                    <FormControl>
                                        <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                        Accept the above terms and conditions
                                        </FormLabel>
                                        <FormDescription>
                                            You agree to our Terms of Service and Privacy Policy.{" "}
                                        </FormDescription>
                                        <FormMessage/>
                                    </div>
                                    </FormItem>
                                )}
                                />
                                <div className="flex items-center space-x-2">
                                <FormItem className="flex flex-row w-full items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                                    <FormControl>
                                        <Checkbox id="profile" onClick={handleProfileCheckboxClick} checked={isProfileChecked}/>
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Profile Information
                                        </FormLabel>
                                        <FormDescription>
                                            I agree to submit the listed profile information along with this application.{" "}
                                        </FormDescription>
                                        <FormMessage/>
                                    </div>
                                </FormItem>
                                </div>
                                </ScrollArea>
                        </div>
                        
                        </motion.div>
                    )}
                    {/*STUDENT-RECOMMENDATION BY INSTITUTION*/}
                    {currentStep === 4 && applicationType === 'student' && (
                    <motion.div
                            initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{duration: 0.3, ease: 'easeInOut'}}
                        >
                        <div className="border md:h-96 p-2 rounded-lg mb-2 mr-1">
                        <div className="grid md:grid-cols-2 grid-cols-1 gap-y-2 mx-2">
                        <FormField
                                control={form.control}
                                name="institution_recommendations.recommended"
                                render={({field}) =>{
                                    return <FormItem className="space-y-3">
                                        <FormLabel>Recommended</FormLabel>
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
                                {Recommended === "yes" &&
                                <FormField
                                control={form.control}
                                name="institution_recommendations.attachment"
                                render={({ field }) => {
                                    return (
                                    <FormItem>
                                        <FormLabel>Attach recommendation letter from your institution</FormLabel>
                                        <FormControl>
                                        <Input
                                        type="file"
                                        accept="application/pdf"
                                        placeholder="Attach a file"
                                        {...RecommendationFile}
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
                                />}
                            </div>
                        </div>
                        </motion.div>
                    )}
                    {/*STUDENT-PREVIEW*/}
                    {currentStep === 5 && applicationType === 'student' && (
                    <motion.div
                            initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{duration: 0.3, ease: 'easeInOut'}}
                        >
                            {isErrorAlert &&
                                <div className="mr-1">
                                    <Alert variant="destructive">
                                        <ExclamationTriangleIcon className="h-4 w-4" />
                                        <AlertTitle>Error</AlertTitle>
                                        <AlertDescription>
                                            Error submitting application, server error. Try again later...
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            }
                            <div className={`border ${isErrorAlert? 'h-80':'h-96'} p-2 rounded-lg mb-2 mr-1`}>
                                <ScrollArea className="h-full">
                                    <div className="px-5">
                                        <Accordion type="single" collapsible>
                                            <AccordionItem value="item-1">
                                                <AccordionTrigger>PRELIMINARY INFORMATION</AccordionTrigger>
                                                    <AccordionContent>
                                                        <div className="flex space-x-2">
                                                            <Label>Status:</Label>
                                                            <Label>Student/Teacher</Label>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <Label>Practice category:</Label>
                                                            <Label>Primary</Label>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <Label>Practice sub-category:</Label>
                                                            <Label>Tutor</Label>
                                                        </div>
                                                    </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="item-1">
                                                <AccordionTrigger>STUDY PROGRAMME</AccordionTrigger>
                                                    <AccordionContent>
                                                        <div className="flex space-x-2">
                                                            <Label>Programme level:</Label>
                                                            <Label>Diploma</Label>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <Label>Name of programme:</Label>
                                                            <Label>BED PRIMARY (BED-PRI)</Label>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <Label>Duration(In Years):</Label>
                                                            <Label>8 years</Label>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <Label>Expected year of completion:</Label>
                                                            <Label>2015</Label>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <Label>Mode of study:</Label>
                                                            <Label>Full-time</Label>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <Label>Subject specialization:</Label>
                                                            <Label>Accounting</Label>
                                                        </div>
                                                    </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="item-1">
                                                <AccordionTrigger>DECLARATION</AccordionTrigger>
                                                    <AccordionContent>
                                                        <div className="flex space-x-2">
                                                            <Label>Accept the above terms and conditions:</Label>
                                                            <Label>Yes</Label>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <Label>Profile Information:</Label>
                                                            <Label>Yes</Label>
                                                        </div>
                                                    </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="item-1">
                                                <AccordionTrigger>RECOMMENDATION</AccordionTrigger>
                                                    <AccordionContent>
                                                        <div className="flex space-x-2">
                                                            <Label>Recommended:</Label>
                                                            <Label>Yes</Label>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <Label>Recommendation:</Label>
                                                            <Label>Letter.pdf</Label>
                                                        </div>
                                                    </AccordionContent>
                                            </AccordionItem>
                                            <AccordionItem value="item-1">
                                                <AccordionTrigger>PREVIEW</AccordionTrigger>
                                                    <AccordionContent>
                                                        <div className="flex space-x-2">
                                                            <Label>Status:</Label>
                                                            <Label>Serving</Label>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <Label>Practice category:</Label>
                                                            <Label>Primary</Label>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <Label>Practice sub-category:</Label>
                                                            <Label>Tutor</Label>
                                                        </div>
                                                    </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </div>
                                </ScrollArea>
                            </div>
                        </motion.div>
                    )}
                    {/*STUDENT-COMPLETE*/}
                    {currentStep === 6 && applicationType === 'student' && (
                    <motion.div
                            initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{duration: 0.3, ease: 'easeInOut'}}
                        >
                        <div className="border md:h-96 p-2 rounded-lg mb-2 mr-1">
                        <ul className='list-disc pl-5 mt-1 text-sm leading-6 text-gray-600'>
                            <li>Processing of the application will be done within 30 days;</li>
                            <li>You will receive electronic feedback once your application has been processed;</li>
                            <li>Successful applicants will be granted a Student Teaching License which is valid for the duration of the training programme.</li>
                        </ul>
                        <p className='mt-2 text-sm leading-6 text-gray-600'>
                            Thank you for your submission.
                        </p>
                        </div>
                        </motion.div>
                    )}
                    {/*EMPLOYMENT DETAILS*/}
                    {currentStep === 2 && applicationType !== 'student' && (
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
                                                        <Select onValueChange={field.onChange} value={field.value}>
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
                                                        <Select onValueChange={field.onChange} value={field.value}>
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
                                                        <Select onValueChange={field.onChange} value={field.value}>
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
                    {currentStep === 3 && applicationType !== 'student' &&  (
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
                                {/*Visible when conditions here*/}
                                <div className="overflow-auto h-full">
                                        <div className="">
                                        {/*Scroll Content - Add-Remove Form Items*/}
                                        <div className=" bg-white">
                                            {/* Repeat the following block of JSX based on numOfQualification */}
                                            {[...Array(numOfQualifications)].map((_,index)=>(
                                            <div key={index} className="w-full grid grid-cols-3 gap-x-5 gap-y-5 border border-dashed border-gray-500 p-1 mt-1 rounded-lg">
                                                    <FormField
                                                    control={form.control}
                                                    name={`edu_pro_qualifications.${index}.level`}
                                                    render={({field}) =>{
                                                        return <FormItem>
                                                                <FormLabel>Qualification level</FormLabel>
                                                                <Select onValueChange={field.onChange} value={field.value}>
                                                                    <FormControl>
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Select Qualification level">
                                                                            </SelectValue>
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        <SelectItem value="certification">Certification</SelectItem>
                                                                        <SelectItem value="diploma">Diploma</SelectItem>
                                                                        <SelectItem value="post grad diploma">Post Grad Diploma</SelectItem>
                                                                        <SelectItem value="degree">Degree</SelectItem>
                                                                        <SelectItem value="post grad certificate">Post Grad Certificate</SelectItem>
                                                                        <SelectItem value="masters">Masters</SelectItem>
                                                                        <SelectItem value="phd">PhD</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    }}
                                                    />
                                                    <FormField
                                                    control={form.control}
                                                    name={`edu_pro_qualifications.${index}.qualification`}
                                                    render={({field}) =>{
                                                        return <FormItem>
                                                            <FormLabel>Qualification name</FormLabel>
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
                                                <FormField
                                                    control={form.control}
                                                    name={`edu_pro_qualifications.${index}.institution`}
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
                                                                            form.setValue(`edu_pro_qualifications.${index}.institution`, institution.value)
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
                                                <FormField
                                                    control={form.control}
                                                    name={`edu_pro_qualifications.${index}.qualification_year`}
                                                    render={({field}) =>{
                                                        return <FormItem>
                                                            <FormLabel>Year Of Completion</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                placeholder="Year..."
                                                                {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    }}
                                                />       
                                                <FormField
                                                control={form.control}
                                                name={`edu_pro_qualifications.${index}.minor_subjects.${index}`}
                                                render={({field}) =>{
                                                    return <FormItem>
                                                            <FormLabel>Minor subject</FormLabel>
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select minor subject">
                                                                        </SelectValue>
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="english">English</SelectItem>
                                                                    <SelectItem value="setswana">Setswana</SelectItem>
                                                                    <SelectItem value="physical education">Physical education</SelectItem>
                                                                    <SelectItem value="chemistry">Chemistry</SelectItem>
                                                                    <SelectItem value="biology">Biology</SelectItem>
                                                                    <SelectItem value="mathematics">Mathematics</SelectItem>
                                                                    <SelectItem value="social studies">Social studies</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        <FormMessage/>
                                                    </FormItem>
                                                }}
                                                />
                                                <FormField
                                                control={form.control}
                                                name={`edu_pro_qualifications.${index}.major_subjects.${index}`}
                                                render={({field}) =>{
                                                    return <FormItem>
                                                            <FormLabel>Minor subject</FormLabel>
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select major subject">
                                                                        </SelectValue>
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                <SelectItem value="english">English</SelectItem>
                                                                    <SelectItem value="setswana">Setswana</SelectItem>
                                                                    <SelectItem value="physical education">Physical education</SelectItem>
                                                                    <SelectItem value="chemistry">Chemistry</SelectItem>
                                                                    <SelectItem value="biology">Biology</SelectItem>
                                                                    <SelectItem value="mathematics">Mathematics</SelectItem>
                                                                    <SelectItem value="social studies">Social studies</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        <FormMessage/>
                                                    </FormItem>
                                                }}
                                                />           
                                                                   
                                                <div className="">
                                                <FormField
                                                    control={form.control}
                                                    name={`edu_pro_qualifications.${index}.attachment`}
                                                    render={({ field }) => {
                                                        return (
                                                        <FormItem>
                                                            <FormLabel>Attach a Qualification document</FormLabel>
                                                            <FormControl>
                                                            <Input
                                                            type="file"
                                                            placeholder="Attach a file"
                                                            //{...AttachmentFile}
                                                            onChange={(event) => {
                                                                field.onChange(event.target?.files?.[0] ?? undefined);
                                                            }}
                                                            />
                                                            </FormControl>
                                                            {field.value && ( // Show file details if a file is selected
                                                                    <div className="mt-1 text-sm text-gray-600">
                                                                        File Name: {field.value.name} 
                                                                    </div>
                                                            )}
                                                            <FormDescription>
                                                                Max File Size: 5MB Accepted File Types: .pdf
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
                                            ))}
                                            <div className="flex items-center justify-end w-full p-2">
                                                <button 
                                                type="button" 
                                                onClick={handleSubtractQualification}
                                                disabled={numOfQualifications===1}
                                                className="py-2 px-4 me-2 mb-0 text-sm font-medium text-gray-900 focus:outline-none bg-red-500 rounded-lg border border-red-600 hover:bg-red-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
                                                >- Remove</button>
                                                <button 
                                                type="button" 
                                                onClick={handleAddQualification}
                                                className="py-2 px-4 me-2 mb-0 text-sm font-medium text-gray-900 focus:outline-none bg-green-500 rounded-lg border border-green-600 hover:bg-green-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
                                                >+ Add</button>
                                                {/*<button onClick={handleSubtractQualification} className="inline-flex items-center justify-center p-1 me-3 text-sm font-medium h-6 w-6 text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200" type="button">
                                                    <span className="sr-only">Quantity button</span>
                                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16"/>
                                                    </svg>
                                                </button>
                                                <div>
                                                    <input type="number" id="first_product" value={numOfQualifications} className="bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 " placeholder="1" required />
                                                </div>
                                                <button onClick={handleAddQualification} className="inline-flex items-center justify-center h-6 w-6 p-1 ms-3 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200" type="button">
                                                    <span className="sr-only">Quantity button</span>
                                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
                                                    </svg>
                                                    </button>*/}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>             
                    )}
                    {/*DISABILITY*/}
                    {currentStep === 4 && applicationType !== 'student' &&  (
                        <motion.div
                            initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{duration: 0.3, ease: 'easeInOut'}}
                        >
                        <div className="border md:h-96 p-2 rounded-lg mb-2 mr-1 space-y-5">
                            <div>
                                <FormField
                                    control={form.control}
                                    name="bio_datas.disability"
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
                                name="bio_datas.disability_description"
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
                                                        form.setValue("bio_datas.disability_description", disability.value)
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
                    {currentStep === 5 && applicationType !== 'student' &&  (
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
                                name="offence_convictions.student_related_offence_details"
                                render={({field}) =>{
                                    return <FormItem>
                                            <FormLabel>Select Offence type</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
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
                                    name="offence_convictions.drug_related_offence_details"
                                    render={({field}) =>{
                                        return <FormItem>
                                                <FormLabel>Type of Drug Offense</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
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
                                                    const LicLetter = event.target?.files?.[0];
                                                    if(LicLetter){
                                                        setLicenseFlagLetter(LicLetter.name);
                                                    }else{
                                                        setLicenseFlagLetter('');
                                                    }
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
                                                    const Miscletter = event.target?.files?.[0];
                                                    if(Miscletter){
                                                        setMisconductFlagLetter(Miscletter.name);
                                                    }else{
                                                        setMisconductFlagLetter('');
                                                    }
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
                    {currentStep === 6 && applicationType !== 'student' &&  (
                        <motion.div
                            initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{duration: 0.3, ease: 'easeInOut'}}
                        >
                        <div className="border md:h-96 p-2  rounded-lg mb-2 mr-1 grid gap-y-2 gap-x-10 md:grid-cols-2">
                            <div className="mb-6 space-y-2 text-wrap ml-3">
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <FormField
                                        control={form.control}
                                        name="attachments.national_id_copy"
                                        render={({ field }) => {
                                            return (
                                            <FormItem>
                                                <FormLabel>Certified copy of OMANG or passport (for non-citizens)</FormLabel>
                                                <FormControl>
                                                <Input
                                                type="file"
                                                placeholder="Attach a file"
                                                {...fileID}
                                                onChange={(event) => {
                                                    field.onChange(event.target?.files?.[0] ?? undefined);
                                                    const Omang = event.target?.files?.[0];
                                                    if(Omang){
                                                        setOMANGFileName(Omang.name);
                                                    }else{
                                                        setOMANGFileName('');
                                                    }
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
                            </div>
                            <div className="mb-6 space-y-2 text-wrap ml-3">
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                <FormField
                                        control={form.control}
                                        name="attachments.qualification_copy"
                                        render={({ field }) => {
                                            return (
                                            <FormItem>
                                                <FormLabel>Verification of qualification from BQA.</FormLabel>
                                                <FormControl>
                                                <Input
                                                type="file"
                                                placeholder="Attach a file"
                                                {...fileBQA}
                                                onChange={(event) => {
                                                    field.onChange(event.target?.files?.[0] ?? undefined);
                                                    const selectedFile = event.target?.files?.[0];
                                                    if(selectedFile){
                                                        setBQAFileName(selectedFile.name)
                                                    }else{
                                                        setBQAFileName('');
                                                    }
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
                            </div>
                            <div className="mb-6 space-y-2 text-wrap ml-3">
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                <FormField
                                        control={form.control}
                                        name="attachments.proof_of_payment"
                                        render={({ field }) => {
                                            return (
                                            <FormItem>
                                                <FormLabel>Proof of payment of Registration fee.</FormLabel>
                                                <FormControl>
                                                <Input
                                                type="file"
                                                placeholder="Attach a file"
                                                {...filePHP}
                                                onChange={(event) => {
                                                    field.onChange(event.target?.files?.[0] ?? undefined);
                                                    const ProofOfPayment = event.target?.files?.[0];
                                                    if(ProofOfPayment){
                                                        setProofOfPayment(ProofOfPayment.name);
                                                    }else{
                                                        setProofOfPayment('');
                                                    }
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
                                </div>
                        </div>
                        </motion.div>             
                    )}
                    {/*DECLARATION*/}
                    {currentStep === 7 && applicationType !== 'student' &&  (
                        <motion.div
                            initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{duration: 0.3, ease: 'easeInOut'}}
                        >
                        <div className="border md:h-96 p-2 rounded-lg mb-2 mr-1">
                            <p className="leading-7 [&:not(:first-child)]:mt-6 mb-2">
                             I <em className="underline">{Signature}</em> hereby declare that the information I have provided in this application form is true and correct to the best of my knowledge and belief. I understand that providing false or misleading information may result in the refusal of my application or the cancellation of my registration. I am aware that the Council may collect and verify information about my qualifications, experience, and fitness to teach. I consent to the Council collecting and verifying this information and I authorize the Council to share this information with other relevant organizations, such as employers and educational institutions.
                            </p>
                            <FormField
                                control={form.control}
                                name="declarations.agreement"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                                    <FormControl>
                                        <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                        Accept the above terms and conditions
                                        </FormLabel>
                                        <FormDescription>
                                            You agree to our Terms of Service and Privacy Policy.{" "}
                                        </FormDescription>
                                        <FormMessage/>
                                    </div>
                                    </FormItem>
                                )}
                                />
                                <div className="flex items-center space-x-2">
                                <FormItem className="flex flex-row w-full items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                                    <FormControl>
                                        <Checkbox id="profile" onClick={handleProfileCheckboxClick} checked={isProfileChecked}/>
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Profile Information
                                        </FormLabel>
                                        <FormDescription>
                                            I agree to submit the listed profile information along with this application.{" "}
                                        </FormDescription>
                                        <FormMessage/>
                                    </div>
                                </FormItem>
                                </div>
                        </div>
                        </motion.div>             
                    )}
                    {/*PREVIEW*/}
                    {currentStep === 8 && applicationType !== 'student' &&  (
                        <motion.div
                            initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{duration: 0.3, ease: 'easeInOut'}}
                        >
                        {isErrorAlert &&
                            <div className="mr-1">
                                <Alert variant="destructive">
                                    <ExclamationTriangleIcon className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>
                                        Error submitting application, server error. Try again later...
                                    </AlertDescription>
                                </Alert>
                            </div>
                            }
                        <div className={`border ${isErrorAlert? 'h-80':'h-96'} p-2 rounded-lg mb-2 mr-1`}>
                        <ScrollArea className="h-full">
                            <div className="px-5">
                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>PRELIMINARY INFORMATION</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="flex space-x-2">
                                            <Label>Status:</Label>
                                            <Label>{workStatus}</Label>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Label>Practice category:</Label>
                                            <Label>{practiceCategory}</Label>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Label>Practice sub-category:</Label>
                                            <Label>{practiceCategory}</Label>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>EMPLOYMENT DETAILS</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="flex space-x-2">
                                            <Label>Years in service:</Label>
                                            <Label>{experienceYears}</Label>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Label>Type of institution:</Label>
                                            <Label>{institutionType}</Label>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Label>Current station/institution:</Label>
                                            <Label>{currentInstitution}</Label>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Label>Region:</Label>
                                            <Label>{region}</Label>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Label>District:</Label>
                                            <Label>{district}</Label>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Label>City/Town/Village:</Label>
                                            <Label>{cityOrTown}</Label>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger>QUALIFICATIONS</AccordionTrigger>
                                    <AccordionContent>
                                        Qualifications here....
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-4">
                                    <AccordionTrigger>DISABILITY</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="flex space-x-2">
                                            <Label>Are you living with any form of disability:</Label>
                                            <Label>{disability}</Label>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Label>Nature of Disability:</Label>
                                            <Label>{disabilityDescription}</Label>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-4">
                                    <AccordionTrigger>OFFENCE</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="flex space-x-2 mb-1">
                                            <Label className="font-semibold">1. Have you been convicted of, or entered a plea of guilty or no contest to, or a criminal offense against a learner/ a minor?</Label>
                                            <Label>{studentRelatedOffence}</Label>
                                        </div>
                                        <div className="grid md:grid-cols-3 grid-cols-2 mb-2 gap-2">
                                            <div className="grid grid-cols-2 space-x-2">
                                                <Label className="font-semibold">Offence type:</Label>
                                                <Label>{studentRelatedOffenceType}</Label>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2 mb-1">
                                            <Label className="font-semibold">2. Have you been convicted of, or entered a plea of guilty or no contest to, or a criminal offense of possession of and or of drugs use?</Label>
                                            <Label>{drugRelatedOffence}</Label>
                                        </div>
                                        <div className="flex space-x-2 mb-1">
                                            <Label className="font-semibold">Offense details</Label>
                                            <Label>{drugRelatedOffenceType}</Label>
                                        </div>
                                        <div className="grid md:grid-cols-2 grid-cols-2 mb-2 gap-2">
                                        </div>
                                        <div className="space-y-2 mb-1">
                                            <Label className="font-semibold">3. Have you ever had a teaching license revoked, suspended, invalidated, cancelled or denied by any teaching council or any authority; surrendered such a license or the right to apply for such a license; or had any other adverse action taken against such a license. Please note that this includes a reprimand, warning, or reproval and any order denying the right to apply or reapply for a license?</Label>
                                            <Label>{licenseFlag}</Label>
                                        </div>
                                        {licenseFlag === 'yes' &&
                                        <div className="grid md:grid-cols-2 grid-cols-2 mb-2 gap-2">
                                            <div className="flex space-x-2">
                                                <Label className="font-semibold">Official documentation of the action taken:</Label>
                                                <Label>letter1.pdf</Label>
                                            </div>
                                        </div>}
                                        <div className="space-y-2 mb-1">
                                            <Label className="font-semibold">4. Are you currently the subject of any review, inquiry, investigation, or appeal of alleged misconduct that could warrant discipline or termination by your employer. Please note that this includes any open investigation by or pending proceeding with a child protection agency and any pending criminal charges?</Label>
                                            <Label>{misconductFlag}</Label>
                                        </div>
                                        {misconductFlag === 'yes' &&
                                        <div className="grid md:grid-cols-2 grid-cols-2 mb-2 gap-2">
                                            <div className="flex space-x-2">
                                                <Label className="font-semibold">Official documentation of the action taken:</Label>
                                                <Label>letter.pdf</Label>
                                            </div>
                                        </div>
                                        }
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-5">
                                    <AccordionTrigger>ATTACHMENTS</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="grid md:grid-cols-2 grid-cols-2 mb-2 gap-2">
                                            <div className="flex space-x-2">
                                                <Label className="font-semibold">Certified copy of OMANG or passport (for non-citizens)</Label>
                                                <Label>Omang.pdf</Label>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Label className="font-semibold">Verification of qualification from BQA.</Label>
                                                <Label>BQA.doc</Label>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Label className="font-semibold">Proof of payment of Registration fee.</Label>
                                                <Label>receipt.pdf</Label>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-5">
                                    <AccordionTrigger>DECLARATION</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="grid md:grid-cols-2 grid-cols-2 mb-2 gap-2">
                                            <div className="flex space-x-2">
                                                <Label className="font-semibold">Accept terms and conditions</Label>
                                                <Label>Yes</Label>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Label className="font-semibold">Profile Information</Label>
                                                <Label>Yes</Label>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            </div>
                        </ScrollArea>
                        </div>
                        </motion.div>             
                    )}
                    {/*COMPLETE*/}
                    {currentStep === 9 && applicationType !== 'student' && (
                        <motion.div
                            initial={{y: delta >= 0 ? '50%' : '-50%', opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{duration: 0.3, ease: 'easeInOut'}}
                        >
                        <div className="border md:h-96 p-2 rounded-lg mb-2 mr-1">
                            <ul className='list-disc pl-5 mt-1 text-sm leading-6 text-gray-600'>
                                <li>Processing of the application will be done within 30 days;</li>
                                <li>You will receive electronic feedback once your application has been processed;</li>
                                <li>Once registered and licensed, the teacher has full responsibility of ensuring it is
renewed before it expires in accordance with the Regulations.</li>
                            </ul>
                            <p className='mt-2 text-sm leading-6 text-gray-600'>
                                Thank you for your submission.
                            </p>
                        </div>
                        </motion.div>             
                    )}
                     {/* Navigation Buttons*/}
                    <div className='flex float-end space-x-2 mx-5'>
                        <button 
                            type="button" 
                            hidden={(applicationType === 'teacher' && (currentStep !== steps.length - 1)) || (applicationType === 'student' && (currentStep !== studentSteps.length - 1))}
                            onClick={onClose}
                            className="py-2 px-4 me-2 mb-0 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
                            >Close</button>
                            <button 
                            type="button" 
                            hidden={(applicationType === 'teacher' && (currentStep === 0 || currentStep === steps.length - 1)) || (applicationType === 'student' && (currentStep === 0 || currentStep === studentSteps.length - 1))}
                            className="py-2 px-4 me-2 mb-0 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
                            >Save</button>
                            <button 
                            type="button" 
                            onClick={prev}
                            hidden={(applicationType === 'teacher' && (currentStep === 0 || currentStep === steps.length - 1)) || (applicationType === 'student' && (currentStep === 0 || currentStep === studentSteps.length - 1))}
                            className="py-2 px-4 me-2 mb-0 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
                            >Prev</button>
                            <button 
                            type="button" 
                            hidden={(applicationType === 'teacher' && ((currentStep === steps.length - 1) || (currentStep === steps.length - 2) || (currentStep === steps.length - 1))) || (applicationType === 'student' && ((currentStep === studentSteps.length - 1) || (currentStep === studentSteps.length - 2) || (currentStep === studentSteps.length - 1)))}
                            onClick={next}
                            disabled={(applicationType === 'teacher' && currentStep === steps.length - 3 && (isProfileChecked === false || IsAgreement !== true )) || (applicationType === 'student' && currentStep === studentSteps.length - 4 && (isProfileChecked === false || IsAgreement !== true ))}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2 text-center"
                            >Next</button>
                            <button 
                            type="submit" 
                            hidden={(applicationType === 'teacher' && currentStep !== steps.length - 2) || (applicationType === 'student' && currentStep !== studentSteps.length - 2)}
                            disabled={isSubmitting} // Disable the button while submitting
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2 text-center"
                            >{isSubmitting? "Submitting...." : "Submit"}</button>
                    </div>
                </form>
                </Form>
            </div>
        </div>
    );
}