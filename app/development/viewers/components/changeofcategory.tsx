"use client"

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { ChangeOfCategoryResponse } from '@/app/(portal)/trls/work/changeofcategory/types/changeofcategory-type';
import CategoryViewer from '@/app/(portal)/trls/work/changeofcategory/ui/category-view';

const dummyData: ChangeOfCategoryResponse = {
  code: 200,
  message: "success",
  "background_checks":[],
  "other_qualifications":[],
  "teacher_registrations":{
    "national_id":"512927017",
    "reg_number":"$2y$10$VHVJBmhF",
    "reg_status":"Pending-Screening",
    "endorsement_status":"Pending-Endorsement",
    "rejection_reason":null,
    "service_code":"MESD_006_08_051",
    "payment_ref":null,
    "payment_amount":null,
    "payment_name":null,
    "application_id":"19bc1e28-1187-45b7-9f1a-c87ee4e31e84",
    "license_link":null,
    "education_bg_checks":null,
    "flags_no":"0",
    "institution_verification":"Verified",
    "course_verification":"Verified",
    "license_status":"New",
    "pending_customer_action":"false",
    "registration_type":"Teacher",
    "created_at":"2025-03-19 20:53:08",
    "updated_at":"2025-03-19 20:53:08"
  },"categories":{
    "id":4,
    "national_id":"512927017",
    "registration_number":"C102",
    "current_membership":"Pre-Primary",
    "desired_membership":"Primary",
    "change_reason":"relocation",
    "employment_contract":"http://reg-ui-acc.gov.bw:8080/download/MESD_006_08_051/6c2e29e6-d36d-45b2-9d17-b83089b8f348",
    "teaching_certificate":"http://reg-ui-acc.gov.bw:8080/download/MESD_006_08_051/32c65058-71fe-4a0e-8d1d-d382f999a960",
    "cpd_transcript":"http://reg-ui-acc.gov.bw:8080/download/MESD_006_08_051/2826a670-2004-4969-89df-0be44916644d",
    "created_at":"2025-02-18 08:20:00","updated_at":"2025-02-18 08:20:00"
  }
};

export default function CategoryContent() {
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
      <CategoryViewer 
        data={dummyData}
        userRole="snr_registration_officer"
      />
    </Card>
  );
}