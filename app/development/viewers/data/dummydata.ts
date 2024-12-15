import { RevocationResponse } from "@/app/(portal)/trls/work/revocation/types/revocation-type";
import { TeacherRegistrationResponse } from "@/app/lib/types";

export const dummyRenewalData: TeacherRegistrationResponse = {
    code: 200,
    message: "success",
    "background_checks": [
        {
            "id": 1,
            "national_id": "436415528",
            "name": "Criminal Record Check",
            "description": "No criminal records found",
            "checked_by": "Officer John Smith",
            "created_at": "2024-12-04 08:21:39",
            "updated_at": "2024-12-04 08:21:39"
        },
        {
            "id": 2,
            "national_id": "436415528",
            "name": "Professional Conduct Check",
            "description": "Clear history of professional conduct",
            "checked_by": "Officer Jane Doe",
            "created_at": "2024-12-04 08:21:39",
            "updated_at": "2024-12-04 08:21:39"
        }
    ],
    "other_qualifications": [
        {
            "id": 9,
            "national_id": "436415528",
            "level": "Bachelor's Degree",
            "qualification": "Bachelor of Education",
            "institution": "University of Botswana",
            "attachments": "http://reg-ui-acc.gov.bw:8080/download/MESD_006_08_054/sample-1",
            "qualification_year": "2005",
            "minor_subjects": "English",
            "major_subjects": "Mathematics",
            "created_at": "2024-12-04 08:21:39",
            "updated_at": "2024-12-04 08:21:39"
        },
        {
            "id": 10,
            "national_id": "436415528",
            "level": "Master's Degree",
            "qualification": "Master of Education",
            "institution": "University of Cape Town",
            "attachments": "http://reg-ui-acc.gov.bw:8080/download/MESD_006_08_054/sample-2",
            "qualification_year": "2009",
            "minor_subjects": "Educational Psychology",
            "major_subjects": "Curriculum Development",
            "created_at": "2024-12-04 08:21:39",
            "updated_at": "2024-12-04 08:21:39"
        }
    ],
    "teacher_registrations": {
        "national_id": "436415528",
        "reg_number": "REG2024/001",
        "reg_status": "Pending-Screening",
        "endorsement_status": "Pending-Endorsement",
        "rejection_reason": null,
        "service_code": "MESD_006_08_054",
        "payment_ref": "PAY123456",
        "payment_amount": "500.00",
        "payment_name": "Registration Renewal Fee",
        "application_id": "22c61291-67df-401d-a105-209f2f43b253",
        "license_link": "http://reg-ui-acc.gov.bw:8080/licenses/sample-license",
        "education_bg_checks": "Completed",
        "flags_no": "0",
        "institution_verification": "Verified",
        "course_verification": "Verified",
        "license_status": "Active",
        "pending_customer_action": "false",
        "registration_type": "Teacher",
        "created_at": "2024-12-04 08:21:39",
        "updated_at": "2024-12-04 08:21:39"
    },
    "teacher_preliminary_infos": {
        "id": 8,
        "national_id": "436415528",
        "citizen_status": "Citizen",
        "work_status": "Employed",
        "practice_category": "Secondary",
        "sub_category": "Senior Teacher",
        "created_at": "2024-12-04 08:21:39",
        "updated_at": "2024-12-04 08:21:39"
    },
    "edu_pro_qualifications": {
        "id": 8,
        "national_id": "436415528",
        "level": "PhD",
        "qualification": "Doctor of Education",
        "institution": "University of Pretoria",
        "attachments": "http://reg-ui-acc.gov.bw:8080/download/MESD_006_08_054/sample-3",
        "qualification_year": "2015",
        "minor_subjects": "Research Methods",
        "major_subjects": "Educational Leadership",
        "subjects": "Leadership, Administration",
        "created_at": "2024-12-04 08:21:39",
        "updated_at": "2024-12-04 08:21:39"
    },
    "bio_datas": {
        "id": 8,
        "national_id": "436415528",
        "surname": "Mokobi",
        "forenames": "Thabo James",
        "dob": "1980-06-24T00:00:00.000Z",
        "pob": "Gaborone",
        "gender": "Male",
        "nationality": "Botswana",
        "postal_address": "P.O Box 920, Gaborone, Botswana",
        "physical_address": "Plot 42567, Extension 12, Gaborone, Botswana",
        "email": "thabo.mokobi@email.com",
        "mobile": "+26774219688",
        "marital_status": "Married",
        "next_of_kin_name": "Sarah Mokobi",
        "next_of_kin_relation": "Spouse",
        "next_of_kin_contact": "+26774219689",
        "disability": "No",
        "disability_description": null,
        "created_at": "2024-12-04 08:21:39",
        "updated_at": "2024-12-04 08:21:39"
    },
    "declarations": {
        "id": 8,
        "national_id": "436415528",
        "agreement": "Yes",
        "signature": "Thabo Mokobi",
        "created_at": "2024-12-04 08:21:39",
        "updated_at": "2024-12-04 08:21:39"
    },
    "offence_convictions": {
        "id": 8,
        "national_id": "436415528",
        "student_related_offence": "No",
        "student_related_offence_attachments": null,
        "student_related_offence_details": null,
        "drug_related_offence": "No",
        "drug_related_offence_attachments": null,
        "drug_related_offence_details": null,
        "license_flag": "No",
        "license_flag_details": null,
        "misconduct_flag": "No",
        "misconduct_flag_details": null,
        "created_at": "2024-12-04 08:21:39",
        "updated_at": "2024-12-04 08:21:39"
    },
    "employment_details": {
        "id": 8,
        "national_id": "436415528",
        "experience_years": "15",
        "current_institution": "Gaborone Secondary School",
        "institution_type": "Public",
        "region": "South-East",
        "district": "Gaborone",
        "city_or_town": "Gaborone",
        "created_at": "2024-12-04 08:21:39",
        "updated_at": "2024-12-04 08:21:39"
    },
    "attachments": {
        "national_id": "436415528",
        "national_id_copy": "http://reg-ui-acc.gov.bw:8080/download/MESD_006_08_054/id-copy",
        "qualification_copy": "http://reg-ui-acc.gov.bw:8080/download/MESD_006_08_054/qualification",
        "work_permit": null,
        "proof_of_payment": "http://reg-ui-acc.gov.bw:8080/download/MESD_006_08_054/payment",
        "created_at": "2024-12-04 08:21:39",
        "updated_at": "2024-12-04 08:21:39"
    }
};

export const dummyRevocationData: RevocationResponse = {
    code: 200,
    message: "success",
    "revocation": {
        "id": 1,
        "revocation_number": "RVC2024-11-00001",
        "sla": "25",
        "reg_status": "Pending-Screening",
        "userid": "436415528",
        "application_id": "0446c9cc-3ab2-4ebf-8166-876b8938eb41",
        "registration_number": "Q54532",
        "current_employer": "Gaborone Secondary School",
        "employer_contact": "+26771625455",
        "reason": "retirement",
        "declaration": "I declare that the information provided...",
        "profile_data_consent": true,
        "created_at": "2024-11-26T15:23:20",
        "updated_at": "2024-11-26T15:23:20"
    },
    "profile": {
        "id": 1,
        "userid": "436415528",
        "first_name": "olorato",
        "middle_name": "",
        "surname": "charles",
        "primary_email": "bopaki@26digitalbw.com",
        "primary_phone": "+26771625455",
        "primary_physical": "20287,20288,Phase 2,Botswana",
        "primary_postal": "P.O Box 30559,46190,Serowe,Botswana",
        "gender": "Female",
        "nationality": "Botswana",
        "created_at": "2024-11-26T15:23:20",
        "updated_at": "2024-11-26T15:23:20"
    }
};