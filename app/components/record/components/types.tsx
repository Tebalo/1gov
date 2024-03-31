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
    postalAddress: string;
    physicalAddress: string;
    email: string;
    mobile: string;
    maritalStatus: string;
    nextOfKinName: string;
    nextOfKinRelation: string;
    nextOfKinContact: string;
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
    created_at: string;
    updated_at: string;
}
interface Recommendation{
    recommended:string;
    attachment: string;
}
interface StudyProgramme{
    name: string;
    completionYear: string;
    level: string;
    duration: number;// Assuming duration is numerical
    modeOfStudy: string;
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
    bio_datas: bio_datas,
    declarations: declarations,
    offence_convictions: offence_convictions,
    employment_details: employment_details,
    study_programmes: StudyProgramme,
    attachments: attachments,
    recommendation: Recommendation,
    userRole:string
}