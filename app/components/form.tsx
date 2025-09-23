'use client'

import * as React from "react"
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormDataSchema } from '@/lib/schema'
import FileUpload from './file-upload'
import { processAttachments, submitTeacherRegistration } from '@/lib/teacher-registration'
import { Profile, TeacherRegistrationResponse} from '@/types/teacher-registration'
import QualificationsTable, { QualificationEntry } from './qualifications'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Check, ChevronsUpDown, FileText, Loader2 } from 'lucide-react'
import { countryList } from "@/types/countries"
import { cn } from "@/lib/utils"
import {  
  centralPrivatePrimarySchoolsForSelect, 
  centralPrivateSecondarySchoolsForSelect, 
  chobePrivatePrimarySchoolsForSelect, 
  chobePrivateSecondarySchoolsForSelect, 
  ghanziPrivatePrimarySchoolsForSelect, 
  ghanziPrivateSecondarySchoolsForSelect, 
  kgalagadiPrivatePrimarySchoolsForSelect, 
  kgalagadiPrivateSecondarySchoolsForSelect, 
  kgatlengPrivatePrimarySchoolsForSelect, 
  kgatlengPrivateSecondarySchoolsForSelect,
  kwenengPrivatePrimarySchoolsForSelect, 
  kwenengPrivateSecondarySchoolsForSelect, 
  northEastPrivatePrimarySchoolsForSelect, 
  northEastPrivateSecondarySchoolsForSelect, 
  northWestPrivatePrimarySchoolsForSelect, 
  northWestPrivateSecondarySchoolsForSelect, 
  southEastPrivatePrimarySchoolsForSelect, 
  southEastPrivateSecondarySchoolsForSelect, 
  southernPrivatePrimarySchoolsForSelect, 
  southernPrivateSecondarySchoolsForSelect } from "@/types/private_schools"
import {  
  centralPublicSchoolsForSelect, 
  chobePublicSchoolsForSelect, 
  ghanziPublicSchoolsForSelect, 
  kgalagadiPublicSchoolsForSelect, 
  kgatlengPublicSchoolsForSelect, 
  kwenengPublicSchoolsForSelect, 
  northEastPublicSchoolsForSelect, 
  northWestPublicSchoolsForSelect, 
  southEastPublicSchoolsForSelect, 
  southernPublicSchoolsForSelect } from "@/types/public_junior_schools"
import { 
  centralSeniorSecondarySchoolsForSelect, 
  chobeSeniorSecondarySchoolsForSelect, 
  ghanziSeniorSecondarySchoolsForSelect, 
  kgalagadiSeniorSecondarySchoolsForSelect, 
  kgatlengSeniorSecondarySchoolsForSelect, 
  kwenengSeniorSecondarySchoolsForSelect, 
  northEastSeniorSecondarySchoolsForSelect, 
  northWestSeniorSecondarySchoolsForSelect, 
  southEastSeniorSecondarySchoolsForSelect, 
  southernSeniorSecondarySchoolsForSelect } from "@/types/public_senior_school"
import { 
  allBotswanaQualificationsForSelect, 
  degreeForSelect, diplomasForSelect, 
  doctorateForSelect, 
  mastersForSelect } from "@/types/qualifications"
