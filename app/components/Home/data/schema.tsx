import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
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
  id: z.number(),
  tipoff_number: z.string(),
  full_name: z.string(),
  phone: z.string(),
  identity_No: z.string(),
  email: z.string(),
  nature_of_crime: z.string(),
  description: z.string(),
  crime_location: z.string(),
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
export type complaintwithNullValues = z.infer<typeof complaintSchemawithNullValues>
export type Investigations = z.infer<typeof InvestigationsSchema>
export type Complaint = z.infer<typeof complaintSchema>
export type Reg = z.infer<typeof regSchema>
export type Task = z.infer<typeof taskSchema>
