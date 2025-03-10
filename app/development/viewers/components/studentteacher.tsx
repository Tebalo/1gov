"use client"

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import StudentTeacherViewer from '@/app/(portal)/trls/work/student-teacher/ui/student-view';
import { StudentTeacherResponse } from '@/app/(portal)/trls/work/student-teacher/types/student-type';

const dummyData: StudentTeacherResponse = {
  code: 200,
  message: "success",
    "background_checks":[],
    "teacher_registrations":{
        "national_id":"436415528",
        "reg_number":"$2y$10$XkPuooQp",
        "reg_status":"Pending-Assessment",
        "endorsement_status":"Pending-Endorsement",
        "rejection_reason":null,
        "service_code":"MESD_006_08_050",
        "payment_ref":null,
        "payment_amount":null,
        "payment_name":null,
        "application_id":"76167e8d-f676-44bb-8819-2bb6e2e6ed1e",
        "license_link":null,
        "education_bg_checks":null,
        "flags_no":"0",
        "institution_verification":"Verified",
        "course_verification":"Verified",
        "license_status":"New",
        "pending_customer_action":"false",
        "registration_type":"Student-Teacher",
        "created_at":"2025-03-10 18:42:13",
        "updated_at":"2025-03-10 18:42:13"
    },
    "student_preliminary_infos":{
        "id":1,
        "national_id":"436415528",
        "student_id":null,
        "institution_name":"University of Botswana",
        "institution_type":null,
        "citizenry":"Citizen",
        "practice_category":null,
        "sub_category":null,
        "study_area":null,
        "created_at":"2025-03-10 18:42:13",
        "updated_at":"2025-03-10 18:42:13"
    },
    "bio_datas":{
        "id":1,
        "national_id":"436415528",
        "surname":"Motlalepuo",
        "forenames":"Garenosi",
        "dob":"1996-06-24T00:00:00.000Z",
        "pob":null,
        "gender":"Male",
        "nationality":"Botswana",
        "postal_address":"P.O Box 190,Tlokweng,Botswana",
        "physical_address":"Plot 4257,Bodiba,Tlokweng,Botswana",
        "email":"garenosi@gmail.com",
        "mobile":"+26771682727",
        "marital_status":null,
        "next_of_kin_name":null,
        "next_of_kin_relation":null,
        "next_of_kin_contact":null,
        "disability":"No",
        "disability_description":null,
        "created_at":"2025-03-10 18:42:13",
        "updated_at":"2025-03-10 18:42:13"
    },
    "declarations":{
        "id":1,
        "national_id":"436415528",
        "agreement":"Yes",
        "signature":null,
        "created_at":"2025-03-10 18:42:13","updated_at":"2025-03-10 18:42:13"
    },
    "offence_convictions":{
        "id":1,"national_id":"436415528",
        "student_related_offence":"No",
        "student_related_offence_attachments":null,
        "student_related_offence_details":null,
        "drug_related_offence":"No",
        "drug_related_offence_attachments":null,
        "drug_related_offence_details":null,
        "license_flag":"No",
        "license_flag_details":null,
        "misconduct_flag":"No",
        "misconduct_flag_details":null,
        "created_at":"2025-03-10 18:42:13",
        "updated_at":"2025-03-10 18:42:13"
    },
    "student_study_programmes":{
        "id":1,
        "national_id":"436415528",
        "name":"Bachelor of Education in Integrated Early Childhood Development (B.Ed-IECD)",
        "completion_year":"2026",
        "level":"Degree",
        "duration":4,
        "specialization":"Science",
    },
    "attachments":{
        "national_id":"436415528",
        "national_id_copy":null,
        "qualification_copy":null,
        "attachment_letter":null,
        "created_at":"2025-03-10 18:42:13",
        "updated_at":"2025-03-10 18:42:13"
    }
};

export default function StudentContent() {
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
      <StudentTeacherViewer 
        data={dummyData}
        userRole="snr_registration_officer"
      />
    </Card>
  );
}