import { institutionForSelect } from "@/types/institution"
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger } from "@/components/ui/accordion"
import InfoItem from "./InfoItem"
import { Badge } from "@/components/ui/badge"
import {   
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,} from "@/components/ui/table"
import {   
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { 
  centralPrimarySchoolsForSelect, 
  chobePrimarySchoolsForSelect, 
  ghanziPrimarySchoolsForSelect, 
  kgalagadiPrimarySchoolsForSelect, 
  kgatlengPrimarySchoolsForSelect, 
  kwenengPrimarySchoolsForSelect, 
  northEastPrimarySchoolsForSelect, 
  northWestPrimarySchoolsForSelect, 
  southEastPrimarySchoolsForSelect, 
  southernPrimarySchoolsForSelect } from "@/types/primary_schools"
import { useDraft } from "@/lib/hooks/useDraft"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { useRouter } from "next/navigation"
import { useUserData } from "@/lib/hooks/useUserData"
import { subjectSpecializationForSelect } from "@/types/subjects_specialization"
import { getAccessGroups } from "../auth/auth"
import { AccessGroup } from "../lib/types"

//  PROD MESD_006_28_001
//  UAT MESD_006_08_054

type FormInputs = z.infer<typeof FormDataSchema>

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

interface UploadResponse {
  bucket: string
  extension: string
  'original-name': string
  key: string
}

const countries = countryList.map((country) => ({
  value: country,
  label: country,
}));

export default function Form() {
  // const {nationalId, passportId, userData} = useUserData();
  // const userId = nationalId || passportId || '';

  const [previousStep, setPreviousStep] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const delta = currentStep - previousStep

  const [nationalIdDoc, setNationalIdDoc] = useState<UploadResponse | null>(null)
  const [misconductFlagDetailsDoc, setMisconductFlagDetailsDoc] = useState<UploadResponse | null>(null)
  const [drugRelatedOffenceAttachmentsDoc, setDrugRelatedOffenceAttachmentsDoc] = useState<UploadResponse | null>(null)
  const [licenseFlagDetailsDoc, setLicenseFlagDetailsDoc] = useState<UploadResponse | null>(null)
  const [studentRelatedOffenceAttachmentDoc, setStudentRelatedOffenceAttachmentDoc] = useState<UploadResponse | null>(null)
  const [qualifications, setQualifications] = useState<QualificationEntry[]>([])
  const [mandatoryDoc,setMandatoryDoc] = useState<UploadResponse | null>(null) // Mandatory qualification attachment

  const [countryOpen, setCountryOpen] = React.useState(false)
  const [doctoralDegreeOpen, setDoctoralDegreeOpen] = React.useState(false) 
  const [degreeOpen, setDegreeOpen] = React.useState(false)
  const [honoursOpen, setHonoursOpen] = React.useState(false)
  const [diplomaOpen, setDiplomaOpen] = React.useState(false)
  const [mastersOpen, setMastersOpen] = React.useState(false)
  const [institutionOpen, setInstitutionOpen] = React.useState(false)
  const [seniorOpen, setSeniorOpen] = React.useState(false)
  const [juniorOpen, setJuniorOpen] = React.useState(false)
  const [primaryOpen, setPrimaryOpen] = React.useState(false)
  const [privateOpen, setPrivateOpen] = React.useState(false)
  const [subjectOpen, setSubjectOpen] = useState(false)
  const [postGradDiplomaOpen, setPostGradDiplomaOpen] = React.useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submittingDraft,setSubmittingDraft] = useState(false)
  const [submissionResult, setSubmissionResult] = useState<TeacherRegistrationResponse | null>(null)
  const { toast } = useToast();
  const router = useRouter()

  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchId = async () => {
      const result = await getAccessGroups();
      console.log(result)
      if (result) {
        setUserId(result.nationalId || result.passportId || result.userid);
      }
    };
    fetchId();
  }, []);

  const { saveDraft, loadDraft, updateDraft, updateDraftFields, updateDraftStatus, isLoading, error } = useDraft({
    userId: userId ?? '', 
    userName: 'system_user',
    formType: "Registration", 
    userRole: "Customer", 
  });
  const [fields, setFields] = useState<string[]>([])

  const getAPIFormatQualifications = () => {
    return qualifications
      .filter(q => q.alt_attachments)
      .map(q => ({
        alt_qualification: q.alt_qualification,
        alt_qualification_year: q.alt_qualification_year,
        alt_attachments: q.alt_attachments!
      }))
  }

  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    setValue,
    getValues,
    formState: { errors }
  } = useForm<FormInputs>({
    resolver: zodResolver(FormDataSchema),
    mode: 'onChange'
  })

  /**
   * Process and submit the form data
   * @param formData - Data from the form submission
   */
  const processForm: SubmitHandler<FormInputs> = async (formData) => {
    try{
      if(formData.citizenship.toLowerCase() === 'citizen'){
        formData.nationality = 'Botswana'
      }

      // Extract profile data from form
      const profile: Profile = {
        username: formData.username,
        first_name: formData.first_name,
        middle_name: formData.middle_name || "",
        last_name: formData.last_name || "", // Ensure last_name is included
        surname: formData.surname || formData.last_name,
        date_of_birth: formData.date_of_birth,
        citizenship: formData.citizenship,
        // primary_email: formData.primary_email,
        primary_phone: formData.primary_phone,
        primary_physical: formData.primary_physical,
        primary_postal: formData.primary_postal,
        gender: formData.gender,
        nationality: formData.nationality || "", // Ensure
        // marital_status: formData.marital_status
      }

      const processedAttachments = processAttachments(formData)

      const apiQualifications = getAPIFormatQualifications()

      const processedFormData = {
        ...formData,
        ...processedAttachments,
        qualifications: apiQualifications, 
        national_id_copy: nationalIdDoc,
        attachments: mandatoryDoc,
        student_related_offence_attachments: studentRelatedOffenceAttachmentDoc,
        misconduct_flag_details: misconductFlagDetailsDoc,
        drug_related_offence_attachments:  drugRelatedOffenceAttachmentsDoc,
        license_flag_details: licenseFlagDetailsDoc
      }
      const urlParams = new URLSearchParams(window.location.search);
      const draft_Id = urlParams.get('draftId');
      
      /**
       * Submit the registration form
       */
      const result = await submitTeacherRegistration(processedFormData, profile, draft_Id || '')
      setSubmissionResult(result)
      if (submissionResult?.success==true || result.success==true) {  

        /**
         * If submission is successful, update draft status to 'submitted'
         */
        await updateDraftStatus(draft_Id || '', 'submitted')
        
        setSubmitting(false)
        // reset()
      } else {
        setSubmitting(false)
        //alert('Registration failed. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }finally {
      setSubmitting(false)
    }
  }
  /**
   * Submit draft
   * @param formData 
   */
  const processDraft: SubmitHandler<FormInputs> = async (formData) => {
    try {
      setSubmittingDraft(true)
      const urlParams = new URLSearchParams(window.location.search);
      const draftIdFromUrl = urlParams.get('draftId');
      if(formData.citizenship.toLowerCase() === 'citizen'){
        formData.nationality = 'Botswana'
      }
      
      const profile: Profile = {
        username: formData.username,
        first_name: formData.first_name,
        middle_name: formData.middle_name || "",
        last_name: formData.last_name || "",
        surname: formData.surname || formData.last_name,
        date_of_birth: formData.date_of_birth,
        citizenship: formData.citizenship,
        primary_phone: formData.primary_phone,
        primary_physical: formData.primary_physical,
        primary_postal: formData.primary_postal,
        gender: formData.gender,
        nationality: formData.nationality || "",
      }
      
      const processedAttachments = processAttachments(formData)
      const apiQualifications = getAPIFormatQualifications()

      const processedFormData = {
        ...formData,
        ...processedAttachments,
        qualifications: qualifications,
        national_id_copy: nationalIdDoc,
        attachments: mandatoryDoc,
        student_related_offence_attachments: studentRelatedOffenceAttachmentDoc,
        misconduct_flag_details: misconductFlagDetailsDoc,
        drug_related_offence_attachments:  drugRelatedOffenceAttachmentsDoc,
        license_flag_details: licenseFlagDetailsDoc
      }
      let draft;
      if(draftIdFromUrl && draftIdFromUrl) {
        draft = await updateDraft(draftIdFromUrl, processedFormData, currentStep);
      }else {
        draft = await saveDraft(processedFormData);
      }
      // console.log(draft.id);
      if(draft && draft.id) {
        // If draft saved successfully, refresh the page to load the draft
        router.push(`/customer/dashboard/teacher-application?draftId=${draft.id}`)
      }
      toast({
        title: "Draft saved successfully",
        description: "You can continue your application later.",
        action: (
          <ToastAction altText="Ok">Ok</ToastAction>
        ),
      });

      setSubmittingDraft(false)
    } catch (error) {
      setSubmittingDraft(false)
      console.error('Error saving draft:', error);
      toast({
          title: "Error saving draft",
          description: "An error occurred while saving your draft. Please try again.",
          action: (
            <ToastAction altText="Ok">Ok</ToastAction>
          ),
        });
    }
  }

  // Function to save draft manually (e.g., on button click)
  const handleSaveDraft = async () => {
    const currentFormData = getValues(); // Get current form values
    await processDraft(currentFormData);
  }

  // Function to load existing draft on component mount
  // useEffect(() => {
  //   const loadExistingDraft = async () => {
  //     try {
  //       const draftData = await loadDraft();
  //       if (draftData) {
  //         // Reset form with draft data
  //         reset(draftData);
  //         console.log('Draft loaded successfully');
  //       }
  //     } catch (error) {
  //       console.error('Error loading draft:', error);
  //     }
  //   };

  //   loadExistingDraft();
  // }, [loadDraft, reset]);

  // Auto-save draft on form changes (debounced)
  // Auto-save draft on form changes (debounced)
  const watchedFields = watch();
  const citizenship = watch('citizenship');
  const gender = watch("gender")
  const nationality = watch("nationality")
  // Auto-save draft every 60 seconds if there are changes
  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const draftIdFromUrl = urlParams.get('draftId');
  //   const timer = setTimeout(async () => {
  //     // Only auto-save if there's meaningful content AND user has started filling the form
  //     const hasContent = watchedFields.first_name || 
  //                       watchedFields.last_name ||
  //                       watchedFields.username
      
  //     // Don't auto-save on initial load/empty form
  //     if (hasContent) {
  //       try {
  //         if(draftIdFromUrl) {
  //           // If draftId exists in URL, update existing draft
  //           await updateDraft(draftIdFromUrl, watchedFields, currentStep);
  //         } else {
  //           // Otherwise, create a new draft
  //           await saveDraft(watchedFields);
  //         }
  //         // console.log('Auto-saved draft');
  //       } catch (error) {
  //         console.error('Auto-save failed:', error);
  //       }
  //     }
  //   }, 30000); // 30 seconds debounce

  //   return () => clearTimeout(timer);
  // }, [watchedFields, saveDraft, updateDraft, currentStep]);

  /**
   * Load draft if draftId is present in URL
   * This effect runs only once on component mount
   */
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const draftIdFromUrl = urlParams.get('draftId');
  
    if (draftIdFromUrl) {
      const fetchDraft = async () => {
        const draftData = await loadDraft(draftIdFromUrl);
        setFields(draftData?.fields || [])
        setCurrentStep(draftData.currentStep || 0)
        if (draftData) {

          reset(draftData);
          setNationalIdDoc(draftData.national_id_copy || null) 
          setQualifications(draftData.qualifications || [])
          setStudentRelatedOffenceAttachmentDoc(draftData.student_related_offence_attachments || null)
          setDrugRelatedOffenceAttachmentsDoc(draftData.drug_related_offence_attachments || null)
          setLicenseFlagDetailsDoc(draftData.license_flag_details || null)
          setMisconductFlagDetailsDoc(draftData.misconduct_flag_details || null)
          setMandatoryDoc(draftData.attachments || null)

          /**
           * Clear fields that were requested to be corrected
           */
          if(draftData.status != 'correction' && draftData.fields && draftData.fields.length > 0){

            const handleFieldReset = (field: string) => {
              switch (field) {
                case 'national_id_copy':
                  if (draftData.national_id_copy) setNationalIdDoc(null);
                  break;
                case 'qualifications':
                  if (draftData.qualifications) setQualifications(draftData.qualifications || []);
                  break;
                case 'student_related_offence_attachment':
                  if (draftData.student_related_offence_attachment) setStudentRelatedOffenceAttachmentDoc(null);
                  break;
                case 'drug_related_offence_attachments':
                  if (draftData.drug_related_offence_attachments) setDrugRelatedOffenceAttachmentsDoc(null);
                  break;
                case 'license_flag_details_attachment':
                  if (draftData.license_flag_details_attachment) setLicenseFlagDetailsDoc(null);
                  break;
                case 'misconduct_flag_details_attachment':
                  if (draftData.misconduct_flag_details_attachment) setMisconductFlagDetailsDoc(null);
                  break;
                default:
                  // Clear the form field value
                  setValue(field as keyof FormInputs, '');
              }
            };

            draftData.fields.forEach((field: string) => {
              try {
                handleFieldReset(field);
              } catch (error) {
                console.error(`Error resetting field ${field}:`, error);
              }
            });

            // After resetting fields, update the draft to clear the fields array
            await updateDraft(draftIdFromUrl, watchedFields, currentStep);
            // Reset draft fields
            // await updateDraftFields(draftIdFromUrl, []);
            // Update draft status to 'correction'
            await updateDraftStatus(draftIdFromUrl, 'correction');
          }
        }
      };

      fetchDraft();
    }
  }, [loadDraft, reset, setValue, updateDraft]);

  type FieldName = keyof FormInputs

  const next = async () => {
    const fields = steps[currentStep].fields
    const output = await trigger(fields as FieldName[], { shouldFocus: true })

    if (!output) {
      console.log('Validation failed for step:', currentStep)
      return
    }

    if (currentStep < steps.length - 1) {
      setPreviousStep(currentStep)
      setCurrentStep(step => step + 1)
    }
  }

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep)
      setCurrentStep(step => step - 1)
    }
  }

  const submitDraft = async () => { 
    processDraft(getValues()) 
  }

  const submitForm = async () => {
    setSubmitting(true)
    // Validate all fields before submitting
    const isValid = await trigger()
    if (isValid) {
      const formData = getValues()
      processForm(formData) 
    } else {
      setSubmitting(false)
      alert('Please fill in all required fields correctly')
    }
  }

  return (
    <section className='bg-gray-50 md:p-2 max-h-screen'>
      <div className='max-w-9xl mx-auto flex gap-6'>
        {/* Left Sidebar - Header */}
        {/* <div className='w-80 flex-shrink-0 md:block hidden'>
          <div className='sticky top-4'>
            <TeacherRegistrationHeader />
          </div>
        </div> */}


        {/* Main Content */}
        <div className='flex-1 bg-white rounded-lg shadow-lg'>
          {fields.length > 0 && (
            <div className="rounded-md bg-red-50 border border-red-200 p-4 mb-4">
              <p className="text-sm text-red-800">
                <span className="font-medium">Please correct these fields:</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {fields.map((field, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200"
                  >
                    {field.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
          {/* Progress Steps */}
          <nav aria-label='Progress' className='md:px-6 py-6 border-b md:block hidden'>
            <ol role='list' className='space-y-4 md:flex md:space-x-8 md:space-y-0'>
              {steps.map((step, index) => (
                <li key={step.name} className='md:flex-1'>
                  {currentStep > index ? (
                    <div className='group flex w-full flex-col border-l-4 border-emerald-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                      <span className='text-sm font-medium text-emerald-600 transition-colors'>
                        {step.id}
                      </span>
                      <span className='text-sm font-medium'>{step.name}</span>
                    </div>
                  ) : currentStep === index ? (
                    <div
                      className='flex w-full flex-col border-l-4 border-blue-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'
                      aria-current='step'
                    >
                      <span className='text-sm font-medium text-blue-600'>
                        {step.id}
                      </span>
                      <span className='text-sm font-medium'>{step.name}</span>
                    </div>
                  ) : (
                    <div className='group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                      <span className='text-sm font-medium text-gray-500 transition-colors'>
                        {step.id}
                      </span>
                      <span className='text-sm font-medium'>{step.name}</span>
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          {/* Mobile Header */}
          <div className='md:hidden block w-full mb-4'>
            <div className='bg-white shadow-sm border-b p-4'>
              <h1 className='text-lg font-semibold text-gray-900'>
                Teacher Registration
              </h1>
              <p className='text-sm text-gray-600'>Complete your application</p>
            </div>
          </div>
          <ScrollArea className='md:h-[500px] p-4'>
            <form onSubmit={handleSubmit(processForm)}>
              {/* Step 1: Personal Information */}
              {currentStep === 0 && (
                <motion.div
                  initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>
                        Please provide your personal details for identification purposes.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4 sm:space-y-6 p-4 sm:p-6'>
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>  

                        {/* First Name */}
                        <div className="space-y-2">
                          <Label htmlFor='first_name' className="text-sm font-medium text-gray-700">
                            First Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id='first_name'
                            {...register('first_name')}
                            className='text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                            placeholder="Enter your first name"
                            disabled={submitting}
                          />
                          {errors.first_name && (
                            <p className='text-sm text-red-500 flex items-center gap-1'>
                              <span className="text-xs">⚠</span>
                              {errors.first_name.message}
                            </p>
                          )}
                        </div>

                        {/* Last Name */}
                        <div className="space-y-2">
                          <Label htmlFor='last_name' className="text-sm font-medium text-gray-700">
                            Last Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id='last_name'
                            {...register('last_name')}
                            className='text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                            placeholder="Enter your last name"
                          />
                          {errors.last_name && (
                            <p className='text-sm text-red-500 flex items-center gap-1'>
                              <span className="text-xs">⚠</span>
                              {errors.last_name.message}
                            </p>
                          )}
                        </div>

                        {/* Middle Name - Full width on mobile */}
                        <div className="space-y-2 sm:col-span-1">
                          <Label htmlFor='middle_name' className="text-sm font-medium text-gray-700">
                            Middle Name <span className="text-gray-400 text-xs">(Optional)</span>
                          </Label>
                          <Input
                            id='middle_name'
                            {...register('middle_name')}
                            className='text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                            placeholder="Enter your middle name"
                          />
                        </div>

                        {/* Citizenship */}
                        <div className="space-y-2">
                          <Label htmlFor='citizenship' className="text-sm font-medium text-gray-700">
                            Citizenship <span className="text-red-500">*</span>
                          </Label>
                          <Select 
                            value={citizenship}
                            onValueChange={(value) => {
                            setValue('citizenship', value);
                            setValue('nationality', value === 'citizen' ? 'botswana' : ''); // Reset
                            }}>
                            <SelectTrigger className='text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500'>
                              <SelectValue placeholder='Select your citizenship' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='citizen' className="text-base">Citizen</SelectItem>
                              <SelectItem value='non-citizen' className="text-base">Non-Citizen</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.citizenship && (
                            <p className='text-sm text-red-500 flex items-center gap-1'>
                              <span className="text-xs">⚠</span>
                              {errors.citizenship.message}
                            </p>
                          )}
                        </div>

                        {watch('citizenship') === 'non-citizen' && <div className='space-y-2'>
                            <Label htmlFor='nationality' className="text-sm font-medium text-gray-700">
                              Nationality <span className="text-red-500">*</span>
                            </Label>
                            <Popover 
                              open={countryOpen} 
                              onOpenChange={setCountryOpen}
                              
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={countryOpen}
                                  className="w-full justify-between text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                >
                                  {watch('nationality') || "Select your nationality"}
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput placeholder="Search nationality..." className="" />
                                  <CommandList>
                                    <CommandEmpty>No nationality found.</CommandEmpty>
                                    <CommandGroup>
                                      {countries.map((country) => (
                                        <CommandItem
                                          key={country.value}
                                          value={country.label || nationality}
                                          onSelect={(currentValue) => {
                                            setValue('nationality', currentValue === watch('nationality') ? "" : currentValue)
                                            setCountryOpen(false)
                                          }}
                                        >
                                          {country.label}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              watch('nationality') === country.label ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            {/* {countries.map((country) => (
                              <li key={country.value}>{country.value}-{country.label}</li>
                            ))} */}
                            {errors.nationality && (
                              <p className='text-sm text-red-500 flex items-center gap-1'>
                                <span className="text-xs">⚠</span>
                                {errors.nationality.message}
                              </p>
                          )}
                        </div>}

                        {/* National ID OR Passport*/}
                        <div className="space-y-2">
                          <Label htmlFor='username' className="text-sm font-medium text-gray-700">
                            National/Passport ID <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id='username'
                            {...register('username')}
                            className='text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                            placeholder="Enter your national/passport ID number"
                            inputMode="numeric"
                          />
                          {errors.username && (
                            <p className='text-sm text-red-500 flex items-center gap-1'>
                              <span className="text-xs">⚠</span>
                              {errors.username.message}
                            </p>
                          )}
                        </div>

                        {/* Date of Birth - Full width on mobile for better date picker */}
                        <div className="space-y-2 col-span-1 sm:col-span-1">
                          <Label htmlFor='date_of_birth' className="text-sm font-medium text-gray-700">
                            Date of Birth <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id='date_of_birth'
                            type='date'
                            {...register('date_of_birth')}
                            className='text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                          />
                          {errors.date_of_birth && (
                            <p className='text-sm text-red-500 flex items-center gap-1'>
                              <span className="text-xs">⚠</span>
                              {errors.date_of_birth.message}
                            </p>
                          )}
                        </div>

                        {/* Gender */}
                        <div className="space-y-2">
                          <Label htmlFor='gender' className="text-sm font-medium text-gray-700">
                            Gender <span className="text-red-500">*</span>
                          </Label>
                          <Select 
                          value={gender}
                          onValueChange={(value) => setValue('gender', value)}
                          >
                            <SelectTrigger className='text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500'>
                              <SelectValue placeholder='Select your gender' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='Male' className="text-base">Male</SelectItem>
                              <SelectItem value='Female' className="text-base">Female</SelectItem>
                              <SelectItem value='Other' className="text-base">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.gender && (
                            <p className='text-sm text-red-500 flex items-center gap-1'>
                              <span className="text-xs">⚠</span>
                              {errors.gender.message}
                            </p>
                          )}
                        </div>

                        {/* File Upload - Full width */}
                        <div className='col-span-1 sm:col-span-2 mt-4'>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                              National ID Copy <span className="text-red-500">*</span>
                            </Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                              <FileUpload
                                name="national_id_copy"
                                label="National ID Copy"
                                description="Omang copy"
                                acceptedTypes=".pdf,.jpg,.jpeg,.png"
                                maxSize={5}
                                required={true}
                                value={nationalIdDoc}
                                onChange={setNationalIdDoc}
                                error={errors.national_id_copy?.message}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Progress indicator for mobile */}
                      <div className="block sm:hidden mt-6 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Step 1 of 6</span>
                          <span>Personal Information</span>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{width: '16.67%'}}></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 2: Contact Information */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                      <CardDescription>
                        Please provide your contact details and addresses.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
                        {/* Primary Phone */}
                        <div className='space-y-2'>
                          <Label htmlFor='primary_phone'>Primary Phone *</Label>
                          <Input
                            id='primary_phone'
                            type='tel'
                            placeholder='e.g. +267 123 4567'
                            {...register('primary_phone')}
                            className='mt-1'
                          />
                          {errors.primary_phone && (
                            <p className='text-sm text-red-500 mt-1'>{errors.primary_phone.message}</p>
                          )}
                        </div>

                        {/* Primary Physical */} 
                        <div className='space-y-2'>
                          <Label htmlFor='primary_physical'>Physical Address *</Label>
                          <Textarea
                            id='primary_physical'
                            {...register('primary_physical')}
                            className='mt-1'
                            rows={3}
                            placeholder="Enter your physical address"
                          />
                          {errors.primary_physical && (
                            <p className='text-sm text-red-500 mt-1'>{errors.primary_physical.message}</p>
                          )}
                        </div>
                        
                        {/* Primary Postal */}
                        <div className='space-y-2'>
                          <Label htmlFor='primary_postal'>Postal Address *</Label>
                          <Textarea
                            id='primary_postal'
                            {...register('primary_postal')}
                            className='mt-1'
                            rows={3}
                            placeholder="Enter your postal address"
                          />
                          {errors.primary_postal && (
                            <p className='text-sm text-red-500 mt-1'>{errors.primary_postal.message}</p>
                          )}
                        </div>
                      </div>

                      {/* Progress indicator for mobile */}
                      <div className="block sm:hidden mt-6 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Step 2 of 6</span>
                          <span>Contact Information</span>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{width: '33.33%'}}></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 3: Professional Details */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Professional Details</CardTitle>
                      <CardDescription>
                        Please provide your professional and employment information.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                      {Object.keys(errors).length > 0 && (
                        <div className="relative bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <svg 
                                className="h-5 w-5 text-red-400" 
                                viewBox="0 0 20 20" 
                                fill="currentColor"
                              >
                                <path 
                                  fillRule="evenodd" 
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                                  clipRule="evenodd" 
                                />
                              </svg>
                            </div>
                            <div className="ml-3 flex-1">
                              <h3 className="text-sm font-medium text-red-800 mb-2">
                                Please correct the following errors:
                              </h3>
                              <div className="space-y-1">
                                {Object.entries(errors).map(([field, error]) => (
                                  <div key={field} className="flex items-center text-sm text-red-700">
                                    <span className="inline-block w-2 h-2 bg-red-400 rounded-full mr-2 flex-shrink-0"></span>
                                    <span className="font-medium capitalize">
                                      {field.replace(/_/g, ' ')}:
                                    </span>
                                    <span className="ml-1">
                                      {error?.message || 'This field is required'}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={() => {/* Add logic to clear errors or scroll to first error */}}
                            className="absolute top-3 right-3 text-red-400 hover:text-red-600 transition-colors"
                          >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path 
                                fillRule="evenodd" 
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                                clipRule="evenodd" 
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {/* Employment Status */}
                        <div className="space-y-2">
                          <Label htmlFor='work_status'>Employment Status *</Label>
                          <Select 
                          onValueChange={(value) => setValue('work_status', value)}
                          value={watch('work_status')}>
                            <SelectTrigger className='mt-1'>
                              <SelectValue placeholder='Select practice category' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='Employed'>Employed</SelectItem>
                              <SelectItem value='Unemployed'>Unemployed</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.work_status && (
                            <p className='text-sm text-red-500 mt-1'>{errors.work_status.message}</p>
                          )}
                        </div>
                        
                        {/* Practice Category */}
                        <div className="space-y-2">
                          <Label htmlFor='practice_category'>Practice Category *</Label>
                          <Select 
                          value={watch('practice_category')}
                          onValueChange={(value) => setValue('practice_category', value)}
                          >
                            <SelectTrigger className='mt-1'>
                              <SelectValue placeholder='Select school level that you are teaching e.g Pre-Primary' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='Pre-Primary'>Pre-Primary</SelectItem>
                              <SelectItem value='Primary'>Primary</SelectItem>
                              <SelectItem value='Secondary'>Secondary</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.practice_category && (
                            <p className='text-sm text-red-500 mt-1'>{errors.practice_category.message}</p>
                          )}
                        </div>

                        { /* Sub Category */}           
                        <div className="space-y-2">
                          <Label htmlFor='sub_category'>Sub Category *</Label>
                          <Select 
                          onValueChange={(value) => setValue('sub_category', value)}
                          value={watch('sub_category')}>
                            <SelectTrigger className='mt-1'>
                              <SelectValue placeholder='Select sub category' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='Teacher'>Teacher</SelectItem>
                              <SelectItem value='Teacher Aide'>Teacher Aide</SelectItem>
                              <SelectItem value='Tutor'>Tutor</SelectItem>
                              <SelectItem value='Special Education'>Special Education</SelectItem>
                              <SelectItem value='Educational Support Services'>Educational Support Services</SelectItem>
                              <SelectItem value='Education Administrator'>Education Administrator</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.sub_category && (
                            <p className='text-sm text-red-500 mt-1'>{errors.sub_category.message}</p>
                          )}
                        </div>
                        

                        {/* Experience Duration */}
                        <div className="space-y-2">
                          <Label htmlFor='experience_years'>Experience *</Label>
                          <Select 
                          onValueChange={(value) => setValue('experience_years', value)}
                          value={watch('experience_years')}>
                            <SelectTrigger className='mt-1'>
                              <SelectValue placeholder='Select teaching experience duration' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='Less than a year'>Less than a year</SelectItem>
                              <SelectItem value='1 to 5 years'>1 to 5 years</SelectItem>
                              <SelectItem value='6 to 10 years'>6 to 10 years</SelectItem>
                              <SelectItem value='More than 10 years'>More than 10 years</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.experience_years && (
                            <p className='text-sm text-red-500 mt-1'>{errors.experience_years.message}</p>
                          )}
                        </div>

                        {/* Region */}
                        <div className="space-y-2">
                          <Label htmlFor='district'>Region *</Label>
                          <Select 
                          onValueChange={(value) => setValue('district', value)}
                          value={watch('district')}>
                            <SelectTrigger className='mt-1'>
                              <SelectValue placeholder='Select district' />
                            </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='central'>Central</SelectItem>
                                <SelectItem value='chobe'>Chobe</SelectItem>
                                <SelectItem value='ghanzi'>Ghanzi</SelectItem>
                                <SelectItem value='kgalagadi'>Kgalagadi</SelectItem>
                                <SelectItem value='kgatleng'>Kgatleng</SelectItem>
                                <SelectItem value='kweneng'>Kweneng</SelectItem>
                                <SelectItem value='north-east'>North East</SelectItem>
                                <SelectItem value='north-west'>North West</SelectItem>
                                <SelectItem value='south-east'>South East</SelectItem>
                                <SelectItem value='southern'>Southern</SelectItem>
                              </SelectContent>
                          </Select>
                          {errors.district && (
                            <p className='text-sm text-red-500 mt-1'>{errors.district.message}</p>
                          )}
                        </div>

                        {/* Institution Type */}
                        {watch('work_status') === 'Employed' && <div className="space-y-2">
                          <Label className="text-base font-medium">Is the institution you are currently working at a public or private school?</Label>
                          <RadioGroup 
                            value={watch('institution_type')} 
                            onValueChange={(value) => {
                              setValue('institution_type', value);
                              setValue('school_level', ""); // Reset school level when changing type
                              setValue('private_schools', ""); // Reset private schools when changing type
                              setValue('primary_schools', ""); // Reset primary schools when changing type
                              setValue('junior_schools', ""); // Reset junior schools when changing type
                              setValue('senior_schools', ""); // Reset senior schools when changing type
                            }}
                            className="mt-3"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="public" id="institution-public" />
                              <Label htmlFor="institution-public">Public</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="private" id="institution-private" />
                              <Label htmlFor="institution-private">Private</Label>
                            </div>
                          </RadioGroup>
                          {errors.institution_type && (
                            <p className='text-sm text-red-500 mt-1'>{errors.institution_type.message}</p>
                          )}
                        </div>}

                        {/* School level */}
                        {<div className="space-y-2">
                          <Label htmlFor='school_level'>School Level *</Label>
                          <Select 
                          onValueChange={(value) => setValue('school_level', value)}
                          value={watch('school_level')}>
                            <SelectTrigger className='mt-1'>
                              <SelectValue placeholder='Select school level' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='pre-primary'>Pre-Primary</SelectItem>
                              <SelectItem value='primary'>Primary</SelectItem>
                              <SelectItem value='junior school'>Junior School</SelectItem>
                              <SelectItem value='senior school'>Senior Secondary</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.school_level && (
                            <p className='text-sm text-red-500 mt-1'>{errors.school_level.message}</p>
                          )}
                        </div>}

                        {/* Private school */}
                        {watch('institution_type') === 'private' && <div className='space-y-2'>
                            <Label htmlFor='private_schools' className="text-sm font-medium text-gray-700">
                              Private School <span className="text-red-500">*</span>
                            </Label>
                            <Popover open={privateOpen} onOpenChange={setPrivateOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={privateOpen}
                                  className="w-full justify-between text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                >
                                  {watch('private_schools') || "Select your school"}
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput placeholder="Search school..."/>
                                  <CommandList>
                                    <CommandEmpty>No school found.</CommandEmpty>
                                    <CommandGroup>
                                      {watch('school_level')?.toLowerCase() === 'primary' && watch('district').toLowerCase() === 'central' && centralPrivatePrimarySchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.label || watch('private_schools')}
                                          onSelect={(currentValue) => {
                                            setValue('private_schools', currentValue === watch('private_schools') ? "" : currentValue)
                                            setPrivateOpen(false)
                                          }}
                                        >
                                          {school.label}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              watch('private_schools') === school.label ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                      {watch('school_level')?.toLowerCase()  === 'primary' && watch('district')?.toLowerCase()  === 'chobe' && chobePrivatePrimarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.label}
                                        onSelect={(currentValue) => {
                                          setValue('private_schools', currentValue === watch('private_schools') ? "" : currentValue)
                                          setPrivateOpen(false)
                                        }}
                                      >
                                        {school.label}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            watch('private_schools') === school.label ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                      ))}
                                      {watch('school_level')?.toLowerCase()  === 'primary' && watch('district')?.toLowerCase()  === 'ghanzi' && ghanziPrivatePrimarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.label}
                                        onSelect={(currentValue) => {
                                          setValue('private_schools', currentValue === watch('private_schools') ? "" : currentValue)
                                          setPrivateOpen(false)
                                        }}
                                      >
                                        {school.label}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            watch('private_schools') === school.label ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                      ))}
                                      {watch('school_level')?.toLowerCase()  === 'primary' && watch('district')?.toLowerCase()  === 'kgalagadi' && kgalagadiPrivatePrimarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.label}
                                        onSelect={(currentValue) => {
                                          setValue('private_schools', currentValue === watch('private_schools') ? "" : currentValue)
                                          setPrivateOpen(false)
                                        }}
                                      >
                                        {school.label}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            watch('private_schools') === school.label ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                      ))}
                                      {watch('school_level')?.toLowerCase()  === 'primary' && watch('district')?.toLowerCase()  === 'kgatleng' && kgatlengPrivatePrimarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.label}
                                        onSelect={(currentValue) => {
                                          setValue('private_schools', currentValue === watch('private_schools') ? "" : currentValue)
                                          setPrivateOpen(false)
                                        }}
                                      >
                                        {school.label}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            watch('private_schools') === school.label ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                      ))}
                                      {watch('school_level')?.toLowerCase()  === 'primary' && watch('district')?.toLowerCase()  === 'kweneng' && kwenengPrivatePrimarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.label}
                                        onSelect={(currentValue) => {
                                          setValue('private_schools', currentValue === watch('private_schools') ? "" : currentValue)
                                          setPrivateOpen(false)
                                        }}
                                      >
                                        {school.label}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            watch('private_schools') === school.label ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                      ))}
                                      {watch('school_level')?.toLowerCase()  === 'primary' && watch('district')?.toLowerCase()  === 'north-east' && northEastPrivatePrimarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.label}
                                        onSelect={(currentValue) => {
                                          setValue('private_schools', currentValue === watch('private_schools') ? "" : currentValue)
                                          setPrivateOpen(false)
                                        }}
                                      >
                                        {school.label}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            watch('private_schools') === school.label ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                      ))}
                                      {watch('school_level')?.toLowerCase()  === 'primary' && watch('district')?.toLowerCase() === 'north-west' && northWestPrivatePrimarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.label}
                                        onSelect={(currentValue) => {
                                          setValue('private_schools', currentValue === watch('private_schools') ? "" : currentValue)
                                          setPrivateOpen(false)
                                        }}
                                      >
                                        {school.label}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            watch('private_schools') === school.label ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                      ))}
                                      {watch('school_level')?.toLowerCase()  === 'primary' && watch('district')?.toLowerCase() === 'south-east' && southEastPrivatePrimarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.label}
                                        onSelect={(currentValue) => {
                                          setValue('private_schools', currentValue === watch('private_schools') ? "" : currentValue)
                                          setPrivateOpen(false)
                                        }}
                                      >
                                        {school.label}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            watch('private_schools') === school.label ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                      ))}
                                      {watch('school_level')?.toLowerCase()  === 'primary' && watch('district')?.toLowerCase() === 'southern' && southernPrivatePrimarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.label}
                                        onSelect={(currentValue) => {
                                          setValue('private_schools', currentValue === watch('private_schools') ? "" : currentValue)
                                          setPrivateOpen(false)
                                        }}
                                      >
                                        {school.label}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            watch('private_schools') === school.label ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                      ))}
                                      {(watch('school_level')?.toLowerCase() === 'junior school' || watch('school_level')?.toLowerCase() === 'senior school') && watch('district')?.toLowerCase() === 'central' && centralPrivateSecondarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.label}
                                        onSelect={(currentValue) => {
                                          setValue('private_schools', currentValue === watch('private_schools') ? "" : currentValue)
                                          setPrivateOpen(false)
                                        }}
                                      >
                                        {school.label}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            watch('private_schools') === school.label ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                      ))}
                                      {(watch('school_level')?.toLowerCase() === 'junior school' || watch('school_level')?.toLowerCase() === 'senior school') && watch('district')?.toLowerCase() === 'chobe' && chobePrivateSecondarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.label}
                                        onSelect={(currentValue) => {
                                          setValue('private_schools', currentValue === watch('private_schools') ? "" : currentValue)
                                          setPrivateOpen(false)
                                        }}
                                      >
                                        {school.label}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            watch('private_schools') === school.label ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                      ))}
                                      {(watch('school_level')?.toLowerCase() === 'junior school' || watch('school_level')?.toLowerCase() === 'senior school') && watch('district')?.toLowerCase() === 'ghanzi' && ghanziPrivateSecondarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.label}
                                        onSelect={(currentValue) => {
                                          setValue('private_schools', currentValue === watch('private_schools') ? "" : currentValue)
                                          setPrivateOpen(false)
                                        }}
                                      >
                                        {school.label}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            watch('private_schools') === school.label ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                      ))}
                                      {(watch('school_level')?.toLowerCase() === 'junior school' || watch('school_level')?.toLowerCase() === 'senior school') && watch('district')?.toLowerCase() === 'kgalagadi' && kgalagadiPrivateSecondarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.label}
                                        onSelect={(currentValue) => {
                                          setValue('private_schools', currentValue === watch('private_schools') ? "" : currentValue)
                                          setPrivateOpen(false)
                                        }}
                                      >
                                        {school.label}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            watch('private_schools') === school.label ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                      ))}
                                      {(watch('school_level')?.toLowerCase() === 'junior school' || watch('school_level')?.toLowerCase() === 'senior school') && watch('district')?.toLowerCase() === 'kgatleng' && kgatlengPrivateSecondarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.label}
                                        onSelect={(currentValue) => {
                                          setValue('private_schools', currentValue === watch('private_schools') ? "" : currentValue)
                                          setPrivateOpen(false)
                                        }}
                                      >
                                        {school.label}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            watch('private_schools') === school.label ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                      ))}
                                      {(watch('school_level')?.toLowerCase() === 'junior school' || watch('school_level')?.toLowerCase() === 'senior school') && watch('district')?.toLowerCase() === 'kweneng' && kwenengPrivateSecondarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.label}
                                        onSelect={(currentValue) => {
                                          setValue('private_schools', currentValue === watch('private_schools') ? "" : currentValue)
                                          setPrivateOpen(false)
                                        }}
                                      >
                                        {school.label}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            watch('private_schools') === school.label ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                      ))}
                                      {(watch('school_level')?.toLowerCase() === 'junior school' || watch('school_level')?.toLowerCase() === 'senior school') && watch('district')?.toLowerCase() === 'north-east' && northEastPrivateSecondarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.label}
                                        onSelect={(currentValue) => {
                                          setValue('private_schools', currentValue === watch('private_schools') ? "" : currentValue)
                                          setPrivateOpen(false)
                                        }}
                                      >
                                        {school.label}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            watch('private_schools') === school.label ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                      ))}
                                      {(watch('school_level')?.toLowerCase() === 'junior school' || watch('school_level')?.toLowerCase() === 'senior school') && watch('district')?.toLowerCase() === 'north-west' && northWestPrivateSecondarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.label}
                                        onSelect={(currentValue) => {
                                          setValue('private_schools', currentValue === watch('private_schools') ? "" : currentValue)
                                          setPrivateOpen(false)
                                        }}
                                      >
                                        {school.label}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            watch('private_schools') === school.label ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                      ))}
                                      {(watch('school_level')?.toLowerCase() === 'junior school' || watch('school_level')?.toLowerCase() === 'senior school') && watch('district')?.toLowerCase() === 'south-east' && southEastPrivateSecondarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.label}
                                        onSelect={(currentValue) => {
                                          setValue('private_schools', currentValue === watch('private_schools') ? "" : currentValue)
                                          setPrivateOpen(false)
                                        }}
                                      >
                                        {school.label}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            watch('private_schools') === school.label ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                      ))}
                                      {(watch('school_level')?.toLowerCase() === 'junior school' || watch('school_level')?.toLowerCase() === 'senior school') && watch('district')?.toLowerCase() === 'southern' && southernPrivateSecondarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.label}
                                        onSelect={(currentValue) => {
                                          setValue('private_schools', currentValue === watch('private_schools') ? "" : currentValue)
                                          setPrivateOpen(false)
                                        }}
                                      >
                                        {school.label}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            watch('private_schools') === school.label ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            {errors.private_schools && (
                              <p className='text-sm text-red-500 flex items-center gap-1'>
                                <span className="text-xs">⚠</span>
                                {errors.private_schools.message}
                              </p>
                          )}
                        </div>}

                        {/* Primary school */}
                        {watch('school_level') === 'primary' && watch('institution_type') === 'public' && <div className='space-y-2'>
                            <Label htmlFor='primary_schools' className="text-sm font-medium text-gray-700">
                              Primary School <span className="text-red-500">*</span>
                            </Label>
                            <Popover open={primaryOpen} onOpenChange={setPrimaryOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={primaryOpen}
                                  className="w-full justify-between text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                >
                                  {watch('primary_schools') || "Select your school"}
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput placeholder="Search school..."/>
                                  <CommandList>
                                    <CommandEmpty>No school found.</CommandEmpty>
                                    <CommandGroup>
                                      {watch('school_level') === 'primary' && watch('district') === 'central' && centralPrimarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.label || watch('primary_schools')}
                                        onSelect={(currentValue) => {
                                          setValue('primary_schools', currentValue === watch('primary_schools') ? "" : currentValue)
                                          setPrimaryOpen(false)
                                        }}
                                      >
                                        {school.label}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            watch('primary_schools') === school.label ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                      ))}
                                      {watch('district') === 'chobe' && chobePrimarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.label}
                                        onSelect={(currentValue) => {
                                          setValue('primary_schools', currentValue === watch('primary_schools') ? "" : currentValue)
                                          setPrimaryOpen(false)
                                        }}
                                      >
                                        {school.label}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            watch('primary_schools') === school.label ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                      ))}
                                      {watch('district') === 'ghanzi' && ghanziPrimarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.label}
                                        onSelect={(currentValue) => {
                                          setValue('primary_schools', currentValue === watch('primary_schools') ? "" : currentValue)
                                          setPrimaryOpen(false)
                                        }}
                                      >
                                        {school.label}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            watch('primary_schools') === school.label ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                      ))}
                                      {watch('district') === 'kgalagadi' && kgalagadiPrimarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.label}
                                        onSelect={(currentValue) => {
                                          setValue('primary_schools', currentValue === watch('primary_schools') ? "" : currentValue)
                                          setPrimaryOpen(false)
                                        }}
                                      >
                                        {school.label}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            watch('primary_schools') === school.label ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                      ))}
                                      {watch('district') === 'kgatleng' && kgatlengPrimarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.label}
                                        onSelect={(currentValue) => {
                                          setValue('primary_schools', currentValue === watch('primary_schools') ? "" : currentValue)
                                          setPrimaryOpen(false)
                                        }}
                                      >
                                        {school.label}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            watch('primary_schools') === school.label ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                      ))}
                                      {watch('district') === 'kweneng' && kwenengPrimarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.label}
                                        onSelect={(currentValue) => {
                                          setValue('primary_schools', currentValue === watch('primary_schools') ? "" : currentValue)
                                          setPrimaryOpen(false)
                                        }}
                                      >
                                        {school.label}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            watch('primary_schools') === school.label ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                      ))}
                                      {watch('district') === 'north-east' && northEastPrimarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.label}
                                        onSelect={(currentValue) => {
                                          setValue('primary_schools', currentValue === watch('primary_schools') ? "" : currentValue)
                                          setPrimaryOpen(false)
                                        }}
                                      >
                                        {school.label}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            watch('primary_schools') === school.label ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                      ))}
                                      { watch('district') === 'north-west' && northWestPrimarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.label}
                                        onSelect={(currentValue) => {
                                          setValue('primary_schools', currentValue === watch('primary_schools') ? "" : currentValue)
                                          setPrimaryOpen(false)
                                        }}
                                      >
                                        {school.label}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            watch('primary_schools') === school.label ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                      ))}
                                      {watch('district') === 'south-east' && southEastPrimarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.label}
                                        onSelect={(currentValue) => {
                                          setValue('primary_schools', currentValue === watch('primary_schools') ? "" : currentValue)
                                          setPrimaryOpen(false)
                                        }}
                                      >
                                        {school.label}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            watch('primary_schools') === school.label ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                      ))}
                                      {watch('district') === 'southern' && southernPrimarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.label}
                                        onSelect={(currentValue) => {
                                          setValue('primary_schools', currentValue === watch('primary_schools') ? "" : currentValue)
                                          setPrimaryOpen(false)
                                        }}
                                      >
                                        {school.label}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            watch('primary_schools') === school.label ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            {errors.primary_schools && (
                              <p className='text-sm text-red-500 flex items-center gap-1'>
                                <span className="text-xs">⚠</span>
                                {errors.primary_schools.message}
                              </p>
                          )}
                        </div>}

                        {/* Other Primary Schools */}
                        {watch('other_primary_schools') === 'Other' && watch('institution_type') === 'public' && <div className="space-y-2">
                          <Label htmlFor='other_primary_schools'>Other Primary School *</Label>
                          <Input
                            id='other_primary_schools'
                            {...register('other_primary_schools')}
                            className='mt-1'
                          />
                          {errors.other_junior_schools && (
                            <p className='text-sm text-red-500 mt-1'>{errors.other_junior_schools.message}</p>
                          )}
                        </div>}

                        {/* Junior school */}
                        {watch('school_level') === 'junior school' && watch('institution_type') === 'public' && <div className='space-y-2'>
                            <Label htmlFor='junior_schools' className="text-sm font-medium text-gray-700">
                              Junior School <span className="text-red-500">*</span>
                            </Label>
                            <Popover open={juniorOpen} onOpenChange={setJuniorOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={juniorOpen}
                                  className="w-full justify-between text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                >
                                  {watch('junior_schools') || "Select your school"}
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput placeholder="Search school..." />
                                  <CommandList>
                                    <CommandEmpty>No school found.</CommandEmpty>
                                    <CommandGroup>
                                      {watch('district') == 'central' && centralPublicSchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.label || watch('junior_schools')}
                                          onSelect={(currentValue) => {
                                            setValue('junior_schools', currentValue === watch('junior_schools') ? "" : currentValue)
                                            setJuniorOpen(false)
                                          }}
                                        >
                                          {school.label}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              watch('junior_schools') === school.label ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                      {watch('district') == 'chobe' && chobePublicSchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.label}
                                          onSelect={(currentValue) => {
                                            setValue('junior_schools', currentValue === watch('junior_schools') ? "" : currentValue)
                                            setJuniorOpen(false)
                                          }}
                                        >
                                          {school.label}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              watch('junior_schools') === school.label ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                      {watch('district') == 'ghanzi' && ghanziPublicSchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.label}
                                          onSelect={(currentValue) => {
                                            setValue('junior_schools', currentValue === watch('junior_schools') ? "" : currentValue)
                                            setJuniorOpen(false)
                                          }}
                                        >
                                          {school.label}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              watch('junior_schools') === school.label ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                      {watch('district') == 'kgalagadi' && kgalagadiPublicSchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.label}
                                          onSelect={(currentValue) => {
                                            setValue('junior_schools', currentValue === watch('junior_schools') ? "" : currentValue)
                                            setJuniorOpen(false)
                                          }}
                                        >
                                          {school.label}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              watch('junior_schools') === school.label ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                      {watch('district') == 'kgatleng' && kgatlengPublicSchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.label}
                                          onSelect={(currentValue) => {
                                            setValue('junior_schools', currentValue === watch('junior_schools') ? "" : currentValue)
                                            setJuniorOpen(false)
                                          }}
                                        >
                                          {school.label}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              watch('junior_schools') === school.label ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                      {watch('district') == 'kweneng' && kwenengPublicSchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.label}
                                          onSelect={(currentValue) => {
                                            setValue('junior_schools', currentValue === watch('junior_schools') ? "" : currentValue)
                                            setJuniorOpen(false)
                                          }}
                                        >
                                          {school.label}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              watch('junior_schools') === school.label ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                      {watch('district') == 'north-east' && northEastPublicSchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.label}
                                          onSelect={(currentValue) => {
                                            setValue('junior_schools', currentValue === watch('junior_schools') ? "" : currentValue)
                                            setJuniorOpen(false)
                                          }}
                                        >
                                          {school.label}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              watch('junior_schools') === school.label ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                      {watch('district') == 'north-west' && northWestPublicSchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.label}
                                          onSelect={(currentValue) => {
                                            setValue('junior_schools', currentValue === watch('junior_schools') ? "" : currentValue)
                                            setJuniorOpen(false)
                                          }}
                                        >
                                          {school.label}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              watch('junior_schools') === school.label ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                      {watch('district') == 'south-east' && southEastPublicSchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.label}
                                          onSelect={(currentValue) => {
                                            setValue('junior_schools', currentValue === watch('junior_schools') ? "" : currentValue)
                                            setJuniorOpen(false)
                                          }}
                                        >
                                          {school.label}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              watch('junior_schools') === school.label ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                      {watch('district') == 'southern' && southernPublicSchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.label}
                                          onSelect={(currentValue) => {
                                            setValue('junior_schools', currentValue === watch('junior_schools') ? "" : currentValue)
                                            setJuniorOpen(false)
                                          }}
                                        >
                                          {school.label}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              watch('junior_schools') === school.label ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            {errors.junior_schools && (
                              <p className='text-sm text-red-500 flex items-center gap-1'>
                                <span className="text-xs">⚠</span>
                                {errors.junior_schools.message}
                              </p>
                          )}
                        </div>}

                        {/* Other Junior Schools */}
                        {watch('other_junior_schools') === 'Other' && watch('institution_type') === 'public' && <div className="space-y-2">
                          <Label htmlFor='other_junior_schools'>Other Junior School *</Label>
                          <Input
                            id='other_junior_schools'
                            {...register('other_junior_schools')}
                            className='mt-1'
                          />
                          {errors.other_junior_schools && (
                            <p className='text-sm text-red-500 mt-1'>{errors.other_junior_schools.message}</p>
                          )}
                        </div>}

                        {/* Senior school */}
                        {watch('school_level') === 'senior school' && watch('institution_type') === 'public' && <div className='space-y-2'>
                            <Label htmlFor='senior_schools' className="text-sm font-medium text-gray-700">
                              Senior School <span className="text-red-500">*</span>
                            </Label>
                            <Popover open={seniorOpen} onOpenChange={setSeniorOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={seniorOpen}
                                  className="w-full justify-between text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                >
                                  {watch('senior_schools') || "Select your school"}
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput placeholder="Search school..."/>
                                  <CommandList>
                                    <CommandEmpty>No school found.</CommandEmpty>
                                    <CommandGroup>
                                      {watch('district') === "central" && centralSeniorSecondarySchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.label || watch('senior_schools')}
                                          onSelect={(currentValue) => {
                                            setValue('senior_schools', currentValue === watch('senior_schools') ? "" : currentValue)
                                            setSeniorOpen(false)
                                          }}
                                        >
                                          {school.label}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              watch('senior_schools') === school.label ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                      {watch('district') === "chobe" && chobeSeniorSecondarySchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.label  || watch('senior_schools')}
                                          onSelect={(currentValue) => {
                                            setValue('senior_schools', currentValue === watch('senior_schools') ? "" : currentValue)
                                            setSeniorOpen(false)
                                          }}
                                        >
                                          {school.label}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              watch('senior_schools') === school.label ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                      {watch('district') === "ghanzi" && ghanziSeniorSecondarySchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.label || watch('senior_schools')}
                                          onSelect={(currentValue) => {
                                            setValue('senior_schools', currentValue === watch('senior_schools') ? "" : currentValue)
                                            setSeniorOpen(false)
                                          }}
                                        >
                                          {school.label}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              watch('senior_schools') === school.label ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                      {watch('district') === "ghanzi" && ghanziSeniorSecondarySchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.label || watch('senior_schools')}
                                          onSelect={(currentValue) => {
                                            setValue('senior_schools', currentValue === watch('senior_schools') ? "" : currentValue)
                                            setSeniorOpen(false)
                                          }}
                                        >
                                          {school.label}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              watch('senior_schools') === school.label ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                      {watch('district') === "kgalagadi" && kgalagadiSeniorSecondarySchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.label || watch('senior_schools')}
                                          onSelect={(currentValue) => {
                                            setValue('senior_schools', currentValue === watch('senior_schools') ? "" : currentValue)
                                            setSeniorOpen(false)
                                          }}
                                        >
                                          {school.label}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              watch('senior_schools') === school.label ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                      {watch('district') === "kgatleng" && kgatlengSeniorSecondarySchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.label || watch('senior_schools')}
                                          onSelect={(currentValue) => {
                                            setValue('senior_schools', currentValue === watch('senior_schools') ? "" : currentValue)
                                            setSeniorOpen(false)
                                          }}
                                        >
                                          {school.label}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              watch('senior_schools') === school.label ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                      {watch('district') === "kweneng" && kwenengSeniorSecondarySchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.label || watch('senior_schools')}
                                          onSelect={(currentValue) => {
                                            setValue('senior_schools', currentValue === watch('senior_schools') ? "" : currentValue)
                                            setSeniorOpen(false)
                                          }}
                                        >
                                          {school.label}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              watch('senior_schools') === school.label ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                      {watch('district') === "north-east" && northEastSeniorSecondarySchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.label || watch('senior_schools')}
                                          onSelect={(currentValue) => {
                                            setValue('senior_schools', currentValue === watch('senior_schools') ? "" : currentValue)
                                            setSeniorOpen(false)
                                          }}
                                        >
                                          {school.label}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              watch('senior_schools') === school.label ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                      {watch('district') === "north-west" && northWestSeniorSecondarySchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.label || watch('senior_schools')}
                                          onSelect={(currentValue) => {
                                            setValue('senior_schools', currentValue === watch('senior_schools') ? "" : currentValue)
                                            setSeniorOpen(false)
                                          }}
                                        >
                                          {school.label}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              watch('senior_schools') === school.label ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                      {watch('district') === "south-east" && southEastSeniorSecondarySchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.label || watch('senior_schools')}
                                          onSelect={(currentValue) => {
                                            setValue('senior_schools', currentValue === watch('senior_schools') ? "" : currentValue)
                                            setSeniorOpen(false)
                                          }}
                                        >
                                          {school.label}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              watch('senior_schools') === school.label ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                      {watch('district') === "southern" && southernSeniorSecondarySchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.label || watch('senior_schools')}
                                          onSelect={(currentValue) => {
                                            setValue('senior_schools', currentValue === watch('senior_schools') ? "" : currentValue)
                                            setSeniorOpen(false)
                                          }}
                                        >
                                          {school.label}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              watch('senior_schools') === school.label ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            {errors.senior_schools && (
                              <p className='text-sm text-red-500 flex items-center gap-1'>
                                <span className="text-xs">⚠</span>
                                {errors.senior_schools.message}
                              </p>
                          )}
                        </div>}

                        {/* Other Senior Schools */}
                        {watch('senior_schools') === 'Other' && watch('institution_type') === 'public' && <div className="space-y-2">
                          <Label htmlFor='other_senior_schools'>Other Senior School *</Label>
                          <Input
                            id='other_senior_schools'
                            {...register('other_senior_schools')}
                            className='mt-1'
                          />
                          {errors.other_senior_schools && (
                            <p className='text-sm text-red-500 mt-1'>{errors.other_senior_schools.message}</p>
                          )}
                        </div>}

                      </div>

                      {/* Progress indicator for mobile */}
                      <div className="block sm:hidden mt-6 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Step 3 of 6</span>
                          <span>Professional Details</span>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{width: '50%'}}></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 4: Qualifications */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Qualifications</CardTitle>
                      <CardDescription>
                        Please provide details about your educational qualifications.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                      {Object.keys(errors).length > 0 && (
                        <div className="relative bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <svg 
                                className="h-5 w-5 text-red-400" 
                                viewBox="0 0 20 20" 
                                fill="currentColor"
                              >
                                <path 
                                  fillRule="evenodd" 
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                                  clipRule="evenodd" 
                                />
                              </svg>
                            </div>
                            <div className="ml-3 flex-1">
                              <h3 className="text-sm font-medium text-red-800 mb-2">
                                Please correct the following errors:
                              </h3>
                              <div className="space-y-1">
                                {Object.entries(errors).map(([field, error]) => (
                                  <div key={field} className="flex items-center text-sm text-red-700">
                                    <span className="inline-block w-2 h-2 bg-red-400 rounded-full mr-2 flex-shrink-0"></span>
                                    <span className="font-medium capitalize">
                                      {field.replace(/_/g, ' ')}:
                                    </span>
                                    <span className="ml-1">
                                      {error?.message || 'This field is required'}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={() => {/* Add logic to clear errors or scroll to first error */}}
                            className="absolute top-3 right-3 text-red-400 hover:text-red-600 transition-colors"
                          >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path 
                                fillRule="evenodd" 
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                                clipRule="evenodd" 
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        
                        {/* Level */}
                        <div className='space-y-2'>
                          <Label htmlFor='level'>Teaching Qualification Level*</Label>
                          <Select onValueChange={(value) => {
                            setValue('level', value);
                            // Reset all qualification-related fields
                            setValue('qualification_certificate', '');
                            setValue('qualification_diploma', '');
                            setValue('qualification_post_grad_diploma', '');
                            setValue('qualification_degree', '');
                            setValue('qualification_degree_honours', '');
                            setValue('qualification_masters_degree', '');
                            setValue('qualification_doctoral_degree', '');
                            setValue('other_qualification', '');
                          }}
                          value={watch('level')}>
                            <SelectTrigger className='mt-1'>
                              <SelectValue placeholder='Select level' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='Certificate'>Certificate</SelectItem>
                              <SelectItem value='Diploma'>Diploma</SelectItem>
                              <SelectItem value='Post-Graduate Diploma'>Post-Graduate Diploma</SelectItem>
                              <SelectItem value="Bachelor's Degree">Bachelor&apos;s Degree</SelectItem>
                              <SelectItem value="Bachelor's Degree Honours">Bachelor&apos;s Degree Honours</SelectItem>
                              <SelectItem value="Master's Degree">Master&apos;s Degree</SelectItem>
                              <SelectItem value="Doctoral Degree">Doctoral&apos;s Degree</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.level && (
                            <p className='text-sm text-red-500 mt-1'>{errors.level.message}</p>
                          )}
                        </div>

                        {/* Doctoral Degree */}
                        {watch('level') === "Doctoral Degree" && <div className='space-y-2'>
                            <Label htmlFor='qualification_doctoral_degree' className="text-sm font-medium text-gray-700">
                              Doctoral Degree<span className="text-red-500">*</span>
                            </Label>
                            <Popover open={doctoralDegreeOpen} onOpenChange={setDoctoralDegreeOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={doctoralDegreeOpen}
                                  className="w-full justify-between text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                >
                                  {watch('qualification_doctoral_degree') || "Select your Degree"}
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput placeholder="Search degree..."/>
                                  <CommandList>
                                    <CommandEmpty>No degree found.</CommandEmpty>
                                    <CommandGroup>
                                      {doctorateForSelect.map((doctorate) => (
                                        <CommandItem
                                          key={doctorate.value}
                                          value={doctorate.label || watch('qualification_doctoral_degree')}
                                          onSelect={(currentValue) => {
                                            setValue('qualification_doctoral_degree', currentValue === watch('qualification_doctoral_degree') ? "" : currentValue)
                                            setDoctoralDegreeOpen(false)
                                          }}
                                        >
                                          {doctorate.label}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              watch('qualification_doctoral_degree') === doctorate.label ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            {errors.qualification_doctoral_degree && (
                              <p className='text-sm text-red-500 flex items-center gap-1'>
                                <span className="text-xs">⚠</span>
                                {errors.qualification_doctoral_degree.message}
                              </p>
                          )}
                        </div>}

                        {/* Master's Degree */}
                        {watch('level') === "Master's Degree" && <div className='space-y-2'>
                            <Label htmlFor='qualification_masters_degree' className="text-sm font-medium text-gray-700">
                              Master&apos;s Degree<span className="text-red-500">*</span>
                            </Label>
                            <Popover open={mastersOpen} onOpenChange={setMastersOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={mastersOpen}
                                  className="w-full justify-between text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                >
                                  {watch('qualification_masters_degree') || "Search your master's degree"}
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput placeholder="Search degree..."/>
                                  <CommandList>
                                    <CommandEmpty>No Master&apos;s Degree found.</CommandEmpty>
                                    <CommandGroup>
                                      {mastersForSelect.map((masters) => (
                                        <CommandItem
                                          key={masters.value}
                                          value={masters.label}
                                          onSelect={(currentValue) => {
                                            setValue('qualification_masters_degree', currentValue === watch('qualification_masters_degree') ? "" : currentValue)
                                            setMastersOpen(false)
                                          }}
                                        >
                                          {masters.label}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              watch('qualification_masters_degree') === masters.label ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            {errors.qualification_masters_degree && (
                              <p className='text-sm text-red-500 flex items-center gap-1'>
                                <span className="text-xs">⚠</span>
                                {errors.qualification_masters_degree.message}
                              </p>
                          )}
                        </div>}

                        {/* Bachelor's Degree Honours */}
                        {watch('level') === "Bachelor's Degree Honours" && <div className='space-y-2'>
                            <Label htmlFor='qualification_degree' className="text-sm font-medium text-gray-700">
                              Bachelor&apos;s Degree Honours<span className="text-red-500">*</span>
                            </Label>
                            <Popover open={honoursOpen} onOpenChange={setHonoursOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={honoursOpen}
                                  className="w-full justify-between text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                >
                                  {watch('qualification_degree_honours') || "Select your Degree"}
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput placeholder="Search degree..." />
                                  <CommandList>
                                    <CommandEmpty>No Honour&apos;s degree found.</CommandEmpty>
                                    <CommandGroup>
                                      {degreeForSelect.map((degree) => (
                                        <CommandItem
                                          key={degree.value}
                                          value={degree.label || watch('qualification_degree_honours')}
                                          onSelect={(currentValue) => {
                                            setValue('qualification_degree_honours', currentValue === watch('qualification_degree_honours') ? "" : currentValue)
                                            setHonoursOpen(false)
                                          }}
                                        >
                                          {degree.label}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              watch('qualification_degree_honours') === degree.label ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            {errors.qualification_degree_honours && (
                              <p className='text-sm text-red-500 flex items-center gap-1'>
                                <span className="text-xs">⚠</span>
                                {errors.qualification_degree_honours.message}
                              </p>
                          )}
                        </div>}

                        {/* Diploma */}
                        {watch('level') === 'Diploma' && <div className='space-y-2'>
                            <Label htmlFor='qualification_diploma' className="text-sm font-medium text-gray-700">
                              Diploma <span className="text-red-500">*</span>
                            </Label>
                            <Popover open={diplomaOpen} onOpenChange={setDiplomaOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={diplomaOpen}
                                  className="w-full justify-between text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                >
                                  {watch('qualification_diploma') || "Select your diploma"}
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput placeholder="Search diploma..." />
                                  <CommandList>
                                    <CommandEmpty>No diploma found.</CommandEmpty>
                                    <CommandGroup>
                                      {diplomasForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.label || watch('qualification_diploma')}
                                          onSelect={(currentValue) => {
                                            setValue('qualification_diploma', currentValue === watch('qualification_diploma') ? "" : currentValue)
                                            setDiplomaOpen(false)
                                          }}
                                        >
                                          {school.label}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              watch('qualification_diploma') === school.label ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            {errors.qualification_diploma && (
                              <p className='text-sm text-red-500 flex items-center gap-1'>
                                <span className="text-xs">⚠</span>
                                {errors.qualification_diploma.message}
                              </p>
                          )}
                        </div>}

                        {/* Post-Graduate Diploma */}
                        {watch('level') === 'Post-Graduate Diploma' && <div className='space-y-2'>
                            <Label htmlFor='qualification_post_grad_diploma' className="text-sm font-medium text-gray-700">
                              Post-Graduate Diploma <span className="text-red-500">*</span>
                            </Label>
                            <Popover open={postGradDiplomaOpen} onOpenChange={setPostGradDiplomaOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={postGradDiplomaOpen}
                                  className="w-full justify-between text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                >
                                  {watch('qualification_post_grad_diploma') || "Select your diploma"}
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput placeholder="Search post grad diploma..." />
                                  <CommandList>
                                    <CommandEmpty>No post grad diploma found.</CommandEmpty>
                                    <CommandGroup>
                                      {allBotswanaQualificationsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.label || watch('qualification_post_grad_diploma')}
                                          onSelect={(currentValue) => {
                                            setValue('qualification_post_grad_diploma', currentValue === watch('qualification_post_grad_diploma') ? "" : currentValue)
                                            setPostGradDiplomaOpen(false)
                                          }}
                                        >
                                          {school.label}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              watch('qualification_post_grad_diploma') === school.label ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            {errors.qualification_post_grad_diploma && (
                              <p className='text-sm text-red-500 flex items-center gap-1'>
                                <span className="text-xs">⚠</span>
                                {errors.qualification_post_grad_diploma.message}
                              </p>
                          )}
                        </div>}

                        {/* Bachelor's Degree */}
                        {watch('level') === "Bachelor's Degree" && <div className='space-y-2'>
                            <Label htmlFor='qualification_degree' className="text-sm font-medium text-gray-700">
                              Bachelor&apos;s Degree <span className="text-red-500">*</span>
                            </Label>
                            <Popover open={degreeOpen} onOpenChange={setDegreeOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={degreeOpen}
                                  className="w-full justify-between text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                >
                                  {watch('qualification_degree') || "Select your Bachelor's Degree"}
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput placeholder="Search degree..." />
                                  <CommandList>
                                    <CommandEmpty>No bachelor&apos;s degree found.</CommandEmpty>
                                    <CommandGroup>
                                      {degreeForSelect.map((degree) => (
                                        <CommandItem
                                          key={degree.value}
                                          value={degree.label || watch('qualification_degree')}
                                          onSelect={(currentValue) => {
                                            setValue('qualification_degree', currentValue === watch('qualification_degree') ? "" : currentValue)
                                            setDegreeOpen(false)
                                          }}
                                        >
                                          {degree.label}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              watch('qualification_degree') === degree.label ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            {errors.qualification_degree && (
                              <p className='text-sm text-red-500 flex items-center gap-1'>
                                <span className="text-xs">⚠</span>
                                {errors.qualification_degree.message}
                              </p>
                          )}
                        </div>}

                        {/* Certificate */}
                        {watch('level') === "Certificate" && <div>
                          <Label htmlFor='qualification_certificate'>Qualification Certificate *</Label>
                          <Select 
                          onValueChange={(value) => setValue('qualification_certificate', value)}
                          value={watch('qualification_certificate')}>
                            <SelectTrigger className='mt-1'>
                              <SelectValue placeholder='Select qualification' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='Certificate V Distance Education'>Certificate V Distance Education</SelectItem>
                              <SelectItem value='Certificate V in Botswana Sign Language'>Certificate V in Botswana Sign Language</SelectItem>
                              <SelectItem value='Certificate V in Early Childhood Education'>Certificate V in Early Childhood Education</SelectItem>
                              <SelectItem value='Certificate V in English for Professional Purposes'>Certificate V in English for Professional Purposes</SelectItem>
                              <SelectItem value='Certificate V in Vocational Education and Training'>Certificate V in Vocational Education and Training</SelectItem>
                              <SelectItem value='Certificate V in Vocational Education and Training Practice'> Certificate V in Vocational Education and Training Practice</SelectItem>
                              <SelectItem value='Postgraduate Certificate in Quality Assurance in Education'>Postgraduate Certificate in Quality Assurance in Education</SelectItem>
                              <SelectItem value='Post Graduate Certificate in Curriculum Development'>Post Graduate Certificate in Curriculum Development</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.qualification_certificate && (
                            <p className='text-sm text-red-500 mt-1'>{errors.qualification_certificate.message}</p>
                          )}
                        </div>}

                        {/* Other qualification */}
                        {watch('level') === "Other" && <div>
                          <Label htmlFor='other_qualification'>Other qualification *</Label>
                          <Input
                            id='other_qualification'
                            {...register('other_qualification')}
                            className='mt-1'
                          />
                          {errors.other_qualification && (
                            <p className='text-sm text-red-500 mt-1'>{errors.other_qualification.message}</p>
                          )}
                        </div>}

                        {/* Institution */}
                        <div className='space-y-2'>
                            <Label htmlFor='institution' className="text-sm font-medium text-gray-700">
                              Name of Institution <span className="text-red-500">*</span>
                            </Label>
                            <Popover open={institutionOpen} onOpenChange={setInstitutionOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={institutionOpen}
                                  className="w-full justify-between text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                >
                                  {watch('institution') || "Select your institution"}
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput placeholder="Search institution..." />
                                  <CommandList>
                                    <CommandEmpty>No institution found.</CommandEmpty>
                                    <CommandGroup>
                                      {institutionForSelect.map((institution) => (
                                        <CommandItem
                                          key={institution.value}
                                          value={institution.label || watch('institution')}
                                          onSelect={(currentValue) => {
                                            setValue('institution', currentValue === watch('institution') ? "" : currentValue)
                                            setInstitutionOpen(false)
                                          }}
                                        >
                                          {institution.label}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              watch('institution') === institution.label ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            {errors.institution && (
                              <p className='text-sm text-red-500 flex items-center gap-1'>
                                <span className="text-xs">⚠</span>
                                {errors.institution.message}
                              </p>
                          )}
                        </div>
                        {/* Other Institution  */}
                        {watch('institution') === "Other" && <div className='space-y-2'>
                          <Label htmlFor='other_institution'>Institution Name *</Label>
                          <Input
                            id='other_institution'
                            {...register('other_institution')}
                            className='mt-1'
                            placeholder="Enter your institution name"
                          />
                          {errors.other_institution && (
                            <p className='text-sm text-red-500 mt-1'>{errors.other_institution.message}</p>
                          )}
                        </div>}

                        <div className='space-y-2'>
                          <Label htmlFor='qualification_year'>Qualification Year *</Label>
                          <Input
                            id='qualification_year'
                            type='number'
                            min='1950'
                            max='2026'
                            {...register('qualification_year')}
                            className='mt-1'
                          />
                          {errors.qualification_year && (
                            <p className='text-sm text-red-500 mt-1'>{errors.qualification_year.message}</p>
                          )}
                        </div>

                        {/* <div className='space-y-2'>
                          <Label htmlFor='subject_specialization'>Subject Specialization *</Label>
                          <Input
                            id='subject_specialization'
                            {...register('subject_specialization')}
                            className='mt-1'
                          />
                          {errors.subject_specialization && (
                            <p className='text-sm text-red-500 mt-1'>{errors.subject_specialization.message}</p>
                          )}
                        </div> */}

                        {/* Subject Specialization */}
                        <div className='space-y-2'>
                            <Label htmlFor='subject_specialization' className="text-sm font-medium text-gray-700">
                              Subject Specialization <span className="text-red-500">*</span>
                            </Label>
                            <Popover open={subjectOpen} onOpenChange={setSubjectOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={subjectOpen}
                                  className="w-full justify-between text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                >
                                  {watch('subject_specialization') || "Select your specialization"}
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput placeholder="Search subject..." />
                                  <CommandList>
                                    <CommandEmpty>No specialization found.</CommandEmpty>
                                    <CommandGroup>
                                      {subjectSpecializationForSelect.map((subject_specialization) => (
                                        <CommandItem
                                          key={subject_specialization.value}
                                          value={subject_specialization.label || watch('subject_specialization')}
                                          onSelect={(currentValue) => {
                                            setValue('subject_specialization', currentValue === watch('subject_specialization') ? "" : currentValue)
                                            setSubjectOpen(false)
                                          }}
                                        >
                                          {subject_specialization.label}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              watch('subject_specialization') === subject_specialization.label ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            {errors.subject_specialization && (
                              <p className='text-sm text-red-500 flex items-center gap-1'>
                                <span className="text-xs">⚠</span>
                                {errors.subject_specialization.message}
                              </p>
                          )}
                        </div>

                        {watch('subject_specialization') === "Other" && (
                          <div className='space-y-2'>
                            <Label htmlFor='other_subject_specialization'>Other Subject Specialization</Label>
                            <Input
                              id='other_subject_specialization'
                              {...register('other_subject_specialization')}
                              className='mt-1'
                              placeholder="Enter your subject specialization"
                            />
                            {errors.other_subject_specialization && (
                              <p className='text-sm text-red-500 mt-1'>{errors.other_subject_specialization.message}</p>
                            )}
                          </div>)}
                      </div>  
                        <FileUpload
                          name="attachments"
                          label="Attach a pdf copy of your qualification document"
                          description="Mandatory Qualification"
                          acceptedTypes=".pdf,.jpg,.jpeg,.png"
                          maxSize={5}
                          required={true}
                          value={mandatoryDoc}
                          onChange={setMandatoryDoc}
                          error={errors.attachments?.message}
                        />
                        
                      <div>
                          <QualificationsTable
                            qualifications={qualifications}
                            onChange={setQualifications}
                          />
                      </div>

                      {/* Progress indicator for mobile */}
                      <div className="block sm:hidden mt-6 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Step 4 of 6</span>
                          <span>Qualifications</span>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{width: '66.67%'}}></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 5: Background Check */}
              {currentStep === 4 && (
                <motion.div
                  initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Background Check</CardTitle>
                      <CardDescription>
                        Please provide information for background verification.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                      {/* Disability */}
                      <div>
                        <Label className="text-base font-medium">Are you living with any form of disability?</Label>
                        <RadioGroup 
                          value={watch('disability')} 
                          onValueChange={(value) => {
                            setValue('disability', value)
                            setValue('disability_description', undefined); // Reset disability description
                            }}
                          className="mt-3"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="disability-yes" />
                            <Label htmlFor="disability-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="disability-no" />
                            <Label htmlFor="disability-no">No</Label>
                          </div>
                        </RadioGroup>
                        
                        {watch('disability') === 'yes' && (
                          <div className="mt-4">
                            <Label htmlFor="disability_description">Choose all that apply</Label>
                            <div className="mt-2 space-y-2">
                              {[
                                "Physical disabilities (Wheel chaired, crunches, short limbs, facial)",
                                "Sensory impairments (Hearing, vision, Low vision)",
                                "Speech disabilities",
                                "Medical conditions",
                                "Attention Deficit disabilities",
                                "Allergies",
                                "Psychiatric disorders"
                              ].map((option, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id={`disability_${index}`}
                                    value={option}
                                    {...register('disability_description')}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                  <Label htmlFor={`disability_${index}`} className="text-sm font-normal cursor-pointer">
                                    {option}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Student-related offences */}
                      <div>
                        <Label className="text-base font-medium">Have you been convicted of a criminal offense against a learner or minor?</Label>
                        <RadioGroup 
                          value={watch('student_related_offence')} 
                          onValueChange={(value) => {
                            setValue('student_related_offence', value)
                            setValue('student_related_offence_details', ''); // Reset details
                            setValue('student_related_offence_attachments', undefined); // Reset attachments
                          }}
                          className="mt-3"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="student-offence-yes" />
                            <Label htmlFor="student-offence-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="student-offence-no" />
                            <Label htmlFor="student-offence-no">No</Label>
                          </div>
                        </RadioGroup>
                        
                        {watch('student_related_offence') === 'yes' && (
                          <div className="mt-4 space-y-4">
                            <div>
                              <Label htmlFor="student_related_offence_details">Please provide details</Label>
                              <Textarea
                                id="student_related_offence_details"
                                placeholder="Describe the student-related offence..."
                                {...register('student_related_offence_details')}
                                className="mt-1"
                              />
                            </div>

                            <div className='col-span-2'>
                              <FileUpload
                                name="student_related_offence_attachments"
                                label="Attachments (optional)"
                                description="Upload a clear copy of your National ID"
                                acceptedTypes=".pdf,.jpg,.jpeg,.png"
                                maxSize={5}
                                required={watch('student_related_offence') === 'yes' ? true : false}
                                value={studentRelatedOffenceAttachmentDoc}
                                onChange={setStudentRelatedOffenceAttachmentDoc}
                                error={errors.student_related_offence_attachments?.message}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Drug-related offences */}
                      <div>
                        <Label className="text-base font-medium">Have you been convicted of a drug related criminal offense?</Label>
                        <RadioGroup 
                          value={watch('drug_related_offence')} 
                          onValueChange={(value) => {
                            setValue('drug_related_offence', value);
                            setValue('drug_related_offence_details', ''); // Reset details
                            setValue('drug_related_offence_attachments', undefined); // Reset attachments
                          }}
                          className="mt-3"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="drug-offence-yes" />
                            <Label htmlFor="drug-offence-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="drug-offence-no" />
                            <Label htmlFor="drug-offence-no">No</Label>
                          </div>
                        </RadioGroup>
                        
                        {watch('drug_related_offence') === 'yes' && (
                          <div className="mt-4 space-y-4">
                            <div>
                              <Label htmlFor="drug_related_offence_details">If yes, please provide full details</Label>
                              <Textarea
                                id="drug_related_offence_details"
                                placeholder="Describe the drug-related offence..."
                                {...register('drug_related_offence_details')}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="drug_related_offence_details">Provide supporting evidence/documentation if any (Upload in pdf format)</Label>
                              <FileUpload
                                name="drug_related_offence_attachments"
                                label="Attachments (optional)"
                                description="Upload a clear copy of your National ID"
                                acceptedTypes=".pdf,.jpg,.jpeg,.png"
                                maxSize={5}
                                required={watch('drug_related_offence') === 'yes' ? true : false}
                                value={drugRelatedOffenceAttachmentsDoc}
                                onChange={setDrugRelatedOffenceAttachmentsDoc}
                                error={errors.drug_related_offence_attachments?.message}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* License-related issues */}
                      <div>
                        <Label className="text-base font-medium">Have you ever had your teaching license revoked, suspended, invalidated, cancelled or denied license by any Teaching Council or Authority?</Label>
                        <RadioGroup 
                          value={watch('license_flag')} 
                          onValueChange={(value) => {
                            setValue('license_flag', value)
                            setValue('license_flag_details', undefined); // Reset details
                          }}
                          className="mt-3"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="license-flag-yes" />
                            <Label htmlFor="license-flag-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="license-flag-no" />
                            <Label htmlFor="license-flag-no">No</Label>
                          </div>
                        </RadioGroup>
                        
                        {watch('license_flag') === 'yes' && (
                          <div className="mt-4">
                              <Label>If yes, please attach a letter giving full details and official documentation of the action taken.</Label>
                              <FileUpload
                                name="license_flag_details"
                                label="Attachments (optional)"
                                description="Upload a clear copy of your National ID"
                                acceptedTypes=".pdf,.jpg,.jpeg,.png"
                                maxSize={5}
                                required={watch('license_flag') === 'yes' ? true : false}
                                value={licenseFlagDetailsDoc}
                                onChange={setLicenseFlagDetailsDoc}
                                error={errors.license_flag_details?.message}
                              />
                          </div>
                        )}
                      </div>

                      {/* Professional misconduct */}
                      <div>
                        <Label className="text-base font-medium">Are you currently the subject of any review, enquiry or investigations by any Teaching Council or any Authority.?</Label>
                        <RadioGroup 
                          value={watch('misconduct_flag')} 
                          onValueChange={(value) => {
                            setValue('misconduct_flag', value)
                            setValue('misconduct_flag_details', undefined); // Reset details
                          }}
                          className="mt-3"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="misconduct-flag-yes" />
                            <Label htmlFor="misconduct-flag-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="misconduct-flag-no" />
                            <Label htmlFor="misconduct-flag-no">No</Label>
                          </div>
                        </RadioGroup>
                        
                        {watch('misconduct_flag') === 'yes' && (
                          <div className="mt-4">
                              <Label htmlFor="misconduct_flag_details">If yes, please attach a letter giving full details and any official documentation available regarding the matter.</Label>
                              <FileUpload
                                name="misconduct_flag_details"
                                label="Attachments (optional)"
                                description="Upload a clear copy of your National ID"
                                acceptedTypes=".pdf,.jpg,.jpeg,.png"
                                maxSize={5}
                                required={watch('misconduct_flag') === 'yes' ? true : false}
                                value={misconductFlagDetailsDoc}
                                onChange={setMisconductFlagDetailsDoc}
                                error={errors.misconduct_flag_details?.message}
                              />
                          </div>
                        )}
                      </div>

                      {/* Progress indicator for mobile */}
                      <div className="block sm:hidden mt-6 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Step 5 of 6</span>
                          <span>Background Check</span>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{width: '83.33%'}}></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 6: Review & Complete */}
              {currentStep === 5 && (
                <motion.div
                  initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Review & Complete</CardTitle>
                      <CardDescription>
                        Please review your information and agree to the terms before submitting.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                      {Object.keys(errors).length > 0 && (
                        <div className="relative bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <svg 
                                className="h-5 w-5 text-red-400" 
                                viewBox="0 0 20 20" 
                                fill="currentColor"
                              >
                                <path 
                                  fillRule="evenodd" 
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                                  clipRule="evenodd" 
                                />
                              </svg>
                            </div>
                            <div className="ml-3 flex-1">
                              <h3 className="text-sm font-medium text-red-800 mb-2">
                                Please correct the following errors:
                              </h3>
                              <div className="space-y-1">
                                {Object.entries(errors).map(([field, error]) => (
                                  <div key={field} className="flex items-center text-sm text-red-700">
                                    <span className="inline-block w-2 h-2 bg-red-400 rounded-full mr-2 flex-shrink-0"></span>
                                    <span className="font-medium capitalize">
                                      {field.replace(/_/g, ' ')}:
                                    </span>
                                    <span className="ml-1">
                                      {error?.message || 'This field is required'}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={() => {/* Add logic to clear errors or scroll to first error */}}
                            className="absolute top-3 right-3 text-red-400 hover:text-red-600 transition-colors"
                          >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path 
                                fillRule="evenodd" 
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                                clipRule="evenodd" 
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                      {/* Summary Section */}
                      <div className='bg-gray-50 p-4 rounded-lg'>
                        <Accordion
                          type="single"
                          collapsible
                          className="w-full"
                          defaultValue="item-1"
                        >
                          {/* Step 1: Personal Information */}
                          <AccordionItem value="item-1">
                            <AccordionTrigger>Step 1: Personal Information</AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-4 text-balance">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoItem label="First Name" value={watch('first_name')} />
                                <InfoItem label="Last Name" value={watch('last_name')} />
                                <InfoItem label="Middle Name" value={watch('middle_name')} />
                                <InfoItem label="Surname" value={watch('surname')} />
                                <InfoItem label="Date of Birth" value={watch('date_of_birth')} />
                                <InfoItem label="Gender" value={watch('gender')} />
                                <InfoItem label="Citizenship" value={watch('citizenship')} />
                                <InfoItem label="Nationality" value={watch('nationality')} />
                              </div>
                            </AccordionContent>
                          </AccordionItem>

                          {/* Step 2: Contact Information */}
                          <AccordionItem value="item-2">
                            <AccordionTrigger>Step 2: Contact Information</AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-4 text-balance">
                              <div className="grid grid-cols-1 gap-4">
                                <InfoItem label="Primary Phone" value={watch('primary_phone')} />
                                <InfoItem label="Physical Address" value={watch('primary_physical')} />
                                <InfoItem label="Postal Address" value={watch('primary_postal')} />
                              </div>
                            </AccordionContent>
                          </AccordionItem>

                          {/* Step 3: Professional Details */}
                          <AccordionItem value="item-3">
                            <AccordionTrigger>Step 3: Professional Details</AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-4 text-balance">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoItem label="Work Status" value={watch('work_status')} />
                                <InfoItem label="Practice Category" value={watch('practice_category')} />
                                <InfoItem label="Sub Category" value={watch('sub_category')} />
                                <InfoItem label="Years of Experience" value={watch('experience_years')} />
                                <InfoItem label="District" value={watch('district')} />
                                <InfoItem label="Institution Type" value={watch('institution_type')} />
                                <InfoItem label="School Level" value={watch('school_level')} />
                                <InfoItem label="Level" value={watch('level')} />
                                <InfoItem label="Private Schools" value={watch('private_schools')} />
                                <InfoItem label="Other Private Schools" value={watch('other_private_schools')} />
                                <InfoItem label="Primary Schools" value={watch('primary_schools')} />
                                {/* <InfoItem label="Pre-Primary Name" value={watch('pre_primary_name')} /> */}
                                <InfoItem label="Other Primary Schools" value={watch('other_primary_schools')} />
                                <InfoItem label="Junior Schools" value={watch('junior_schools')} />
                                <InfoItem label="Other Junior Schools" value={watch('other_junior_schools')} />
                                <InfoItem label="Senior Schools" value={watch('senior_schools')} />
                                <InfoItem label="Other Senior Schools" value={watch('other_senior_schools')} />
                                {/* <InfoItem label="Major Subjects" value={watch('subject_specialization')} /> */}
                                <InfoItem label="Subject Specialization" value={watch('other_subject_specialization')} />
                              </div>
                            </AccordionContent>
                          </AccordionItem>

                          {/* Step 4: Qualifications */}
                          <AccordionItem value="item-4">
                            <AccordionTrigger>Step 4: Qualifications</AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-4 text-balance">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoItem label="Certificate" value={watch('qualification_certificate')} />
                                <InfoItem label="Post-Grad Certificate" value={watch('qualification_post_grad_certificate')} />
                                <InfoItem label="Diploma" value={watch('qualification_diploma')} />
                                <InfoItem label="Post-Grad Diploma" value={watch('qualification_post_grad_diploma')} />
                                <InfoItem label="Degree" value={watch('qualification_degree')} />
                                <InfoItem label="Honours Degree" value={watch('qualification_degree_honours')} />
                                <InfoItem label="Masters Degree" value={watch('qualification_masters_degree')} />
                                <InfoItem label="Doctoral Degree" value={watch('qualification_doctoral_degree')} />
                                <InfoItem label="Other Qualification" value={watch('other_qualification')} />
                                <InfoItem label="Institution" value={watch('institution')} />
                                <InfoItem label="Other Institution" value={watch('other_institution')} />
                                <InfoItem label="Qualification Year" value={watch('qualification_year')} />
                              </div>
                              {qualifications && qualifications.length > 0 && (
                                <>
                                  <Label>Additional Qualifications</Label>
                                  {/* Desktop Table View - Hidden on mobile */}
                                  <div className="hidden md:block rounded-md border overflow-hidden">
                                    <Table className="w-full">
                                      <TableHeader className="bg-gray-50">
                                        <TableRow>
                                          <TableHead  className="px-4 py-3 text-left text-sm font-medium text-gray-900">Qualification</TableHead >
                                          <TableHead  className="px-4 py-3 text-left text-sm font-medium text-gray-900">Year</TableHead >
                                          <TableHead  className="px-4 py-3 text-left text-sm font-medium text-gray-900">Certificate</TableHead >
                                          <TableHead  className="px-4 py-3 text-left text-sm font-medium text-gray-900 w-[100px]">Actions</TableHead >
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody className="divide-y divide-gray-200">
                                        {qualifications.map((qualification) => (
                                          <TableRow key={qualification.id} className="hover:bg-gray-50">
                                            <TableCell  className="px-4 py-3 text-sm font-medium text-gray-900">
                                              {qualification.alt_qualification}
                                            </TableCell >
                                            <TableCell  className="px-4 py-3 text-sm text-gray-700">{qualification.alt_qualification_year}</TableCell >
                                            <TableCell  className="px-4 py-3 text-sm">
                                              {qualification.alt_attachments ? (
                                                <div className="flex items-center space-x-2">
                                                  <FileText className="h-4 w-4 text-green-600" />
                                                  <span className="text-sm">
                                                    {qualification.alt_attachments['original-name']}
                                                  </span>
                                                  <Badge variant="secondary" className="text-xs">
                                                    {qualification.alt_attachments.extension.toUpperCase()}
                                                  </Badge>
                                                </div>
                                              ) : (
                                                <span className="text-red-500 text-sm">No certificate</span>
                                              )}
                                            </TableCell >
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>

                                  {/* Mobile Card View - Hidden on desktop */}
                                  <div className="md:hidden space-y-4">
                                    {qualifications.map((qualification, index) => (
                                      <div 
                                        key={qualification.id} 
                                        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                                      >
                                        {/* Header with qualification name and actions */}
                                        <div className="flex items-start justify-between mb-3">
                                          <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                                              {qualification.alt_qualification}
                                            </h3>
                                            <div className="flex items-center mt-1 text-xs text-gray-500">
                                              <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                                                #{index + 1}
                                              </span>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Qualification details */}
                                        <div className="space-y-3">
                                          {/* Year */}
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                              Year Completed
                                            </span>
                                            <span className="text-sm font-medium text-gray-900">
                                              {qualification.alt_qualification_year}
                                            </span>
                                          </div>

                                          {/* Certificate Status */}
                                          <div className="border-t border-gray-100 pt-3">
                                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">
                                              Certificate
                                            </span>
                                            {qualification.alt_attachments ? (
                                              <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-md border border-green-200">
                                                <FileText className="h-4 w-4 text-green-600 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                  <p className="text-sm font-medium text-green-800 truncate">
                                                    {qualification.alt_attachments['original-name']}
                                                  </p>
                                                  <div className="flex items-center mt-1">
                                                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                                      {qualification.alt_attachments.extension.toUpperCase()}
                                                    </Badge>
                                                  </div>
                                                </div>
                                              </div>
                                            ) : (
                                              <div className="flex items-center space-x-2 p-2 bg-red-50 rounded-md border border-red-200">
                                                <div className="h-4 w-4 rounded-full bg-red-500 flex-shrink-0"></div>
                                                <span className="text-sm font-medium text-red-700">
                                                  No certificate uploaded
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}
                            </AccordionContent>
                          </AccordionItem>

                          {/* Step 5: Background Check */}
                          <AccordionItem value="item-5">
                            <AccordionTrigger>Step 5: Background Check</AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-4 text-balance">
                              <div className="grid grid-cols-1 gap-4">
                                <InfoItem label="Disability" value={watch('disability')} />
                                <InfoItem label="Disability Description" value={watch('disability_description')?.toString()} />
                                <InfoItem label="Student Related Offence" value={watch('student_related_offence')} />
                                <InfoItem label="Student Offence Details" value={watch('student_related_offence_details')} />
                                <InfoItem label="Drug Related Offence" value={watch('drug_related_offence')} />
                                <InfoItem label="Drug Offence Details" value={watch('drug_related_offence_details')} />
                                <InfoItem label="License Flag" value={watch('license_flag')} />
                                <InfoItem label="Misconduct Flag" value={watch('misconduct_flag')} />
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>

                      {/* Declaration and Consent */}
                      <div className='space-y-4'>
                        <div className='flex items-start space-x-3'>
                          <Checkbox 
                            id='declaration'
                            onCheckedChange={(checked) => setValue('declaration', checked as boolean)}
                          />
                          <div className='grid gap-1.5 leading-none'>
                            <Label 
                              htmlFor='declaration'
                              className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                            >
                              Declaration *
                            </Label>
                            <p className='text-xs text-muted-foreground'>
                              I hereby declare that the information I have provided in this application form is true and correct to the best of my knowledge and belief.
                              I understand that provision of false or misleading information may result in the refusal of my application or cancellation of my registration.  
                              I consent to the Council collecting and verifying this information and I authorise the council to share this information with other relevant 
                              organizations, such as employers and educational institutions.
                            </p>
                          </div>
                        </div>
                        {errors.declaration && (
                          <p className='text-sm text-red-500'>{errors.declaration.message}</p>
                        )}

                        <div className='flex items-start space-x-3'>
                          <Checkbox 
                            id='profile_data_consent'
                            onCheckedChange={(checked) => setValue('profile_data_consent', checked as boolean)}
                          />
                          <div className='grid gap-1.5 leading-none'>
                            <Label 
                              htmlFor='profile_data_consent'
                              className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                            >
                              Data Consent *
                            </Label>
                            <p className='text-xs text-muted-foreground'>
                              I consent to the collection, processing, and use of my personal data for the purposes of this application 
                              and future communications related to my professional registration.
                            </p>
                          </div>
                        </div>
                        {errors.profile_data_consent && (
                          <p className='text-sm text-red-500'>{errors.profile_data_consent.message}</p>
                        )}
                      </div>

                      {/* Progress indicator for mobile */}
                      <div className="block sm:hidden mt-6 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Step 6 of 6</span>
                          <span>Review & Complete</span>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{width: '100%'}}></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </form>
          
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
                  onClick={submitDraft}
                  className='bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2'
                  disabled={submittingDraft || submitting}
                > {submittingDraft ? (
                  <>
                    Saving
                  </>): (
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
                  )}
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
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button                       
                      type='button'                    
                      className='bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2'>Submit Application</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      {!submitting && !submissionResult && (
                        <>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Submit Teacher Registration Application?</AlertDialogTitle>
                            <AlertDialogDescription>
                              You are about to submit your teacher registration application. Please review all the information you have provided carefully before proceeding.
                              
                              Once submitted, your application will be sent for review and you will not be able to make changes until the review process is complete. You will receive a confirmation email with your application reference number.
                              
                              Are you ready to submit your application?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button onClick={submitForm}>Continue</Button>
                          </AlertDialogFooter>
                        </>
                      )}
                      {submitting && (
                        <>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Submitting...</AlertDialogTitle>
                          <AlertDialogDescription>
                            <div className="items-center space-y-2">
                              <div className="flex items-center justify-center">
                                <Loader2 className="animate-spin h-6 w-6 text-blue-600 mr-2 inline-block" />
                              </div>
                              <div>
                                Your application is being submitted. This may take a few moments depending on the size of your attachments and the current server load.
                                Please wait while we process your application.
                              </div>
                            </div>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            {/* <Button onClick={submitForm}>Re-submit</Button> */}
                          </AlertDialogFooter>
                        </>
                      )}
                      {submissionResult?.success==true && (
                        <>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Application Submitted Successfully!</AlertDialogTitle>
                            <AlertDialogDescription>
                              Your teacher registration application has been submitted successfully. 
                              You will receive a confirmation email shortly with your application reference number: <strong>{submissionResult.application_id}</strong>.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogAction onClick={() => setSubmissionResult(null)}>Close</AlertDialogAction>
                          </AlertDialogFooter>
                        </>
                      )}
                      {submissionResult?.success==false && (
                        <>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Application Submission Failed</AlertDialogTitle>
                            <AlertDialogDescription>
                              We encountered an error while submitting your application. Please check your internet connection and try again.
                              If the problem persists, contact support with the following error message: <strong>{submissionResult.error}</strong>.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogAction onClick={() => setSubmissionResult(null)}>Close</AlertDialogAction>
                          </AlertDialogFooter>
                        </>
                      )}
                    </AlertDialogContent>
                  </AlertDialog>
                  </>
                )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </section>
  )
}