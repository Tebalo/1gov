interface bio_datas {
    id: number | null;
    national_id: string | null;
    surname: string | null;
    forenames: string | null;
    dob: string | null;
    pob: string | null;
    gender: string | null;
    nationality: string | null;
    postal_address: string | null;
    physical_address: string | null;
    email: string | null;
    mobile: string;
    marital_status: string | null;
    next_of_kin_name: string | null;
    next_of_kin_relation: string | null;
    next_of_kin_contact: string | null;
    disability: string | null;
    disability_description: string | null;
    created_at: string | null;
    updated_at: string | null;
  }
  interface attachments{
    national_id: string | null;
    national_id_copy: string | null;
    qualification_copy: string | null;
    work_permit: string | null;
    proof_of_payment: string | null;
    created_at: string | null
    updated_at: string | null;
  }
  
  interface employment_details {
    id: number | null;
    national_id: string | null;
    experience_years: string | null;
    current_institution: string | null;
    institution_type: string | null;
    region: string | null;
    district: string | null;
    city_or_town: string | null;
    created_at: string | null;
    updated_at: string | null;
  }
  
  interface teacher_registrations {
    national_id: string | null;
    reg_number: string | null;
    reg_status: string | null;
    endorsement_status: string;
    rejection_reason: string | null;
    service_code: string | null;
    payment_ref: string | null;
    payment_amount: string | null;
    reason: string | null;
    payment_name: string | null;
    application_id: string | null;
    license_link: string | null;
    education_bg_checks: string | null;
    flags_no: string | null;
    institution_verification: string | null;
    course_verification: string | null;
    license_status: string | null;
    pending_customer_action: string | null;
    registration_type: string | null;
    created_at: string | null;
    updated_at: string | null;
  }
  
  interface declarations {
    id: number | null;
    national_id: string | null;
    agreement: string | null;
    signature: string | null;
    created_at: string | null;
    updated_at: string | null;
  }
  
  interface offence_convictions {
    id: number | null;
    national_id: string | null;
    student_related_offence: string | null;
    student_related_offence_attachments: string | null;
    student_related_offence_details: string | null;
    drug_related_offence: string | null;
    drug_related_offence_attachments: string | null;
    drug_related_offence_details: string | null;
    license_flag: string | null;
    license_flag_details: string | null;
    misconduct_flag: string | null;
    misconduct_flag_details: string | null;
    created_at: string | null;
    updated_at: string | null;
  }
  
  interface edu_pro_qualifications{
    id: number | null;
    national_id: string | null;
    level: string | null;
    qualification: string | null;
    institution: string | null;
    attachments: string | null;
    qualification_year: string | null;
    minor_subjects: string | null;
    subjects?: string | null;
    major_subjects: string | null;
    created_at: string | null;
    updated_at: string | null;
  }
  
  interface teacher_preliminary_infos {
    id: number | null;
    national_id: string | null;
    citizen_status: string | null;
    work_status: string | null;
    practice_category: string | null;
    sub_category: string | null;
    created_at: string | null;
    updated_at: string | null;
  }
  
  interface background_checks{
    id: number | null,
    national_id: string | null,
    name: string | null,
    description: string | null,
    checked_by: string | null,
    created_at: string | null,
    updated_at: string | null
  }

  interface categories{
    id: number | null,
    national_id: string | null,
    registration_number: string | null,
    current_membership: string | null,
    desired_membership: string | null,
    change_reason: string | null,
    employment_contract: string | null,
    teaching_certificate: string | null,
    cpd_transcript: string | null,
    created_at: string | null,
    updated_at: string | null
  }


export interface RestorationResponse {
  code: number;
  message: string;
  teacher_registrations?: teacher_registrations;
  teacher_preliminary_infos?: teacher_preliminary_infos;
  edu_pro_qualifications?: edu_pro_qualifications;
  other_qualifications?: edu_pro_qualifications[];
  bio_datas?: bio_datas;
  background_checks?: background_checks[];
  declarations?: declarations;
  offence_convictions?: offence_convictions;
  employment_details?: employment_details;
  attachments?: attachments;
  categories?: categories;
}