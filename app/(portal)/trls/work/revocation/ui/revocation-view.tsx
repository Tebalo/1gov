'use client'
import React from 'react';
import { Info, FileCheck, FileText, AlertTriangle, User, Clock } from 'lucide-react'
import { Role } from '@/app/lib/store';
import InfoCard from '@/app/components/InfoCard';
import InfoItem from '@/app/components/InfoItem';
import RevocationActionButtons from '../actions/revocation-action-items';
import { RevocationResponse } from '../types/revocation-type';


interface RevocationViewerProps {
  data: RevocationResponse;
  userRole: Role;
}

const RevocationViewer: React.FC<RevocationViewerProps> = ({ data, userRole }) => {
  const renderSection = (content: React.ReactNode) => (
    <div className="mb-8">{content}</div>
  );

  const fullName = `${data?.profile?.first_name} ${data?.profile?.middle_name} ${data?.profile?.surname}`.trim();

  const renderRevocationInfo = () => (
    <InfoCard title='Revocation Information' icon={<AlertTriangle className="w-6 h-6 text-red-500"/>}>
      <InfoItem label="Revocation Number" value={data?.revocation?.revocation_number}/>
      <InfoItem label="Registration Number" value={data?.revocation?.registration_number}/>
      <InfoItem label="Status" value={data?.revocation?.reg_status}/>
      <InfoItem label="SLA Days" value={`${data?.revocation?.sla}`}/>
      <InfoItem label="Reason" value={data?.revocation?.reason}/>
      <InfoItem label="Submission Date" value={new Date(data?.revocation?.created_at ?? '').toLocaleDateString()}/>
    </InfoCard>
  );

  const renderPersonalInfo = () => (
    <InfoCard title='Personal Information' icon={<User className="w-6 h-6 text-blue-500"/>}>
      <InfoItem label="Full Name" value={fullName}/>
      <InfoItem label="Gender" value={data?.profile?.gender}/>
      <InfoItem label="Nationality" value={data?.profile?.nationality}/>
      <InfoItem label="Email" value={data?.profile?.primary_email}/>
      <InfoItem label="Phone" value={data?.profile?.primary_phone}/>
    </InfoCard>
  );

  const renderEmployerInfo = () => (
    <InfoCard title='Employer Information' icon={<FileCheck className="w-6 h-6 text-blue-500"/>}>
      <InfoItem label="Current Employer" value={data?.revocation?.current_employer}/>
      <InfoItem label="Employer Contact" value={data?.revocation?.employer_contact}/>
      <InfoItem label="Physical Address" value={data?.profile?.primary_physical}/>
      <InfoItem label="Postal Address" value={data?.profile?.primary_postal}/>
    </InfoCard>
  );

  const renderDeclaration = () => (
    <InfoCard title='Declaration' icon={<Info className="w-6 h-6 text-blue-500"/>} columns={1}>
      <div className="p-4 bg-gray-50 rounded">
        <p className="text-gray-700">{data?.revocation?.declaration}</p>
        <div className="mt-4 flex items-center gap-2">
          <input type="checkbox" checked={data?.revocation?.profile_data_consent} readOnly />
          <span className="text-sm text-gray-600">Profile data consent provided</span>
        </div>
      </div>
    </InfoCard>
  );

  if (!data || !data?.revocation || !data?.profile) {
    return <div>No data available</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
      <div className="mb-4 flex-shrink-0 shadow-md">
        <div className='flex justify-between items-center'>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              License Revocation Request
            </h1>
            <p className="text-gray-600 mt-1">
              {data?.revocation?.revocation_number}
            </p>
          </div>
          <RevocationActionButtons 
            recordId={data?.revocation?.revocation_number ?? ''} 
            userRole={userRole} 
            current_status={data?.revocation?.reg_status ?? ''}
          />
        </div>
        <div className="mt-2 h-1 w-full bg-red-400 rounded-full"></div>
      </div>
      
      <div className='flex-grow overflow-y-auto'>
        <div className='space-y-8 pr-4'>
          {renderSection(renderRevocationInfo())}
          {renderSection(renderPersonalInfo())}
          {renderSection(renderEmployerInfo())}
          {renderSection(renderDeclaration())}
        </div>
      </div>
    </div>
  );
};

export default RevocationViewer;