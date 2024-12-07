'use client'
import React from 'react';
import { Info, FileCheck, FileText, File } from 'lucide-react'
import { appeal } from '@/app/lib/types';
import InfoCard from '../InfoCard';
import InfoItem from '../InfoItem';
import { Role } from '@/app/lib/store';
import AppealsActionButtons from './components/AppealsActionItems';

interface AppealViewerProps {
  data: appeal;
  userRole: Role;
}

const AppealViewer: React.FC<AppealViewerProps> = ({ data, userRole }) => {
  const renderSection = (content: React.ReactNode) => (
    <div className="mb-8">
      {content}
    </div>
  );

  const fullName = `${data.profile?.first_name} ${data.profile?.middle_name ? data.profile.middle_name + ' ' : ''}${data.profile?.surname}`;

  const handleOpenDocument = (key: string | null) => {
    if (key) {
      window.open(key, '_blank');
    }
  };

  const renderProfileInfo = () => (
    <InfoCard title='Profile Information' icon={<Info className="w-6 h-6 text-blue-500"/>}>
      <InfoItem label="Appeals Number" value={data.profile?.appeals_number}/>
      <InfoItem label="Full Name" value={fullName}/>
      <InfoItem label="Email" value={data.profile?.primary_email}/>
      <InfoItem label="Postal Address" value={data.profile?.primary_postal}/>
    </InfoCard>
  );

  const renderAppealInfo = () => (
    <InfoCard title='Appeal Information' icon={<FileCheck className="w-6 h-6 text-blue-500"/>}>
      <InfoItem label="Application ID" value={data.appeals_application?.application}/>
      <InfoItem label="Registration Status" value={data.appeals_application?.reg_status}/>
      <InfoItem label="Appeal Decision" value={data.appeals_application?.appeal_decision}/>
      <InfoItem label="SLA" value={data.appeals_application?.sla}/>
      <InfoItem label="Appeal Reason" value={data.appeals_application?.appeal_reason}/>
    </InfoCard>
  );

  const renderDatesInfo = () => (
    <InfoCard title='Dates Information' icon={<FileText className="w-6 h-6 text-blue-500"/>}>
      <InfoItem 
        label="Created At" 
        value={data.appeals_application?.created_at ? new Date(data.appeals_application.created_at).toLocaleString() : 'N/A'}
      />
      <InfoItem 
        label="Updated At" 
        value={data.appeals_application?.updated_at ? new Date(data.appeals_application.updated_at).toLocaleString() : 'N/A'}
      />
    </InfoCard>
  );

  const renderDocuments = () => (
    <InfoCard title='Supporting Documents' icon={<File className="w-6 h-6 text-blue-500"/>}>
      <div className="space-y-4">
        <button
          onClick={() => handleOpenDocument(data.appeals_application?.supporting_document_key ?? null)}
          disabled={!data.appeals_application?.supporting_document_key}
          className="w-full text-left px-4 py-2 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center space-x-2">
            <File className="h-4 w-4"/>
            <span>Supporting Document</span>
          </div>
        </button>
      </div>
    </InfoCard>
  );

  if (!data || !data.profile || !data.appeals_application) {
    return <div>No data available</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
      <div className="mb-4 flex-shrink-0 shadow-md">
        <div className='flex justify-between'>
          <h1 className="text-3xl font-bold text-gray-800">
            Appeal Details
          </h1>
          <AppealsActionButtons 
            recordId={data.profile.appeals_number} 
            userRole={userRole} 
            current_status={data.appeals_application.reg_status}
          />
        </div>
        <div className="mt-2 h-1 w-full bg-blue-400 rounded-full"></div>
      </div>
      
      <div className='flex-grow overflow-y-auto'>
        <div className='space-y-8 pr-4'>
          {renderSection(renderProfileInfo())}
          {renderSection(renderAppealInfo())}
          {renderSection(renderDatesInfo())}
          {renderSection(renderDocuments())}
        </div>
      </div>
    </div>
  );
};

export default AppealViewer;