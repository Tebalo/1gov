"use client"

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import InvestigationView from '@/app/components/record/ComplaintViewer';
import { InvestigationResponse } from '@/app/lib/types';

const dummyData: InvestigationResponse = {
  "success": true,
  "data": {
      "complaint": {
          "id": 6,
          "crime_location": "Gabane",
          "inquiry_number": "INQ2025-01-00006",
          "nature_of_crime": "Theft",
          "reg_status": "ASSESSMENT",
          "case_number": "CS2025-01-00001",
          "date": "2025-01-13",
          "time": null,
          "bif_number": null,
          "fir_number": "FIR1234",
          "created_at": "2025-01-18T07:02:07.000000Z",
          "updated_at": "2025-01-18T07:02:07.000000Z"
      },
      "reporter": {
          "id": 6,
          "name": "Naledi Naledi",
          "contact_number": null,
          "Omang_id": "000020000",
          "occupation": "Student",
          "sex": "Female",
          "nationality": "Botswana",
          "address": "Plot 112 Gaborone",
          "inquiry_number": "INQ2025-01-00006",
          "case_number": null,
          "anonymous": false,
          "submission_type": "Walk-In",
          "created_at": "2025-01-18T07:02:07.000000Z",
          "updated_at": "2025-01-18T07:02:07.000000Z"
      },
      "offender": {
          "id": 6,
          "name": "Mr Mosweu",
          "sex": "Male",
          "inquiry_number": "INQ2025-01-00006",
          "nationality": null,
          "dob": null,
          "age": 45,
          "contact_number": "71234567",
          "id_passport_number": "123412222",
          "address": "456 Sechele Street",
          "ward": "Gabane",
          "occupation": "Teacher",
          "place_of_work": "Gabane",
          "created_at": "2025-01-18T07:02:07.000000Z",
          "updated_at": "2025-01-18T07:02:07.000000Z"
      },
      "investigation": {
          "id": 6,
          "inquiry_number": "INQ2025-01-00006",
          "investigating_officer": null,
          "police_station": null,
          "cr_number": null,
          "offence": null,
          "outcome": null,
          "created_at": "2025-01-18T07:02:07.000000Z",
          "updated_at": "2025-01-18T07:02:07.000000Z"
      },
      "preliminary_investigation": {
          "id": 6,
          "inquiry_number": "INQ2025-01-00006",
          "investigation_details": null,
          "investigation_outcome": null,
          "created_at": "2025-01-18T07:02:07.000000Z",
          "updated_at": "2025-01-18T07:02:07.000000Z"
      }
  }
};

export default function InvestigationContent() {
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
    {dummyData?.data ? (
      <InvestigationView
      data={dummyData?.data}
      userRole="investigations_manager"
    />
    ):(
        <>No data available</>
    )}
    </Card>
  );
}