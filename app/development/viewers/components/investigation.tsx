"use client"

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import InvestigationView from '@/app/components/record/ComplaintViewer';
import { InvestigationResponse } from '@/app/lib/types';

const dummyData: InvestigationResponse = {
    code: 200,
    message: "success",
    data: {
        reporter: {
            'name': 'John Mokwena',
            'contact_number': '+267 71234567',
            'Omang_id': '123456789',
            'occupation': 'Teacher',
            'inquiry_number': '123',
            'case_number': '123',
            'reg_status': 'External-Investigation',
            'sex': 'Male',
            'submission_type': 'In-Person',
            'anonymous': false,
            'nationality': 'Motswana',
            'address': 'Plot 1234, Broadhurst Phase 4',
            'created_at': '2025-01-04 08:21:39',
            'updated_at': '2025-01-04 08:21:39',
            'id': 1
        },
        'complaint': {
            'crime_location': 'Gaborone Secondary School',
            'nature_of_crime': 'Professional Misconduct',
            'case_number': 'jfj',
            'outcome': 'Deak',
            'date': '2024-01-15',
            'time': '14:30',
            'bif_number': 'BIF/2024/001',
            'fir_number': 'FIR/2024/123',
            'created_at': '',
            'updated_at': '',
            'id': 1
        },
        'offender': {
            'name': 'Sarah Smith',
            'sex': 'Female',
            'nationality': 'Motswana',
            'dob': '1990-05-15',
            'age': 34,
            'contact_number': '+267 72345678',
            'id_passport_number': '987654321',
            'address': 'Plot 567, Extension 12',
            'ward': 'Block 8',
            'occupation': 'Mathematics Teacher',
            'place_of_work': 'Gaborone Secondary School',
            'created_at': '',
            'updated_at': '',
            'id': 1
        },
        'investigation': {
            'investigating_officer': 'Officer K. Molefe',
            'police_station': 'Central Police Station',
            'cr_number': 'CR/2024/456',
            'offence': 'Unprofessional Conduct',
            'outcome': 'Under Investigation',
            'created_at': '',
            'updated_at': '',
            'id': 1
        },
        preliminary_investigation: {
            id: 1,
            inquiry_number: '',
            investigation_details: 'Something',
            investigation_outcome: 'Closed',
            created_at: '',
            updated_at: ''
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