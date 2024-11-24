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
  Omang_id: z.string(),
  submission_type: z.string(),
  case_number:z.string(),
  inquiry_number:z.string(),
  reg_status: z.string(),
  date_of_submission: z.string(),
  anonymous: z.boolean() 
})

export const complaintSchemawithNullValues = z.object({
  Omang_id: z.string().nullable().optional(),
  submission_type: z.string().nullable().optional(),
  case_number: z.string().nullable().optional(),
  inquiry_number: z.string().nullable().optional(),
  reg_status: z.string().nullable().optional(),
  date_of_submission: z.string().nullable().optional(),
  anonymous: z.boolean().nullable().optional()
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

export type Activity = z.infer<typeof activitySchema>
export type Tipoff = z.infer<typeof tipoffSchema>
export type CPD = z.infer<typeof CPDSchema>
export type complaintwithNullValues = z.infer<typeof complaintSchemawithNullValues>
export type Investigations = z.infer<typeof InvestigationsSchema>
export type Complaint = z.infer<typeof complaintSchema>
export type Reg = z.infer<typeof regSchema>
export type Task = z.infer<typeof taskSchema>
