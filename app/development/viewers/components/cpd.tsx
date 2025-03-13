"use client"

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { CPDResponseGet } from '@/app/lib/types';
import CPDViewer from '@/app/components/record/CPDViewer';

const dummyData: CPDResponseGet = {
    code: 200,
    data: {
            "cpd_activity": {
                "id": 1,
                "user_id": "769717905",
                "cpd_number": "CPD2025-03-00001",
                "cumulative_points": "60",
                "reg_status": "PENDING-SCREENING",
                "cpd_activity": "eLearning",
                "other": "Course",
                "other_1": "University of Botswana",
                "activity_name": "Course",
                "application_id": "2cf5da6a-3210-429c-b819-1236bcb8d840",
                "cpd_points": "60",
                "cpd_activity_description": "Nice course",
                "service_provider": "Other",
                "duration": "01/01/2025 - 02/01/2025",
                "declaration": null,
                "profile_data_consent": null,
                "created_at": "2025-03-12T19:10:29.000000Z",
                "updated_at": "2025-03-12T19:10:29.000000Z"
            },
            "profile": {
                "id": 1,
                "cpd_number": "CPD2025-03-00001",
                "first_name": "garenosi",
                "middle_name": null,
                "surname": "motlalepuo",
                "created_at": "2025-03-12T19:10:29.000000Z",
                "updated_at": "2025-03-12T19:10:29.000000Z"
            },
            "service": {},
            "attachment": {
                "id": 1,
                "cpd_number": "CPD2025-03-00001",
                "cpd_evidence_key": null,
                "other_attachments_key": null,
                "created_at": "2025-03-12T19:10:29.000000Z",
                "updated_at": "2025-03-12T19:10:29.000000Z"
            }
    }
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