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
  "other_qualifications": [],
  "teacher_registrations": {
      "national_id": "436415528",
      "reg_number": "$2y$10$fxDFkAVR",
      "reg_status": "Pending-Screening",
      "endorsement_status": "Pending-Endorsement",
      "rejection_reason": null,
      "service_code": "MESD_006_08_054",
      "payment_ref": null,
      "payment_amount": null,
      "payment_name": null,
      "application_id": "048369cf-6b75-468f-9c76-4ea38493d158",
      "submission_id": "680b4ae8ec323eb2a078",
      "license_link": null,
      "education_bg_checks": null,
      "flags_no": "0",
      "institution_verification": "Verified",
      "course_verification": "Verified",
      "license_status": "New",
      "pending_customer_action": "false",
      "registration_type": "Teacher",
      "created_at": "2025-04-25 08:42:18",
      "updated_at": "2025-04-25 08:42:18"
  },
  "teacher_preliminary_infos": {
      "id": 6,
      "national_id": "436415528",
      "citizen_status": "Citizen",
      "work_status": null,
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
      "physical_address": "Plot 42567,Moeti,Maun,Botswana",
      "email": "gmotlalepuo@gmail.com",
      "mobile": "+26774219688",
      "marital_status": null,
      "next_of_kin_name": null,
      "next_of_kin_relation": null,
      "next_of_kin_contact": null,
      "disability": "No",
      "disability_description": null,
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
      "created_at": "2025-04-25 08:42:18",
      "updated_at": "2025-04-25 08:42:18"
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
      "national_id_copy": null,
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