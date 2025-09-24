export type StatusType = 
| 'PENDING-CUSTOMER-ACTION'
| 'PENDING-SCREENING'
| 'PENDING-ASSESSMENT'
| 'MANAGER-REJECTED'
| 'MANAGER-APPROVED'
| 'RECOMMENDED-FOR-APPROVAL'
| 'RECOMMENDED-FOR-REJECTION'
| 'PENDING-ENDORSEMENT'
| 'ENDORSEMENT-COMPLETE';

interface TeacherRegistration {
    national_id?: string | null;
    reg_number?: string | null;
    reg_status?: string | null;
    endorsement_status?: string;
    rejection_reason?: string | null;
    submission_id: string | null;
    service_code?: string | null;
    payment_ref?: string | null;
    payment_amount?: string | null;
    payment_name?: string | null;
    paid_at?: string | null;
    application_id?: string | null;
    assigned_to?: string | null;
    work_status?: string | null;
    license_link?: string | null;
    education_bg_checks?: string | null;
    flags_no?: string | null;
    institution_verification?: string | null;
    course_verification?: string | null;
    license_status?: string | null;
    pending_customer_action?: string | null;
    registration_type?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
}
  
interface TeacherPreliminaryInfo {
    id?: number | null;
    national_id?: string | null;
    citizen_status?: string | null;
    work_status?: string | null;
    practice_category?: string | null;
    sub_category?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    minor_subjects?: string | null;
    major_subjects?: string | null;
}
  
interface EduProQualification {
    id?: number | null;
    national_id?: string | null;
    level?: string | null;
    qualification?: string | null;
    institution?: string | null;
    attachments?: string | null;
    qualification_year?: string | null;
    minor_subjects?: string | null;
    major_subjects?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
}
  
interface BioData {
    id?: number | null;
    national_id?: string | null;
    surname?: string | null;
    forenames?: string | null;
    dob?: string | null;
    pob?: string | null;
    gender?: string | null;
    nationality?: string | null;
    postal_address?: string | null;
    physical_address?: string | null;
    email?: string | null;
    mobile?: string;
    marital_status?: string | null;
    next_of_kin_name?: string | null;
    next_of_kin_relation?: string | null;
    next_of_kin_contact?: string | null;
    disability?: string | null;
    disability_description?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
}
  
interface Declaration {
    id?: number | null;
    national_id?: string | null;
    agreement?: string | null;
    signature?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
}
  
interface OffenceConviction {
    id?: number | null;
    national_id?: string | null;
    student_related_offence?: string | null;
    student_related_offence_details?: string | null;
    student_related_offence_attachments?: string | null;
    drug_related_offence_attachments?: string | null;
    drug_related_offence?: string | null;
    drug_related_offence_details?: string | null;
    license_flag?: string | null;
    license_flag_details?: string | null;
    misconduct_flag?: string | null;
    misconduct_flag_details?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
}

interface EmploymentDetail {
    id: number | null;
    national_id: string | null;
    experience_years: string | null;
    experience_months?: number | null;
    current_institution: string | null;
    institution_type: string | null;
    region: string | null;
    district: string | null;
    city_or_town: string | null;
    created_at: string | null;
    updated_at: string | null;
}

interface BackgroundChecks{
      id?: number | null,
      national_id?: string | null,
      name?: string | null,
      description?: string | null,
      checked_by?: string | null,
      created_at?: string | null,
      updated_at?: string | null
}

interface Attachment {
    national_id?: string | null;
    national_id_copy?: string | null;
    qualification_copy?: string | null;
    work_permit?: string | null;
    proof_of_payment?: string | null;
    created_at?: string | null
    updated_at?: string | null;
}

export interface TeacherResponse {
    code: number;
    message: string;
    teacher_registrations?: TeacherRegistration;
    teacher_preliminary_infos?: TeacherPreliminaryInfo;
    edu_pro_qualifications?: EduProQualification;
    other_qualifications?: EduProQualification[];
    bio_datas?: BioData;
    background_checks?: BackgroundChecks[];
    declarations?: Declaration;
    offence_convictions?: OffenceConviction;
    employment_details?: EmploymentDetail;
    attachments?: Attachment;
}