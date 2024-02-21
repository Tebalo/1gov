import {z} from 'zod';

export const FormDataSchema = z.object({

  // teacher registration
  registration_type: z.string().min(1,'Registration type is required').optional(),
  disability: z.string().min(0,'Disability check is required').optional(),
  disability_description: z.string().min(0,'Field is required').optional(),

  // bio datas

  // declarations
  agreement: z.string().min(0, 'Agreement is required').optional(),
  signature: z.string().min(0,'Signature is required').optional(),

  // attachments

  // Qualifications
  level: z.string().min(0,'Field is required').optional(),
  qualification: z.string().min(0,'Field is required').optional(),
  institution: z.string().min(0, 'Institution name is required').optional(),
  qualification_year: z.string().min(0,'Field is required').optional(),
  teaching_subjects: z.string().min(0,'Field is required').optional(),

  // Employment details
  experience_years: z.string().min(0,'Employment status is required').optional(),
  current_institution: z.string().min(1,'Institution is required').optional(),
  institution_type: z.string().min(1,'Field is required').optional(),
  region: z.string().min(1,'Field is required').optional(),
  district: z.string().min(1,'Field is required').optional(),
  city_or_town: z.string().min(1,'Field is required').optional(),

  // Institution recommendation
  recommended:z.string().min(0,'Field is required').optional(),
  comment: z.string().min(0,'Field is required').optional(),
  name:z.string().min(1,'Field is required').optional(),

  // Offence convictions
  student_related_offence: z.string().min(1,'Field is required').optional(),
  student_related_offence_details: z.string().min(0,'Field is required').optional(),
  drug_related_offence: z.string().min(1,'Field is required').optional(),
  drug_related_offence_details: z.string().min(0,'Field is required').optional(),
  license_flag: z.string().min(1,'Field is required').optional(),
  license_flag_details: z.string().min(0,'Field is required').optional(),
  misconduct_flag: z.string().min(1,'Field is required'),
  misconduct_flag_details:z.string().min(0,'Field is required').optional(),

  // Student Preliminary Infos
  institution_name:z.string().min(1,'Field is required').optional(),
  citizenry: z.string().min(1,'Citizenship is required').optional(),
  study_area: z.string().min(1,'Field is required').optional(),

  
  disability_check: z.string().min(1,'Field is required').optional(),
  minor_conviction: z.string().min(0,'Field is required').optional(),
  drugs_conviction: z.string().min(0,'Field is required').optional(),
  area_of_practice: z.string().min(0,'Field is required').optional(),
  registration_category: z.string().min(1,'Field is required').optional(),
  
  // Student Study Programmes
  completion_year: z.string().min(0,'Field is required').optional(),
  duration: z.string().min(0,'Field is required').optional(),
  mode_of_study: z.string().min(0,'Field is required').optional(),
  specialization: z.string().min(0,'Field is required').optional(),
  
  status: z.string().min(1,'Status is required').optional(),

  // Teacher preliminary info
  citizen_status:z.string().min(0,'Citizenship is required').optional(),
  work_status: z.string().min(1,'Work Status is required').optional(),
  practice_category:z.string().min(1,'Practice category is required').optional(),
  sub_cateogry:z.string().min(1,'Sub-category is required').optional(),
})