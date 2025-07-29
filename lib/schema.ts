import { z } from 'zod'

const documentSchema = z.object({
    bucket: z.string().optional(),
    extension: z.string().optional(),
    original_name: z.string().optional(),
    key: z.string().optional()
})

const QualificationSchema = z.object({
  alt_qualification: z.string(),
  alt_qualification_year: z.string(),
  alt_attachments: documentSchema.optional()
}).optional();

export const FormDataSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  // primary_email: z.string().min(1, 'Email is required').email('Invalid email'),
  citizenship: z.string().min(1, 'Citizenship is required'),
  surname: z.string().optional(),
  middle_name: z.string().optional(),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  username: z.string().min(1, 'Username is required'),
  primary_phone: z.string().min(1, 'Primary phone is required'),
  primary_physical: z.string().min(1, 'Primary physical address is required'),
  primary_postal: z.string().min(1, 'Primary postal address is required'),
  gender: z.string().min(1, 'Gender is required'),
  // marital_status: z.string().min(1, 'Marital status is required'),
  // required if citizenship is not 'Zambia'
  nationality: z.string().optional(),

  // form
  work_status: z.string().min(1, 'Work status is required'),
  practice_category: z.string().min(1, 'Practice category is required'),
  sub_category: z.string().min(1, 'Sub category is required'),
  experience_years: z.string().min(1, 'Experience years is required'),
  district: z.string().min(1, 'District is required'),
  institution_type: z.string().min(1, 'Institution type is required'),
  private_schools: z.string().optional(),
  other_private_schools: z.string().optional(),
  school_level: z.string().optional(),
  primary_schools: z.string().optional(),
  pre_primary_schools: z.string().optional(),
  other_primary_schools: z.string().optional(),
  
  junior_schools: z.string().optional(),
  other_junior_schools: z.string().optional(),
  senior_schools: z.string().optional(),
  other_senior_schools: z.string().optional(),
  qualification_masters_degree: z.string().optional(),
  level: z.string().min(1, 'Level is required'),
  qualification_certificate: z.string().optional(),
  qualification_post_grad_certificate: z.string().optional(),
  qualification_diploma: z.string().optional(),
  qualification_post_grad_diploma: z.string().optional(),
  qualification_degree: z.string().optional(),
  qualification_degree_honours: z.string().optional(),
  other_qualification: z.string().optional(),
  qualification_doctoral_degree: z.string().optional(),
  institution: z.string().optional(),
  other_institution: z.string().optional(),
  qualification_year: z.string().min(1, 'Qualification year is required'),
  attachments: documentSchema.optional(),
  subject_specialization: z.string().min(1, 'Subject specialization required'),
  other_subject_specialization: z.string().optional(),
  qualifications: z.array(QualificationSchema).optional(),

  disability: z.string().optional(),
  disability_description: z.array(z.string()).optional(),
  student_related_offence: z.string().optional(),
  student_related_offence_details: z.string().optional(),
  student_related_offence_attachments: documentSchema.optional(),
  drug_related_offence: z.string().optional(),
  drug_related_offence_details: z.string().optional(),
  drug_related_offence_attachments: documentSchema.optional(),
  license_flag: z.string().optional(),
  license_flag_details: documentSchema.optional(),
  misconduct_flag: z.string().optional(),
  misconduct_flag_details: documentSchema.optional(),
  national_id_copy: documentSchema.optional(),
  qualification_copy: documentSchema.optional(),
  work_permit: documentSchema.optional(),
  declaration: z.boolean().refine(value => value === true, {
    message: 'You must agree to the declaration'
  }),
  profile_data_consent: z.boolean().refine(value => value === true, {
    message: 'You must consent to the use of your profile data' 
  }),
})
// .superRefine((data,ctx) => {
//     if (data.citizenship === 'non-citizen' && !data.nationality || data.nationality.length === 0) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: "Nationality is required for non-citizens",
//         path: ['nationality']
//     });
//   }
// });






