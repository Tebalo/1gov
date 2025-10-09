import { z } from 'zod'

const documentSchema = z.object({
    bucket: z.string().optional(),
    extension: z.string().optional(),
    'original-name': z.string().optional(), 
    key: z.string().optional()
}).passthrough().nullable().optional(); 

const QualificationSchema = z.object({
  alt_qualification: z.string(),
  alt_qualification_year: z.string(),
  level: z.string().optional(),
  institution: z.string().optional(),
  major_subjects: z.string().optional(),
  alt_attachments: documentSchema.optional()
}).optional();

const requiredDocumentSchema = z.object({
    bucket: z.string(),
    extension: z.string(),
    'original-name': z.string(),
    key: z.string()
}).passthrough();

export const FormDataSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  primary_email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),
  citizenship: z.string().min(1, 'Citizenship is required'),
  surname: z.string().optional(),
  middle_name: z.string().optional(),
  date_of_birth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine(
      (date) => {
        const birthDate = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();
        
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
          return age - 1 >= 18;
        }
        
        return age >= 18;
      },
      {
        message: 'You must be at least 18 years old',
      }
    )
    .refine(
      (date) => {
        const birthDate = new Date(date);
        return !isNaN(birthDate.getTime());
      },
      {
        message: 'Invalid date format',
      }
    ),
  username: z.string().min(1, 'Username is required'),
  primary_phone: z.string().min(1, 'Primary phone is required'),
  primary_physical: z.string().min(1, 'Primary physical address is required'),
  primary_postal: z.string().min(1, 'Primary postal address is required'),
  gender: z.string().min(1, 'Gender is required'),
  nationality: z.string().optional(),
  work_status: z.string().min(1, 'Work status is required'),
  practice_category: z.string().min(1, 'Practice category is required'),
  sub_category: z.string().min(1, 'Sub category is required'),
  experience_years: z.string().min(1, 'Experience years is required'),
  district: z.string().optional(),
  institution_type: z.string().optional(),
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
  level: z.string().min(1, 'Qualification level is required'),
  qualification_certificate: z.string().optional(),
  qualification_post_grad_certificate: z.string().optional(),
  qualification_diploma: z.string().optional(),
  qualification_post_grad_diploma: z.string().optional(),
  qualification_degree: z.string().optional(),
  qualification_degree_honours: z.string().optional(),
  other_qualification: z.string().optional(),
  qualification_doctoral_degree: z.string().optional(),
  institution: z.string().min(1, 'Institution is required'),
  other_institution: z.string().optional(),
  qualification_year: z.string().min(1, 'Qualification year is required'),
  attachments: z.object({
    bucket: z.string().optional(),
    extension: z.string().optional(),
    'original-name': z.string().optional(),
    key: z.string().optional()
  }, {
    required_error: 'Qualification document is required',
    invalid_type_error: 'Please upload a valid document'
  }).passthrough(),
  subject_specialization: z.string().min(1, 'Subject specialization is required'),
  other_subject_specialization: z.string().optional(),
  qualifications: z.array(QualificationSchema).optional(),

  disability: z.string().min(1, 'Disability status is required'),
  disability_description: z.array(z.string()).optional(),
  student_related_offence: z.string().min(1, 'This field is required'),
  student_related_offence_details: z.string().optional(),
  student_related_offence_attachments: documentSchema.nullable().optional(),
  drug_related_offence: z.string().min(1, 'This field is required'),
  drug_related_offence_details: z.string().optional(),
  drug_related_offence_attachments: documentSchema.optional(),
  license_flag: z.string().min(1, 'This field is required'),
  license_flag_details: documentSchema.optional(),
  misconduct_flag: z.string().min(1, 'This field is required'),
  misconduct_flag_details: documentSchema.optional(),
  national_id_copy: z.object({
    bucket: z.string(),
    extension: z.string(),
    'original-name': z.string(),
    key: z.string()
  }, {
    required_error: 'National ID/Passport copy is required',
    invalid_type_error: 'Please upload a valid document'
  }).passthrough(),
  qualification_copy: documentSchema.optional(),
  work_permit: documentSchema.optional(),
  declaration: z.boolean().refine(value => value === true, {
    message: 'You must agree to the declaration to proceed'
  }),
  profile_data_consent: z.boolean().refine(value => value === true, {
    message: 'You must consent to the use of your profile data to proceed'
  }),
}).superRefine((data, ctx) => {
  
  // ============================================
  // NATIONALITY VALIDATION
  // ============================================
  if (data.citizenship?.toLowerCase() === 'non-citizen') {
    if (!data.nationality || data.nationality.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Nationality is required for non-citizens',
        path: ['nationality'],
      });
    }
  }

  // ============================================
  // PHONE NUMBER VALIDATION
  // ============================================
  // if (data.citizenship?.toLowerCase() === 'citizen') {
  //   // Strict validation for Botswana citizens
  //   if (!/^(\+267|267|0)?[0-9]{8}$/.test(data.primary_phone)) {
  //     ctx.addIssue({
  //       code: z.ZodIssueCode.custom,
  //       message: 'Please enter a valid Botswana phone number (e.g., +267 71234567, 71234567, or 071234567)',
  //       path: ['primary_phone'],
  //     });
  //   }
  // } else {
  //   // More lenient validation for non-citizens
  //   if (data.primary_phone.length < 8) {
  //     ctx.addIssue({
  //       code: z.ZodIssueCode.custom,
  //       message: 'Please enter a valid phone number (minimum 8 digits)',
  //       path: ['primary_phone'],
  //     });
  //   }
  // }

  // ============================================
  // EMPLOYMENT-RELATED VALIDATIONS
  // ============================================
  if (data.work_status?.toLowerCase() === 'employed') {
    // District is required
    if (!data.district || data.district.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'District is required when employed',
        path: ['district'],
      });
    }
    
    // Institution type is required
    if (!data.institution_type || data.institution_type.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Institution type is required when employed',
        path: ['institution_type'],
      });
    }
    
    // School level is required
    if (!data.school_level || data.school_level.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'School level is required when employed',
        path: ['school_level'],
      });
    }

    // ============================================
    // PUBLIC SCHOOL VALIDATIONS
    // ============================================
    if (data.institution_type?.toLowerCase() === 'public') {
      if (data.school_level?.toLowerCase() === 'primary') {
        if (!data.primary_schools || data.primary_schools.trim().length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please select your primary school',
            path: ['primary_schools'],
          });
        }
        // If "Other" is selected, require other_primary_schools
        if (data.primary_schools?.toLowerCase() === 'other' && !data.other_primary_schools) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please specify the name of your primary school',
            path: ['other_primary_schools'],
          });
        }
      }
      
      if (data.school_level?.toLowerCase() === 'junior secondary') {
        if (!data.junior_schools || data.junior_schools.trim().length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please select your junior school',
            path: ['junior_schools'],
          });
        }
        // If "Other" is selected, require other_junior_schools
        if (data.junior_schools?.toLowerCase() === 'other' && !data.other_junior_schools) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please specify the name of your junior school',
            path: ['other_junior_schools'],
          });
        }
      }
      
      if (data.school_level?.toLowerCase() === 'senior secondary') {
        if (!data.senior_schools || data.senior_schools.trim().length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please select your senior school',
            path: ['senior_schools'],
          });
        }
        // If "Other" is selected, require other_senior_schools
        if (data.senior_schools?.toLowerCase() === 'other' && !data.other_senior_schools) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please specify the name of your senior school',
            path: ['other_senior_schools'],
          });
        }
      }
    }
    
    // ============================================
    // PRIVATE SCHOOL VALIDATIONS
    // ============================================
    if (data.institution_type?.toLowerCase() === 'private') {
      if (!data.private_schools || data.private_schools.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please select your private school',
          path: ['private_schools'],
        });
      }
      // If "Other" is selected, require other_private_schools
      if (data.private_schools?.toLowerCase() === 'other' && !data.other_private_schools) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please specify the name of your private school',
          path: ['other_private_schools'],
        });
      }
    }
  }

  // ============================================
  // QUALIFICATION LEVEL-SPECIFIC VALIDATIONS
  // ============================================
  if (data.level?.toLowerCase() === 'certificate' && !data.qualification_certificate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please select your certificate qualification',
      path: ['qualification_certificate'],
    });
  }
  
  if (data.level?.toLowerCase() === 'diploma' && !data.qualification_diploma) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please select your diploma qualification',
      path: ['qualification_diploma'],
    });
  }
  
  if (data.level?.toLowerCase() === 'post-graduate diploma' && !data.qualification_post_grad_diploma) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please select your post-graduate diploma',
      path: ['qualification_post_grad_diploma'],
    });
  }
  
  if (data.level?.toLowerCase() === "bachelor's degree" && !data.qualification_degree) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please select your bachelor\'s degree',
      path: ['qualification_degree'],
    });
  }
  
  if (data.level?.toLowerCase() === "bachelor's degree honours" && !data.qualification_degree_honours) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please select your honours degree',
      path: ['qualification_degree_honours'],
    });
  }
  
  if (data.level?.toLowerCase() === "master's degree" && !data.qualification_masters_degree) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please select your master\'s degree',
      path: ['qualification_masters_degree'],
    });
  }
  
  if (data.level?.toLowerCase() === "doctoral degree" && !data.qualification_doctoral_degree) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please select your doctoral degree',
      path: ['qualification_doctoral_degree'],
    });
  }
  
  if (data.level?.toLowerCase() === "other" && (!data.other_qualification || data.other_qualification.trim().length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please specify your qualification',
      path: ['other_qualification'],
    });
  }

  // ============================================
  // INSTITUTION VALIDATION
  // ============================================
  if (data.institution?.toLowerCase() === 'other' && (!data.other_institution || data.other_institution.trim().length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please specify the institution name',
      path: ['other_institution'],
    });
  }

  // ============================================
  // SUBJECT SPECIALIZATION VALIDATION
  // ============================================
  if (data.subject_specialization?.toLowerCase() === 'other' && (!data.other_subject_specialization || data.other_subject_specialization.trim().length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please specify your subject specialization',
      path: ['other_subject_specialization'],
    });
  }

  // ============================================
  // DISABILITY VALIDATION
  // ============================================
  if (data.disability?.toLowerCase() === 'yes') {
    if (!data.disability_description || data.disability_description.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please select at least one disability type',
        path: ['disability_description'],
      });
    }
  }

  // ============================================
  // STUDENT-RELATED OFFENCE VALIDATION
  // ============================================
  if (data.student_related_offence?.toLowerCase() === 'yes') {
    if (!data.student_related_offence_details || data.student_related_offence_details.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please provide details about the student-related offence',
        path: ['student_related_offence_details'],
      });
    }
    if (!data.student_related_offence_attachments) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Supporting documentation is required for student-related offences',
        path: ['student_related_offence_attachments'],
      });
    }
  }

  // ============================================
  // DRUG-RELATED OFFENCE VALIDATION
  // ============================================
  if (data.drug_related_offence?.toLowerCase() === 'yes') {
    if (!data.drug_related_offence_details || data.drug_related_offence_details.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please provide details about the drug-related offence',
        path: ['drug_related_offence_details'],
      });
    }
    if (!data.drug_related_offence_attachments) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Supporting documentation is required for drug-related offences',
        path: ['drug_related_offence_attachments'],
      });
    }
  }

  // ============================================
  // LICENSE FLAG VALIDATION
  // ============================================
  if (data.license_flag?.toLowerCase() === 'yes') {
    if (!data.license_flag_details) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Documentation is required when license has been revoked, suspended, or denied',
        path: ['license_flag_details'],
      });
    }
  }

  // ============================================
  // MISCONDUCT FLAG VALIDATION
  // ============================================
  if (data.misconduct_flag?.toLowerCase() === 'yes') {
    if (!data.misconduct_flag_details) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Documentation is required for ongoing reviews or investigations',
        path: ['misconduct_flag_details'],
      });
    }
  }
})