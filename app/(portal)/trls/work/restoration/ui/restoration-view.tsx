'use client'
import React from 'react';
import { Info, FileCheck, FileText, ArrowLeft, File, Briefcase, School, AlertTriangle, GraduationCap, RefreshCcw, AlertCircle } from 'lucide-react'
import { Role } from '@/app/lib/store';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import InfoCard from '@/app/components/InfoCard';
import InfoItem from '@/app/components/InfoItem';
import RestorationActionButtons from '../actions/restoration-action-items';
import { RestorationResponse } from '../types/restoration-type';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface RestorationViewerProps {
  data: RestorationResponse;
  userRole: Role;
}

const RestorationViewer: React.FC<RestorationViewerProps> = ({ data, userRole }) => {
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
      <InfoItem label="License Status" value={data.teacher_registrations?.license_status}/>
      <InfoItem label="Payment Ref" value={data.teacher_registrations?.payment_ref}/>
      <InfoItem label="Payment Amount" value={data.teacher_registrations?.payment_amount}/>
      <InfoItem label="Payment Name" value={data.teacher_registrations?.payment_name}/>
      <InfoItem label="Registration Type" value={data.teacher_registrations?.registration_type}/>
      <InfoItem label="Institution Verification" value={data.teacher_registrations?.institution_verification}/>
      <InfoItem label="Course Verification" value={data.teacher_registrations?.course_verification}/>
      <InfoItem label="Practice Category" value={data.teacher_preliminary_infos?.practice_category}/>
      <InfoItem label="Sub Category" value={data.teacher_preliminary_infos?.sub_category}/>
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

  const renderCategoryInfo = () => (
    <InfoCard title='Category' icon={<Briefcase className="w-6 h-6 text-blue-500"/>}>
      <InfoItem label="Registration number" value={data.categories?.registration_number}/>
      <InfoItem label="Current Membership" value={data.categories?.current_membership}/>
      <InfoItem label="Desired Membership" value={data.categories?.desired_membership}/>
      <InfoItem label="Change Reason" value={data.categories?.change_reason}/>
      <InfoItem label="Employment Contract" value={data.categories?.employment_contract}/>
      <InfoItem label="Teaching Certificate" value={data.categories?.teaching_certificate}/>
      <InfoItem label="CPD Transcript" value={data.categories?.cpd_transcript}/>
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
    <InfoCard title='Qualifications' icon={<School className="w-6 h-6 text-blue-500"/>} columns={1}>
      {data?.other_qualifications && data.other_qualifications.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Level</TableHead>
              <TableHead>Qualification</TableHead>
              <TableHead>Attachment</TableHead>
              <TableHead>Institution</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Subjects</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.other_qualifications.map((qual, index) => (
              <TableRow key={index}>
                <TableCell>{qual.level ?? '-'}</TableCell>
                <TableCell>{qual.qualification ?? '-'}</TableCell>
                <TableCell>
                  {qual.attachments ? (
                    <InfoItem label="" value={qual.attachments}/>
                  ) : '-'}
                </TableCell>
                <TableCell>{qual.institution ?? '-'}</TableCell>
                <TableCell>{qual.qualification_year ?? '-'}</TableCell>
                <TableCell>{qual.major_subjects ?? '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex items-center justify-center p-4 text-muted-foreground">
          No qualifications data available
        </div>
      )}
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
    return (
      <div className="w-full h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4">
            <Alert variant="default" className="border-2">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>Information Not Found</AlertTitle>
                <AlertDescription>
                    The requested information could not be retrieved. This may be due to:
                    <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                        <li>Incomplete data synchronization from 1Gov system</li>
                    </ul>
                    Please contact your system administrator for assistance.
                </AlertDescription>
            </Alert>
            <div className="flex justify-center">
                <Button 
                    onClick={() => window.location.reload()}
                    className="gap-2"
                >
                    <RefreshCcw className="h-4 w-4" />
                    Refresh
                </Button>
            </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
      <div className="mb-4 flex-shrink-0 shadow-md">
        <div className='flex justify-between'>
          <h1 className="text-3xl font-bold text-gray-800">
            Restoration Request
          </h1>
          <RestorationActionButtons 
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

export default RestorationViewer;