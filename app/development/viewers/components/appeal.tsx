"use client"

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { appeal, CPDResponseGet } from '@/app/lib/types';
import CPDViewer from '@/app/components/record/CPDViewer';
import AppealViewer from '@/app/components/record/AppealViewer';

const dummyData: appeal = {
    code: 200,
    "message": "Records retrieved successfully.",
    "profile": {
        "id": 2,
        "user_id": "512927017",
        "appeals_number": "APL2025-03-00002",
        "first_name": "selele",
        "middle_name": "naledi",
        "surname": "kotu",
        "primary_email": "lele@26digitalbw.com",
        "primary_postal": "P.O Box 749, Gaborone, Botswana",
        "created_at": "2025-03-11T17:14:36.000000Z",
        "updated_at": "2025-03-11T17:14:36.000000Z"
    },
    "appeals_application": {
        "id": 2,
        "user_id": "512927017",
        "application_id": null,
        "appeals_number": "APL2025-03-00002",
        "reg_status": "PENDING-SCREENING",
        "sla": "29 days remaining",
        "other": "Had a family emergency",
        "appeal_decision": "Removal from the Register",
        "appeal_reason": "Other",
        "supporting_document_key": "http://reg-ui-acc.gov.bw:8080/download/MESD_006_08_001/d3ba9411-f275-4401-8e47-b1cc6429d0f7",
        "declaration": "I accept the terms and conditions, I hereby declare that the information I have provided in this application form is true and correct to the best of my knowledge and belief. I understand that providing false or misleading information may result in the refusal of my application or the cancellation of my registration. I declare that I have read and understood the Teacher Performance Standards and the Code of Professional Conduct and Ethics and I am committed to upholding these standards in my professional practice. I further declare that I have never been convicted of a criminal offense and have never been involved in any criminal activity. I am aware that the Council may collect and verify information about my qualifications, experience, and fitness to teach. I consent to the Council collecting and verifying this information and I authorize the Council to share this information with other relevant organizations, such as employers and educational institutions.",
        "profile_data_consent": 1,
        "created_at": "2025-03-11T17:14:36.000000Z",
        "updated_at": "2025-03-11T17:14:36.000000Z"
    }
};

export default function Appeal() {
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
      <AppealViewer 
        data={dummyData}
        userRole="snr_registration_officer"
      />
    </Card>
  );
}