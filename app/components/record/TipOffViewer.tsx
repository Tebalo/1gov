import React from 'react';
import { Info, FileCheck, FileText, Home, ArrowLeft, ChevronLeft,  MoveLeft } from 'lucide-react'
import dynamic from 'next/dynamic'
import { TipOffResponse } from '@/app/lib/types';
import Link from 'next/link';

const InfoCard = dynamic(() => import('../InfoCard'), { ssr: false })
const InfoItem = dynamic(() => import('../InfoItem'), { ssr: false })

interface TipOffViewerProps {
  data: TipOffResponse;
  userRole?: string;
}

const TipOffViewer: React.FC<TipOffViewerProps> = ({ data, userRole }) => {
  const renderSection = (content: React.ReactNode) => (
    <div className="mb-8">
      {content}
    </div>
  );

  const renderReporterInfo = (data: TipOffResponse) => (
    <InfoCard title='Reporter Information' icon={<Info className="w-6 h-6 text-blue-500"/>}>
      <InfoItem label="Full Name" value={data.data?.full_name}/>
      <InfoItem label="Phone Number" value={data?.data?.phone}/>
      <InfoItem label="Identity Number" value={data?.data?.identity_No}/>
      <InfoItem label="Email" value={data?.data?.email}/>
    </InfoCard>
  );

  const renderCrimeInfo = (data: TipOffResponse) => (
    <InfoCard title='Crime Information' icon={<FileCheck className="w-6 h-6 text-blue-500"/>}>
      <InfoItem label="Tipoff Number" value={data?.data?.tipoff_number || 'N/A'}/>
      <InfoItem label="Nature of Crime" value={data?.data?.nature_of_crime || 'N/A'}/>
      <InfoItem label="Crime Location" value={data?.data?.crime_location || 'N/A'}/>
      <InfoItem label="Description" value={data?.data?.description || 'N/A'}/>
    </InfoCard>
  );

  const renderSystemInfo = (data: TipOffResponse) => (
    <InfoCard title='System Information' icon={<FileText className="w-6 h-6 text-blue-500"/>}>
      <InfoItem label="Record ID" value={data?.data?.id?.toString() || 'N/A'}/>
    </InfoCard>
  );

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
      <div className="mb-4 flex-shrink-0 shadow-md">
        <div className='flex justify-between'>
          <h1 className="text-3xl font-bold text-gray-800">
            Tip-off Information
          </h1>
          <Link
              href={`/trls/work/`}
              scroll={false}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <ArrowLeft className="h-4 w-4" />
              My Work
            </Link>
        </div>
        <div className="mt-2 h-1 w-full bg-blue-400 rounded-full">

        </div>
      </div>
      
      <div className='flex-grow overflow-y-auto'>
        <div className='space-y-8 pr-4'>
          {renderSection(renderReporterInfo(data))}
          {renderSection(renderCrimeInfo(data))}
          {renderSection(renderSystemInfo(data))}
        </div>
      </div>
    </div>
  );
};

export default TipOffViewer;