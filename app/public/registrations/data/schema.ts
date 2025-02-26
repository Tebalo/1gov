import { z } from "zod"


export const registrationSchema = z.object({
  national_id: z.string(),
  reg_status: z.string(),
  endorsement_status: z.string(),
  forenames: z.string(),
  surname: z.string(),
  registration_type: z.string(),
  practice_category: z.string(),
  sub_category: z.string(),
  created_at: z.string(),
  payment_amount: z.string(),
  license_link: z.string()
})

export type Registration = z.infer<typeof registrationSchema>