"use client"

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { TeacherResponse } from '@/app/(portal)/trls/work/teacher/types/teacher-type';
import TeacherRegistrationViewer from '@/app/(portal)/trls/work/teacher/ui/teacher-section';

const data: TeacherResponse = {
  "code": 200,
  "message": "Success",
  "background_checks": [],
  "other_qualifications": [{
            "id": 6,
            "national_id": "440418213",
            "level": "Bachelor",
            "qualification": "Bachelor of Agriculture",
            "institution": "University of Botswana",
            "attachments": "https://gateway-cus-acc.gov.bw/document/download/MESD_006_08_054/3bd077e3-c9e1-40d2-b53a-4373a513518d",
            "qualification_year": "2002",
            "minor_subjects": null,
            "major_subjects": "English",
            "created_at": "2025-09-24 02:44:43",
            "updated_at": "2025-09-24 02:44:43"
        }],
  "teacher_registrations": {
      "national_id": "436415528",
      "reg_number": "BOT000102",
      "reg_status": "Pending-Screening",
      "work_status": "Employed",
      "endorsement_status": "Pending-Endorsement",
      "rejection_reason": null,
      "service_code": "MESD_006_28_001",
      "payment_ref": null,
      "payment_amount": null,
      "payment_name": null,
      "application_id": "6e0d255f-0b76-44b9-b5a1-933453dde255",
      "submission_id": "6e0d255f933453dde255",
      "license_link": null,
      "draft_id": "cmg6nsxza0000h02kbgj0lr2d",
      "submitted_via": "TRLS Portal",
      "education_bg_checks": null,
      "flags_no": "0",
      "recite": null,
      "invoice": null,
      "charges": null,
      "paid_at": null,
      "payment_link": null,
      "subscription_due_date": null,
      "license_expiry_date": null,
      "assigned_to": "Garenosi Motlalepuo",
      "institution_verification": "Verified",
      "course_verification": "Verified",
      "license_status": "New",
      "pending_customer_action": "false",
      "registration_type": "Teacher",
      "created_at": "2025-09-30 14:37:05",
      "updated_at": "2025-09-30 14:37:05"
  },
  "teacher_preliminary_infos": {
      "id": 6,
      "national_id": "436415528",
      "citizen_status": "Citizen",
      "work_status": "Employed",
      "practice_category": "Secondary",
      "sub_category": "Tutor",
      "created_at": "2025-04-25 08:42:18",
      "updated_at": "2025-04-25 08:42:18"
  },
  "edu_pro_qualifications": {
      "id": 6,
      "national_id": "436415528",
      "level": "Bachelor's Degree",
      "qualification": "Bachelor of Commerce in Accounting",
      "institution": "Botswana Accountancy College",
      "attachments": "http://reg-ui-acc.gov.bw:8080/download/MESD_006_08_054/d7ea6306-e3e1-4e62-a2e2-a2e1fde23133",
      "qualification_year": "2007",
      "minor_subjects": null,
      "major_subjects": "Accounting",
      "created_at": "2025-04-25 08:42:18",
      "updated_at": "2025-04-25 08:42:18"
  },
  "bio_datas": {
      "id": 6,
      "national_id": "436415528",
      "surname": "motlalepuo",
      "forenames": "garenosi",
      "dob": "1996-06-24T00:00:00.000Z",
      "pob": null,
      "gender": "Male",
      "nationality": "Botswana",
      "postal_address": "P.O Box 920,Maun,Botswana",
      "physical_address": "Plot 42567, Moeti, Maun, Botswana",
      "email": "gmotlalepuo@gmail.com",
      "mobile": "+26774219688",
      "marital_status": null,
      "next_of_kin_name": null,
      "next_of_kin_relation": null,
      "next_of_kin_contact": null,
      "disability": "Yes",
      "disability_description": "Physical disabilities (Wheel chaired, crunches, short limbs, facial),Sensory impairments (Hearing, vision, Low vision),Speech disabilities",
      "created_at": "2025-04-25 08:42:18",
      "updated_at": "2025-04-25 08:42:18"
  },
  "declarations": {
      "id": 6,
      "national_id": "436415528",
      "agreement": "Yes",
      "signature": null,
      "created_at": "2025-04-25 08:42:18",
      "updated_at": "2025-04-25 08:42:18"
  },
  "offence_convictions": {
        "id": 6,
        "national_id": "436415528",
        "student_related_offence": "yes",
        "student_related_offence_attachments": null,
        "student_related_offence_details": "Criminal offense",
        "drug_related_offence": "yes",
        "drug_related_offence_attachments": "http://reg-ui-acc.gov.bw:8080/download/MESD_006_08_054/92337334-c789-4648-9053-c67fa0380be2",
        "drug_related_offence_details": "Drug offense",
        "license_flag": "yes",
        "license_flag_details": "http://reg-ui-acc.gov.bw:8080/download/MESD_006_08_054/92337334-c789-4648-9053-c67fa0380be2",
        "misconduct_flag": "yes",
        "misconduct_flag_details": "http://reg-ui-acc.gov.bw:8080/download/MESD_006_08_054/92337334-c789-4648-9053-c67fa0380be2",
        "created_at": "2025-09-30 14:37:05",
        "updated_at": "2025-09-30 14:37:05"
    },
  "employment_details": {
      "id": 6,
      "national_id": "436415528",
      "experience_years": "6 to 10 years",
      "current_institution": "Gaborone",
      "institution_type": "Public",
      "region": "Gaborone",
      "district": "Gaborone",
      "city_or_town": null,
      "created_at": "2025-04-25 08:42:18",
      "updated_at": "2025-04-25 08:42:18"
  },
  "attachments": {
      "national_id": "436415528",
      "national_id_copy": "http://reg-ui-acc.gov.bw:8080/download/MESD_006_08_054/92337334-c789-4648-9053-c67fa0380be2",
      "qualification_copy": null,
      "work_permit": null,
      "proof_of_payment": null,
      "created_at": "2025-04-25 08:42:18",
      "updated_at": "2025-04-25 08:42:18"
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