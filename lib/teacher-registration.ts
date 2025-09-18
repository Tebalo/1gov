"use server"
import { trlsBaseURL } from '@/app/lib/store'
import { AttachmentObject, Profile, QualificationEntry, TeacherRegistrationRequest, TeacherRegistrationResponse } from '@/types/teacher-registration'
import { v4 as uuidv4 } from 'uuid'

const API_BASE_URL = `${trlsBaseURL}:8080/trls-80`
// const TEACHER_REGISTRATION_ENDPOINT = `${API_BASE_URL}/teacher_registrations/`
const TEACHER_REGISTRATION_ENDPOINT = `http://10.0.25.164:8080/trls-80/new-teacher-registration/`

/**
 * Generate a unique application ID
 */
export async function generateApplicationId(): Promise<string> {
  return uuidv4()
}

/**
 * Transform form data to match the expected API payload structure
 */
export async function transformFormData(formData: any, profile: Profile, draft_id:string): Promise<TeacherRegistrationRequest> {
  const applicationId = await generateApplicationId()
  
  return {
    reference: {
      application_id: applicationId,
      submission_id: applicationId.substring(0,8) + applicationId.substring(24),
      draft_id: draft_id, 
      response_id: "",
      status: 0,
      profile: {
        username: profile.username,
        first_name: profile.first_name,
        last_name: profile.last_name || "", // Ensure last_name is included
        middle_name: profile.middle_name || "",
        surname: profile.surname,
        date_of_birth: new Date(profile.date_of_birth).toISOString(),
        citizenship: profile.citizenship,
        primary_email: profile.primary_email,
        primary_phone: profile.primary_phone,
        primary_physical: profile.primary_physical,
        primary_postal: profile.primary_postal,
        gender: profile.gender,
        nationality: profile.nationality,
        marital_status: profile.marital_status
      },
      submitted_by: {
        id: profile.username,
        type: "customer",
        dependent: null
      },
      service: {
        service_id: "MESD_006_28_001",
        service_name: "Application for Teacher Registration and Licensing",
        version: "1.0"
      }
    },
    payload: {
      form: {
        work_status: formData.work_status,
        practice_category: formData.practice_category,
        sub_category: formData.sub_category,
        experience_years: formData.experience_years,
        district: formData.district,
        institution_type: formData.institution_type,
        private_schools: formData.private_schools || null,
        submitted_via: "TRLS Portal",
        other_private_schools: formData.other_private_schools || null,
        school_level: formData.school_level,
        primary_schools: formData.primary_schools || null,
        pre_primary_name: formData.pre_primary_name || null,
        other_primary_schools: formData.other_primary_schools || null,
        junior_schools: formData.junior_schools || null,
        other_junior_schools: formData.other_junior_schools || null,
        senior_schools: formData.senior_schools || null,
        other_senior_schools: formData.other_senior_schools || null,
        level: formData.level,
        qualification_certificate: formData.qualification_certificate || null,
        qualification_post_grad_certificate: formData.qualification_post_grad_certificate || null,
        qualification_diploma: formData.qualification_diploma || null,
        qualification_post_grad_diploma: formData.qualification_post_grad_diploma || null,
        qualification_degree: formData.qualification_degree || null,
        qualification_degree_honours: formData.qualification_degree_honours || null,
        qualification_masters_degree: formData.qualification_masters_degree || null,
        other_qualification: formData.other_qualification || null,
        qualification_doctoral_degree: formData.qualification_doctoral_degree || null,
        institution: formData.institution,
        other_institution: formData.other_institution || null,
        qualification_year: formData.qualification_year,
        attachments: formData.attachments || {},
        major_subjects: formData.major_subjects,
        qualifications: formData.qualifications || null,
        disability: formData.disability || "No",
        disability_description: "".concat(formData.disability_description) || null,
        student_related_offence: formData.student_related_offence || "No",
        student_related_offence_details: formData.student_related_offence_details || null,
        student_related_offence_attachments: formData.student_related_offence_attachments || {},
        drug_related_offence: formData.drug_related_offence || "No",
        drug_related_offence_details: formData.drug_related_offence_details || null,
        drug_related_offence_attachments: formData.drug_related_offence_attachments || {},
        license_flag: formData.license_flag || "No",
        license_flag_details: formData.license_flag_details || {},
        misconduct_flag: formData.misconduct_flag || "No",
        misconduct_flag_details: formData.misconduct_flag_details || {},
        national_id_copy: formData.national_id_copy || {},
        qualification_copy: formData.qualification_copy || {},
        work_permit: formData.work_permit || {},
        declaration: formData.declaration,
        profile_data_consent: formData.profile_data_consent
      },
      payment: {},
      appointment: {}
    }
  }
}

/**
 * Helper function to create a qualification entry
 */
export async function createQualificationEntry(
  qualification: string,
  year: string,
  attachment: AttachmentObject
): Promise<QualificationEntry> {
  return {
    alt_qualification: qualification,
    alt_qualification_year: year,
    alt_attachments: attachment
  }
}

/**
 * Helper function to validate attachment object
 */
export async function isValidAttachment(attachment: any): Promise<boolean> {
  return (
    attachment &&
    typeof attachment.bucket === 'string' &&
    typeof attachment.extension === 'string' &&
    typeof attachment['original-name'] === 'string' &&
    typeof attachment.key === 'string'
  )
}

/**
 * Helper function to process attachments from form data
 */
