"use client"

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { TeacherResponse } from '@/app/(portal)/trls/work/teacher/types/teacher-type';
import TeacherRegistrationViewer from '@/app/(portal)/trls/work/teacher/ui/teacher-section';

const data: TeacherResponse = {
  "code": 200,
  "message": "Success",
    "background_checks": [
        {
            "id": 5,
            "national_id": "512927017",
            "name": "Educational Background Check",
            "description": "Omang number was not found on the TCE graduates database",
            "checked_by": "System Checker",
            "created_at": "2025-10-02 05:26:53",
            "updated_at": "2025-10-02 05:26:53"
        },
        {
            "id": 6,
            "national_id": "512927017",
            "name": "Educational Background Check",
            "description": "Omang number was not found on the Serowe College of Education graduates database",
            "checked_by": "System Checker",
            "created_at": "2025-10-02 05:26:53",
            "updated_at": "2025-10-02 05:26:53"
        }
    ],
    "other_qualifications": [
              {
            "id": 10,
            "national_id": "436415528",
            "level": null,
            "qualification": "Bachelor of Agriculture",
            "institution": null,
            "attachments": "https://twosixdigitalbw.com/api/v2-uat/document/3bd077e3-c9e1-40d2-b53a-4373a513518d/download",
            "qualification_year": "2002",
            "minor_subjects": null,
            "major_subjects": null,
            "created_at": "2025-10-18 11:00:33",
            "updated_at": "2025-10-18 11:00:33"
        }
    ],
    "teacher_registrations": {
        "national_id": "436415528",
        "reg_number": "BOT000117",
        "reg_status": "Recommended-For-Approval",
        "work_status": "Employed",
        "endorsement_status": "Pending-Endorsement",
        "rejection_reason": null,
        "service_code": "TRLS",
        "payment_ref": null,
        "payment_amount": null,
        "payment_name": null,
        "invoice_number": "INV-000118",
        "application_id": "5f6662b4-84ec-4684-983d-149c0e23f9ey",
        "submission_id": "5f6662b4149c0e23879y",
        "license_link": null,
        "draft_id": "cmezyuufe0000h0c4rmkoxpti",
        "submitted_via": "TRLS Portal",
        "education_bg_checks": null,
        "flags_no": "0",
        "recite": null,
        "invoice": "https://twosixdigitalbw.com/api/v2-uat/document/AabrXzqi3mkASF4oldf6aHt92YkakH031upPFbB2/download",
        "charges": null,
        "paid_at": "https://twosixdigitalbw.com/uat/payment/show/ref_68f3737439aae",
        "payment_link": null,
        "subscription_due_date": null,
        "license_expiry_date": null,
        "assigned_to": null,
        "institution_verification": "Verified",
        "course_verification": "Verified",
        "license_status": "New",
        "pending_customer_action": "false",
        "registration_type": "Teacher",
        "created_at": "2025-10-18 11:00:33",
        "updated_at": "2025-10-18 11:01:07"
    },
    "teacher_preliminary_infos": {
        "id": 21,
        "national_id": "436415528",
        "citizen_status": "Citizen",
        "work_status": null,
        "practice_category": "Primary",
        "sub_category": "Tutor",
        "created_at": "2025-10-18 11:00:33",
        "updated_at": "2025-10-18 11:00:33"
    },
    "edu_pro_qualifications": {
        "id": 21,
        "national_id": "436415528",
        "level": "Post-Graduate Diploma",
        "qualification": "Post Graduate Diploma in Project Management",
        "institution": "Amistad Education Botswana",
        "attachments": "https://twosixdigitalbw.com/api/v2-uat/document/34471c3a-1f07-47bb-9519-904d951be0a6/download",
        "qualification_year": "2009",
        "minor_subjects": null,
        "major_subjects": "Integrated Science",
        "subjects": null,
        "created_at": "2025-10-18 11:00:33",
        "updated_at": "2025-10-18 11:00:33"
    },
    "bio_datas": {
        "id": 21,
        "national_id": "436415528",
        "surname": "Motlalepuo",
        "forenames": "Garenosi",
        "dob": "1996-06-24T00:00:00.000Z",
        "pob": null,
        "gender": "Male",
        "nationality": "Botswana",
        "postal_address": "P.O Box 190,Tlokweng,Botswana",
        "physical_address": "Plot 4257,Bodiba,Tlokweng,Botswana",
        "email": "garenosi@gmail.com",
        "mobile": "+26771682727",
        "marital_status": null,
        "next_of_kin_name": null,
        "next_of_kin_relation": null,
        "next_of_kin_contact": null,
        "disability": "Yes",
        "disability_description": "Speech disabilities, Medical conditions",
        "created_at": "2025-10-18 11:00:33",
        "updated_at": "2025-10-18 11:00:33"
    },
    "declarations": {
        "id": 21,
        "national_id": "436415528",
        "agreement": "Yes",
        "signature": null,
        "created_at": "2025-10-18 11:00:33",
        "updated_at": "2025-10-18 11:00:33"
    },
    "offence_convictions": {
        "id": 21,
        "national_id": "436415528",
        "student_related_offence": "No",
        "student_related_offence_attachments": null,
        "student_related_offence_details": null,
        "drug_related_offence": "Yes",
        "drug_related_offence_attachments": "https://twosixdigitalbw.com/api/v2-uat/document/35db3131-08c2-4acb-8528-62f2b1552bd7/download",        
        "drug_related_offence_details": "Yes it was a false accusation and ruled out that I was innocent",
        "license_flag": "No",
        "license_flag_details": null,
        "misconduct_flag": "No",
        "misconduct_flag_details": null,
        "created_at": "2025-10-18 11:00:33",
        "updated_at": "2025-10-18 11:00:33"
    },
    "employment_details": {
        "id": 21,
        "national_id": "436415528",
        "experience_years": "More than 10 years",
        "current_institution": "Kalamare",
        "institution_type": "Public",
        "region": "Charleshill",
        "district": "Charleshill",
        "city_or_town": "",
        "created_at": "2025-10-18 11:00:33",
        "updated_at": "2025-10-18 11:00:33"
    },
    "attachments": {
        "national_id": "436415528",
        "national_id_copy": "https://twosixdigitalbw.com/api/v2-uat/document/23fcac31-9df3-447a-acdf-13d3d9ff4333/download",
        "qualification_copy": null,
        "work_permit": "https://twosixdigitalbw.com/api/v2-uat/document/1402b838-7549-45c5-b8cf-5b6dbdde92c1/download",
        "proof_of_payment": null,
        "created_at": "2025-10-18 11:00:33",
        "updated_at": "2025-10-18 11:00:33"
    }
};

export default function RegistrationContent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <RefreshCw className="h-16 w-16 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="p-4">
      <TeacherRegistrationViewer 
        data={data}
        userRole="manager"
      />
    </Card>
  );
}