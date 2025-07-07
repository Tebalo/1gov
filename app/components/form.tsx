'use client'

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
import { Profile} from '@/types/teacher-registration'
import QualificationsTable, { QualificationEntry } from './qualifications'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { set } from 'date-fns'
// Add this import:
// Schema definition matching your external schema
const documentSchema = z.object({
  name: z.string(),
  size: z.number(),
  type: z.string()
}).optional()

//  PROD MESD_006_28_001
// uat MESD_006_08_054

type FormInputs = z.infer<typeof FormDataSchema>

const steps = [
  {
    id: 'Step 1',
    name: 'Personal Information',
    fields: ['first_name', 'last_name', 'primary_email', 'citizenship', 'middle_name', 'date_of_birth', 'username', 'gender', 'nationality'] // 'surname',
  },
  {
    id: 'Step 2',
    name: 'Contact Information',
    fields: ['primary_phone', 'primary_physical', 'primary_postal']
  },
  {
    id: 'Step 3',
    name: 'Professional Details',
    fields: ['practice_category', 'sub_category', 'experience_years', 'district', 'institution_type', 'school_level', 'level']
  },
  {
    id: 'Step 4',
    name: 'Qualifications',
    fields: ['qualification_certificate', 'institution', 'qualification_year', 'major_subjects', 'qualifications']
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

  const handleQualificationsChange = (newQualifications: QualificationEntry[]) => {
    setQualifications(newQualifications)
    console.log('Updated qualifications:', newQualifications)
  }

  // Convert to API format
  const getAPIFormatQualifications = () => {
    return qualifications
      .filter(q => q.alt_attachments) // Only include qualifications with attachments
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

  const processForm: SubmitHandler<FormInputs> = async (formData) => {
    console.log('Form submitted successfully:', formData)
    alert('Form submitted successfully!')
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
    nationality: formData.nationality,
    // marital_status: formData.marital_status
  }

//   useEffect(() => {
//   if (nationalIdDoc) {
//     setValue('national_id_copy', nationalIdDoc)
//   }
// }, [nationalIdDoc, setValue])
  
  // Process attachments to ensure correct format
  const processedAttachments = processAttachments(formData)

  const apiQualifications = getAPIFormatQualifications()

  const processedFormData = {
    ...formData,
    ...processedAttachments,
    qualifications: apiQualifications, //
    national_id_copy: nationalIdDoc    //
  }
  
  // Submit the registration
  const result = await submitTeacherRegistration(processedFormData, profile)
  
  if (result.success) {
    console.log('Registration successful:', result.application_id)
    // Handle success (redirect, show success message, etc.)
  } else {
    console.error('Registration failed:', result.error)
    // Handle error (show error message, etc.)
  }
    reset()
  }

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

  const submitForm = async () => {
    // Validate all fields before submitting
    const isValid = await trigger()
    if (isValid) {
      const formData = getValues()
      processForm(formData)
    } else {
      console.log('Form validation failed')
      alert('Please fill in all required fields correctly')
    }
  }

  return (
    <section className=' bg-gray-50 p-4'>
      <div className='max-w-7xl mx-auto bg-white rounded-lg shadow-lg'>
        {/* Progress Steps */}
        <nav aria-label='Progress' className='p-6 border-b'>
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

        <ScrollArea className='h-[500px] p-6'>
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
                  <CardContent className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <Label htmlFor='first_name'>First Name *</Label>
                        <Input
                          id='first_name'
                          {...register('first_name')}
                          className='mt-1'
                        />
                        {errors.first_name && (
                          <p className='text-sm text-red-500 mt-1'>{errors.first_name.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor='last_name'>Last Name *</Label>
                        <Input
                          id='last_name'
                          {...register('last_name')}
                          className='mt-1'
                        />
                        {errors.last_name && (
                          <p className='text-sm text-red-500 mt-1'>{errors.last_name.message}</p>
                        )}
                      </div>

                      {/* <div>
                        <Label htmlFor='surname'>Surname *</Label>
                        <Input
                          id='surname'
                          {...register('surname')}
                          className='mt-1'
                        />
                        {errors.surname && (
                          <p className='text-sm text-red-500 mt-1'>{errors.surname.message}</p>
                        )}
                      </div> */}

                      <div>
                        <Label htmlFor='middle_name'>Middle Name</Label>
                        <Input
                          id='middle_name'
                          {...register('middle_name')}
                          className='mt-1'
                        />
                      </div>

                      <div>
                        <Label htmlFor='username'>National Id *</Label>
                        <Input
                          id='username'
                          {...register('username')}
                          className='mt-1'
                        />
                        {errors.username && (
                          <p className='text-sm text-red-500 mt-1'>{errors.username.message}</p>
                        )}
                      </div>

                      {/* <div>
                        <Label htmlFor='primary_email'>Email Address *</Label>
                        <Input
                          id='primary_email'
                          type='email'
                          {...register('primary_email')}
                          className='mt-1'
                        />
                        {errors.primary_email && (
                          <p className='text-sm text-red-500 mt-1'>{errors.primary_email.message}</p>
                        )}
                      </div> */}

                      <div>
                        <Label htmlFor='date_of_birth'>Date of Birth *</Label>
                        <Input
                          id='date_of_birth'
                          type='date'
                          {...register('date_of_birth')}
                          className='mt-1'
                        />
                        {errors.date_of_birth && (
                          <p className='text-sm text-red-500 mt-1'>{errors.date_of_birth.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor='gender'>Gender *</Label>
                        <Select onValueChange={(value) => setValue('gender', value)}>
                          <SelectTrigger className='mt-1'>
                            <SelectValue placeholder='Select gender' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='male'>Male</SelectItem>
                            <SelectItem value='female'>Female</SelectItem>
                            <SelectItem value='other'>Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.gender && (
                          <p className='text-sm text-red-500 mt-1'>{errors.gender.message}</p>
                        )}
                      </div>

                      {/* <div>
                        <Label htmlFor='marital_status'>Marital Status *</Label>
                        <Select onValueChange={(value) => setValue('marital_status', value)}>
                          <SelectTrigger className='mt-1'>
                            <SelectValue placeholder='Select marital status' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='single'>Single</SelectItem>
                            <SelectItem value='married'>Married</SelectItem>
                            <SelectItem value='divorced'>Divorced</SelectItem>
                            <SelectItem value='widowed'>Widowed</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.marital_status && (
                          <p className='text-sm text-red-500 mt-1'>{errors.marital_status.message}</p>
                        )}
                      </div> */}

                      <div>
                        <Label htmlFor='citizenship'>Citizenship *</Label>
                        <Input
                          id='citizenship'
                          {...register('citizenship')}
                          className='mt-1'
                        />
                        {errors.citizenship && (
                          <p className='text-sm text-red-500 mt-1'>{errors.citizenship.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor='nationality'>Nationality *</Label>
                        <Input
                          id='nationality'
                          {...register('nationality')}
                          className='mt-1'
                        />
                        {errors.nationality && (
                          <p className='text-sm text-red-500 mt-1'>{errors.nationality.message}</p>
                        )}
                      </div>
                      <div className='col-span-2'>
                        <FileUpload
                          name="national_id_copy"
                          label="National ID Copy"
                          description="Upload a clear copy of your National ID"
                          acceptedTypes=".pdf,.jpg,.jpeg,.png"
                          maxSize={5}
                          required={true}
                          value={nationalIdDoc}
                          onChange={setNationalIdDoc}
                          error={errors.national_id_copy?.message}
                        />
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
                    <div>
                      <Label htmlFor='primary_phone'>Primary Phone *</Label>
                      <Input
                        id='primary_phone'
                        type='tel'
                        {...register('primary_phone')}
                        className='mt-1'
                      />
                      {errors.primary_phone && (
                        <p className='text-sm text-red-500 mt-1'>{errors.primary_phone.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor='primary_physical'>Physical Address *</Label>
                      <Textarea
                        id='primary_physical'
                        {...register('primary_physical')}
                        className='mt-1'
                        rows={3}
                      />
                      {errors.primary_physical && (
                        <p className='text-sm text-red-500 mt-1'>{errors.primary_physical.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor='primary_postal'>Postal Address *</Label>
                      <Textarea
                        id='primary_postal'
                        {...register('primary_postal')}
                        className='mt-1'
                        rows={3}
                      />
                      {errors.primary_postal && (
                        <p className='text-sm text-red-500 mt-1'>{errors.primary_postal.message}</p>
                      )}
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
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <Label htmlFor='practice_category'>Practice Category *</Label>
                        <Select onValueChange={(value) => setValue('practice_category', value)}>
                          <SelectTrigger className='mt-1'>
                            <SelectValue placeholder='Select practice category' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='education'>Education</SelectItem>
                            <SelectItem value='healthcare'>Healthcare</SelectItem>
                            <SelectItem value='legal'>Legal</SelectItem>
                            <SelectItem value='engineering'>Engineering</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.practice_category && (
                          <p className='text-sm text-red-500 mt-1'>{errors.practice_category.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor='sub_category'>Sub Category *</Label>
                        <Select onValueChange={(value) => setValue('sub_category', value)}>
                          <SelectTrigger className='mt-1'>
                            <SelectValue placeholder='Select sub category' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='primary'>Primary</SelectItem>
                            <SelectItem value='secondary'>Secondary</SelectItem>
                            <SelectItem value='tertiary'>Tertiary</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.sub_category && (
                          <p className='text-sm text-red-500 mt-1'>{errors.sub_category.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor='experience_years'>Years of Experience *</Label>
                        <Input
                          id='experience_years'
                          type='number'
                          {...register('experience_years')}
                          className='mt-1'
                        />
                        {errors.experience_years && (
                          <p className='text-sm text-red-500 mt-1'>{errors.experience_years.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor='district'>District *</Label>
                        <Select onValueChange={(value) => setValue('district', value)}>
                          <SelectTrigger className='mt-1'>
                            <SelectValue placeholder='Select district' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='central'>Central</SelectItem>
                            <SelectItem value='northern'>Northern</SelectItem>
                            <SelectItem value='southern'>Southern</SelectItem>
                            <SelectItem value='eastern'>Eastern</SelectItem>
                            <SelectItem value='western'>Western</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.district && (
                          <p className='text-sm text-red-500 mt-1'>{errors.district.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor='institution_type'>Institution Type *</Label>
                        <Select onValueChange={(value) => setValue('institution_type', value)}>
                          <SelectTrigger className='mt-1'>
                            <SelectValue placeholder='Select institution type' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='public'>Public</SelectItem>
                            <SelectItem value='private'>Private</SelectItem>
                            <SelectItem value='ngo'>NGO</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.institution_type && (
                          <p className='text-sm text-red-500 mt-1'>{errors.institution_type.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor='school_level'>School Level *</Label>
                        <Select onValueChange={(value) => setValue('school_level', value)}>
                          <SelectTrigger className='mt-1'>
                            <SelectValue placeholder='Select school level' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='pre-primary'>Pre-Primary</SelectItem>
                            <SelectItem value='primary'>Primary</SelectItem>
                            <SelectItem value='secondary'>Secondary</SelectItem>
                            <SelectItem value='senior'>Senior</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.school_level && (
                          <p className='text-sm text-red-500 mt-1'>{errors.school_level.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor='level'>Level *</Label>
                        <Select onValueChange={(value) => setValue('level', value)}>
                          <SelectTrigger className='mt-1'>
                            <SelectValue placeholder='Select level' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='entry'>Entry Level</SelectItem>
                            <SelectItem value='mid'>Mid Level</SelectItem>
                            <SelectItem value='senior'>Senior Level</SelectItem>
                            <SelectItem value='executive'>Executive</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.level && (
                          <p className='text-sm text-red-500 mt-1'>{errors.level.message}</p>
                        )}
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
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <Label htmlFor='qualification_certificate'>Qualification Certificate *</Label>
                        <Select onValueChange={(value) => setValue('qualification_certificate', value)}>
                          <SelectTrigger className='mt-1'>
                            <SelectValue placeholder='Select qualification' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='certificate'>Certificate</SelectItem>
                            <SelectItem value='diploma'>Diploma</SelectItem>
                            <SelectItem value='degree'>Bachelors Degree</SelectItem>
                            <SelectItem value='masters'>Masters Degree</SelectItem>
                            <SelectItem value='phd'>PhD</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.qualification_certificate && (
                          <p className='text-sm text-red-500 mt-1'>{errors.qualification_certificate.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor='institution'>Institution *</Label>
                        <Input
                          id='institution'
                          {...register('institution')}
                          className='mt-1'
                        />
                        {errors.institution && (
                          <p className='text-sm text-red-500 mt-1'>{errors.institution.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor='qualification_year'>Qualification Year *</Label>
                        <Input
                          id='qualification_year'
                          type='number'
                          min='1950'
                          max='2024'
                          {...register('qualification_year')}
                          className='mt-1'
                        />
                        {errors.qualification_year && (
                          <p className='text-sm text-red-500 mt-1'>{errors.qualification_year.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor='major_subjects'>Major Subjects *</Label>
                        <Input
                          id='major_subjects'
                          {...register('major_subjects')}
                          className='mt-1'
                        />
                        {errors.major_subjects && (
                          <p className='text-sm text-red-500 mt-1'>{errors.major_subjects.message}</p>
                        )}
                      </div>
                    </div>

                    {/* <div>
                      <Label htmlFor='qualifications'>Additional Qualifications *</Label>
                      <Textarea
                        id='qualifications'
                        {...register('qualifications')}
                        className='mt-1'
                        rows={4}
                        placeholder='List any additional qualifications, certifications, or training...'
                      />
                      {errors.qualifications && (
                        <p className='text-sm text-red-500 mt-1'>{errors.qualifications.message}</p>
                      )}
                    </div> */}
                    <div>
                        <QualificationsTable
                          qualifications={qualifications}
                          onChange={setQualifications}
                        />
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
                      <Label className="text-base font-medium">Do you have any disability?</Label>
                      <RadioGroup 
                        value={watch('disability')} 
                        onValueChange={(value) => setValue('disability', value)}
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
                          <Label htmlFor="disability_description">Please describe your disability</Label>
                          <Textarea
                            id="disability_description"
                            placeholder="Describe your disability..."
                            {...register('disability_description')}
                            className="mt-1"
                          />
                        </div>
                      )}
                    </div>

                    {/* Student-related offences */}
                    <div>
                      <Label className="text-base font-medium">Any student-related offences?</Label>
                      <RadioGroup 
                        value={watch('student_related_offence')} 
                        onValueChange={(value) => setValue('student_related_offence', value)}
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
                              required={true}
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
                      <Label className="text-base font-medium">Any drug-related offences?</Label>
                      <RadioGroup 
                        value={watch('drug_related_offence')} 
                        onValueChange={(value) => setValue('drug_related_offence', value)}
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
                            <Label htmlFor="drug_related_offence_details">Please provide details</Label>
                            <Textarea
                              id="drug_related_offence_details"
                              placeholder="Describe the drug-related offence..."
                              {...register('drug_related_offence_details')}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <FileUpload
                              name="drug_related_offence_attachments"
                              label="Attachments (optional)"
                              description="Upload a clear copy of your National ID"
                              acceptedTypes=".pdf,.jpg,.jpeg,.png"
                              maxSize={5}
                              required={true}
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
                      <Label className="text-base font-medium">Any license-related issues?</Label>
                      <RadioGroup 
                        value={watch('license_flag')} 
                        onValueChange={(value) => setValue('license_flag', value)}
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
                            <FileUpload
                              name="drug_related_offence_attachments"
                              label="Attachments (optional)"
                              description="Upload a clear copy of your National ID"
                              acceptedTypes=".pdf,.jpg,.jpeg,.png"
                              maxSize={5}
                              required={true}
                              value={licenseFlagDetailsDoc}
                              onChange={setLicenseFlagDetailsDoc}
                              error={errors.license_flag_details?.message}
                            />
                        </div>
                      )}
                    </div>

                    {/* Professional misconduct */}
                    <div>
                      <Label className="text-base font-medium">Any professional misconduct?</Label>
                      <RadioGroup 
                        value={watch('misconduct_flag')} 
                        onValueChange={(value) => setValue('misconduct_flag', value)}
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
                            <FileUpload
                              name="drug_related_offence_attachments"
                              label="Attachments (optional)"
                              description="Upload a clear copy of your National ID"
                              acceptedTypes=".pdf,.jpg,.jpeg,.png"
                              maxSize={5}
                              required={true}
                              value={misconductFlagDetailsDoc}
                              onChange={setMisconductFlagDetailsDoc}
                              error={errors.drug_related_offence_attachments?.message}
                            />
                        </div>
                      )}
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
                    {/* Summary Section */}
                    <div className='bg-gray-50 p-4 rounded-lg'>
                      <h3 className='font-semibold mb-3'>Application Summary</h3>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                        <div>
                          <strong>Name:</strong> {watch('first_name')} {watch('last_name')}
                        </div>
                        {/* <div>
                          <strong>Email:</strong> {watch('primary_email')}
                        </div> */}
                        <div>
                          <strong>Practice Category:</strong> {watch('practice_category')}
                        </div>
                        <div>
                          <strong>District:</strong> {watch('district')}
                        </div>
                        <div>
                          <strong>Institution:</strong> {watch('institution')}
                        </div>
                        <div>
                          <strong>Qualification:</strong> {watch('qualification_certificate')}
                        </div>
                      </div>
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
                            I hereby declare that all the information provided in this application is true and accurate to the best of my knowledge. 
                            I understand that any false information may result in the rejection of my application or termination of employment.
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
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </form>
        

        {/* Navigation */}
        <div className='p-6 border-t bg-gray-50'>
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
              Previous
            </Button>
            
            <div className='flex items-center gap-2'>
              <span className='text-sm text-gray-500'>
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>

            {currentStep < steps.length - 1 ? (
              <Button
                type='button'
                onClick={next}
                className='flex items-center gap-2'
              >
                Next
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
              <Button 
                type='button'
                onClick={submitForm}
                className='bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2'
              >
                Submit Application
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
                </svg>
              </Button>
            )}
          </div>
        </div>
        </ScrollArea>
      </div>
    </section>
  )
}