import { z } from "zod"
export const revocationSchema = z.object({
  revocation_number: z.string().nullable(),
  userid: z.string().nullable(),
  sla: z.string().nullable(),
  registration_number: z.string().nullable(),
  current_employer: z.string().nullable(),
  reason: z.string().nullable(),
  reg_status: z.string().nullable(),
  date_of_submission: z.string().nullable(),
})

export type Revocation = z.infer<typeof revocationSchema>