import {z} from 'zod';

const Region = ["gaborone", "francistown", "palapye"] as const;
const District = ["chobe", "ghanzi", "ngamiland", "kgatleng", "kweneng", "south-east"] as const;
const Place = ["gaborone","francistown","maun","palapye","mahalapye","serowe","orapa","gantsi","jwaneng"] as const; 

const teacherPreliminaryInfoSchema = z.object({
    /**
     * Preliminary Info schema.*/
    work_status: z.enum(["student/teacher", "unemployed", "serving", "retired", "educational consultant"]),
    practice_category: z.enum(["pre-primary", "primary", "junior secondary", "secondary"]),
    sub_category: z.enum(["teacher-aide", "tutor", "special education", "educational support services", "education administrator"]),
})

const disabilities = [
  "Visual Impairment",
  "Hearing Impairment",
  "Mobility Impairment",
  "Cognitive Impairment",
  "Neurodevelopmental Disorders",
  "Chronic Illnesses",
  "Psychiatric Disabilities",
  "Learning Disabilities",
  "Speech Impairment",
  "Intellectual Disability",
  "Deafblindness",
  "Epilepsy",
  "Musculoskeletal Disorders",
  "Multiple Sclerosis",
  "Cerebral Palsy"
] as const;

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_FILE_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']

const offenceConvictions = z.object({
  /**
   * Capture offence convictions object
  */
  student_related_offence: z.enum(["yes", "no"]),
  student_related_offence_details: z.string().optional(),
  drug_related_offence: z.enum(["yes", "no"]),
  drug_related_offence_details: z.string().optional(),
  license_flag: z.enum(["yes", "no"]),
  misconduct_flag: z.enum(["yes", "no"]),
  offence_type: z.string().optional(),
  conviction_status: z.string().optional(),
  sentence_outcome: z.string().optional(),
  date_of_conviction: z.date().optional(),
  type_of_drug_offence: z.string().optional(),
  drug_conviction_status: z.string().optional(),
  substance_involved: z.string().optional(),
  court_jurisdiction: z.string().optional(),
  date_of_drug_conviction: z.date().optional(),
  jurisdiction_drugs: z.string().optional(),
  license_flag_details: typeof window === "undefined" ? z.any():
    z
    .instanceof(FileList)
    .optional(),
  misconduct_flag_details:  typeof window === "undefined" ? z.any():
  z
  .instanceof(FileList)
  .optional(),
})

const teacherRegistrations = z.object({
  /**
   * Capture teacher registration, it should be a disability object.
  */
  registration_type: z.string().optional(),
  reg_status: z.string().optional(),
  disability: z.enum(["yes","no"]),
  disability_description: z.string().optional()
})

const declarations = z.object({
  agreement: z.boolean({
    required_error: "Agreement is required",
    invalid_type_error: "Agreement must be boolean"
  }),
  signature: z.string({
    required_error: "Signature is required",
    invalid_type_error: "Signature must be a string"
  }),
})

/**
 * Check doc for Zod enums: https://zod.dev/?id=zod-enums
 * use 'as const' to define your enum values as tuple of strings.
*/

const employmentDetails = z.object({
    /**
     * Employment Details schema.*/
    experience_years: z.coerce.number().optional(),
    current_institution: z.string().optional(),
    institution_type: z.enum(["private", "public"]),
    region: z.string(),
    district: z.string(),
    city_or_town: z.string(),
})

const attachments = z.object({
  national_id_copy:  typeof window === "undefined" ? z.any():
  z
  .instanceof(FileList)
  .refine((files) => files.length === 1, {message: "File is required."})
  .refine((files) => files[0].size <= MAX_FILE_SIZE, {message: "Max file size is 5MB"})
  .refine(
    (files) => ACCEPTED_FILE_TYPES.includes(files[0].type),
    { message: ".pdf, .doc, and .docx files are accepted"}
  ),
  qualification_copy: typeof window === "undefined" ? z.any():
  z
  .instanceof(FileList)
  .refine((files) => files.length === 1, {message: "File is required."})
  .refine((files) => files[0].size <= MAX_FILE_SIZE, {message: "Max file size is 5MB"})
  .refine(
    (files) => ACCEPTED_FILE_TYPES.includes(files[0].type),
    { message: ".pdf, .doc, and .docx files are accepted"}
  ),
  proof_of_payment: typeof window === "undefined" ? z.any():
  z
  .instanceof(FileList)
  .refine((files) => files.length === 1, {message: "File is required."})
  .refine((files) => files[0].size <= MAX_FILE_SIZE, {message: "Max file size is 5MB"})
  .refine(
    (files) => ACCEPTED_FILE_TYPES.includes(files[0].type),
    { message: ".pdf, .doc, and .docx files are accepted"}
  ),
})

export const formSchema = z.object({
    /**
     * Application for teacher/stundent registration schema.
     * Desc: Nested objects, meets backend specification
     * */
    teacher_preliminary_infos: teacherPreliminaryInfoSchema,
    employment_details: employmentDetails,
    teacher_registrations: teacherRegistrations,
    offence_convictions: offenceConvictions,
    attachments: attachments,
    declarations: declarations,
})

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