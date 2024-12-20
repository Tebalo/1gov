'use client'
import React from 'react';
import { Info, FileCheck, FileText, ArrowLeft, File, Briefcase, School, AlertTriangle, GraduationCap } from 'lucide-react'
import { TeacherRegistrationResponse } from '@/app/lib/types';
import InfoCard from '../InfoCard';
import InfoItem from '../InfoItem';
import { Role } from '@/app/lib/store';
import RenewalActionButtons from './components/RenewalActionItems';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface RenewalViewerProps {
  data: TeacherRegistrationResponse;
  userRole: Role;
}

const RenewalViewer: React.FC<RenewalViewerProps> = ({ data, userRole }) => {
  const renderSection = (content: React.ReactNode) => (
    <div className="mb-8">{content}</div>
  );

  const fullName = `${data.bio_datas?.forenames} ${data.bio_datas?.surname}`;

  const handleOpenDocument = (key: string | null) => {
    if (key) window.open(key, '_blank');
  };

  const renderPersonalInfo = () => (
    <InfoCard title='Personal Information' icon={<Info className="w-6 h-6 text-blue-500"/>}>
      <InfoItem label="Registration Number" value={data.teacher_registrations?.reg_number}/>
      <InfoItem label="Full Name" value={fullName}/>
      <InfoItem label="National ID" value={data.bio_datas?.national_id}/>
      <InfoItem label="Date of Birth" value={data.bio_datas?.dob}/>
      <InfoItem label="Gender" value={data.bio_datas?.gender}/>
      <InfoItem label="Email" value={data.bio_datas?.email}/>
      <InfoItem label="Mobile" value={data.bio_datas?.mobile}/>
    </InfoCard>
  );

  const renderRegistrationInfo = () => (
    <InfoCard title='Registration Information' icon={<FileCheck className="w-6 h-6 text-blue-500"/>}>
      <InfoItem label="Registration Status" value={data.teacher_registrations?.reg_status}/>
      <InfoItem label="Registration Type" value={data.teacher_registrations?.registration_type}/>
      <InfoItem label="Practice Category" value={data.teacher_preliminary_infos?.practice_category}/>
      <InfoItem label="Sub Category" value={data.teacher_preliminary_infos?.sub_category}/>
      <InfoItem label="License Status" value={data.teacher_registrations?.license_status}/>
    </InfoCard>
  );

  const renderEmploymentInfo = () => (
    <InfoCard title='Employment Information' icon={<Briefcase className="w-6 h-6 text-blue-500"/>}>
      <InfoItem label="Current Institution" value={data.employment_details?.current_institution}/>
      <InfoItem label="Institution Type" value={data.employment_details?.institution_type}/>
      <InfoItem label="Region" value={data.employment_details?.region}/>
      <InfoItem label="District" value={data.employment_details?.district}/>
      <InfoItem label="Experience" value={`${data.employment_details?.experience_years} years`}/>
    </InfoCard>
  );

  const renderMandatoryQualifications = () => (
    <InfoCard 
      title='Mandatory Qualification' 
      icon={<GraduationCap className="w-6 h-6 text-blue-500"/>}
      columns={1}
    >
      {data?.edu_pro_qualifications ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Level</TableHead>
              <TableHead>Qualification</TableHead>
              <TableHead>Institution</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Major Subjects</TableHead>
              <TableHead>Attachment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{data.edu_pro_qualifications.level ?? '-'}</TableCell>
              <TableCell>{data.edu_pro_qualifications.qualification ?? '-'}</TableCell>
              <TableCell>{data.edu_pro_qualifications.institution ?? '-'}</TableCell>
              <TableCell>{data.edu_pro_qualifications.qualification_year ?? '-'}</TableCell>
              <TableCell>{data.edu_pro_qualifications.major_subjects ?? '-'}</TableCell>
              <TableCell>
                <TableCell><InfoItem label="" value={data.edu_pro_qualifications.attachments ?? ''}/></TableCell>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ) : (
        <div className="flex items-center justify-center p-4 text-muted-foreground">
          No mandatory qualification data available
        </div>
      )}
    </InfoCard>
  );

  const renderQualifications = () => (
    <InfoCard title='Educational Qualifications' icon={<School className="w-6 h-6 text-blue-500"/>} columns={1}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Level</TableHead>
            <TableHead>Qualification</TableHead>
            <TableHead>Attachment</TableHead>
            <TableHead>Institution</TableHead>
            <TableHead>Year</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.other_qualifications?.map((qual, index) => (
            <TableRow key={index}>
              <TableCell>{qual.level}</TableCell>
              <TableCell>{qual.qualification}</TableCell>
              <TableCell><InfoItem label="" value={qual.attachments}/></TableCell>
              <TableCell>{qual.institution}</TableCell>
              <TableCell>{qual.qualification_year}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </InfoCard>
  );

  const renderBackgroundChecks = () => (
    <InfoCard title='Background Checks' icon={<AlertTriangle className="w-6 h-6 text-blue-500"/>} columns={1}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Checked By</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.background_checks?.map((check, index) => (
            <TableRow key={index}>
              <TableCell>{check.name}</TableCell>
              <TableCell>{check.description}</TableCell>
              <TableCell>{check.checked_by}</TableCell>
              <TableCell>{new Date(check.created_at || '').toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </InfoCard>
  );

  const renderDocuments = () => (
    <InfoCard title='Documents' icon={<File className="w-6 h-6 text-blue-500"/>} columns={3}>
      <InfoItem label="National ID Copy" value={data.attachments?.national_id_copy}/>
      <InfoItem label="Qualification Documents" value={data.attachments?.qualification_copy}/>
      <InfoItem label="Proof of Payment" value={data.attachments?.proof_of_payment}/>
    </InfoCard>
  );

  if (!data || !data.bio_datas || !data.teacher_registrations) {
    return <div>No data available</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
      <div className="mb-4 flex-shrink-0 shadow-md">
        <div className='flex justify-between'>
          <h1 className="text-3xl font-bold text-gray-800">
            License Renewal Request
          </h1>
          <RenewalActionButtons 
            recordId={data.teacher_registrations.national_id ?? ''} 
            userRole={userRole} 
            current_status={data.teacher_registrations.reg_status ?? ''}
          />
        </div>
        <div className="mt-2 h-1 w-full bg-blue-400 rounded-full"></div>
      </div>
      
      <div className='flex-grow overflow-y-auto'>
        <div className='space-y-8 pr-4'>
          {renderSection(renderPersonalInfo())}
          {renderSection(renderRegistrationInfo())}
          {renderSection(renderEmploymentInfo())}
          {renderSection(renderMandatoryQualifications())}
          {renderSection(renderQualifications())}
          {renderSection(renderBackgroundChecks())}
          {renderSection(renderDocuments())}
        </div>
      </div>
    </div>
  );
};

export default RenewalViewer;