'use client'

import * as React from "react"
import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import FileUpload, { UploadResponse } from './file-upload'
//import { processAttachments, submitMisconductReport } from '@/lib/misconduct-report'
import { Profile, MisconductReportResponse } from '@/types/misconduct-report'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Check, ChevronsUpDown, FileText, Loader2, AlertCircle, ArrowRight, Info, Calendar as CalendarIcon } from 'lucide-react'
import { countryList } from "@/types/countries"
import { cn } from "@/lib/utils"
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
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { useRouter } from "next/navigation"
import { getAccessGroups } from "../auth/auth"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { getFieldLabel } from "../customer/dashboard/lib/get-field-info"

// Define form input types
type FormInputs = {
  // Personal Information
  first_name: string
  last_name: string
  middle_name?: string
  citizenship: 'citizen' | 'non-citizen'
  nationality?: string
  username: string
  date_of_birth: string
  gender: 'Male' | 'Female'
  national_id_copy?: any

  // Contact Information
  primary_phone: string
  primary_email: string
  primary_physical: string
  primary_postal: string

  // Misconduct Details
  nature_of_breach: string
  location_of_breach: string
  date_of_breach: string
  description_of_breach: string
  supporting_documents?: any

  // Review & Complete
  declaration: boolean
  profile_data_consent: boolean
  terms_and_conditions_of_use_and_privacy_policy: boolean
}

const steps = [
  {
    id: 'Step 1',
    name: 'Personal Information',
    fields: ['first_name', 'last_name', 'citizenship', 'nationality', 'middle_name', 'date_of_birth', 'gender','national_id_copy']
  },
  {
    id: 'Step 2',
    name: 'Contact Information',
    fields: ['primary_phone', 'primary_physical', 'primary_postal','primary_email']
  },
  {
    id: 'Step 3',
    name: 'Misconduct Details',
    fields: ['nature_of_breach', 'location_of_breach', 'date_of_breach', 'description_of_breach', 'supporting_documents']
  },
  { 
    id: 'Step 4', 
    name: 'Review & Complete', 
    fields: ['declaration', 'profile_data_consent','terms_and_conditions_of_use_and_privacy_policy'] 
  }
]

const countries = countryList.map((country) => ({
  value: country,
  label: country,
}));

