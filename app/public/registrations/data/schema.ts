import { z } from "zod"


export const registrationSchema = z.object({
  national_id: z.string(),
  reg_number: z.string(),
  reg_status: z.string(),
  endorsement_status: z.string(),
  rejection_reason: z.string().nullable(),
  service_code: z.string(),
  payment_ref: z.string().nullable(),
  payment_amount: z.number().nullable(),
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
  updated_at: z.string()
})

export type Registration = z.infer<typeof registrationSchema>