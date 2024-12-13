"use client"

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import RenewalViewer from '@/app/components/record/RenewalViewer';
import { TeacherRegistrationResponse } from '@/app/lib/types';

const dummyData: TeacherRegistrationResponse = {
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

export default function RenewalContent() {
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Renewal Test Data</h1>
        <Button variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Reload
        </Button>
      </div>
      <RenewalViewer 
        data={dummyData}
        userRole="license_officer"
      />
    </Card>
  );
}