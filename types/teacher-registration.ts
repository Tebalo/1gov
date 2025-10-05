export interface AttachmentObject {
  bucket: string
  extension: string
  'original-name': string
  key: string
}

export interface QualificationEntry {
  alt_qualification: string
  alt_qualification_year: string
  alt_attachments: AttachmentObject
}

export interface Profile {
  username: string
  first_name: string
  last_name: string
  middle_name: string
  surname: string
  date_of_birth: string
  citizenship: string
  primary_email?: string
  primary_phone: string
  primary_physical: string
  primary_postal: string
  gender: string
  nationality: string
  marital_status?: string
}

export interface SubmittedBy {
  id: string
  type: 'customer' | 'admin' | 'agent'
  dependent: string | null
}

export interface Service {
  service_id: string
  service_name: string
  version: string
}

export interface Reference {
  application_id: string
  submission_id: string
  draft_id: string | null
  response_id: string
  status: number
  profile: Profile
  submitted_by: SubmittedBy
  service: Service
}

export interface FormData {
  work_status: string
  practice_category: string
  sub_category: string
  experience_years: string
  district: string
  institution_type: string
  private_schools?: string | null
  other_private_schools?: string | null
  school_level: string
  submitted_via: string
  primary_schools?: string | null
  pre_primary_name?: string | null
  other_primary_schools?: string | null
  junior_schools?: string | null
  other_junior_schools?: string | null
  senior_schools?: string | null
  other_senior_schools?: string | null
  level: string
  major_subjects?: string | null
  qualification_certificate?: string | null
  qualification_post_grad_certificate?: string | null
  qualification_diploma?: string | null
  qualification_post_grad_diploma?: string | null
  qualification_degree?: string | null
  qualification_degree_honours?: string | null
  qualification_masters_degree?: string | null
  other_qualification?: string | null
  qualification_doctoral_degree?: string | null
  institution: string
  other_institution?: string | null
  qualification_year: string
  attachments: AttachmentObject | {}
  subject_specialization: string | null
  other_subject_specialization?: string | null
  qualifications: QualificationEntry[] | null
  disability: string
  disability_description?: string | null // merge into a single string
  student_related_offence: string
  student_related_offence_details?: string | null
  student_related_offence_attachments: AttachmentObject | {}
  drug_related_offence: string
  drug_related_offence_details?: string | null
  drug_related_offence_attachments: AttachmentObject | {}
  license_flag: string
  license_flag_details: AttachmentObject | {}
  misconduct_flag: string
  misconduct_flag_details: AttachmentObject | {}
  national_id_copy: AttachmentObject | {}
  qualification_copy: AttachmentObject | {}
  work_permit: AttachmentObject | {}
  declaration: boolean
  profile_data_consent: boolean
}

export interface Payload {
  form: FormData
  payment: Record<string, any>
  appointment: Record<string, any>
}

export interface TeacherRegistrationRequest {
  reference: Reference
  payload: Payload
}

export interface TeacherRegistrationResponse {
  success: boolean
  application_id?: string
  response_id?: string
  message?: string
  error?: string
  code?: number
}