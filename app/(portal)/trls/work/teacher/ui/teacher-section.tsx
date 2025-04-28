'use client'
import React from 'react';
import { Info, FileCheck, File, Briefcase, School, AlertTriangle, GraduationCap} from 'lucide-react'
import { Role } from '@/app/lib/store';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import InfoCard from '@/app/components/InfoCard';
import InfoItem from '@/app/components/InfoItem';
import { TeacherResponse } from '../types/teacher-type';
import AuditTrail from '@/components/case/audit-trail';
import { CommentSection } from '@/components/case/add-comment';
import CaseHeader from '@/components/case/case-header';
import TeacherActions from '../actions/action-section';

interface TeacherViewerProps {
  data: TeacherResponse;
  userRole: Role;
}

const TeacherRegistrationViewer: React.FC<TeacherViewerProps> = ({ data, userRole }) => {

  const caseId = data?.teacher_registrations?.national_id ?? '';
  const caseType = 'teacher';
  const renderSection = (content: React.ReactNode) => (
    <div className="mb-8">{content}</div>
  );

  const fullName = `${data.bio_datas?.forenames} ${data.bio_datas?.surname}`;

  const handleOpenDocument = (key: string | null) => {
    if (key) window.open(key, '_blank');
  };

  const renderPersonalInfo = () => (
    <InfoCard title='Personal Information' icon={<Info className="w-6 h-6 text-blue-500"/>} columns={2}>
      <InfoItem label="Full Name" value={fullName}/>
      <InfoItem label="National ID" value={data.bio_datas?.national_id}/>
      <InfoItem label="Date of Birth" value={data.bio_datas?.dob} isDate/>
      <InfoItem label="Gender" value={data.bio_datas?.gender}/>
      <InfoItem label="Email" value={data.bio_datas?.email}/>
      <InfoItem label="Mobile" value={data.bio_datas?.mobile}/>
    </InfoCard>
  );

  const getLicenseStatus = () => {
    const isManagerApproved = data?.teacher_registrations?.reg_status === 'Manager-Approved';
    const isEndorsementComplete = data.teacher_registrations?.endorsement_status === 'Endorsement-Complete'
    const hasPayment = data.teacher_registrations?.payment_amount != null;

    return isManagerApproved && isEndorsementComplete && hasPayment ? 'Valid' : 'Invalid';
  }

  const isEndorsementComplete = () => {
    return data.teacher_registrations?.endorsement_status === 'Endorsement-Complete';
  }

  const renderRegistrationInfo = () => (
    <InfoCard title='Registration Information' icon={<FileCheck className="w-6 h-6 text-blue-500"/>} columns={2}>
      <InfoItem label="Registration Status" value={data.teacher_registrations?.reg_status}/>
      <InfoItem label="Payment Ref" value={data.teacher_registrations?.payment_ref}/>
      <InfoItem label="Payment Amount" value={data.teacher_registrations?.payment_amount}/>
      <InfoItem label="Payment Name" value={data.teacher_registrations?.payment_name}/>
      <InfoItem label="Registration Type" value={data.teacher_registrations?.registration_type}/>
      <InfoItem label="SLA" value={data.teacher_registrations?.created_at} isSLA/>
      <InfoItem label="Institution Verification" value={data.teacher_registrations?.institution_verification}/>
      <InfoItem label="Course Verification" value={data.teacher_registrations?.course_verification}/>
      <InfoItem label="Practice Category" value={data.teacher_preliminary_infos?.practice_category}/>
      <InfoItem label="Sub Category" value={data.teacher_preliminary_infos?.sub_category}/>
      {isEndorsementComplete() && <InfoItem label='License Status' value={getLicenseStatus()} isLicenseStatus/>}
    </InfoCard>
  );

  const renderEmploymentInfo = () => (
    <InfoCard title='Employment Information' icon={<Briefcase className="w-6 h-6 text-blue-500"/>} columns={2}>
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
      {data?.background_checks && data?.background_checks?.length > 0 ? (
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
      ) : (
        <div className="flex items-center justify-center p-4 text-muted-foreground">
          No background checks data available
        </div>
      )}
    </InfoCard>
  );

  const renderDocuments = () => (
    <InfoCard title='Documents' icon={<File className="w-6 h-6 text-blue-500"/>} columns={2}>
      <InfoItem label="National ID Copy" value={data.attachments?.national_id_copy}/>
      <InfoItem label="Qualification Documents" value={data.attachments?.qualification_copy}/>
      <InfoItem label="Proof of Payment" value={data.attachments?.proof_of_payment}/>
    </InfoCard>
  );

  const renderComments = () => (
    <CommentSection
      caseId={caseId}
      caseType={caseType}
    />
  )

  
  return (
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col">

      <CaseHeader 
        caseId={'TR-'+data?.teacher_registrations?.national_id ?? ''} 
        caseTitle={'Teacher Registration Request'} 
        caseStatus={data?.teacher_registrations?.reg_status ?? ''} 
        caseType={'Teacher Registration'} 
        caseCreatedDate={data?.teacher_registrations?.created_at ?? ''} 
        caseCreatedBy={fullName} 
        caseAssignedTo={''} 
        actions={<TeacherActions recordId={data?.teacher_registrations?.national_id ?? ''} userRole={userRole} current_status={data?.teacher_registrations?.reg_status ?? ''}/>} 
        auditTrail={<AuditTrail caseId={data?.teacher_registrations?.national_id ?? ''}caseType='teacher'/>} 
        icon={<GraduationCap className='h-16 w-16 bg-blue-50 rounded-lg p-2 text-sky-600'/>}        
      />
      
      <div className='flex-grow overflow-y-auto'>
        <div className='space-y-8 pr-4'>
          {renderSection(renderPersonalInfo())}
          {renderSection(renderRegistrationInfo())}
          {renderSection(renderEmploymentInfo())}
          {renderSection(renderMandatoryQualifications())}
          {renderSection(renderQualifications())}
          {renderSection(renderBackgroundChecks())}
          {renderSection(renderDocuments())}
          {renderSection(renderComments())}
        </div>
      </div>
    </div>
  );
};

export default TeacherRegistrationViewer;