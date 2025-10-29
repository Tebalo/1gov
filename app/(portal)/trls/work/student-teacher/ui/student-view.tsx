import React from 'react';
import { Info, FileCheck, FileText, File, AlertTriangle, GraduationCap } from 'lucide-react'
import { Role } from '@/app/lib/store';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import InfoCard from '@/app/components/InfoCard';
import InfoItem from '@/app/components/InfoItem';
import { StudentTeacherResponse } from '../types/student-type';
import AuditTrail from '@/components/case/audit-trail';
import { CommentSection } from '@/components/case/add-comment';
import CaseHeader from '@/components/case/case-header';
import StudentTeacherFlowActions from '../actions/flow-actions';


interface StudentViewerProps {
  data: StudentTeacherResponse;
  userRole: Role;
}


const StudentTeacherViewer: React.FC<StudentViewerProps> = ({ data, userRole }) => {
  const renderSection = (content: React.ReactNode) => (
    <div className="mb-8">{content}</div>
  );

  const fullName = `${data?.bio_datas?.forenames} ${data?.bio_datas?.surname}`;


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
    <InfoCard title='Offence & Convictions' icon={<AlertTriangle className="w-6 h-6 text-blue-500"/>} columns={3}>
      <InfoItem label="Student Related Offence" value={data?.offence_convictions?.student_related_offence}/>
      <InfoItem label="Details" value={data?.offence_convictions?.student_related_offence_details}/>
      <InfoItem label="Supporting Document" value={data?.offence_convictions?.student_related_offence_attachments} isAttachment/>
      <InfoItem label="Drug Related Offence" value={data?.offence_convictions?.drug_related_offence}/>
      <InfoItem label="Details" value={data?.offence_convictions?.drug_related_offence_details}/>
      <InfoItem label="Supporting Document" value={data?.offence_convictions?.drug_related_offence_attachments} isAttachment/>
      <InfoItem label="License Flag" value={data?.offence_convictions?.license_flag}/>
      <InfoItem label="Supporting Document" value={data?.offence_convictions?.license_flag_details} isAttachment/>
      <InfoItem label="" value={''}/>
      <InfoItem label="Misconduct Flag" value={data?.offence_convictions?.misconduct_flag}/>
      <InfoItem label="Supporting Document" value={data?.offence_convictions?.misconduct_flag_details} isAttachment/> 
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
    <InfoCard title='Declarations' icon={<FileCheck className="w-6 h-6 text-blue-500"/>} columns={1}>
      <InfoItem label="Agreement" value={data?.declarations?.agreement}/>
      <InfoItem label="Signature" value={data?.declarations?.signature}/>
      <InfoItem label="Date" value={data?.declarations?.created_at}/>
    </InfoCard>
  );

  const renderComments = () => (
    <CommentSection
      caseId={caseId}
      caseType={'student-teacher'}
    />
  )
  const caseId = data?.teacher_registrations?.national_id ?? '';
  return (
    <div className="container mx-auto px-4 py-2 h-screen max-w-full flex flex-col">
      <CaseHeader 
        caseId={'STR-'+data?.teacher_registrations?.national_id} 
        caseTitle={'Student-Teacher Registration Request'} 
        caseStatus={data?.teacher_registrations?.reg_status ?? ''} 
        caseType={'Teacher Registration'} 
        caseCreatedDate={data?.teacher_registrations?.created_at ?? ''} 
        caseCreatedBy={fullName} 
        caseAssignedTo={''} 
        actions={<StudentTeacherFlowActions recordId={data?.teacher_registrations?.national_id ?? ''} userRole={userRole} current_status={data?.teacher_registrations?.reg_status ?? ''}/>} 
        auditTrail={<AuditTrail caseId={data?.teacher_registrations?.national_id ?? ''} caseType='student-teacher'/>} 
        icon={<GraduationCap className='h-16 w-16 bg-blue-50 rounded-lg p-2 text-sky-600'/>}        
      />      
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
          {renderSection(renderComments())}
          
        </div>
      </div>
    </div>
  );
};

export default StudentTeacherViewer;