export default function MisconductReportForm() {
  const [previousStep, setPreviousStep] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const delta = currentStep - previousStep

  const [nationalIdDoc, setNationalIdDoc] = useState<UploadResponse | null>(null)
  const [supportingDocuments, setSupportingDocuments] = useState<UploadResponse | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submissionResult, setSubmissionResult] = useState<MisconductReportResponse | null>(null)
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const { toast } = useToast();
  const [isLoadingForm, setIsLoadingForm] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const router = useRouter()
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [userId, setUserId] = useState('');
  const [status, setFormStatus] = useState('')

  const [countryOpen, setCountryOpen] = React.useState(false)

  useEffect(() => {
    const fetchId = async () => {
      const result = await getAccessGroups();
      if (result) {
        setUserId(result.nationalId || result.passportId || result.userid);
      }
    };
    fetchId();
  }, []);

  const [fields, setFields] = useState<string[]>([])

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

      
      const profile: Profile = {
        username: formData.username,
        first_name: formData.first_name,
        middle_name: formData.middle_name || "",
        last_name: formData.last_name || "",
        surname: formData.last_name,
        date_of_birth: formData.date_of_birth,
        citizenship: formData.citizenship,
        primary_email: formData.primary_email,
        primary_phone: formData.primary_phone,
        primary_physical: formData.primary_physical,
        primary_postal: formData.primary_postal,
        gender: formData.gender,
        nationality: formData.nationality || "",
      }

      // Simulated success response for testing
      setSubmissionResult({
        success: true,
        report_id: "TEST-123-456"
      });

      const processedFormData = {
        ...formData,
        national_id_copy: nationalIdDoc,
        supporting_documents: supportingDocuments,
      }
      
      const urlParams = new URLSearchParams(window.location.search);
      const draft_Id = urlParams.get('draftId');

                /**
           * Submit the misconduct report payload to the server.
           * Adjust URL, payload shape and headers to match your backend.
           */
          const submitMisconductReport = async (payload: Record<string, any>): Promise<any> => {
            try {
              const res = await fetch('/api/misconduct', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
              });

              if (!res.ok) {
                const text = await res.text();
                throw new Error(`Server error: ${res.status} ${text}`);
              }

              return await res.json();
            } catch (err) {
              console.error('submitMisconductReport error', err);
              throw err;
            }
          };
      
      /**
       * =====================================================
       * SUBMIT THE MISCONDUCT REPORT FORM
       * =====================================================
       */
      const result = await submitMisconductReport({
        ...processedFormData,
        profile,
        draft_Id: draft_Id || ''
      })
      setSubmissionResult(result)
      
      if (result?.success) {  
        setSubmitting(false)
        router.push(`/customer/dashboard`) 
      } else {
        setSubmitting(false)
        setSubmissionError("Failed to submit misconduct report. Please try again.")
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmissionError("An unexpected error occurred. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  // Auto-save draft on form changes (debounced) - DISABLED
  const watchedFields = watch();
  const citizenship = watch('citizenship');
  const gender = watch("gender")
  const nationality = watch("nationality")

  useEffect(() => {
    const initializeForm = async () => {
      try {
        setIsLoadingForm(true);
        
        const urlParams = new URLSearchParams(window.location.search);
        const draftIdFromUrl = urlParams.get('draftId');
        const access_profile = await getAccessGroups();
        
        // Try to load draft from URL first - DISABLED
        if (draftIdFromUrl) {
          // Draft loading disabled for testing
          console.log('Draft loading disabled for testing flow');
        }
        
        // Try to load latest draft if no URL param - DISABLED
        if (access_profile?.preferred_username) {
          try {
            // Draft loading disabled for testing
            console.log('Latest draft loading disabled for testing flow');
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
  }, [reset, setValue]);

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
      
      // Draft saving disabled for testing
      console.log('Draft saving disabled for testing flow');
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
      
      // Draft saving disabled for testing
      console.log('Draft saving disabled for testing flow');
    }
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
      <div className='max-w-9xl mx-auto flex gap-6'>      
          {/* Main Content */}
          <div className='flex-1 bg-white'>

            {fields.length > 0 && (status=="correction" || status=="correcting") && (
              <div className="rounded-md bg-red-50 border border-red-200 p-4 m-4">
                <p className="text-sm text-red-800">
                  <span className="font-medium">Your misconduct report has been rejected at the screening stage because of missing or incorrect information. Please correct these fields:</span>
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {fields.map((field, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200"
                    >
                      {getFieldLabel(String(field)).label}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {status=="submitted" &&(
                <ReportAlreadySubmitted/>
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
                  Report A Misconduct or a Case
                </h1>
                <p className='text-sm text-gray-600'>Submit a misconduct report</p>
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
                            onValueChange={(value: 'citizen' | 'non-citizen') => {
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
                                          value={country.value}
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
                        </div>

                        {/* Gender */}
                        <div className="space-y-2">
                          <Label htmlFor='gender' className="text-sm font-medium text-gray-700">
                            Gender <span className="text-red-500">*</span>
                          </Label>
                          <Select 
                          value={gender}
                          onValueChange={(value: 'Male' | 'Female') => {
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
                                compact
                              />
                            </div>
                          </div>
                        </div>}
                      </div>

                      {/* Progress indicator for mobile */}
                      <div className="block sm:hidden mt-6 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Step 1 of 4</span>
                          <span>Personal Information</span>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{width: '25%'}}></div>
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
                        </div>
                      </div>

                      {/* Progress indicator for mobile */}
                      <div className="block sm:hidden mt-6 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Step 2 of 4</span>
                          <span>Contact Information</span>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{width: '50%'}}></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 3: Misconduct Details */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <Card className='border-0 shadow-none'>
                    <CardHeader>
                      <CardTitle>Misconduct Details</CardTitle>
                      <CardDescription>
                        Please provide details about the misconduct or case you are reporting.
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
                        
                        {/* Nature of Breach */}
                        <div className='space-y-2'>
                          <Label htmlFor='nature_of_breach'>Nature of Breach <span className="text-red-500">*</span></Label>
                          <Input
                            id='nature_of_breach'
                            {...register('nature_of_breach')}
                            className='mt-1'
                            placeholder="e.g., Professional misconduct, harassment, negligence"
                          />
                        </div>

                        {/* Location of Breach */}
                        <div className='space-y-2'>
                          <Label htmlFor='location_of_breach'>Location of Breach <span className="text-red-500">*</span></Label>
                          <Input
                            id='location_of_breach'
                            {...register('location_of_breach')}
                            className='mt-1'
                            placeholder="e.g., School premises, online platform, specific location"
                          />
                        </div>

                        {/* Date of Breach */}
                        <div className="space-y-2 col-span-1 md:col-span-2">
                          <Label htmlFor='date_of_breach' className="text-sm font-medium text-gray-700">
                            Date of Breach <span className="text-red-500">*</span>
                          </Label>
                          
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500",
                                  !watch('date_of_breach') && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                <span className="truncate">
                                {watch('date_of_breach') ? format(new Date(watch('date_of_breach')), "PPP") : <span>Pick a date</span>}
                                </span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={(() => {
                                  try {
                                    return watch('date_of_breach') ? new Date(watch('date_of_breach')) : undefined;
                                  } catch {
                                    return undefined;
                                  }
                                })()}
                                onSelect={(newDate) => {
                                  if (newDate) {
                                    const year = newDate.getFullYear();
                                    const month = String(newDate.getMonth() + 1).padStart(2, '0');
                                    const day = String(newDate.getDate()).padStart(2, '0');
                                    setValue('date_of_breach', `${year}-${month}-${day}`);
                                  } else {
                                    setValue('date_of_breach', '');
                                  }
                                  trigger('date_of_breach');
                                }}
                                className="rounded-md border shadow-sm"
                                captionLayout="dropdown"
                                disabled={(date) =>
                                  date > new Date(new Date().setHours(0, 0, 0, 0) + 86400000) || 
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
                        </div>

                        {/* Description of Breach */}
                        <div className='space-y-2 col-span-1 md:col-span-2'>
                          <Label htmlFor='description_of_breach'>Description of Breach <span className="text-red-500">*</span></Label>
                          <Textarea
                            id='description_of_breach'
                            {...register('description_of_breach')}
                            className='mt-1'
                            rows={6}
                            placeholder="Please provide a detailed description of the misconduct or case, including what happened, when it occurred, who was involved, and any other relevant details..."
                          />
                        </div>

                        {/* Supporting Documents */}
                        <div className='space-y-2 col-span-1 md:col-span-2'>
                          <Label className="text-sm font-medium text-gray-700">
                            Supporting Documents <span className="text-gray-400 text-xs">(Optional)</span>
                          </Label>
                          <FileUpload
                            name="supporting_documents"
                            label="Attach supporting documents"
                            description="Upload any supporting documents, evidence, or files related to this misconduct report (e.g., photos, documents, screenshots)"
                            acceptedTypes=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            maxSize={10}
                            required={false}
                            value={supportingDocuments}
                            onChange={(file) => {
                              setSupportingDocuments(file);
                              if (file) {
                                setValue('supporting_documents', file);
                                trigger('supporting_documents');
                              }
                            }}
                            compact
                          />
                        </div>
                      </div>

                      {/* Progress indicator for mobile */}
                      <div className="block sm:hidden mt-6 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Step 3 of 4</span>
                          <span>Misconduct Details</span>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{width: '75%'}}></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 4: Review & Complete */}
              {currentStep === 3 && (
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
                                <InfoItem label="Primary Email" value={watch('primary_email')} />
                                <InfoItem label="Physical Address" value={watch('primary_physical')} />
                                <InfoItem label="Postal Address" value={watch('primary_postal')} />
                              </div>
                            </AccordionContent>
                          </AccordionItem>

                          {/* Step 3: Misconduct Details */}
                          <AccordionItem value="item-3">
                            <AccordionTrigger>Step 3: Misconduct Details</AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-4 text-balance">
                              <div className="grid grid-cols-1 gap-4">
                                <InfoItem label="Nature of Breach" value={watch('nature_of_breach')} />
                                <InfoItem label="Location of Breach" value={watch('location_of_breach')} />
                                <InfoItem label="Date of Breach" value={watch('date_of_breach')} />
                                <InfoItem label="Description of Breach" value={watch('description_of_breach')} />
                                {supportingDocuments && (
                                  <InfoItem 
                                    label="Supporting Documents" 
                                    value={`${supportingDocuments['original-name']} (${supportingDocuments.extension.toUpperCase()})`} 
                                  />
                                )}
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
                              I hereby declare that the information I have provided in this misconduct report is true and correct to the best of my knowledge and belief.
                              I understand that provision of false or misleading information may result in legal consequences.  
                              I consent to the Council collecting and verifying this information for the purpose of investigating this report.
                            </p>
                          </div>
                        </div>

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
                              I consent to the collection, processing, and use of my personal data for the purposes of this misconduct report 
                              and any related investigations or communications.
                            </p>
                          </div>
                        </div>

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
                      </div>

                      {/* Progress indicator for mobile */}
                      <div className="block sm:hidden mt-6 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Step 4 of 4</span>
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
                      className='bg-blue-600 hover:bg-blue-700 flex items-center gap-2'>Submit Report</Button>
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
                              Submit Misconduct Report?
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
                                    You are about to submit your misconduct report. Please review all the information you have provided carefully before proceeding.
                                  </p>
                                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                                    <p className="text-amber-800 text-sm">
                                      <strong>Important:</strong> Once submitted, your report will be sent for review and investigation. You will not be able to make changes to the submitted report.
                                    </p>
                                  </div>
                                  <p>
                                    You will receive a confirmation notification with your report reference number for future reference.
                                  </p>
                                </div>
                                <p className="font-medium text-blue-700">
                                  Are you ready to submit your misconduct report?
                                </p>
                              </div>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel 
                              onClick={() => {
                                setSubmitting(false);
                                setSubmissionResult(null);
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
                            <AlertDialogTitle className="text-center">Submitting Report...</AlertDialogTitle>
                            <AlertDialogDescription className="text-center">
                              <div className="space-y-4">
                                <div className="flex items-center justify-center">
                                  <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
                                </div>
                                <div>
                                  Your misconduct report is being submitted. This may take a few moments depending on the size of your attachments and the current server load.
                                  Please wait while we process your report.
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
                      {submissionResult?.success && !submitting && (
                        <>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-center text-green-600">
                              Report Submitted Successfully!
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-center">
                              <div className="space-y-4">
                                <div className="flex items-center justify-center">
                                  <svg className="w-12 h-12 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <div className="text-green-700">
                                  Your misconduct report has been submitted successfully. 
                                  You will receive a confirmation email shortly with your report reference number:
                                  <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                                    <strong className="text-green-800 text-lg">{submissionResult.report_id}</strong>
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
                      {submissionResult?.success === false && (
                        <>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-red-600 flex items-center gap-2">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                              Report Submission Failed
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-red-700 bg-red-50 p-3 rounded-md border border-red-200">
                              {submissionError ? (
                                <>
                                  {submissionError}
                                </>
                              ):(
                                <>
                                  We encountered an error while submitting your report. Please check your internet connection and try again.
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
    </section>
  )
}

const ReportAlreadySubmitted = () => {
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
            Report Already Submitted
          </h3>
          <p className="text-gray-700 mb-4">
            You have already submitted your misconduct report. 
            Visit your dashboard to view your report status and any updates on the investigation.
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