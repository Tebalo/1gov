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
  attachment_letter: string | null;
  created_at: string | null
  updated_at: string | null;
}

interface student_preliminary_infos{
  id: number | null;
  national_id: string | null;
  student_id: string | null;
  institution_name: string | null;
  institution_type: string | null;
  citizenry: string | null;
  practice_category: string | null;
  sub_category: string | null;
  study_area: string | null;
  created_at: string | null;
  updated_at: string | null
}

interface student_study_programmes {
  id: number | null,
  national_id: string | null;
  name: string | null;
  completion_year: string | null;
  level: string | null;
  duration: number | null;
  specialization: string | null;
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

interface background_checks{
  id: number | null,
  national_id: string | null,
  name: string | null,
  description: string | null,
  checked_by: string | null,
  created_at: string | null,
  updated_at: string | null
}



export interface StudentTeacherResponse {
  code: number;
  message: string;
  teacher_registrations?: teacher_registrations;
  bio_datas?: bio_datas;
  background_checks?: background_checks[];
  declarations?: declarations;
  offence_convictions?: offence_convictions;
  student_study_programmes?: student_study_programmes;
  student_preliminary_infos?: student_preliminary_infos;
  attachments?: attachments;
}