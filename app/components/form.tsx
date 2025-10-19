'use client'

import * as React from "react"
import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormDataSchema } from '@/lib/schema'
import FileUpload, { UploadResponse } from './file-upload'
import { processAttachments, submitTeacherRegistration } from '@/lib/teacher-registration'
import { Profile, TeacherRegistrationResponse} from '@/types/teacher-registration'
import QualificationsTable, { QualificationEntry } from './qualifications'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Check, ChevronsUpDown, FileText, Loader2, AlertCircle, ArrowRight, Info } from 'lucide-react'
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
  degreeForSelect, diplomasForSelect, 
  doctorateForSelect, 
  honoursForSelect, 
  mastersForSelect, 
  postGraduateDiplomasForSelect} from "@/types/qualifications"
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
import { subjectSpecializationForSelect } from "@/types/subjects_specialization"
import { getAccessGroups } from "../auth/auth"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { getFieldLabel } from "../customer/dashboard/lib/get-field-info"

type FormInputs = z.infer<typeof FormDataSchema>

const steps = [
  {
    id: 'Step 1',
    name: 'Personal Information',
    fields: ['first_name', 'last_name', 'citizenship', 'nationality', 'middle_name', 'date_of_birth', 'gender','national_id_copy'] // 'surname',
  },
  {
    id: 'Step 2',
    name: 'Contact Information',
    fields: ['primary_phone', 'primary_physical', 'primary_postal','primary_email']
  },
  {
    id: 'Step 3',
    name: 'Professional Details',
    fields: ['practice_category', 'work_status', 'sub_category', 'experience_years', 'district', 'institution_type', 'school_level','private_schools','primary_schools','junior_schools','senior_schools']
  },
  {
    id: 'Step 4',
    name: 'Qualifications',
    fields: ['other_subject_specialization','subject_specialization', 'qualification_certificate', 'qualification_doctoral_degree', 'qualification_masters_degree', 'qualification_degree_honours', 'qualification_post_grad_diploma', 'qualification_degree', 'qualification_diploma', 'attachments', 'subject_specialization', 'institution', 'qualification_year', 'major_subjects', 'qualifications', 'level','other_qualification']
  },
  {
    id: 'Step 5',
    name: 'Declarations & Disclosures',
    fields: ['disability', 'student_related_offence', 'drug_related_offence', 'license_flag', 'misconduct_flag','license_flag_details','misconduct_flag_details','drug_related_offence_details','student_related_offence_attachments','student_related_offence_details','disability_description']
  },
  { 
    id: 'Step 6', 
    name: 'Review & Complete', 
    fields: ['declaration', 'profile_data_consent','terms_and_conditions_of_use_and_privacy_policy'] 
  }
]


const countries = countryList.map((country) => ({
  value: country,
  label: country,
}));

