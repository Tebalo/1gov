'use client'
import React from 'react';
import { Info, FileCheck, FileText, File, AlertTriangle, GraduationCap, FileWarning } from 'lucide-react'
import { Role } from '@/app/lib/store';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import InfoCard from '@/app/components/InfoCard';
import InfoItem from '@/app/components/InfoItem';
import { Button } from '@/components/ui/button';
import { StudentTeacherResponse } from '../types/student-type';
import StudentTeacherActionButtons from '../actions/student-action-items';
import AuditTrail from '@/components/case/audit-trail';


interface StudentViewerProps {
  data: StudentTeacherResponse;
  userRole: Role;
}


const StudentTeacherViewer: React.FC<StudentViewerProps> = ({ data, userRole }) => {
  const renderSection = (content: React.ReactNode) => (
    <div className="mb-8">{content}</div>
  );

  const fullName = `${data?.bio_datas?.forenames} ${data?.bio_datas?.surname}`;

  const handleOpenDocument = (key: string | null) => {
    if (key) window.open(key, '_blank');
  };

  const renderPersonalInfo = () => (
    <InfoCard title='Personal Information' icon={<Info className="w-6 h-6 text-blue-500"/>} columns={2}>
      <InfoItem label="Full Name" value={fullName}/>
      <InfoItem label="National ID" value={data?.bio_datas?.national_id}/>
      <InfoItem label="Date of Birth" value={data?.bio_datas?.dob} isDate/>
      <InfoItem label="Gender" value={data?.bio_datas?.gender}/>
      <InfoItem label="Email" value={data?.bio_datas?.email}/>
      <InfoItem label="Mobile" value={data?.bio_datas?.mobile}/>
      <InfoItem label="Nationality" value={data?.bio_datas?.nationality}/>
      <InfoItem label="Postal Address" value={data?.bio_datas?.postal_address}/>
      <InfoItem label="Physical Address" value={data?.bio_datas?.physical_address}/>
      <InfoItem label="Disability" value={data?.bio_datas?.disability}/>
      <InfoItem label="Disability Description" value={data?.bio_datas?.disability_description}/>
    </InfoCard>
  );

  const getLicenseStatus = () => {
    const isManagerApproved = data?.teacher_registrations?.reg_status === 'Manager-Approved';
    const isEndorsementComplete = data?.teacher_registrations?.endorsement_status === 'Endorsement-Complete'
    const hasPayment = data?.teacher_registrations?.payment_amount != null;

    return isManagerApproved && isEndorsementComplete ? 'Valid' : 'Invalid';
  }

  const isEndorsementComplete = () => {
    return data?.teacher_registrations?.endorsement_status === 'Endorsement-Complete';
  }

  const renderRegistrationInfo = () => (
    <InfoCard title='Registration Information' icon={<FileCheck className="w-6 h-6 text-blue-500"/>} columns={2}>
      <InfoItem label="Registration Status" value={data?.teacher_registrations?.reg_status}/>
      <InfoItem label="Endorsement Status" value={data?.teacher_registrations?.endorsement_status}/>
      <InfoItem label="Registration Type" value={data?.teacher_registrations?.registration_type}/>
      <InfoItem label="Created At" value={data?.teacher_registrations?.created_at}/>
      <InfoItem label="Institution Verification" value={data?.teacher_registrations?.institution_verification}/>
      <InfoItem label="Course Verification" value={data?.teacher_registrations?.course_verification}/>
      <InfoItem label="Practice Category" value={data?.student_preliminary_infos?.practice_category}/>
      <InfoItem label="Sub Category" value={data?.student_preliminary_infos?.sub_category}/>
      {isEndorsementComplete() && <InfoItem label='License Status' value={getLicenseStatus()} isLicenseStatus/>}
    </InfoCard>
  );

  const renderPreliminaryInfo = () => (
    <InfoCard title='Preliminary Information' icon={<FileText className="w-6 h-6 text-blue-500"/>} columns={2}>
      <InfoItem label="Institution Name" value={data?.student_preliminary_infos?.institution_name}/>
      <InfoItem label="Citizenry" value={data?.student_preliminary_infos?.citizenry}/>
    </InfoCard>
  );

  const renderStudyProgramme = () => (
    <InfoCard 
      title='Study Programme' 
      icon={<GraduationCap className="w-6 h-6 text-blue-500"/>}
      columns={1}
    >
      {data?.student_study_programmes ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Programme Name</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Completion Year</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Duration (Years)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{data?.student_study_programmes.name ?? '-'}</TableCell>
              <TableCell>{data?.student_study_programmes.level ?? '-'}</TableCell>
              <TableCell>{data?.student_study_programmes.completion_year ?? '-'}</TableCell>
              <TableCell>{data?.student_study_programmes.specialization ?? '-'}</TableCell>
              <TableCell>{data?.student_study_programmes.duration ?? '-'}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ) : (
        <div className="flex items-center justify-center p-4 text-muted-foreground">
          No study programme data available
        </div>
      )}
    </InfoCard>
  );

  const renderOffenceConvictions = () => (
    <InfoCard title='Offence & Convictions' icon={<AlertTriangle className="w-6 h-6 text-blue-500"/>} columns={2}>
      <InfoItem label="Student Related Offence" value={data?.offence_convictions?.student_related_offence}/>
      <InfoItem label="Details" value={data?.offence_convictions?.student_related_offence_details}/>
      <InfoItem label="Drug Related Offence" value={data?.offence_convictions?.drug_related_offence}/>
      <InfoItem label="Details" value={data?.offence_convictions?.drug_related_offence_details}/>
      <InfoItem label="License Flag" value={data?.offence_convictions?.license_flag}/>
      <InfoItem label="Details" value={data?.offence_convictions?.license_flag_details}/>
      <InfoItem label="Misconduct Flag" value={data?.offence_convictions?.misconduct_flag}/>
      <InfoItem label="Details" value={data?.offence_convictions?.misconduct_flag_details}/>
    </InfoCard>
  );

  const renderBackgroundChecks = () => (
    <InfoCard title='Background Checks' icon={<AlertTriangle className="w-6 h-6 text-blue-500"/>} columns={1}>
      {data?.background_checks && data?.background_checks.length > 0 ? (
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
            {data?.background_checks.map((check, index) => (
              <TableRow key={index}>
                <TableCell>{check.name ?? '-'}</TableCell>
                <TableCell>{check.description ?? '-'}</TableCell>
                <TableCell>{check.checked_by ?? '-'}</TableCell>
                <TableCell>{check.created_at ? new Date(check.created_at).toLocaleDateString() : '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex items-center justify-center p-4 text-muted-foreground">
          No background checks available
        </div>
      )}
    </InfoCard>
  );

  const renderDocuments = () => (
    <InfoCard title='Documents' icon={<File className="w-6 h-6 text-blue-500"/>} columns={2}>
      <InfoItem label="National ID Copy" value={data?.attachments?.national_id_copy}/>
      <InfoItem label="Attachment Letter" value={data?.attachments?.attachment_letter} />
    </InfoCard>
  );

  const renderDeclarations = () => (
    <InfoCard title='Declarations' icon={<FileCheck className="w-6 h-6 text-blue-500"/>}>
      <InfoItem label="Agreement" value={data?.declarations?.agreement}/>
      <InfoItem label="Signature" value={data?.declarations?.signature}/>
      <InfoItem label="Date" value={data?.declarations?.created_at}/>
    </InfoCard>
  );

  // if (!data || !data?.bio_datas || !data?.teacher_registrations) {
  //   return (
  //     <div className="w-full h-[calc(100vh-4rem)] flex items-center justify-center p-4">
  //       <div className="max-w-md w-full space-y-4">
  //         <Alert variant="default" className="border-2">
  //           <AlertCircle className="h-5 w-5" />
  //           <AlertTitle>Information Not Found</AlertTitle>
  //           <AlertDescription>
  //             The requested information could not be retrieved. This may be due to:
  //             <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
  //               <li>Incomplete data synchronization from system</li>
  //             </ul>
  //             Please contact your system administrator for assistance.
  //           </AlertDescription>
  //         </Alert>
  //         <div className="flex justify-center">
  //           <Button 
  //             onClick={() => window.location.reload()}
  //             className="gap-2"
  //           >
  //             <RefreshCcw className="h-4 w-4" />
  //             Refresh
  //           </Button>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }
  const caseId = '1001';
  return (
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
      <div className="mb-4 flex-shrink-0 shadow-md p-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Student-Teacher Registration
          </h1>
          <div className='grid md:grid-cols-2 grid-cols-1 gap-2'>
            <AuditTrail caseId={caseId}/>

            {data?.teacher_registrations?.national_id ? (
              <StudentTeacherActionButtons 
                recordId={data?.teacher_registrations?.national_id ?? ''} 
                userRole={userRole}
                current_status={data?.teacher_registrations?.reg_status ?? ''}
              />
            ) : (
              <Button
                variant="link"
                className="text-red-500 hover:underline p-0 flex items-center"
              >
                <FileWarning className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 flex-shrink-0"/>
                <span className="text-wrap px-2 italic text-base sm:text-lg">Missing required data. Contact support!</span>
              </Button>
            )}
          </div>
        </div>
        <div className="mt-2 h-1 w-full bg-blue-400 rounded-full"></div>
      </div>
      
      <div className='flex-grow overflow-y-auto'>
        <div className='space-y-8 pr-4'>
          {renderSection(renderPersonalInfo())}
          {renderSection(renderRegistrationInfo())}
          {renderSection(renderPreliminaryInfo())}
          {renderSection(renderStudyProgramme())}
          {renderSection(renderOffenceConvictions())}
          {renderSection(renderBackgroundChecks())}
          {renderSection(renderDocuments())}
          {renderSection(renderDeclarations())}
        </div>
      </div>
    </div>
  );
};

export default StudentTeacherViewer;