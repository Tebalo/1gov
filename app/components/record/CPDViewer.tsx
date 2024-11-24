'use client'
import React from 'react';
import { Info, FileCheck, FileText, ArrowLeft, File } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link';
import { CPDResponseGet } from '@/app/lib/types';
import InfoCard from '../InfoCard';
import InfoItem from '../InfoItem';

interface CPDViewerProps {
  data: CPDResponseGet;
  userRole?: string;
}

const CPDViewer: React.FC<CPDViewerProps> = ({ data, userRole }) => {
  const renderSection = (content: React.ReactNode) => (
    <div className="mb-8">
      {content}
    </div>
  );

  const fullName = `${data.data?.profile.first_name} ${data.data?.profile.middle_name ? data.data.profile.middle_name + ' ' : ''}${data.data?.profile.surname}`;

  const handleOpenEvidence = (key: string | null) => {
    if (key) {
      window.open(`${key}`, '_blank');
    }
  };

  const renderProfileInfo = () => (
    <InfoCard title='Profile Information' icon={<Info className="w-6 h-6 text-blue-500"/>}>
      <InfoItem label="CPD Number" value={data.data?.profile.cpd_number}/>
      <InfoItem label="Full Name" value={fullName}/>
      <InfoItem label="Registration Status" value={data.data?.cpd_activity.reg_status}/>
    </InfoCard>
  );

  const renderActivityInfo = () => (
    <InfoCard title='CPD Activity Information' icon={<FileCheck className="w-6 h-6 text-blue-500"/>}>
      <InfoItem label="Activity Type" value={data.data?.cpd_activity.cpd_activity}/>
      <InfoItem label="CPD Points" value={data.data?.cpd_activity.cpd_points}/>
      <InfoItem label="Cumulative Points" value={data.data?.cpd_activity.cumulative_points}/>
      <InfoItem label="Service Provider" value={data.data?.cpd_activity.service_provider}/>
      <InfoItem label="Duration" value={data.data?.cpd_activity.duration}/>
      <InfoItem label="SLA" value={data.data?.cpd_activity.sla}/>
      <InfoItem label="Description" value={data.data?.cpd_activity.cpd_activity_description}/>
    </InfoCard>
  );

  const renderServiceInfo = () => (
    <InfoCard title='Service Information' icon={<FileText className="w-6 h-6 text-blue-500"/>}>
      <InfoItem label="Service Name" value={data.data?.service.service_name}/>
      <InfoItem label="Service ID" value={data.data?.service.service_id}/>
      <InfoItem label="Service Version" value={data.data?.service.service_version}/>
      <InfoItem 
        label="Created At" 
        value={data.data?.service.created_at ? new Date(data.data.service.created_at).toLocaleString() : 'N/A'}
        />
      <InfoItem 
        label="Updated At" 
        value={data.data?.service.updated_at ? new Date(data.data.service.updated_at).toLocaleString() : 'N/A'}
        />
    </InfoCard>
  );

  const renderAttachments = () => (
    <InfoCard title='Attachments' icon={<File className="w-6 h-6 text-blue-500"/>}>
      <div className="space-y-4">
        <button
          onClick={() => handleOpenEvidence(data.data?.attachment.cpd_evidence_key ?? null)}
          disabled={!data.data?.attachment.cpd_evidence_key}
          className="w-full text-left px-4 py-2 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center space-x-2">
            <File className="h-4 w-4"/>
            <span>CPD Evidence</span>
          </div>
        </button>
        
        <button
          onClick={() => handleOpenEvidence(data.data?.attachment.other_attachments_key ?? null)}
          disabled={!data.data?.attachment.other_attachments_key}
          className="w-full text-left px-4 py-2 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center space-x-2">
            <File className="h-4 w-4"/>
            <span>Other Attachments</span>
          </div>
        </button>
      </div>
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
            CPD Activity Details
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
          {renderSection(renderProfileInfo())}
          {renderSection(renderActivityInfo())}
          {renderSection(renderServiceInfo())}
          {renderSection(renderAttachments())}
        </div>
      </div>
    </div>
  );
};

export default CPDViewer;