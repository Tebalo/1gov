import {z} from 'zod';

export const FormDataSchema = z.object({
  institution: z.string().min(1, 'Institution name is required'),
  citizenry: z.string().min(1,'Citizenship is required'),
  status: z.string().min(1,'Status is required'),
  employment_status: z.string().min(1,'Employment status is required'),
  type_institution: z.string().min(1,'Employment status is required'),
  disability_check: z.string().min(1,'Field is required'),
  minor_conviction: z.string().min(1,'Field is required'),
  drugs_conviction: z.string().min(1,'Field is required'),
  area_of_practice: z.string().min(1,'Field is required'),
  registration_category: z.string().min(1,'Field is required'),
  district: z.string().min(1,'Field is required'),
  place: z.string().min(1,'Field is required'),
  region: z.string().min(1,'Field is required'),
  disability_specification: z.string().min(0,'Field is required'),
  minor_conviction_specification: z.string().min(0,'Field is required'),
  drugs_conviction_specification: z.string().min(0,'Field is required'),
  license_revoked: z.string().min(0,'Field is required'),

  
  
  student_related_offence: z.string().min(1,'Field is required'),
  student_related_offence_details: z.string().min(1,'Field is required'),
  drug_related_offence: z.string().min(1,'Field is required'),
  drug_related_offence_details: z.string().min(1,'Field is required'),
  license_flag: z.string().min(1,'Field is required'),
  license_flag_details: z.string().min(1,'Field is required'),
  misconduct_flag: z.string().min(1,'Field is required'),
  misconduct_flag_details:z.string().min(1,'Field is required'),
})