export async function processAttachments(formData: any): Promise<{
  attachments: AttachmentObject | {}
  national_id_copy: AttachmentObject | {}
  qualification_copy: AttachmentObject | {}
  work_permit: AttachmentObject | {}
  student_related_offence_attachments: AttachmentObject | {}
  drug_related_offence_attachments: AttachmentObject | {}
  license_flag_details: AttachmentObject | {}
  misconduct_flag_details: AttachmentObject | {}
}> {
  return {
    attachments: await isValidAttachment(formData.attachments) ? formData.attachments : {},
    national_id_copy: await isValidAttachment(formData.national_id_copy) ? formData.national_id_copy : {},
    qualification_copy: await isValidAttachment(formData.qualification_copy) ? formData.qualification_copy : {},
    work_permit: await isValidAttachment(formData.work_permit) ? formData.work_permit : {},
    student_related_offence_attachments: await isValidAttachment(formData.student_related_offence_attachments) ? formData.student_related_offence_attachments : {},
    drug_related_offence_attachments: await isValidAttachment(formData.drug_related_offence_attachments) ? formData.drug_related_offence_attachments : {},
    license_flag_details: await isValidAttachment(formData.license_flag_details) ? formData.license_flag_details : {},
    misconduct_flag_details: await isValidAttachment(formData.misconduct_flag_details) ? formData.misconduct_flag_details : {}
  }
}

const extractErrorMessage = (errorText: string): string => {
  const messageMatch = errorText.match(/"message":\s*"([^"]+)"/);
  return messageMatch ? messageMatch[1] : "An error occurred";
};

/**
 * Submit teacher registration to the API
 */
export async function submitTeacherRegistration(
  formData: any,
  profile: Profile, 
  draft_id:string
): Promise<TeacherRegistrationResponse> {
  try {
    // Transform the form data to match the API structure
    const requestPayload = await transformFormData(formData, profile, draft_id)
    // console.log('Url:', TEACHER_REGISTRATION_ENDPOINT)
    // console.log('Submitting teacher registration:', JSON.stringify(requestPayload))
    
    // Make the API request
    const response = await fetch(TEACHER_REGISTRATION_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestPayload)
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      // console.error('API Error:', response.status, errorText)
      
      return {
        success: false,
        error: `API Error: ${response.status} - ${errorText}`
      }
    }
    // Check if the json is valid
    if (!response.headers.get('content-type')?.includes('application/json')) {
      return {
        success: true,
        application_id: (await requestPayload).reference.application_id,
        response_id: '',
        message: 'Application submitted successfully'
      }
    }
    const responseData = await response.json()
    // console.log('API Response:', responseData)
    
    return {
      success: true,
      application_id: (await requestPayload).reference.application_id,
      response_id: responseData.response_id || responseData.id,
      message: responseData.message || 'Application submitted successfully'
    }
    
  } catch (error) {
    // console.error('Submission error:', error)
    
    return {
      success: false,
      // error: 'Error submitting application',
      error: error instanceof Error ? extractErrorMessage(error.message) : 'Unknown error occurred'
    }
  }
}

// Server Action (if using Next.js App Router)
// 'use server'

// export async function submitTeacherRegistrationAction(
//   formData: any,
//   profile: Profile
// ): Promise<TeacherRegistrationResponse> {
//   return submitTeacherRegistration(formData, profile)
// }

// API Route Handler (if using Next.js Pages Router or App Router)
// pages/api/teacher-registration.ts or app/api/teacher-registration/route.ts

// *

// Usage example in your form component
export async function handleFormSubmission(formData: any) {
  // Extract profile data from form
  const profile: Profile = {
    username: formData.username,
    first_name: formData.first_name,
    middle_name: formData.middle_name || "",
    last_name: formData.last_name || "", // Ensure last_name is included
    surname: formData.surname,
    date_of_birth: formData.date_of_birth,
    citizenship: formData.citizenship,
    primary_email: formData.primary_email,
    primary_phone: formData.primary_phone,
    primary_physical: formData.primary_physical,
    primary_postal: formData.primary_postal,
    gender: formData.gender,
    nationality: formData.nationality,
    marital_status: formData.marital_status
  }
  
  // Process attachments to ensure correct format
  const processedAttachments = processAttachments(formData)
  const processedFormData = {
    ...formData,
    ...processedAttachments
  }
  
  // Submit the registration
  const draft_id = "" // Default empty draft ID
  const result = await submitTeacherRegistration(processedFormData, profile, draft_id)
  
  if (result.success) {
    console.log('Registration successful:', result.application_id)
    // Handle success (redirect, show success message, etc.)
  } else {
    console.error('Registration failed:', result.error)
    // Handle error (show error message, etc.)
  }
  
  return result
}

// Example of how to structure qualification data in your form
export async function createQualificationsArray(qualificationEntries: Array<{
  qualification: string
  year: string
  attachment: AttachmentObject
}>): Promise<QualificationEntry[]> {
  return await Promise.all(
    qualificationEntries.map(entry => 
      createQualificationEntry(entry.qualification, entry.year, entry.attachment)
    )
  )
}

// Example usage:
/*
const qualificationData = [
  {
    qualification: "Bachelor of Science in Forest Sciences",
    year: "2015",
    attachment: {
      bucket: "MESD_006_28_001",
      extension: "pdf",
      "original-name": "gtty.pdf",
      key: "9c2523f5-fe32-4f6b-8aae-1d4b1277afb7"
    }
  }
]

const qualifications = createQualificationsArray(qualificationData)

// Include in your form data:
const formData = {
  // ... other form fields
  qualifications: qualifications,
  national_id_copy: {
    bucket: "MESD_006_28_001",
    extension: "pdf",
    "original-name": "national-id.pdf",
    key: "unique-key-123"
  }
}
*/