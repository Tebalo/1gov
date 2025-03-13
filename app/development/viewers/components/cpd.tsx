"use client"

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { CPDResponseGet } from '@/app/lib/types';
import CPDViewer from '@/app/components/record/CPDViewer';

const dummyData: CPDResponseGet = {
    code: 200,
    data:{
      "cpd_activity":{
        "id":4,
        "user_id":"512927017",
        "cpd_number":"CPD2025-03-00004",
        "cumulative_points":"155",
        "reg_status":"PENDING-SCREENING",
        "cpd_activity":"eLearning",
        "other":null,
        "other_1":null,"activity_name":"Maths","application_id":"0cacb8ee-978f-4e86-a8d0-6ebd4f1e83c6","cpd_points":"60","cpd_activity_description":"MAthematics","service_provider":"UNIVERSITY OF BOTSWANA","duration":"10\/03\/2025 - 10\/03\/2025","declaration":"1","profile_data_consent":1,"created_at":"2025-03-13T15:19:24.000000Z","updated_at":"2025-03-13T15:19:24.000000Z"},"profile":{"id":4,"cpd_number":"CPD2025-03-00004","first_name":"selele","middle_name":"naledi","surname":"kotu","created_at":"2025-03-13T15:19:24.000000Z","updated_at":"2025-03-13T15:19:24.000000Z"

        },"service":{},
        "attachment":{
          "id":4,
          "cpd_number":"CPD2025-03-00004",
          "cpd_evidence_key":"http://reg-ui-acc.gov.bw:8080/download/MESD_006_08_052/bb541e9e-dfec-4c08-bb56-92127e0523af",
          "other_attachments_key":null,
          "created_at":"2025-03-13T15:19:24.000000Z","updated_at":"2025-03-13T15:19:24.000000Z"
        }}
};

export default function CPD() {
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
      <CPDViewer 
        data={dummyData}
        userRole="snr_registration_officer"
      />
    </Card>
  );
}