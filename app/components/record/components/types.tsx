interface teacher_preliminary_infos {
    id: string,
    national_id: string;
    citizen_status: string,
    work_status: string,
    practice_category: string,
    sub_category: string,
    created_at: string,
    updated_at: string
}
  
interface declarations {
    agreement: boolean;
    signature: string;
}

interface offence_convictions {
    id: string,
    student_related_offence: string;
    student_related_offence_details: string;
    drug_related_offence: string;
    drug_related_offence_details: string;
    license_flag: string;
    license_flag_details: string;
    misconduct_flag: string;
    misconduct_flag_details: string;
}

interface edu_pro_qualifications{
    id: string,
    level: string,
    qualification: string,
    institution: string,
    qualification_year: string,
    attachments: string,
    minor_subjects: [],
    major_subjects: [],
}

interface bio_datas {
    surname: string;
    forenames: string;
    id: string;
    dob: string; 
    pob: string;
    gender: string;
    nationality: string;
    postal_address: string;
    physical_address: string;
    email: string;
    mobile: string;
    marital_status: string;
    next_of_kin_name: string;
    next_of_kin_relation: string;
    next_of_kin_contact: string;
    disability: string;
    disability_description: string;
}
interface employment_details {
    experience_years: number;
    current_institution: string;
    institution_type: string;
    region: string;
    district: string;
    city_or_town: string;
}
interface teacher_registrations {
    national_id: string;
    reg_number: string;
    registration_type: string;
    reg_status: string;
    endorsement_status: string;
    created_at: string;
    updated_at: string;
}

interface student_preliminary_infos{
    institution_name: string;
    institution_type: string;
    citizenry: string;
    study_area: string;
}

interface institution_recommendations{
    recommended:string;
    attachment: string;
}
interface student_study_programmes{
    name: string;
    completion_year: string;
    level: string;
    duration: number;// Assuming duration is numerical
    mode_of_study: string;
    specialization: string;
}
interface attachments{
    national_id: string,
    national_id_copy: string,
    qualification_copy: string,
    proof_of_payment: string,
    created_at: string,
    updated_at: string
}
export default interface Props {
    teacher_registrations: teacher_registrations,
    teacher_preliminary_infos: teacher_preliminary_infos,
    edu_pro_qualifications: edu_pro_qualifications[],
    student_preliminary_infos: student_preliminary_infos,
    bio_datas: bio_datas,
    declarations: declarations,
    offence_convictions: offence_convictions,
    employment_details: employment_details,
    student_study_programmes: student_study_programmes,
    attachments: attachments,
    institution_recommendations: institution_recommendations,
    userRole:string
}