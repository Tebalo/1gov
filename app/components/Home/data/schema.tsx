import { z } from "zod"

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
  priority: z.string(),
})

export const regSchema = z.object({
  national_id: z.string(),
  reg_number: z.string(),
  reg_status: z.string(),
  registration_type: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})

export const complaintSchema = z.object({
  inquiry_number: z.string().optional(),
  case_number: z.string().optional(),
  reg_status: z.string(),
  date_of_submission: z.string().optional(),
  nature_of_crime: z.string().optional(),
  crime_location: z.string().optional()
})

export const complaintSchemawithNullValues = z.object({
  inquiry_number: z.string().nullable(),
  case_number: z.string().nullable(),
  reg_status: z.string().nullable(),
  date_of_submission: z.string().nullable(),
  nature_of_crime: z.string().nullable(),
  crime_location: z.string().nullable()
});

export const InvestigationsSchema = z.object({
  id: z.number().int(),
  name:z.string(),
  contact_number:z.string(),
  Omang_id:z.string(),
  passport_no:z.string(),
  occupation:z.string(),
  sex:z.string(),
  nationality:z.string(),
  address:z.string(),
  reg_status:z.string(),
  inquiry_number:z.string(),
  case_number:z.string(),
  created_at:z.string(),
  updated_at:z.string(),
})

export const tipoffSchema = z.object({
  application_id: z.string(),
  user_id: z.string(),
  reg_status: z.string(),
  tipoff_number: z.string(),
  first_name: z.string(),
  middle_name: z.string(),
  surname: z.string(),
  primary_email: z.string(),
  primary_phone: z.string(),
  primary_postal: z.string(),
  gender: z.string(),
  nationality: z.string(),
  breach_nature: z.string(),
  breach_description: z.string(),
  breach_location: z.string(),
  breach_date: z.string(),
  profile_data_consent: z.boolean(),
  service_id: z.string(),
  service_name: z.string(),
  service_version: z.string()
})

export const CPDSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  cpd_number: z.string(),
  cumulative_points: z.string(),
  reg_status: z.string(),
  sla: z.string(),
  cpd_activity: z.string(),
  cpd_points: z.string(),
  cpd_activity_description: z.string(),
  service_provider: z.string(),
  duration: z.string(),
  declaration: z.string(),
  profile_data_consent: z.number(),
  created_at: z.string(),
  updated_at: z.string()
})

export const activitySchema = z.object({
  activities: z.string(),
  full_name: z.string(),
  role: z.string(),
  record_type: z.string(),
  record_id: z.string(),
  activity_number: z.string(),
  submission_type: z.string(),
  date_of_submission: z.string(),
  anonymous: z.string()
})

export const AppealsSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  application: z.string(),
  appeals_number: z.string(),
  reg_status: z.string(),
  sla: z.string(),
  appeal_decision: z.string(),
  appeal_reason: z.string(),
  supporting_document_key: z.string(),
  declaration: z.string(),
  profile_data_consent: z.number(),
  created_at: z.string(),
  updated_at: z.string()
})

export const renewalSchema = z.object({
  national_id: z.string(),
  reg_number: z.string(),
  reg_status: z.string(),
  endorsement_status: z.string(),
  rejection_reason: z.string().nullable(),
  service_code: z.string(),
  payment_ref: z.string().nullable(),
  payment_amount: z.string().nullable(),
  payment_name: z.string().nullable(),
  application_id: z.string(),
  license_link: z.string().nullable(),
  education_bg_checks: z.string().nullable(),
  flags_no: z.string(),
  institution_verification: z.string(),
  course_verification: z.string(),
  license_status: z.string(),
  pending_customer_action: z.string(),
  registration_type: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type Renewal = z.infer<typeof renewalSchema>
export type Appeal = z.infer<typeof AppealsSchema>
export type Activity = z.infer<typeof activitySchema>
export type Tipoff = z.infer<typeof tipoffSchema>
export type CPD = z.infer<typeof CPDSchema>
export type complaintwithNullValues = z.infer<typeof complaintSchemawithNullValues>
export type Investigations = z.infer<typeof InvestigationsSchema>
export type Complaint = z.infer<typeof complaintSchema>
export type Reg = z.infer<typeof regSchema>
export type Task = z.infer<typeof taskSchema>
