import { AttachmentObject, Profile, QualificationEntry, TeacherRegistrationRequest, TeacherRegistrationResponse } from '@/types/teacher-registration'
import { v4 as uuidv4 } from 'uuid'

const API_BASE_URL = 'http://10.0.26.164:8080/trls-80'
const TEACHER_REGISTRATION_ENDPOINT = `${API_BASE_URL}/teacher_registrations/`

/**
 * Generate a unique application ID
 */
export function generateApplicationId(): string {
  return uuidv4()
}

/**
 * Transform form data to match the expected API payload structure
 */
export function transformFormData(formData: any, profile: Profile): TeacherRegistrationRequest {
  const applicationId = generateApplicationId()
  
  return {
    reference: {
      application_id: applicationId,
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
        disability_description: formData.disability_description || null,
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
export function createQualificationEntry(
  qualification: string,
  year: string,
  attachment: AttachmentObject
): QualificationEntry {
  return {
    alt_qualification: qualification,
    alt_qualification_year: year,
    alt_attachments: attachment
  }
}

/**
 * Helper function to validate attachment object
 */
export function isValidAttachment(attachment: any): attachment is AttachmentObject {
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
export function processAttachments(formData: any): {
  attachments: AttachmentObject | {}
  national_id_copy: AttachmentObject | {}
  qualification_copy: AttachmentObject | {}
  work_permit: AttachmentObject | {}
  student_related_offence_attachments: AttachmentObject | {}
  drug_related_offence_attachments: AttachmentObject | {}
  license_flag_details: AttachmentObject | {}
  misconduct_flag_details: AttachmentObject | {}
} {
  return {
    attachments: isValidAttachment(formData.attachments) ? formData.attachments : {},
    national_id_copy: isValidAttachment(formData.national_id_copy) ? formData.national_id_copy : {},
    qualification_copy: isValidAttachment(formData.qualification_copy) ? formData.qualification_copy : {},
    work_permit: isValidAttachment(formData.work_permit) ? formData.work_permit : {},
    student_related_offence_attachments: isValidAttachment(formData.student_related_offence_attachments) ? formData.student_related_offence_attachments : {},
    drug_related_offence_attachments: isValidAttachment(formData.drug_related_offence_attachments) ? formData.drug_related_offence_attachments : {},
    license_flag_details: isValidAttachment(formData.license_flag_details) ? formData.license_flag_details : {},
    misconduct_flag_details: isValidAttachment(formData.misconduct_flag_details) ? formData.misconduct_flag_details : {}
  }
}

/**
 * Submit teacher registration to the API
 */
export async function submitTeacherRegistration(
  formData: any,
  profile: Profile
): Promise<TeacherRegistrationResponse> {
  try {
    // Transform the form data to match the API structure
    const requestPayload = transformFormData(formData, profile)
    
    console.log('Submitting teacher registration:', requestPayload)
    
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
      console.error('API Error:', response.status, errorText)
      
      return {
        success: false,
        error: `API Error: ${response.status} - ${errorText}`
      }
    }
    
    const responseData = await response.json()
    console.log('API Response:', responseData)
    
    return {
      success: true,
      application_id: requestPayload.reference.application_id,
      response_id: responseData.response_id || responseData.id,
      message: responseData.message || 'Application submitted successfully'
    }
    
  } catch (error) {
    console.error('Submission error:', error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
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
  const result = await submitTeacherRegistration(processedFormData, profile)
  
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
export function createQualificationsArray(qualificationEntries: Array<{
  qualification: string
  year: string
  attachment: AttachmentObject
}>): QualificationEntry[] {
  return qualificationEntries.map(entry => 
    createQualificationEntry(entry.qualification, entry.year, entry.attachment)
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