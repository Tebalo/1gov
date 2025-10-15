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
    "other_qualifications": [],
    "teacher_registrations": {
        "national_id": "512927017",
        "reg_number": "BOT000111",
        "reg_status": "Pending-Screening",
        "work_status": "Unemployed",
        "endorsement_status": "Pending-Endorsement",
        "rejection_reason": null,
        "service_code": "MESD_006_28_001",
        "payment_ref": null,
        "payment_amount": null,
        "payment_name": null,
        "application_id": "d4d00be0-6557-43cf-91e0-8722245ea50f",
        "submission_id": "d4d00be08722245ea50f",
        "license_link": null,
        "draft_id": "cmg8yxmkg0000mr2hvfq7t4h3",
        "submitted_via": "TRLS Portal",
        "education_bg_checks": null,
        "flags_no": "2",
        "recite": null,
        "invoice": "https://twosixdigitalbw.com/v2/document/UaD3iXWwaZtvdrZK5avwJ1wookKDVuBhR1RJ5RPe/download",
        "charges": null,
        "paid_at": "https://twosixdigitalbw.com/ppm/payment/show/ref_68de16fb960bb",
        "payment_link": null,
        "subscription_due_date": null,
        "license_expiry_date": null,
        "assigned_to": "Garenosi Motlalepuo",
        "institution_verification": "Verified",
        "course_verification": "Verified",
        "license_status": "New",
        "pending_customer_action": "false",
        "registration_type": "Teacher",
        "created_at": "2025-10-02 05:26:53",
        "updated_at": "2025-10-02 05:26:53"
    },
    "teacher_preliminary_infos": {
        "id": 16,
        "national_id": "512927017",
        "citizen_status": "citizen",
        "work_status": null,
        "practice_category": "Secondary",
        "sub_category": "Teacher Aide",
        "created_at": "2025-10-02 05:26:53",
        "updated_at": "2025-10-02 05:26:53"
    },
    "edu_pro_qualifications": {
        "id": 16,
        "national_id": "512927017",
        "level": "Diploma",
        "qualification": "diploma in secondary education",
        "institution": "serowe college of education",
        "attachments": "https://twosixdigitalbw.com/v2/document/Qe4JARDpW9V7IkLnyRWqGWwob38Uhy5oubEEFlgU/download",
        "qualification_year": "2018",
        "minor_subjects": null,
        "major_subjects": null,
        "subjects": null,
        "created_at": "2025-10-02 05:26:53",
        "updated_at": "2025-10-02 05:26:53"
    },
    "bio_datas": {
        "id": 16,
        "national_id": "512927017",
        "surname": "KOTU",
        "forenames": "SELELE",
        "dob": "1984-10-04T00:00:00.000Z",
        "pob": null,
        "gender": "Female",
        "nationality": "Botswana",
        "postal_address": "Plot 321 Gaborone",
        "physical_address": "Plot 321 Gaborone",
        "email": "lele@26digitalbw.com",
        "mobile": "71567567",
        "marital_status": null,
        "next_of_kin_name": null,
        "next_of_kin_relation": null,
        "next_of_kin_contact": null,
        "disability": "no",
        "disability_description": "undefined",
        "created_at": "2025-10-02 05:26:53",
        "updated_at": "2025-10-02 05:26:53"
    },
    "declarations": {
        "id": 16,
        "national_id": "512927017",
        "agreement": "Yes",
        "signature": null,
        "created_at": "2025-10-02 05:26:53",
        "updated_at": "2025-10-02 05:26:53"
    },
    "offence_convictions": {
        "id": 13,
        "national_id": "512927017",
        "student_related_offence": "no",
        "student_related_offence_attachments": null,
        "student_related_offence_details": null,
        "drug_related_offence": "no",
        "drug_related_offence_attachments": null,
        "drug_related_offence_details": null,
        "license_flag": "no",
        "license_flag_details": null,
        "misconduct_flag": "no",
        "misconduct_flag_details": null,
        "created_at": "2025-10-02 05:26:53",
        "updated_at": "2025-10-02 05:26:53"
    },
    "employment_details": {
        "id": 13,
        "national_id": "512927017",
        "experience_years": "6 to 10 years",
        "current_institution": null,
        "institution_type": null,
        "region": "ghanzi",
        "district": "ghanzi",
        "city_or_town": null,
        "created_at": "2025-10-02 05:26:53",
        "updated_at": "2025-10-02 05:26:53"
    },
    "attachments": {
        "national_id": "512927017",
        "national_id_copy": "https://twosixdigitalbw.com/v2/document/0WSwPQHi1y47B8sSsVVtxxMYoNCcacBT2AEDYwTs",
        "qualification_copy": null,
        "work_permit": null,
        "proof_of_payment": null,
        "created_at": "2025-10-02 05:26:53",
        "updated_at": "2025-10-02 05:26:53"
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
        userRole="registration_officer"
      />
    </Card>
  );
}