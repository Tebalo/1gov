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
export type Reg = z.infer<typeof regSchema>
export type Task = z.infer<typeof taskSchema>
