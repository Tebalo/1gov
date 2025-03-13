"use client"

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import RestorationViewer from '@/app/(portal)/trls/work/restoration/ui/restoration-view';
import { RestorationResponse } from '@/app/(portal)/trls/work/restoration/types/restoration-type';

const dummyData: RestorationResponse = {
  code: 200,
  message: "success",
    "background_checks": [],
    "other_qualifications": [],
    "teacher_registrations": {
        "national_id": "120014929",
        "reg_number": "$2y$10$ngnNlmiD",
        "reg_status": "Recommended-For-Approval",
        "support_documents": null,
        "reason": null,
        "endorsement_status": "Endorsement-Complete",
        "rejection_reason": null,
        "service_code": "MESD_006_08_054",
        "payment_ref": null,
        "payment_amount": '100',
        "payment_name": null,
        "application_id": "086fd9a4-ba69-40a4-a5f6-29d30986e482",
        "license_link": null,
        "education_bg_checks": null,
        "flags_no": "0",
        "institution_verification": "Verified",
        "course_verification": "Verified",
        "license_status": "New",
        "pending_customer_action": "false",
        "registration_type": "Teacher",
        "created_at": "2025-01-14 05:48:59",
        "updated_at": "2025-01-14 05:48:59"
    },
    "teacher_preliminary_infos": {
        "id": 2,
        "national_id": "120014929",
        "citizen_status": "Citizen",
        "work_status": null,
        "practice_category": "Secondary",
        "sub_category": "Teacher",
        "created_at": "2025-01-14 05:48:59",
        "updated_at": "2025-01-14 05:48:59"
    },
    "edu_pro_qualifications": {
        "id": 2,
        "national_id": "120014929",
        "level": "Post-Graduate Diploma",
        "qualification": "Post Graduate Diploma in Educational Leadership and Management",
        "institution": "ABM University College",
        "attachments": "http://reg-ui-acc.gov.bw:8080/download/MESD_006_08_054/0dd499b4-c31d-4696-99ee-8b48fa0dfb43",
        "qualification_year": "2020",
        "minor_subjects": null,
        "major_subjects": "Setswana",
        "subjects": null,
        "created_at": "2025-01-14 05:48:59",
        "updated_at": "2025-01-14 05:48:59"
    },
    "bio_datas": {
        "id": 2,
        "national_id": "120014929",
        "surname": "rantsho",
        "forenames": "patrick",
        "dob": "1994-10-26T00:00:00.000Z",
        "pob": null,
        "gender": "Male",
        "nationality": "Botswana",
        "postal_address": "Private Bag 1644,Molepolole,Botswana",
        "physical_address": "1064,Molepolole,Botswana",
        "email": "patrick@26digitalbw.com",
        "mobile": "+26775591727",
        "marital_status": null,
        "next_of_kin_name": null,
        "next_of_kin_relation": null,
        "next_of_kin_contact": null,
        "disability": "No",
        "disability_description": null,
        "created_at": "2025-01-14 05:48:59",
        "updated_at": "2025-01-14 05:48:59"
    },
    "offence_convictions": {
        "id": 2,
        "national_id": "120014929",
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
        "created_at": "2025-01-14 05:48:59",
        "updated_at": "2025-01-14 05:48:59"
    },
    "employment_details": {
        "id": 2,
        "national_id": "120014929",
        "experience_years": "More than 10 years",
        "current_institution": "Moeng College",
        "institution_type": "Public",
        "region": "Bobirwa",
        "district": "Bobirwa",
        "city_or_town": null,
        "created_at": "2025-01-14 05:48:59",
        "updated_at": "2025-01-14 05:48:59"
    },
    "attachments": {
        "national_id": "120014929",
        "national_id_copy": "http://reg-ui-acc.gov.bw:8080/download/MESD_006_08_054/8cdce930-6f84-4da1-a4b0-7fe1732848b2",
        "qualification_copy": "http://reg-ui-acc.gov.bw:8080/download/MESD_006_08_054/1750d72c-0cf3-45f2-a78a-6a51d0ca78ec",
        "work_permit": "http://reg-ui-acc.gov.bw:8080/download/MESD_006_08_054/8f6fa585-6e69-4fe1-91ca-328b3c2660ba",
        "proof_of_payment": null,
        "created_at": "2025-01-14 05:48:59",
        "updated_at": "2025-01-14 05:48:59"
    }
};

export default function RestorationContent() {
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
      <RestorationViewer 
        data={dummyData}
        userRole="manager"
      />
    </Card>
  );
}