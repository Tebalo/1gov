"use client"

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import RevocationViewer from '@/app/(portal)/trls/work/revocation/ui/revocation-view';
import { dummyRevocationData } from '../data/dummydata';


export default function RevocationContent() {
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
      <RevocationViewer 
        data={dummyRevocationData}
        userRole="registration_officer"
      />
    </Card>
  );
}