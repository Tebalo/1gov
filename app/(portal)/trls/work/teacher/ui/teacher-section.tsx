"use client"
import React, { useState } from 'react';
import { Info, FileCheck, File, Briefcase, School, AlertTriangle, GraduationCap, Coins, ShieldAlert} from 'lucide-react'
import { Role } from '@/app/lib/store';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import InfoCard from '@/app/components/InfoCard';
import InfoItem from '@/app/components/InfoItem';
import { TeacherResponse } from '../types/teacher-type';
import AuditTrail from '@/components/case/audit-trail';
import { CommentSection } from '@/components/case/add-comment';
import CaseHeader from '@/components/case/case-header';
import TeacherActions from '../actions/action-section';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { updateTeacherStatus } from '../api/update-status';
import { getAuthData } from '@/app/staff/login/components/email-login';
import { InfoLink } from '@/app/components/InfoLink';


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

  const renderPersonalInfo = () => (
    <InfoCard title='Personal Information' icon={<Info className="w-6 h-6 text-blue-500"/>} columns={2}>
      <InfoItem label="Full Name" value={fullName}/>
      <InfoItem label="National ID" value={data.bio_datas?.national_id}/>
      <InfoItem label="Date of Birth" value={data.bio_datas?.dob} isDate/>
      <InfoItem label="Gender" value={data.bio_datas?.gender}/>
      <InfoItem label="Email" value={data.bio_datas?.email}/>
      <InfoItem label="Mobile" value={data.bio_datas?.mobile}/>
      <InfoItem label="Disability" value={data.bio_datas?.disability}/>
      <InfoItem label="Disability Description" value={data.bio_datas?.disability_description}/>
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
      <InfoItem label="Registration Number" value={data.teacher_registrations?.reg_number}/>
      <InfoItem label="Registration Status" value={data.teacher_registrations?.reg_status}/>
      <InfoItem label="Endorsement Status" value={data.teacher_registrations?.endorsement_status}/>
      <InfoItem label="Licence Status" value={data.teacher_registrations?.license_status}/>
      <InfoItem label="Payment Ref" value={data.teacher_registrations?.payment_ref}/>
      <InfoItem 
        label="Payment Amount" 
        value={`P ${data.teacher_registrations?.payment_amount ?? "0"}.00`}
      />
      <InfoItem 
        label="Payment Name" 
        value={data.teacher_registrations?.payment_name ?? "Teacher Registration and License"}
      />
      <InfoLink label="Payment Link" paymentUrl={data.teacher_registrations?.paid_at ?? ''} className=""/>
      <InfoItem label="Registration Type" value={data.teacher_registrations?.registration_type}/>
      <InfoItem label="Citizen Status" value={data.teacher_preliminary_infos?.citizen_status}/>
      <InfoItem label="SLA" value={data.teacher_registrations?.created_at} isSLA/>
      <InfoItem label="Institution Verification" value={data.teacher_registrations?.institution_verification}/>
      <InfoItem label="Course Verification" value={data.teacher_registrations?.course_verification}/>
      <InfoItem label="Practice Category" value={data.teacher_preliminary_infos?.practice_category}/>
      <InfoItem label="Sub Category" value={data.teacher_preliminary_infos?.sub_category}/>
      <InfoItem label="Licence Expiry Date" value={data.teacher_registrations?.license_expiry_date} isDate/>
      <InfoItem label="Subscription Due Date" value={data.teacher_registrations?.subscription_due_date} isDate/>
      {isEndorsementComplete() && <InfoItem label='Computed Licence Status' value={getLicenseStatus()} isLicenseStatus/>}
    </InfoCard>
  );

  const renderEmploymentInfo = () => (
    <InfoCard title='Employment Information' icon={<Briefcase className="w-6 h-6 text-blue-500"/>} columns={2}>
      <InfoItem label="Employment Status" value={data.teacher_registrations?.work_status}/>
      <InfoItem label="Current Institution" value={data.employment_details?.current_institution}/>
      <InfoItem label="Institution Type" value={data.employment_details?.institution_type}/>
      <InfoItem label="Region" value={data.employment_details?.region}/>
      <InfoItem label="Experience" value={data.employment_details?.experience_years}/>
    </InfoCard>
  );

  const renderMandatoryQualifications = () => (
    <InfoCard 
      title='Mandatory Qualification' 
      icon={<GraduationCap className="w-6 h-6 text-blue-500"/>}
      columns={2}
    >
      {data?.edu_pro_qualifications ? (
        <>
          <InfoItem label="Level" value={data.edu_pro_qualifications.level}/>
          <InfoItem label="Qualification" value={data.edu_pro_qualifications.qualification}/>
          <InfoItem label="Institution" value={data.edu_pro_qualifications.institution}/>
          <InfoItem label="Year" value={data.edu_pro_qualifications.qualification_year}/>
          <InfoItem label="Subject Specialisation" value={data.edu_pro_qualifications.major_subjects}/>
          <InfoItem label="Attachment" value={data.edu_pro_qualifications.attachments} isAttachment/>
        </>
      ) : (
        <div className="flex items-center justify-center p-4 text-muted-foreground col-span-2">
          No mandatory qualification data available
        </div>
      )}
    </InfoCard>
  );

  // const renderMandatoryQualifications = () => (
  //   <InfoCard 
  //     title='Mandatory Qualification' 
  //     icon={<GraduationCap className="w-6 h-6 text-blue-500"/>}
  //     columns={1}
  //   >
  //     {data?.edu_pro_qualifications ? (
  //       <Table>
  //         <TableHeader>
  //           <TableRow>
  //             <TableHead>Level</TableHead>
  //             <TableHead>Qualification</TableHead>
  //             <TableHead>Institution</TableHead>
  //             <TableHead>Year</TableHead>
  //             <TableHead>Subject Specialisation</TableHead>
  //             <TableHead>Attachment</TableHead>
  //           </TableRow>
  //         </TableHeader>
  //         <TableBody>
  //           <TableRow>
  //             <TableCell>{data.edu_pro_qualifications.level ?? '-'}</TableCell>
  //             <TableCell>{data.edu_pro_qualifications.qualification ?? '-'}</TableCell>
  //             <TableCell>{data.edu_pro_qualifications.institution ?? '-'}</TableCell>
  //             <TableCell>{data.edu_pro_qualifications.qualification_year ?? '-'}</TableCell>
  //             <TableCell>{data.edu_pro_qualifications.major_subjects ?? '-'}</TableCell>
  //             <TableCell>
  //               <InfoItem label="" value={data.edu_pro_qualifications.attachments ?? ''}/>
  //             </TableCell>
  //           </TableRow>
  //         </TableBody>
  //       </Table>
  //     ) : (
  //       <div className="flex items-center justify-center p-4 text-muted-foreground">
  //         No mandatory qualification data available
  //       </div>
  //     )}
  //   </InfoCard>
  // );

  const renderQualifications = () => (
    <InfoCard title='Additional Qualifications' icon={<School className="w-6 h-6 text-blue-500"/>} columns={1}>
      {data?.other_qualifications && data.other_qualifications.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              {/* <TableHead>Level</TableHead> */}
              <TableHead>Qualification</TableHead>
              <TableHead>Attachment</TableHead>
              {/* <TableHead>Institution</TableHead> */}
              <TableHead>Year</TableHead>
              {/* <TableHead>Subjects</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.other_qualifications.map((qual, index) => (
              <TableRow key={index}>
                {/* <TableCell>{qual.level ?? '-'}</TableCell> */}
                <TableCell>{qual.qualification ?? '-'}</TableCell>
                <TableCell>
                  {qual.attachments ? (
                    <InfoItem label="" value={qual.attachments} isAttachment/>
                  ) : '-'}
                </TableCell>
                {/* <TableCell>{qual.institution ?? '-'}</TableCell> */}
                <TableCell>{qual.qualification_year ?? '-'}</TableCell>
                {/* <TableCell>{qual.major_subjects ?? '-'}</TableCell> */}
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

  const renderOffenceConvictions = () => (
    <InfoCard title='Offence & Convictions' icon={<ShieldAlert className="w-6 h-6 text-red-500"/>} columns={1}>
      {data?.offence_convictions ? (
        <>
          <InfoItem 
            label="Student Related Offence" 
            value={data.offence_convictions.student_related_offence === 'yes' ? 'Yes' : 'No'}
          />
          {data.offence_convictions.student_related_offence === 'yes' && (
            <>
              <InfoItem 
                label="Student Offence Details" 
                value={data.offence_convictions.student_related_offence_details}
              />
              <InfoItem 
                label="Student Offence Attachments" 
                isAttachment
                value={data.offence_convictions.student_related_offence_attachments}
              />
            </>
          )}
          
          <InfoItem 
            label="Drug Related Offence" 
            value={data.offence_convictions.drug_related_offence === 'yes' ? 'Yes' : 'No'}
          />
          {data.offence_convictions.drug_related_offence?.toLowerCase() === 'yes' && (
            <>
              <InfoItem 
                label="Drug Offence Details" 
                value={data.offence_convictions.drug_related_offence_details}
              />
              <InfoItem 
                label="Drug Offence Attachments" 
                isAttachment
                value={data.offence_convictions.drug_related_offence_attachments}
              />
            </>
          )}
          
          <InfoItem 
            label="Licence Flag" 
            value={data.offence_convictions.license_flag === 'yes' ? 'Yes' : 'No'}
          />
          {data.offence_convictions.license_flag?.toLowerCase() === 'yes' && (
            <InfoItem 
              label="Licence Flag Details" 
              isAttachment
              value={data.offence_convictions.license_flag_details}
            />
          )}
          
          <InfoItem 
            label="Misconduct Flag" 
            value={data.offence_convictions.misconduct_flag === 'yes' ? 'Yes' : 'No'}
          />
          {data.offence_convictions.misconduct_flag?.toLowerCase() === 'yes' && (
            <InfoItem 
              label="Misconduct Flag Details" 
              isAttachment
              value={data.offence_convictions.misconduct_flag_details}
            />
          )}
        </>
      ) : (
        <div className="flex items-center justify-center p-4 text-muted-foreground col-span-2">
          No offence or conviction data available
        </div>
      )}
    </InfoCard>
  );

  const hasValidRegistration = data?.teacher_registrations && Object.keys(data.teacher_registrations).length > 0;
  const hasValidBioData = data?.bio_datas && Object.keys(data.bio_datas).length > 0;

  const renderBackgroundChecks = () => (
    <InfoCard title='Background Checks' icon={<AlertTriangle className="w-6 h-6 text-blue-500"/>} columns={1}>
      {data?.background_checks && Array.isArray(data.background_checks) && data.background_checks.length > 0 ? (
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
            {data.background_checks.map((check, index) => (
              <TableRow key={check.id || index}>
                <TableCell>{check.name ?? '-'}</TableCell>
                <TableCell>{check.description ?? '-'}</TableCell>
                <TableCell>{check.checked_by ?? '-'}</TableCell>
                <TableCell>
                  {check.created_at ? new Date(check.created_at).toLocaleDateString() : '-'}
                </TableCell>
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
      <InfoItem label="National ID Copy" value={data.attachments?.national_id_copy} isAttachment/>
      <InfoItem label="Licence Certificate" value={data.teacher_registrations?.license_link} isAttachment/>
      <InfoItem label="Receipt" value={data.teacher_registrations?.recite} isAttachment/>
      <InfoItem label="Invoice" value={data.teacher_registrations?.invoice} isAttachment/>
    </InfoCard>
  );

  const renderComments = () => (
    <CommentSection
      caseId={caseId}
      caseType={caseType}
    />
  )

  
  return (
    <div className="container mx-auto max-w-full px-4 h-screen flex flex-col">
      <CaseHeader 
        caseId={'TR-'+data?.teacher_registrations?.national_id ?? ''} 
        caseTitle={'Teacher Registration Request'} 
        caseStatus={(data?.teacher_registrations?.reg_status != "Manager-Approved" ? data?.teacher_registrations?.reg_status: data.teacher_registrations?.endorsement_status) || ''} 
        caseType={'Teacher Registration'} 
        caseCreatedDate={data?.teacher_registrations?.created_at ?? ''} 
        caseCreatedBy={fullName} 
        caseAssignedTo={data?.teacher_registrations?.assigned_to ?? ''} 
        actions={<TeacherActions recordId={data?.teacher_registrations?.national_id ?? ''} userRole={userRole} current_status={data?.teacher_registrations?.reg_status ?? ''}/>} 
        auditTrail={<AuditTrail caseId={data?.teacher_registrations?.national_id ?? ''} caseType='teacher'/>}
        resendPayment={userRole == "manager" && data?.teacher_registrations?.reg_status == "Manager-Approved" && <ResendPayment caseId={data?.teacher_registrations?.national_id ?? ''}/>} 
        icon={<GraduationCap className='h-16 w-16 bg-blue-50 rounded-lg p-2 text-sky-600'/>}        
      />
      
      <div className='flex-grow overflow-y-auto'>
        <div className='space-y-4 pr-4'>
          {renderSection(renderPersonalInfo())}
          {renderSection(renderRegistrationInfo())}
          {renderSection(renderEmploymentInfo())}
          {renderSection(renderMandatoryQualifications())}
          {renderSection(renderQualifications())}
          {renderSection(renderOffenceConvictions())}
          {renderSection(renderBackgroundChecks())}
          {renderSection(renderDocuments())}
          {renderSection(renderComments())}
        </div>
      </div>
    </div>
  );
};

const ResendPayment: React.FC<{caseId: string}> = ({ 
  caseId
}) => {
  const [submitting, setSubmission] = useState(false)
  const { toast } = useToast();
  async function onSubmit(){
    try{
      setSubmission(true)
      const authData = getAuthData();
      const bearer = authData?.access_token;
      const result = await updateTeacherStatus(caseId, "Manager-Approved", "N/A", [], bearer || '');
      if (result.code === 200 || result.code === 201 || result.code === 504 || result.code === 500) {
        toast({
          title: "Payment link sent",
          variant: "default",
          description: "Payment link has been sent to the customer"
        });
      }
      setSubmission(false)
    }catch(error){
      toast({
        title: "Failed to send",
        variant: "destructive",
        description: `Failed to resend invoice link ${error}`
      });
      
      setSubmission(false)
    }finally{
      setSubmission(false)
    }
  }
  return(
    <div>
      <Button variant={"outline"} onClick={onSubmit}>
        <Coins 
          className={`mr-2 ${submitting ? 'animate-spin text-green-400' : ''}`} 
          size={16} 
        />
        {submitting ? "Sending Link.." : "Resend Invoice Link"}
      </Button>
    </div>
  )
}

export default TeacherRegistrationViewer;