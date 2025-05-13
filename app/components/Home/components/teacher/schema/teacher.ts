import { z } from "zod"
export const TeacherSchema = z.object({
  national_id: z.string().nullable(),
  reg_number: z.string().nullable(),
  reg_status: z.string().nullable(),
  endorsement_status: z.string().nullable(),
  rejection_reason: z.string().nullable(),
  service_code: z.string().nullable(),
  payment_ref: z.string().nullable(),
  payment_amount: z.string().nullable(),
  payment_name: z.string().nullable(),
  application_id: z.string().nullable(),
  license_link: z.string().nullable(),
  education_bg_checks: z.string().nullable(),
  flags_no: z.string().nullable(),
  institution_verification: z.string().nullable(),
  course_verification: z.string().nullable(),
  license_status: z.string().nullable(),
  pending_customer_action: z.string().nullable(),
  registration_type: z.string().nullable(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
})

export type Teacher = z.infer<typeof TeacherSchema>