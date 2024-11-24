import React from 'react';
import { Info, FileCheck, FileText, ArrowLeft } from 'lucide-react'
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

  const fullName = `${data.data?.first_name} ${data.data?.middle_name ? data.data.middle_name + ' ' : ''}${data.data?.surname}`;

  const renderReporterInfo = (data: TipOffResponse) => (
    <InfoCard title='Reporter Information' icon={<Info className="w-6 h-6 text-blue-500"/>}>
      <InfoItem label="Full Name" value={fullName}/>
      <InfoItem label="Phone Number" value={data.data?.primary_phone}/>
      <InfoItem label="Email" value={data.data?.primary_email}/>
      <InfoItem label="Gender" value={data.data?.gender}/>
      <InfoItem label="Nationality" value={data.data?.nationality}/>
      <InfoItem label="Postal Address" value={data.data?.primary_postal}/>
    </InfoCard>
  );

  const renderBreachInfo = (data: TipOffResponse) => (
    <InfoCard title='Breach Information' icon={<FileCheck className="w-6 h-6 text-blue-500"/>}>
      <InfoItem label="Application ID" value={data.data?.application_id}/>
      <InfoItem label="Breach Nature" value={data.data?.breach_nature}/>
      <InfoItem label="Breach Location" value={data.data?.breach_location}/>
      <InfoItem label="Breach Date" value={data.data?.breach_date}/>
      <InfoItem label="Description" value={data.data?.breach_description}/>
      <InfoItem label="Registration Status" value={data.data?.reg_status}/>
    </InfoCard>
  );

  const renderSystemInfo = (data: TipOffResponse) => (
    <InfoCard title='Service Information' icon={<FileText className="w-6 h-6 text-blue-500"/>}>
      <InfoItem label="Service Name" value={data.data?.service_name}/>
      <InfoItem label="Service ID" value={data.data?.service_id}/>
      <InfoItem label="Service Version" value={data.data?.service_version}/>
      <InfoItem label="Created At" value={data.data?.created_at ? new Date(data.data.created_at).toLocaleString() : 'N/A'}/>
      <InfoItem label="Updated At" value={data.data?.updated_at ? new Date(data.data.updated_at).toLocaleString() : 'N/A'}/>
      <InfoItem label="Record ID" value={data.data?.id?.toString()}/>
    </InfoCard>
  );

  if (!data || !data.data) {
    return <div>No data available</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
      <div className="mb-4 flex-shrink-0 shadow-md">
        <div className='flex justify-between'>
          <h1 className="text-3xl font-bold text-gray-800">
            Breach Report Information
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
        <div className="mt-2 h-1 w-full bg-blue-400 rounded-full"></div>
      </div>
      
      <div className='flex-grow overflow-y-auto'>
        <div className='space-y-8 pr-4'>
          {renderSection(renderReporterInfo(data))}
          {renderSection(renderBreachInfo(data))}
          {renderSection(renderSystemInfo(data))}
        </div>
      </div>
    </div>
  );
};

export default TipOffViewer;