export default function Form() {

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
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const { toast } = useToast();
  const [isLoadingForm, setIsLoadingForm] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const router = useRouter()
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [userId, setUserId] = useState('');
  const [status, setFormStatus] = useState('')

  useEffect(() => {
    const fetchId = async () => {
      const result = await getAccessGroups();
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
        level: q.level,
        institution: q.institution,
        major_subjects: q.major_subjects,
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
   // clearErrors,
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
        primary_email: formData.primary_email,
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
       * =====================================================
       * SUBMIT THE APPLICATION FOR TEACHER REGISTRATION FORM
       * =====================================================
       */
      const result = await submitTeacherRegistration(processedFormData, profile, draft_Id || '')
      setSubmissionResult(result)
      if(result?.code == 405){
        setSubmissionError("You have an existing application under review. You cannot submit a new application at this time.")
      }
      if (submissionResult?.success==true || result.success==true) {  
        let draft;
        if(draft_Id) {
          draft = await updateDraft(draft_Id, processedFormData, currentStep);
          /**
           * If submission is successful, update draft status to 'submitted'
           */
          await updateDraftStatus(draft_Id || '', 'submitted')
        }else {
          draft = await saveDraft(processedFormData);
        }

        if(draft && draft.id) {
          // If draft saved successfully, refresh the page to load the draft
          router.push(`/customer/dashboard/teacher-application?draftId=${draft.id}`)
        }
        
        setSubmitting(false)
        router.push(`/customer/dashboard`) 
        // reset()
      } else {
        setSubmitting(false)
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }finally {
      setSubmitting(false)
      
    }
  }
  /**
   * ========================================================
   * CREATE/SAVE DRAFT
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
        primary_email: formData.primary_email,
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
      if(draftIdFromUrl) {
        draft = await updateDraft(draftIdFromUrl, processedFormData, currentStep);
      }else {
        draft = await saveDraft(processedFormData);
      }

      if(draft && draft.id) {
        // If draft saved successfully, refresh the page to load the draft
        router.push(`/customer/dashboard/teacher-application?draftId=${draft.id}`)
      }

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

  // Auto-save draft on form changes (debounced)
  const watchedFields = watch();
  const citizenship = watch('citizenship');
  const gender = watch("gender")
  const nationality = watch("nationality")

  useEffect(() => {
    const loadDraftData = async (draftId: string) => {
      const draftData = await loadDraft(draftId);
      setFields(draftData?.fields || []);
      setCurrentStep(draftData.currentStep || 0);
      
      if (!draftData) return null;
      
      reset(draftData);
      setNationalIdDoc(draftData.national_id_copy || null);
      setQualifications(draftData.qualifications || []);
      setStudentRelatedOffenceAttachmentDoc(draftData.student_related_offence_attachments || null);
      setDrugRelatedOffenceAttachmentsDoc(draftData.drug_related_offence_attachments || null);
      setLicenseFlagDetailsDoc(draftData.license_flag_details || null);
      setMisconductFlagDetailsDoc(draftData.misconduct_flag_details || null);
      setMandatoryDoc(draftData.attachments || null);

      /**
       * Clear fields that were requested to be corrected
       */
      if (draftData.status == 'correction' && draftData.fields && draftData.fields.length > 0) {
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
        
        await updateDraft(draftId, draftData, currentStep);
        await updateDraftStatus(draftId, 'correcting');
      }
      setFormStatus(draftData.status)
      setDisabled(true);
      return draftData;
    };

    const initializeForm = async () => {
      try {
        setIsLoadingForm(true);
        
        const urlParams = new URLSearchParams(window.location.search);
        const draftIdFromUrl = urlParams.get('draftId');
        const access_profile = await getAccessGroups();
        
        // Try to load draft from URL first
        if (draftIdFromUrl) {
          await loadDraftData(draftIdFromUrl);
          return;
        }
        
        // Try to load latest draft if no URL param
        if (access_profile?.preferred_username) {
          try {
            const response = await fetch(`/api/drafts/v1/recent?userId=${access_profile.preferred_username}`);
            
            if (response.ok) {
              const latestDraft = await response.json();
              
              if (latestDraft?.id) {
                await loadDraftData(latestDraft.id);
                
                // Update URL with draft ID
                const newUrl = `${window.location.pathname}?draftId=${latestDraft.id}`;
                window.history.replaceState({}, '', newUrl);
                return;
              }
            }
          } catch (error) {
            console.error('Error fetching latest draft:', error);
          }

          // No draft found, use access profile data
          const formDefaults = {
            username: access_profile.preferred_username || '',
            first_name: access_profile.given_name?.toUpperCase() || '',
            last_name: access_profile.family_name?.toUpperCase() || '',
            primary_email: access_profile.email || '',
            gender: access_profile.gender || '',
            primary_postal: access_profile.postal_address || null,
            primary_physical: access_profile.physical_address || null,
            primary_phone: access_profile.phone || null,
            date_of_birth: access_profile.date_of_birth || null,
          };
          
          Object.entries(formDefaults).forEach(([key, value]) => {
            if (value) {
              setValue(key as keyof FormInputs, value);
            }
          });
          setDisabled(true);
        }
      } catch (error) {
        console.error('Error initializing form:', error);
      } finally {
        setIsLoadingForm(false);
      }
    };

    initializeForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadDraft, reset, setValue, updateDraft]);

  type FieldName = keyof FormInputs

  const next = async () => {
    const fields = steps[currentStep].fields
    const output = await trigger(fields as FieldName[], { shouldFocus: true })

    if (!output) {
      setTimeout(() => {
        const scrollViewport = scrollContainerRef.current?.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollViewport) {
          scrollViewport.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 0);
      return
    }

    if (currentStep < steps.length - 1) {
      setPreviousStep(currentStep)
      setCurrentStep(step => step + 1)
      
      // Scroll to top after state update
      setTimeout(() => {
        const scrollViewport = scrollContainerRef.current?.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollViewport) {
          scrollViewport.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 0);
      
      processDraft(getValues()) 
    }
  }

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep)
      setCurrentStep(step => step - 1)
      
      // Scroll to top after state update
      setTimeout(() => {
        const scrollViewport = scrollContainerRef.current?.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollViewport) {
          scrollViewport.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 0);
      
      processDraft(getValues()) 
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
      
      // Scroll to top to show errors
      setTimeout(() => {
        const scrollViewport = scrollContainerRef.current?.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollViewport) {
          scrollViewport.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 0);
    }
  }

  if (isLoadingForm) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <section className='bg-gray-50 md:p-2 max-h-auto space-y-4'>
      {/* <ScrollArea 
      ref={scrollContainerRef} 
      className='md:h-[800px] p-4 overflow-auto border border-blue-200 rounded-lg' 
      type="always"> */}
      {/* Case Header - Fixed */}
      {/* <Card className="rounded-lg shadow-sm flex-shrink-0 md:block hidden bg-blue-50 border border-blue-200">
          <CardHeader className="p-4">
              <div className="flex justify-between items-center gap-3">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="p-2 bg-blue-600 rounded-lg flex-shrink-0">
                          <BriefcaseBusiness className="w-6 h-6 text-gray-100"/>
                      </div>
                      <div className="flex-1 min-w-0">
                          <h1 className="text-lg font-semibold text-gray-900 truncate">
                              APPLICATION FOR TEACHER REGISTRATION & LICENSING
                          </h1>                                       
                      </div>
                  </div>
                  <div className="flex-shrink-0">
                        <div className="">
                          <div><Badge className="p-1 rounded-sm bg-purple-300 text-purple-950">{status || 'Draft'}</Badge></div>
                        </div>   
                  </div>
              </div>
          </CardHeader>
      </Card> */}
      <div className='max-w-9xl mx-auto flex gap-6'>      
          {/* Main Content */}
          <div className='flex-1 bg-white'>

            {fields.length > 0 && (status=="correction" || status=="correcting") && (
              <div className="rounded-md bg-red-50 border border-red-200 p-4 m-4">
                <p className="text-sm text-red-800">
                  
                  <span className="font-medium">Your teacher application has been rejected at the screening stage because of missing or incorrect information. Please correct these fields:</span>
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {fields.map((field, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200"
                    >
                      {/* {field.replace(/_/g, ' ')} */}
                      {getFieldLabel(String(field)).label}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {status=="submitted" &&(
                <ApplicationAlreadySubmitted/>
            )}
            {/* Progress Steps */}
            <nav aria-label='Progress' className='md:px-2 py-2 md:block hidden'>
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

            {/* Mobile Header */}
            <div className='md:hidden block w-full mb-4'>
              <div className='bg-white shadow-sm border-b p-4'>
                <h1 className='text-lg font-semibold text-gray-900'>
                  Teacher Registration
                </h1>
                <p className='text-sm text-gray-600'>Complete your application</p>
              </div>
            </div>
          
            <form onSubmit={handleSubmit(processForm)}>
              {/* Step 1: Personal Information */}
              {currentStep === 0 && (
                <motion.div
                  initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <Card className='border-0 shadow-none'>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>
                        Please provide your personal details for identification purposes.
                          <p className="mt-1 italic text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">
                            Scroll down to continue filling out the form and access the navigation items.
                          </p>
                          <div>
                            <span className="text-red-500">*</span>
                            <span className="italic text-xs">=Required</span>
                          </div>  
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4 sm:space-y-6'>
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
                            disabled={disabled}
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
                            disabled={disabled}
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
                            setValue('nationality', value === 'citizen' ? 'Botswana' : ''); // Reset
                            trigger('citizenship')
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
                                  <span className="truncate">
                                    {watch('nationality') || "Select your nationality"}
                                  </span>
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
                            {errors.nationality && (
                              <p className='text-sm text-red-500 flex items-center gap-1'>
                                <span className="text-xs">⚠</span>
                                {errors.nationality.message}
                              </p>
                          )}
                        </div>}

                        {/* National ID OR 1GOV ID*/}
                        <div className="space-y-2">
                          <Label htmlFor='username' className="text-sm font-medium text-gray-700">
                            National/1Gov ID <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id='username'
                            {...register('username')}
                            className='text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                            placeholder="Enter your national/passport ID number"
                            inputMode="numeric"
                            disabled={disabled}
                          />
                          {errors.username && (
                            <p className='text-sm text-red-500 flex items-center gap-1'>
                              <span className="text-xs">⚠</span>
                              {errors.username.message}
                            </p>
                          )}
                        </div>

                        {/* Date of Birth with date picker */}
                        <div className="space-y-2 col-span-1 sm:col-span-1">
                          <Label htmlFor='date_of_birth' className="text-sm font-medium text-gray-700">
                            Date of Birth <span className="text-red-500">*</span>
                          </Label>
                          
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500",
                                  !watch('date_of_birth') && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                <span className="truncate">
                                {watch('date_of_birth') ? format(new Date(watch('date_of_birth')), "PPP") : <span>Pick a date</span>}
                                </span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={(() => {
                                  try {
                                    return watch('date_of_birth') ? new Date(watch('date_of_birth')) : undefined;
                                  } catch {
                                    return undefined;
                                  }
                                })()}
                                onSelect={(newDate) => {
                                  if (newDate) {
                                    const year = newDate.getFullYear();
                                    const month = String(newDate.getMonth() + 1).padStart(2, '0');
                                    const day = String(newDate.getDate()).padStart(2, '0');
                                    setValue('date_of_birth', `${year}-${month}-${day}`);
                                  } else {
                                    setValue('date_of_birth', '');
                                  }
                                  trigger('date_of_birth');
                                }}
                                className="rounded-md border shadow-sm"
                                captionLayout="dropdown"
                                disabled={(date) =>
                                  date >= new Date(new Date().setHours(0, 0, 0, 0) + 86400000) || 
                                  date < new Date("1900-01-01")
                                }
                              />
                              <div className="flex justify-end p-3 border-t">
                                <Button 
                                  type="button" 
                                  size="sm"
                                  onClick={() => {
                                    // Close the popover by finding and clicking the trigger
                                    const trigger = document.querySelector('[data-state="open"]');
                                    if (trigger) {
                                      (trigger as HTMLElement).click();
                                    }
                                  }}
                                  className="bg-blue-800 hover:bg-blue-900 text-white"
                                >
                                  Close
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>

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
                          onValueChange={(value) => {
                            setValue('gender', value)
                            trigger('gender')
                          }}
                          >
                            <SelectTrigger className='text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500'>
                              <SelectValue placeholder='Select your gender' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='Male' className="text-base">Male</SelectItem>
                              <SelectItem value='Female' className="text-base">Female</SelectItem>
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
                        {watch('citizenship') && <div className='col-span-1 sm:col-span-1'>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                              {watch("citizenship") == 'citizen' ? 'National ID Copy':'Passport Copy'} <span className="text-red-500">*</span>
                            </Label>
                            <div className="">
                              <FileUpload
                                name="national_id_copy"
                                label="Attach a Copy"
                                description="national-id-documents"
                                acceptedTypes=".pdf,.jpg,.jpeg,.png"
                                maxSize={5}
                                required={true}
                                value={nationalIdDoc}
                                onChange={(file) => {
                                  setNationalIdDoc(file);
                                  if (file) {
                                    setValue('national_id_copy', file);
                                    trigger('national_id_copy');
                                  }
                                }}
                                error={errors.national_id_copy?.message as string | undefined}
                                compact
                              />
                            </div>
                          </div>
                        </div>}
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
                  <Card className='border-0 shadow-none'>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                      <CardDescription>
                        Please provide your contact details and addresses.
                          <p className="mt-1 italic text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">
                            Scroll down to continue filling out the form and access the navigation items.
                          </p>
                          <div>
                            <span className="text-red-500">*</span>
                            <span className="italic text-xs">=Required</span>
                          </div>  
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
                        {/* Primary Phone */}
                        <div className='space-y-2'>
                          <Label htmlFor='primary_phone'>Primary Phone <span className="text-red-500">*</span></Label>
                          <Input
                            id='primary_phone'
                            type='tel'
                            placeholder='e.g. +2671234567'
                            {...register('primary_phone')}
                            className='mt-1'
                          />
                          {errors.primary_phone && (
                            <p className='text-sm text-red-500 mt-1'>{errors.primary_phone.message}</p>
                          )}
                        </div>

                        {/* Primary Email */}
                        <div className='space-y-2'>
                          <Label htmlFor='primary_email'>Primary Email <span className="text-red-500">*</span></Label>
                          <Input
                            id='primary_email'
                            type='email'
                            placeholder='e.g. yourname@gmail.com'
                            {...register('primary_email')}
                            className='mt-1'
                          />
                          {errors.primary_email && (
                            <p className='text-sm text-red-500 mt-1'>{errors.primary_email.message}</p>
                          )}
                        </div>

                        {/* Primary Physical */} 
                        <div className='space-y-2'>
                          <Label htmlFor='primary_physical'>Physical Address <span className="text-red-500">*</span></Label>
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
                          <Label htmlFor='primary_postal'>Postal Address <span className="text-red-500">*</span></Label>
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
                  <Card className='border-0 shadow-none'>
                    <CardHeader>
                      <CardTitle>Professional Details</CardTitle>
                      <CardDescription>
                        Please provide your professional and employment information.
                          <p className="mt-1 italic text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">
                            Scroll down to continue filling out the form and access the navigation items.
                          </p>
                          <div>
                            <span className="text-red-500">*</span>
                            <span className="italic text-xs">=Required</span>
                          </div>  
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {/* Employment Status */}
                        <div className="space-y-2">
                          <Label htmlFor='work_status'>Employment Status <span className="text-red-500">*</span></Label>
                          <Select 
                          onValueChange={(value: string) => {
                            setValue('work_status', value);
                            setValue('institution_type', "");
                            setValue('school_level', "");
                            setValue('district', "");

                            setValue('private_schools', "");
                            setValue('primary_schools', "");
                            setValue('junior_schools', "");
                            setValue('senior_schools', "");
                            trigger('work_status')
                          }}
                          value={watch('work_status')}>
                            <SelectTrigger className='mt-1'>
                              <SelectValue placeholder='Select employment status' />
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
                        
                        <div className="space-y-2">
                          <Label htmlFor='practice_category'>Practice Category <span className="text-red-500">*</span></Label>
                          <Select 
                          value={watch('practice_category')}
                          onValueChange={(value) => {
                            setValue('practice_category', value)
                            trigger('practice_category')
                          }}
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
                          <Label htmlFor='sub_category'>Sub Category <span className="text-red-500">*</span></Label>
                          <Select 
                          onValueChange={(value) => {
                            setValue('sub_category', value)
                            trigger('sub_category')
                          }}
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
                          <Label htmlFor='experience_years'>Experience <span className="text-red-500">*</span></Label>
                          <Select 
                          onValueChange={(value) => {
                            setValue('experience_years', value)
                            trigger('experience_years')
                          }}
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

                        {/* Practice Category */}
                        {watch('work_status') == "Employed" && (
                          <>
                        {/* Region */}
                        <div className="space-y-2">
                          <Label htmlFor='district'>Region <span className="text-red-500">*</span></Label>
                          <Select 
                          onValueChange={
                            (value) => {
                              setValue('district', value)
                              trigger('district')
                            }
                          }
                          value={watch('district')}>
                            <SelectTrigger className='mt-1'>
                              <SelectValue placeholder='Select district' />
                            </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='Central'>Central</SelectItem>
                                <SelectItem value='Chobe'>Chobe</SelectItem>
                                <SelectItem value='Ghanzi'>Ghanzi</SelectItem>
                                <SelectItem value='Kgalagadi'>Kgalagadi</SelectItem>
                                <SelectItem value='Kgatleng'>Kgatleng</SelectItem>
                                <SelectItem value='Kweneng'>Kweneng</SelectItem>
                                <SelectItem value='North-East'>North East</SelectItem>
                                <SelectItem value='North-West'>North West</SelectItem>
                                <SelectItem value='South-East'>South East</SelectItem>
                                <SelectItem value='Southern'>Southern</SelectItem>
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
                              setValue('school_level', ""); 
                              setValue('private_schools', ""); 
                              setValue('primary_schools', ""); 
                              setValue('junior_schools', ""); 
                              setValue('senior_schools', ""); 
                              trigger('institution_type')
                            }}
                            className="mt-3"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Public" id="institution-public" />
                              <Label htmlFor="institution-public">Public</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Private" id="institution-private" />
                              <Label htmlFor="institution-private">Private</Label>
                            </div>
                          </RadioGroup>
                          {errors.institution_type && (
                            <p className='text-sm text-red-500 mt-1'>{errors.institution_type.message}</p>
                          )}
                        </div>}

                        {/* School level */}
                        {<div className="space-y-2">
                          <Label htmlFor='school_level'>School Level <span className="text-red-500">*</span></Label>
                          <Select 
                          onValueChange={(value) => {
                            setValue('school_level', value);
                                setValue('private_schools', "");
                                setValue('primary_schools', "");
                                setValue('junior_schools', "");
                                setValue('senior_schools', "");
                                setValue('subject_specialization', "");
                                setValue('other_subject_specialization', "");
                                trigger('school_level');
                            }
                            }
                          value={watch('school_level')}>
                            <SelectTrigger className='mt-1'>
                              <SelectValue placeholder='Select school level' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='Pre-primary'>Pre-Primary</SelectItem>
                              <SelectItem value='Primary'>Primary</SelectItem>
                              <SelectItem value='Junior Secondary'>Junior School</SelectItem>
                              <SelectItem value='Senior Secondary'>Senior Secondary</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.school_level && (
                            <p className='text-sm text-red-500 mt-1'>{errors.school_level.message}</p>
                          )}
                        </div>}

                        {/* Private school */}
                        {watch('institution_type')?.toLowerCase() === 'private' && <div className='space-y-2'>
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
                                  <span className="truncate">
                                    {watch('private_schools') || "Select your school"}
                                  </span>
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput placeholder="Search school..."/>
                                  <CommandList>
                                    <CommandEmpty>No school found.</CommandEmpty>
                                    <CommandGroup>
                                      {watch('school_level')?.toLowerCase() === 'primary' && watch('district')?.toLowerCase() === 'central' && centralPrivatePrimarySchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.value}
                                          onSelect={(currentValue) => {
                                            const selectedSchool = centralPrivatePrimarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                            setValue('private_schools', selectedSchool?.label || currentValue);
                                            setPrivateOpen(false)
                                            trigger('private_schools')
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
                                        value={school.value}
                                        onSelect={(currentValue) => {
                                          const selectedSchool = chobePrivatePrimarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                          setValue('private_schools', selectedSchool?.label || currentValue);
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
                                        value={school.value}
                                        onSelect={(currentValue) => {
                                          const selectedSchool = ghanziPrivatePrimarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                          setValue('private_schools', selectedSchool?.label || currentValue);
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
                                        value={school.value}
                                        onSelect={(currentValue) => {
                                          const selectedSchool = kgalagadiPrivatePrimarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                          setValue('private_schools', selectedSchool?.label || currentValue);
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
                                        value={school.value}
                                        onSelect={(currentValue) => {
                                          const selectedSchool = kgatlengPrivatePrimarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                          setValue('private_schools', selectedSchool?.label || currentValue);
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
                                        value={school.value}
                                        onSelect={(currentValue) => {
                                          const selectedSchool = kwenengPrivatePrimarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                          setValue('private_schools', selectedSchool?.label || currentValue);
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
                                        value={school.value}
                                        onSelect={(currentValue) => {
                                          const selectedSchool = northEastPrivatePrimarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                          setValue('private_schools', selectedSchool?.label || currentValue);
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
                                        value={school.value}
                                        onSelect={(currentValue) => {
                                          const selectedSchool = northWestPrivatePrimarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                          setValue('private_schools', selectedSchool?.label || currentValue);
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
                                        value={school.value}
                                        onSelect={(currentValue) => {
                                          const selectedSchool = southEastPrivatePrimarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                          setValue('private_schools', selectedSchool?.label || currentValue);
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
                                        value={school.value}
                                        onSelect={(currentValue) => {
                                          const selectedSchool = southernPrivatePrimarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                          setValue('private_schools', selectedSchool?.label || currentValue);
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
                                      {(watch('school_level')?.toLowerCase() === 'junior secondary' || watch('school_level')?.toLowerCase() === 'senior secondary') && watch('district')?.toLowerCase() === 'central' && centralPrivateSecondarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.value}
                                        onSelect={(currentValue) => {
                                          const selectedSchool = centralPrivateSecondarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                          setValue('private_schools', selectedSchool?.label || currentValue);
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
                                      {(watch('school_level')?.toLowerCase() === 'junior secondary' || watch('school_level')?.toLowerCase() === 'senior secondary') && watch('district')?.toLowerCase() === 'chobe' && chobePrivateSecondarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.value}
                                        onSelect={(currentValue) => {
                                          const selectedSchool = chobePrivateSecondarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                          setValue('private_schools', selectedSchool?.label || currentValue);
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
                                      {(watch('school_level')?.toLowerCase() === 'junior secondary' || watch('school_level')?.toLowerCase() === 'senior secondary') && watch('district')?.toLowerCase() === 'ghanzi' && ghanziPrivateSecondarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.value}
                                        onSelect={(currentValue) => {
                                          const selectedSchool = ghanziPrivateSecondarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                          setValue('private_schools', selectedSchool?.label || currentValue);
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
                                      {(watch('school_level')?.toLowerCase() === 'junior secondary' || watch('school_level')?.toLowerCase() === 'senior secondary') && watch('district')?.toLowerCase() === 'kgalagadi' && kgalagadiPrivateSecondarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.value}
                                        onSelect={(currentValue) => {
                                          const selectedSchool = kgalagadiPrivateSecondarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                          setValue('private_schools', selectedSchool?.label || currentValue);
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
                                      {(watch('school_level')?.toLowerCase() === 'junior secondary' || watch('school_level')?.toLowerCase() === 'senior secondary') && watch('district')?.toLowerCase() === 'kgatleng' && kgatlengPrivateSecondarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.value}
                                        onSelect={(currentValue) => {
                                          const selectedSchool = kgatlengPrivateSecondarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                          setValue('private_schools', selectedSchool?.label || currentValue);
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
                                      {(watch('school_level')?.toLowerCase() === 'junior secondary' || watch('school_level')?.toLowerCase() === 'senior secondary') && watch('district')?.toLowerCase() === 'kweneng' && kwenengPrivateSecondarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.value}
                                        onSelect={(currentValue) => {
                                          const selectedSchool = kwenengPrivateSecondarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                          setValue('private_schools', selectedSchool?.label || currentValue);
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
                                      {(watch('school_level')?.toLowerCase() === 'junior secondary' || watch('school_level')?.toLowerCase() === 'senior secondary') && watch('district')?.toLowerCase() === 'north-east' && northEastPrivateSecondarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.value}
                                        onSelect={(currentValue) => {
                                          const selectedSchool = northEastPrivateSecondarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                          setValue('private_schools', selectedSchool?.label || currentValue);
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
                                      {(watch('school_level')?.toLowerCase() === 'junior secondary' || watch('school_level')?.toLowerCase() === 'senior secondary') && watch('district')?.toLowerCase() === 'north-west' && northWestPrivateSecondarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.value}
                                        onSelect={(currentValue) => {
                                          const selectedSchool = northWestPrivateSecondarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                          setValue('private_schools', selectedSchool?.label || currentValue);
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
                                      {(watch('school_level')?.toLowerCase() === 'junior secondary' || watch('school_level')?.toLowerCase() === 'senior secondary') && watch('district')?.toLowerCase() === 'south-east' && southEastPrivateSecondarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.value}
                                        onSelect={(currentValue) => {
                                          const selectedSchool = southEastPrivateSecondarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                          setValue('private_schools', selectedSchool?.label || currentValue);
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
                                      {(watch('school_level')?.toLowerCase() === 'junior secondary' || watch('school_level')?.toLowerCase() === 'senior secondary') && watch('district')?.toLowerCase() === 'southern' && southernPrivateSecondarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.value}
                                        onSelect={(currentValue) => {
                                          const selectedSchool = southernPrivateSecondarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                          setValue('private_schools', selectedSchool?.label || currentValue);
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
                        {watch('school_level')?.toLowerCase()  === 'primary' && watch('institution_type')?.toLowerCase()  === 'public' && <div className='space-y-2'>
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
                                  <span className="truncate">
                                    {watch('primary_schools') || "Select your school"}
                                  </span>
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput placeholder="Search school..."/>
                                  <CommandList>
                                    <CommandEmpty>No school found.</CommandEmpty>
                                    <CommandGroup>
                                      {watch('school_level')?.toLowerCase() === 'primary' && watch('district')?.toLowerCase()  === 'central' && centralPrimarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.value}
                                        onSelect={(currentValue) => {
                                          const selectedSchool = centralPrimarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                          setValue('primary_schools', selectedSchool?.label || currentValue);
                                          setPrimaryOpen(false)
                                          trigger('primary_schools')
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
                                      {watch('district')?.toLowerCase()  === 'chobe' && chobePrimarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.value}
                                        onSelect={(currentValue) => {
                                          const selectedSchool = chobePrimarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                          setValue('primary_schools', selectedSchool?.label || currentValue);
                                          setPrimaryOpen(false)
                                          trigger('primary_schools')
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
                                      {watch('district')?.toLowerCase()  === 'ghanzi' && ghanziPrimarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.value}
                                        onSelect={(currentValue) => {
                                          const selectedSchool = ghanziPrimarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                          setValue('primary_schools', selectedSchool?.label || currentValue);
                                          setPrimaryOpen(false)
                                          trigger('primary_schools')
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
                                      {watch('district')?.toLowerCase()  === 'kgalagadi' && kgalagadiPrimarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.value}
                                        onSelect={(currentValue) => {
                                          const selectedSchool = kgalagadiPrimarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                          setValue('primary_schools', selectedSchool?.label || currentValue);
                                          setPrimaryOpen(false)
                                          trigger('primary_schools')
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
                                      {watch('district')?.toLowerCase()  === 'kgatleng' && kgatlengPrimarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.value}
                                        onSelect={(currentValue) => {
                                          const selectedSchool = kgatlengPrimarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                          setValue('primary_schools', selectedSchool?.label || currentValue);
                                          setPrimaryOpen(false)
                                          trigger('primary_schools')
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
                                      {watch('district')?.toLowerCase()  === 'kweneng' && kwenengPrimarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.value}
                                        onSelect={(currentValue) => {
                                          const selectedSchool = kwenengPrimarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                          setValue('primary_schools', selectedSchool?.label || currentValue);
                                          setPrimaryOpen(false)
                                          trigger('primary_schools')
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
                                      {watch('district')?.toLowerCase()  === 'north-east' && northEastPrimarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.value}
                                        onSelect={(currentValue) => {
                                          const selectedSchool = northEastPrimarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                          setValue('primary_schools', selectedSchool?.label || currentValue);
                                          setPrimaryOpen(false)
                                          trigger('primary_schools')
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
                                      { watch('district')?.toLowerCase() === 'north-west' && northWestPrimarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.value}
                                        onSelect={(currentValue) => {
                                          const selectedSchool = northWestPrimarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                          setValue('primary_schools', selectedSchool?.label || currentValue);
                                          setPrimaryOpen(false)
                                          trigger('primary_schools')
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
                                      {watch('district')?.toLowerCase() === 'south-east' && southEastPrimarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.value}
                                        onSelect={(currentValue) => {
                                          const selectedSchool = southEastPrimarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                          setValue('primary_schools', selectedSchool?.label || currentValue);
                                          setPrimaryOpen(false)
                                          trigger('primary_schools')
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
                                      {watch('district')?.toLowerCase() === 'southern' && southernPrimarySchoolsForSelect.map((school) => (
                                      <CommandItem
                                        key={school.value}
                                        value={school.value}
                                        onSelect={(currentValue) => {
                                          const selectedSchool = southernPrimarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                          setValue('primary_schools', selectedSchool?.label || currentValue);
                                          setPrimaryOpen(false)
                                          trigger('primary_schools')
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
                        {watch('other_primary_schools')?.toLowerCase()  === 'other' && watch('institution_type')?.toLowerCase()  === 'public' && <div className="space-y-2">
                          <Label htmlFor='other_primary_schools'>Other Primary School <span className="text-red-500">*</span></Label>
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
                        {watch('school_level')?.toLowerCase()  === 'junior secondary' && watch('institution_type')?.toLowerCase()  === 'public' && <div className='space-y-2'>
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
                                  <span className="truncate">
                                    {watch('junior_schools') || "Select your school"}
                                  </span>
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput placeholder="Search school..." />
                                  <CommandList>
                                    <CommandEmpty>No school found.</CommandEmpty>
                                    <CommandGroup>
                                      {watch('district')?.toLowerCase() === 'central' && centralPublicSchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.value}
                                          onSelect={(currentValue) => {
                                            const selectedSchool = centralPublicSchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                            setValue('junior_schools', selectedSchool?.label || currentValue);
                                            setJuniorOpen(false)
                                            trigger('junior_schools')
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
                                      {watch('district')?.toLowerCase() === 'chobe' && chobePublicSchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.value}
                                          onSelect={(currentValue) => {
                                            const selectedSchool = chobePublicSchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                            setValue('junior_schools', selectedSchool?.label || currentValue);
                                            setJuniorOpen(false)
                                            trigger('junior_schools')
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
                                      {watch('district')?.toLowerCase() === 'ghanzi' && ghanziPublicSchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.value}
                                          onSelect={(currentValue) => {
                                            const selectedSchool = ghanziPublicSchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                            setValue('junior_schools', selectedSchool?.label || currentValue);
                                            setJuniorOpen(false)
                                            trigger('junior_schools')
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
                                      {watch('district')?.toLowerCase() === 'kgalagadi' && kgalagadiPublicSchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.value}
                                          onSelect={(currentValue) => {
                                            const selectedSchool = kgalagadiPublicSchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                            setValue('junior_schools', selectedSchool?.label || currentValue);
                                            setJuniorOpen(false)
                                            trigger('junior_schools')
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
                                      {watch('district')?.toLowerCase() === 'kgatleng' && kgatlengPublicSchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.value}
                                          onSelect={(currentValue) => {
                                            const selectedSchool = kgatlengPublicSchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                            setValue('junior_schools', selectedSchool?.label || currentValue);
                                            setJuniorOpen(false)
                                            trigger('junior_schools')
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
                                      {watch('district')?.toLowerCase() === 'kweneng' && kwenengPublicSchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.value}
                                          onSelect={(currentValue) => {
                                            const selectedSchool = kwenengPublicSchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                            setValue('junior_schools', selectedSchool?.label || currentValue);
                                            setJuniorOpen(false)
                                            trigger('junior_schools')
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
                                      {watch('district')?.toLowerCase() === 'north-east' && northEastPublicSchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.value}
                                          onSelect={(currentValue) => {
                                            const selectedSchool = northEastPublicSchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                            setValue('junior_schools', selectedSchool?.label || currentValue);
                                            setJuniorOpen(false)
                                            trigger('junior_schools')
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
                                      {watch('district')?.toLowerCase() === 'north-west' && northWestPublicSchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.value}
                                          onSelect={(currentValue) => {
                                            const selectedSchool = northWestPublicSchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                            setValue('junior_schools', selectedSchool?.label || currentValue);
                                            setJuniorOpen(false)
                                            trigger('junior_schools')
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
                                      {watch('district')?.toLowerCase() === 'south-east' && southEastPublicSchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.value}
                                          onSelect={(currentValue) => {
                                            const selectedSchool = southEastPublicSchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                            setValue('junior_schools', selectedSchool?.label || currentValue);
                                            setJuniorOpen(false)
                                            trigger('junior_schools')
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
                                      {watch('district')?.toLowerCase() === 'southern' && southernPublicSchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.value}
                                          onSelect={(currentValue) => {
                                            const selectedSchool = southernPublicSchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                            setValue('junior_schools', selectedSchool?.label || currentValue);
                                            setJuniorOpen(false)
                                            trigger('junior_schools')
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
                        {watch('other_junior_schools')?.toLowerCase()  === 'other' && watch('institution_type')?.toLowerCase()  === 'public' && <div className="space-y-2">
                          <Label htmlFor='other_junior_schools'>Other Junior School <span className="text-red-500">*</span></Label>
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
                        {watch('school_level')?.toLowerCase()  === 'senior secondary' && watch('institution_type')?.toLowerCase()  === 'public' && <div className='space-y-2'>
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
                                  <span className="truncate">
                                    {watch('senior_schools') || "Select your school"}
                                  </span>
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput placeholder="Search school..."/>
                                  <CommandList>
                                    <CommandEmpty>No school found.</CommandEmpty>
                                    <CommandGroup>
                                      {watch('district')?.toLowerCase() === "central"  && centralSeniorSecondarySchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.value}
                                          onSelect={(currentValue) => {
                                            const selectedSchool = centralSeniorSecondarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                            setValue('senior_schools', selectedSchool?.label || currentValue);
                                            setSeniorOpen(false)
                                            trigger('senior_schools')
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
                                      {watch('district')?.toLowerCase() === "chobe" && chobeSeniorSecondarySchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.value}
                                          onSelect={(currentValue) => {
                                            const selectedSchool = chobeSeniorSecondarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                            setValue('senior_schools', selectedSchool?.label || currentValue);
                                            setSeniorOpen(false)
                                            trigger('senior_schools')
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
                                      {watch('district')?.toLowerCase()  === "ghanzi" && ghanziSeniorSecondarySchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.value}
                                          onSelect={(currentValue) => {
                                            const selectedSchool = ghanziSeniorSecondarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                            setValue('senior_schools', selectedSchool?.label || currentValue);
                                            setSeniorOpen(false)
                                            trigger('senior_schools')
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
                                      {watch('district')?.toLowerCase()  === "kgalagadi" && kgalagadiSeniorSecondarySchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.value}
                                          onSelect={(currentValue) => {
                                            const selectedSchool = kgalagadiSeniorSecondarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                            setValue('senior_schools', selectedSchool?.label || currentValue);
                                            setSeniorOpen(false)
                                            trigger('senior_schools')
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
                                      {watch('district')?.toLowerCase()  === "kgatleng" && kgatlengSeniorSecondarySchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.value}
                                          onSelect={(currentValue) => {
                                            const selectedSchool = kgatlengSeniorSecondarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                            setValue('senior_schools', selectedSchool?.label || currentValue);
                                            setSeniorOpen(false)
                                            trigger('senior_schools')
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
                                      {watch('district')?.toLowerCase()  === "kweneng" && kwenengSeniorSecondarySchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.value}
                                          onSelect={(currentValue) => {
                                            const selectedSchool = kwenengSeniorSecondarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                            setValue('senior_schools', selectedSchool?.label || currentValue);
                                            setSeniorOpen(false)
                                            trigger('senior_schools')
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
                                      {watch('district')?.toLowerCase()  === "north-east" && northEastSeniorSecondarySchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.value}
                                          onSelect={(currentValue) => {
                                            const selectedSchool = northEastSeniorSecondarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                            setValue('senior_schools', selectedSchool?.label || currentValue);
                                            setSeniorOpen(false)
                                            trigger('senior_schools')
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
                                      {watch('district')?.toLowerCase()  === "north-west" && northWestSeniorSecondarySchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.value}
                                          onSelect={(currentValue) => {
                                            const selectedSchool = northWestSeniorSecondarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                            setValue('senior_schools', selectedSchool?.label || currentValue);
                                            setSeniorOpen(false)
                                            trigger('senior_schools')
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
                                      {watch('district')?.toLowerCase()  === "south-east" && southEastSeniorSecondarySchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.value}
                                          onSelect={(currentValue) => {
                                            const selectedSchool = southEastSeniorSecondarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                            setValue('senior_schools', selectedSchool?.label || currentValue);
                                            setSeniorOpen(false)
                                            trigger('senior_schools')
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
                                      {watch('district')?.toLowerCase()  === "southern" && southernSeniorSecondarySchoolsForSelect.map((school) => (
                                        <CommandItem
                                          key={school.value}
                                          value={school.value}
                                          onSelect={(currentValue) => {
                                            const selectedSchool = southernSeniorSecondarySchoolsForSelect.find((d) => d.value.toLowerCase() === currentValue.toLowerCase());
                                            setValue('senior_schools', selectedSchool?.label || currentValue);
                                            setSeniorOpen(false)
                                            trigger('senior_schools')
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
                        {watch('senior_schools')?.toLowerCase() === 'other' && watch('institution_type')?.toLowerCase()  === 'public' && <div className="space-y-2">
                          <Label htmlFor='other_senior_schools'>Other Senior School <span className="text-red-500">*</span></Label>
                          <Input
                            id='other_senior_schools'
                            {...register('other_senior_schools')}
                            className='mt-1'
                          />
                          {errors.other_senior_schools && (
                            <p className='text-sm text-red-500 mt-1'>{errors.other_senior_schools.message}</p>
                          )}
                        </div>}
                        </>
                        )}

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
                  <Card className='border-0 shadow-none'>
                    <CardHeader>
                      <CardTitle>Qualifications</CardTitle>
                      <CardDescription>
                        Please provide details about your educational qualifications.
                          <p className="mt-1 italic text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">
                            Scroll down to continue filling out the form and access the navigation items.
                          </p>
                          <div>
                            <span className="text-red-500">*</span>
                            <span className="italic text-xs">=Required</span>
                          </div>  
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        
                        {/* Level */}
                        <div className='space-y-2'>
                          <Label htmlFor='level'>Teaching Qualification Level <span className="text-red-500">*</span></Label>
                          <Select 
                            onValueChange={(value: string) => {
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
                              trigger('level')
                            }}
                            value={watch('level')}
                          >
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
                              <SelectItem value="Doctoral Degree">Doctoral Degree</SelectItem>
                              {/* <SelectItem value="Other">Other</SelectItem> */}
                            </SelectContent>
                          </Select>
                          {errors.level && (
                            <p className='text-sm text-red-500 mt-1'>{errors.level.message}</p>
                          )}
                        </div>

                        {/* Doctoral Degree */}
                        {watch('level') === "Doctoral Degree" && (
                          <div className='space-y-2'>
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
                                  <span className="truncate">
                                    {watch('qualification_doctoral_degree') || "Select your Degree"}
                                  </span>
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
                                          value={doctorate.value}
                                          onSelect={(currentValue) => {
                                            const selectedDoctorate = doctorateForSelect.find(
                                              (d) => d.value.toLowerCase() === currentValue.toLowerCase()
                                            );
                                            setValue('qualification_doctoral_degree', selectedDoctorate?.label || currentValue);
                                            setDoctoralDegreeOpen(false);
                                            trigger('qualification_doctoral_degree')
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
                          </div>
                        )}

                        {/* Master's Degree */}
                        {watch('level') === "Master's Degree" && (
                          <div className='space-y-2'>
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
                                  <span className="truncate">
                                    {watch('qualification_masters_degree') || "Search your master's degree"}
                                  </span>
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
                                          value={masters.value}
                                          onSelect={(currentValue) => {
                                            const selectedMasters = mastersForSelect.find(
                                              (m) => m.value.toLowerCase() === currentValue.toLowerCase()
                                            );
                                            setValue('qualification_masters_degree', selectedMasters?.label || currentValue);
                                            setMastersOpen(false);
                                            trigger('qualification_masters_degree')
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
                          </div>
                        )}

                        {/* Bachelor's Degree Honours */}
                        {watch('level') === "Bachelor's Degree Honours" && (
                          <div className='space-y-2'>
                            <Label htmlFor='qualification_degree_honours' className="text-sm font-medium text-gray-700">
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
                                  <span className="truncate">
                                    {watch('qualification_degree_honours') || "Select your Degree"}
                                  </span>
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput placeholder="Search degree..." />
                                  <CommandList>
                                    <CommandEmpty>No Honour&apos;s degree found.</CommandEmpty>
                                    <CommandGroup>
                                      {honoursForSelect.map((degree) => (
                                        <CommandItem
                                          key={degree.value}
                                          value={degree.value}
                                          onSelect={(currentValue) => {
                                            const selectedHonours = honoursForSelect.find(
                                              (d) => d.value.toLowerCase() === currentValue.toLowerCase()
                                            );
                                            setValue('qualification_degree_honours', selectedHonours?.label || currentValue);
                                            setHonoursOpen(false);
                                            trigger('qualification_degree_honours')
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
                          </div>
                        )}

                        {/* Diploma */}
                        {watch('level') === 'Diploma' && (
                          <div className='space-y-2'>
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
                                  <span className="truncate">
                                    {watch('qualification_diploma') || "Select your diploma"}
                                  </span>
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput placeholder="Search diploma..." />
                                  <CommandList>
                                    <CommandEmpty>No diploma found.</CommandEmpty>
                                    <CommandGroup>
                                      {diplomasForSelect.map((diploma) => (
                                        <CommandItem
                                          key={diploma.value}
                                          value={diploma.value}
                                          onSelect={(currentValue) => {
                                            const selectedDiploma = diplomasForSelect.find(
                                              (d) => d.value.toLowerCase() === currentValue.toLowerCase()
                                            );
                                            setValue('qualification_diploma', selectedDiploma?.label || currentValue);
                                            setDiplomaOpen(false);
                                            trigger('qualification_diploma')
                                          }}
                                        >
                                          {diploma.label}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              watch('qualification_diploma') === diploma.label ? "opacity-100" : "opacity-0"
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
                          </div>
                        )}

                        {/* Post-Graduate Diploma */}
                        {watch('level') === 'Post-Graduate Diploma' && (
                          <div className='space-y-2'>
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
                                  <span className="truncate">
                                    {watch('qualification_post_grad_diploma') || "Select your diploma"}
                                  </span>
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput placeholder="Search post grad diploma..." />
                                  <CommandList>
                                    <CommandEmpty>No post grad diploma found.</CommandEmpty>
                                    <CommandGroup>
                                      {postGraduateDiplomasForSelect.map((diploma) => (
                                        <CommandItem
                                          key={diploma.value}
                                          value={diploma.value}
                                          onSelect={(currentValue) => {
                                            const selectedDiploma = postGraduateDiplomasForSelect.find(
                                              (d) => d.value.toLowerCase() === currentValue.toLowerCase()
                                            );
                                            setValue('qualification_post_grad_diploma', selectedDiploma?.label || currentValue);
                                            setPostGradDiplomaOpen(false);
                                            trigger('qualification_post_grad_diploma')
                                          }}
                                        >
                                          {diploma.label}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              watch('qualification_post_grad_diploma') === diploma.label ? "opacity-100" : "opacity-0"
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
                          </div>
                        )}

                        {/* Bachelor's Degree */}
                        {watch('level') === "Bachelor's Degree" && (
                          <div className='space-y-2'>
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
                                  <span className="truncate">
                                    {watch('qualification_degree') || "Select your Bachelor's Degree"}
                                  </span>
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
                                          value={degree.value}
                                          onSelect={(currentValue) => {
                                            const selectedDegree = degreeForSelect.find(
                                              (d) => d.value.toLowerCase() === currentValue.toLowerCase()
                                            );
                                            setValue('qualification_degree', selectedDegree?.label || currentValue);
                                            setDegreeOpen(false);
                                            trigger('qualification_degree')
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
                          </div>
                        )}

                        {/* Certificate */}
                        {watch('level') === "Certificate" && (
                          <div>
                            <Label htmlFor='qualification_certificate'>Qualification Certificate <span className="text-red-500">*</span></Label>
                            <Select 
                              onValueChange={(value) => {
                                setValue('qualification_certificate', value)
                                trigger('qualification_certificate')
                               }
                              }
                              value={watch('qualification_certificate')
                                
                              }
                            >
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
                                <SelectItem value='Other'>Other</SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.qualification_certificate && (
                              <p className='text-sm text-red-500 mt-1'>{errors.qualification_certificate.message}</p>
                            )}
                        </div>
                        )}

                        {/* Other qualification */}
                        {(watch('qualification_certificate') || watch('qualification_degree') || 
                          watch('qualification_masters_degree') || watch('qualification_doctoral_degree' ) || watch('qualification_diploma') || 
                          watch('qualification_post_grad_diploma') || watch('qualification_degree_honours')) === "Other" && (
                          <div>
                            <Label htmlFor='other_qualification'>Other qualification <span className="text-red-500">*</span></Label>
                            <Input
                              id='other_qualification'
                              {...register('other_qualification')}
                              className='mt-1'
                            />
                            {errors.other_qualification && (
                              <p className='text-sm text-red-500 mt-1'>{errors.other_qualification.message}</p>
                            )}
                          </div>
                        )}

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
                                  <span className="truncate">
                                    {watch('institution') || "Select your institution"}
                                  </span>
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
                                          value={institution.value}
                                          onSelect={(currentValue) => {
                                            const selectedInstitution = institutionForSelect.find(
                                              (i) => i.value.toLowerCase() === currentValue.toLowerCase()
                                            );
                                            setValue('institution', selectedInstitution?.label || currentValue);
                                            setInstitutionOpen(false);
                                            trigger('institution');
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
                        {watch('institution')?.toLowerCase() === "other" && (
                          <div className='space-y-2'>
                            <Label htmlFor='other_institution'>Institution Name <span className="text-red-500">*</span></Label>
                            <Input
                              id='other_institution'
                              {...register('other_institution')}
                              className='mt-1'
                              placeholder="Enter your institution name"
                            />
                            {errors.other_institution && (
                              <p className='text-sm text-red-500 mt-1'>{errors.other_institution.message}</p>
                            )}
                          </div>
                        )}

                        {/* Qualification Year */}
                        <div className='space-y-2'>
                          <Label htmlFor='qualification_year'>Qualification Year <span className="text-red-500">*</span></Label>
                          <div>
                            <Input
                              id='qualification_year'
                              type='text'
                              placeholder='Enter year (e.g., 2000)'
                              maxLength={4}
                              {...register('qualification_year')}
                              className={errors.qualification_year ? 'border-red-500' : ''}
                              onChange={(e) => {
                                // Allow only numbers and limit to 4 characters
                                const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                                setValue('qualification_year', value);
                                trigger('qualification_year');
                              }}
                              onBlur={() => {
                                trigger('qualification_year');
                              }}
                            />
                          </div>
                          {errors.qualification_year && (
                            <p className='text-sm text-red-500 mt-1'>{errors.qualification_year.message}</p>
                          )}
                        </div>
                        {/* <div className='space-y-2'>
                          <Label htmlFor='qualification_year'>Qualification Year *</Label>
                          <div>
                            <Select
                              onValueChange={(value) => setValue('qualification_year', value)}
                              defaultValue={watch('qualification_year')}
                            >
                              <SelectTrigger className='mt-1'>
                                <SelectValue placeholder="Select a year" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 2025 - 1950 + 1 }, (_, i) => 2025 - i).map((year) => (
                                  <SelectItem key={year} value={year.toString()}>
                                    {year}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <input
                              type="hidden"
                              {...register('qualification_year', {
                                required: 'Qualification year is required',
                                validate: (value) => {
                                  const year = parseInt(value);
                                  if (isNaN(year) || year < 1950 || year > 2025) {
                                    return 'Please select a year between 1950 and 2026';
                                  }
                                  return true;
                                }
                              })}
                            />
                          </div>
                          {errors.qualification_year && (
                            <p className='text-sm text-red-500 mt-1'>{errors.qualification_year.message}</p>
                          )}
                        </div> */}

                        {/* Subject Specialization - Made Optional */}
                        <div className='space-y-2'>
                          <Label htmlFor='subject_specialization' className="text-sm font-medium text-gray-700">
                            Subject Specialization
                            <span className="text-gray-500 font-normal ml-1">
                              (Required when school level is secondary)
                            </span>
                          </Label>
                          <Popover open={subjectOpen} onOpenChange={setSubjectOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={subjectOpen}
                                className="w-full justify-between text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              >
                                <span className="truncate">
                                  {watch('subject_specialization') || "Select your specialization"}
                                </span>
                                <ChevronsUpDown className="opacity-50 ml-2 flex-shrink-0" />
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
                                        value={subject_specialization.value}
                                        onSelect={(currentValue) => {
                                          const selectedSubject = subjectSpecializationForSelect.find(
                                            (s) => s.value.toLowerCase() === currentValue.toLowerCase()
                                          );
                                          setValue('subject_specialization', selectedSubject?.label || currentValue);
                                          setSubjectOpen(false);
                                        }}
                                        className="flex items-center justify-between"
                                      >
                                        <span className="truncate flex-1 mr-2">{subject_specialization.label}</span>
                                        <Check
                                          className={cn(
                                            "flex-shrink-0",
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

                        {watch('subject_specialization')?.toLowerCase() === "other" && (
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
                          </div>
                        )}

                        {/* Mandatory Qualification Document Upload */}
                        <div className='space-y-2'>
                          <Label className="text-sm font-medium text-gray-700">Upload Qualification Document <span className="text-red-500">*</span></Label>
                          <FileUpload
                            name="attachments"
                            label="Attach a pdf copy of your qualification document"
                            description="Attach a pdf copy of your qualification document"
                            acceptedTypes=".pdf,.jpg,.jpeg,.png"
                            maxSize={5}
                            required={true}
                            value={mandatoryDoc}
                            onChange={(file) => {
                              setMandatoryDoc(file);
                              if (file) {
                                setValue('attachments', file);
                                trigger('attachments');
                              }
                            }}
                            error={errors.attachments?.message as string | undefined}
                            compact
                          />
                        </div>
                      </div>  

                        
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

              {/* Step 5: Declarations & Disclosures */}
              {currentStep === 4 && (
                <motion.div
                  initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <Card className='border-0 shadow-none'>
                    <CardHeader>
                      <CardTitle>Declarations & Disclosures</CardTitle>
                      <CardDescription>
                        Please answer all questions truthfully and provide supporting documentation where required.
                          <p className="mt-1 italic text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">
                            Scroll down to continue filling out the form and access the navigation items.
                          </p>         
                          <div>
                            <span className="text-red-500">*</span>
                            <span className="italic text-xs">=Required</span>
                          </div>   
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
                            trigger('disability')
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
                        {errors.disability && (
                          <p className='text-sm text-red-500 mt-1'>{errors.disability.message}</p>
                        )}
                        {watch('disability') === 'yes' && (
                          <div className="mt-4">
                            <Label htmlFor="disability_description">Choose all that apply</Label>
                            <div className="mt-2 space-y-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
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
                              {errors.disability_description && (
                                <p className='text-sm text-red-500 mt-1'>{errors.disability_description.message}</p>
                              )}
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
                            setStudentRelatedOffenceAttachmentDoc(null); // Reset details
                            trigger('student_related_offence')
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
                        {errors.student_related_offence && (
                          <p className='text-sm text-red-500 mt-1'>{errors.student_related_offence.message}</p>
                        )}
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
                              {errors.student_related_offence_details && (
                                <p className='text-sm text-red-500 mt-1'>{errors.student_related_offence_details.message}</p>
                              )}
                            </div>
                            {/* watch('student_related_offence') === 'yes' ? true : false */}
                            <div className='col-span-2'>
                              <FileUpload
                                name="student_related_offence_attachments"
                                label="Attachments *"
                                description="Upload a clear copy"
                                acceptedTypes=".pdf,.jpg,.jpeg,.png"
                                maxSize={5}
                                required={false}
                                value={studentRelatedOffenceAttachmentDoc}
                                onChange={(file) => {
                                  setStudentRelatedOffenceAttachmentDoc(file);
                                  if (file) {
                                    setValue('student_related_offence_attachments', file);
                                    trigger('student_related_offence_attachments');
                                  }
                                }}
                                error={errors.student_related_offence_attachments?.message as string | undefined}
                                compact
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
                            setDrugRelatedOffenceAttachmentsDoc(null); // Reset attachments
                            trigger('drug_related_offence')
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
                        {errors.drug_related_offence && (
                          <p className='text-sm text-red-500 mt-1'>{errors.drug_related_offence.message}</p>
                        )}
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
                              {errors.drug_related_offence_details && (
                                <p className='text-sm text-red-500 mt-1'>{errors.drug_related_offence_details.message}</p>
                              )}
                            </div>
                            <div>
                              <Label htmlFor="drug_related_offence_details">Provide supporting evidence/documentation if any (Upload in pdf format)</Label>
                              <FileUpload
                                name="drug_related_offence_attachments"
                                label="Attachments *"
                                description="Upload a clear copy of your National ID"
                                acceptedTypes=".pdf,.jpg,.jpeg,.png"
                                maxSize={5}
                                required={false}
                                value={drugRelatedOffenceAttachmentsDoc}
                                onChange={(file) => {
                                  setDrugRelatedOffenceAttachmentsDoc(file);
                                  if (file) {
                                    setValue('drug_related_offence_attachments', file);
                                    trigger('drug_related_offence_attachments');
                                  }
                                }}
                                error={errors.drug_related_offence_attachments?.message as string | undefined}
                                compact
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
                            setLicenseFlagDetailsDoc(null); // Reset details
                            trigger('license_flag')
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
                        {errors.license_flag && (
                          <p className='text-sm text-red-500 mt-1'>{errors.license_flag.message}</p>
                        )}
                        {watch('license_flag') === 'yes' && (
                          <div className="mt-4">
                              <Label>If yes, please attach a letter giving full details and official documentation of the action taken.</Label>
                              <FileUpload
                                name="license_flag_details"
                                label="Attachments *"
                                description="Upload a clear copy"
                                acceptedTypes=".pdf,.jpg,.jpeg,.png"
                                maxSize={5}
                                required={false}
                                value={licenseFlagDetailsDoc}
                                onChange={(file) => {
                                  setLicenseFlagDetailsDoc(file);
                                  if (file) {
                                    setValue('license_flag_details', file);
                                    trigger('license_flag_details');
                                  }
                                }}
                                error={errors.license_flag_details?.message as string | undefined}
                                compact
                              />
                          </div>
                        )}
                      </div>

                      {/* Professional misconduct */}
                      <div>
                        <Label className="text-base font-medium">Are you currently the subject of any review, enquiry or investigations by any Teaching Council or any Authority?</Label>
                        <RadioGroup 
                          value={watch('misconduct_flag')} 
                          onValueChange={(value) => {
                            setValue('misconduct_flag', value)
                            setMisconductFlagDetailsDoc(null); // Reset details
                            trigger('misconduct_flag')
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
                        {errors.misconduct_flag && (
                          <p className='text-sm text-red-500 mt-1'>{errors.misconduct_flag.message}</p>
                        )}
                        {watch('misconduct_flag') === 'yes' && (
                          <div className="mt-4">
                              <Label htmlFor="misconduct_flag_details">If yes, please attach a letter giving full details and any official documentation available regarding the matter.</Label>
                              <FileUpload
                                name="misconduct_flag_details"
                                label="Attachments *"
                                description="Upload a clear copy of your National ID"
                                acceptedTypes=".pdf,.jpg,.jpeg,.png"
                                maxSize={5}
                                required={false}
                                value={misconductFlagDetailsDoc}
                                onChange={(file) => {
                                  setMisconductFlagDetailsDoc(file);
                                  if (file) {
                                    setValue('misconduct_flag_details', file);
                                    trigger('misconduct_flag_details');
                                  }
                                }}
                                error={errors.misconduct_flag_details?.message as string | undefined}
                                compact
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
                  <Card className='border-0 shadow-none'>
                    <CardHeader>
                      <CardTitle>Review & Complete</CardTitle>
                      <CardDescription>
                        Please review your information and agree to the terms before submitting.
                          <p className="mt-1 italic text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">
                            Scroll down to continue filling out the form and access the navigation items.
                          </p>
                          <div>
                            <span className="text-red-500">*</span>
                            <span className="italic text-xs">=Required</span>
                          </div>  
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                      {/* Summary Section */}
                      <div className='bg-gray-50 p-4 rounded-lg'>
                        <Accordion
                          type="single"
                          collapsible
                          className="w-full"
                          defaultValue=""
                        >
                          {/* Step 1: Personal Information */}
                          <AccordionItem value="item-1">
                            <AccordionTrigger>Step 1: Personal Information</AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-4 text-balance">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoItem label="First Name" value={watch('first_name')} />
                                <InfoItem label="Last Name" value={watch('last_name')} />
                                {watch('middle_name') && <InfoItem label="Middle Name" value={watch('middle_name')} />}
                                {/* <InfoItem label="Surname" value={watch('surname')} /> */}
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
                                {watch('experience_years') && <InfoItem label="Years of Experience" value={watch('experience_years')} />}
                                {watch('district') && <InfoItem label="Region" value={watch('district')} />}
                                {watch('institution_type') && <InfoItem label="Institution Type" value={watch('institution_type')} />}
                                {watch('school_level') && <InfoItem label="School Level" value={watch('school_level')} />}
                                {watch('private_schools') && <InfoItem label="Level" value={watch('level')} />}
                                {watch('private_schools') && <InfoItem label="Private Schools" value={watch('private_schools')} />}
                                {watch('other_private_schools') && <InfoItem label="Other Private Schools" value={watch('other_private_schools')} />}
                                {watch('primary_schools') && <InfoItem label="Primary Schools" value={watch('primary_schools')} />}
                                {/* <InfoItem label="Pre-Primary Name" value={watch('pre_primary_name')} /> */}
                                {watch('other_primary_schools') && <InfoItem label="Other Primary Schools" value={watch('other_primary_schools')} />}
                                {watch('junior_schools') && <InfoItem label="Junior Schools" value={watch('junior_schools')} />}
                                {watch('other_junior_schools') && <InfoItem label="Other Junior Schools" value={watch('other_junior_schools')} />}
                                {watch('senior_schools') && <InfoItem label="Senior Schools" value={watch('senior_schools')} />}
                                {watch('other_senior_schools') && <InfoItem label="Other Senior Schools" value={watch('other_senior_schools')} />}
                                {watch('subject_specialization') && <InfoItem label="Subject Specialization" value={watch('subject_specialization')} /> }
                                {watch('other_subject_specialization') && <InfoItem label="Subject Specialization" value={watch('other_subject_specialization')} />}
                              </div>
                            </AccordionContent>
                          </AccordionItem>

                          {/* Step 4: Qualifications */}
                          <AccordionItem value="item-4">
                            <AccordionTrigger>Step 4: Qualifications</AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-4 text-balance">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {watch('qualification_certificate') && <InfoItem label="Certificate" value={watch('qualification_certificate')} />}
                                {watch('qualification_post_grad_certificate') && <InfoItem label="Post-Grad Certificate" value={watch('qualification_post_grad_certificate')} />}
                                {watch('qualification_diploma') && <InfoItem label="Diploma" value={watch('qualification_diploma')} />}
                                {watch('qualification_post_grad_diploma')&& <InfoItem label="Post-Grad Diploma" value={watch('qualification_post_grad_diploma')} />}
                                {watch('qualification_degree') && <InfoItem label="Degree" value={watch('qualification_degree')} />}
                                {watch('qualification_degree_honours') && <InfoItem label="Honours Degree" value={watch('qualification_degree_honours')} />}
                                {watch('qualification_masters_degree') && <InfoItem label="Masters Degree" value={watch('qualification_masters_degree')} />}
                                {watch('qualification_doctoral_degree') && <InfoItem label="Doctoral Degree" value={watch('qualification_doctoral_degree')} />}
                                {watch('other_qualification') && <InfoItem label="Other Qualification" value={watch('other_qualification')} />}
                                {watch('institution') && <InfoItem label="Institution" value={watch('institution')} />}
                                {watch('other_institution') && <InfoItem label="Other Institution" value={watch('other_institution')} />}
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
                            <AccordionTrigger>Step 5: Declarations & Disclosures</AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-4 text-balance">
                              <div className="grid grid-cols-1 gap-4">
                                <InfoItem label="Disability" value={watch('disability')} />
                                {watch('disability_description') && <InfoItem label="Disability Description" value={watch('disability_description')?.toString()} />}
                                <InfoItem label="Student Related Offence" value={watch('student_related_offence')} />
                                {watch('student_related_offence_details') && <InfoItem label="Student Offence Details" value={watch('student_related_offence_details')} />}
                                <InfoItem label="Drug Related Offence" value={watch('drug_related_offence')} />
                                {watch('drug_related_offence_details') && <InfoItem label="Drug Offence Details" value={watch('drug_related_offence_details')} />}
                                <InfoItem label="Licence Flag" value={watch('license_flag')} />
                                {watch('misconduct_flag') && <InfoItem label="Misconduct Flag" value={watch('misconduct_flag')} />}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>

                      {/* Declaration and Consent */}
                      <div className='space-y-4'>
                        {/* Declaration */}
                        <div className='flex items-start space-x-3'>
                          <Checkbox 
                            id='declaration'
                            checked={watch('declaration')}
                            onCheckedChange={
                              (checked) => {
                                setValue('declaration', checked as boolean);
                                trigger('declaration');
                              }
                            }
                            required
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

                        {/* Data Consent */}
                        <div className='flex items-start space-x-3'>
                          <Checkbox 
                            id='profile_data_consent'
                            checked={watch('profile_data_consent')}
                            onCheckedChange={(checked) => {
                              setValue('profile_data_consent', checked as boolean);
                              trigger('profile_data_consent');
                            }}
                            required
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

                        {/* Terms of service and data privacy */}
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="terms_and_conditions_of_use_and_privacy_policy"
                            checked={watch('terms_and_conditions_of_use_and_privacy_policy')}
                            onCheckedChange={(checked) => {
                              setValue('terms_and_conditions_of_use_and_privacy_policy', checked as boolean);
                              trigger('terms_and_conditions_of_use_and_privacy_policy')
                            }}
                            required
                            disabled={isLoading}
                          />
                          <Label
                            htmlFor="terms"
                            className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            I agree to the{" "}
                            <a 
                              href="/terms" 
                              className="font-medium text-primary underline-offset-4 hover:underline"
                              target="_blank"
                            >
                              Terms and Conditions of Use
                            </a>
                            {" "}
                            and{" "}
                            <a 
                              href="/privacy" 
                              className="font-medium text-primary underline-offset-4 hover:underline"
                              target="_blank"
                            >
                              Privacy Policy
                            </a> 
                          </Label>
                        </div>
                        {errors.terms_and_conditions_of_use_and_privacy_policy && (
                          <p className='text-sm text-red-500'>{errors.terms_and_conditions_of_use_and_privacy_policy.message}</p>
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
                
                <div className='md:block hidden items-center gap-2'>
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
                      className='bg-blue-600 hover:bg-blue-700 flex items-center gap-2'>Submit Application</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      {Object.keys(errors).length > 0 && (
                        <Alert variant="destructive" className="mb-4">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle className="text-base font-semibold">
                            {Object.keys(errors).length} {Object.keys(errors).length === 1 ? 'error' : 'errors'} found
                          </AlertTitle>
                          <AlertDescription>
                            <p className="text-sm mb-3">Please review and correct the following:</p>
                            <div className="max-h-48 overflow-y-auto">
                              <ul className="space-y-2">
                                {Object.entries(errors).map(([field, error]) => (
                                  <li key={field} className="flex items-start gap-2 text-sm">
                                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                                    <span className="font-medium text-red-900">
                                      {field
                                        .replace(/_/g, ' ')
                                        .replace(/\b\w/g, l => l.toUpperCase())
                                        .replace(/Id/g, 'ID')
                                        .replace(/Pdf/g, 'PDF')
                                        .replace(/Alt /g, '')
                                        .replace(/Primary /g, '')
                                      }
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </AlertDescription>
                        </Alert>
                      )}
                      {!submitting && !submissionResult && (
                        <>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-center text-blue-600">
                              Submit Teacher Registration Application?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-center">
                              <div className="space-y-4">
                                <div className="flex items-center justify-center">
                                  <svg className="w-12 h-12 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <div className="space-y-3 text-left">
                                  <p>
                                    You are about to submit your teacher registration application. Please review all the information you have provided carefully before proceeding.
                                  </p>
                                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                                    <p className="text-amber-800 text-sm">
                                      <strong>Important:</strong> Once submitted, your application will be sent for review and you will not be able to make changes until the review process is complete.
                                    </p>
                                  </div>
                                  <p>
                                    You will receive a confirmation notification and sms with your application reference number.
                                  </p>
                                </div>
                                <p className="font-medium text-blue-700">
                                  Are you ready to submit your application?
                                </p>
                              </div>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel 
                              onClick={() => {
                                setSubmitting(false);
                                setSubmissionResult(null);
                                // clearErrors();  // Clears all errors at once
                              }}
                            >
                              Return To Form
                            </AlertDialogCancel>
                            <Button 
                              onClick={submitForm}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Continue Submission
                            </Button>
                          </AlertDialogFooter>
                        </>
                      )}
                      {submitting && (
                        <>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-center">Submitting Application...</AlertDialogTitle>
                            <AlertDialogDescription className="text-center">
                              <div className="space-y-4">
                                <div className="flex items-center justify-center">
                                  <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
                                </div>
                                <div>
                                  Your application is being submitted. This may take a few moments depending on the size of your attachments and the current server load.
                                  Please wait while we process your application.
                                </div>
                              </div>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel 
                              onClick={() => setSubmitting(false)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Cancel Submission
                            </AlertDialogCancel>
                          </AlertDialogFooter>
                        </>
                      )}
                      {submissionResult?.success==true && !submitting && (
                        <>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-center text-green-600">
                              Application Submitted Successfully!
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-center">
                              <div className="space-y-4">
                                <div className="flex items-center justify-center">
                                  <svg className="w-12 h-12 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <div className="text-green-700">
                                  Your teacher registration application has been submitted successfully. 
                                  You will receive a confirmation email shortly with your application reference number:
                                  <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                                    <strong className="text-green-800 text-lg">{submissionResult.application_id}</strong>
                                  </div>
                                </div>
                              </div>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogAction 
                              onClick={() => setSubmissionResult(null)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Close
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </>
                      )}
                      {submissionResult?.success==false && (
                        <>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-red-600 flex items-center gap-2">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                              Application Submission Failed
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-red-700 bg-red-50 p-3 rounded-md border border-red-200">
                              {submissionError ? (
                                <>
                                  {submissionError}
                                </>
                              ):(
                                <>
                                  We encountered an error while submitting your application. Please check your internet connection and try again.
                                  If the problem persists, contact support.
                                </>
                              )}      
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogAction 
                              onClick={() => setSubmissionResult(null)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              Close
                            </AlertDialogAction>
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
            
        </div>
      </div>
      {/* </ScrollArea> */}
    </section>
  )
}

const ApplicationAlreadySubmitted = () => {
  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 p-6 rounded-r-lg">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="bg-green-100 rounded-full p-2">
            <Info className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Application Already Submitted
          </h3>
          <p className="text-gray-700 mb-4">
            You have already submitted your teacher registration application. 
            Visit your dashboard to view your application status and take any required actions.
          </p>
          <Link 
            href="/customer/dashboard"
            className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-medium group"
          >
            Go to Dashboard
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};