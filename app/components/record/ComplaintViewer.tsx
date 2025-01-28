import { Role, statusTransitions } from '@/app/lib/store';
import { 
  Info, FileText,  FileCheck,
  ClipboardCheck
} from 'lucide-react'

import dynamic from 'next/dynamic'
import ActionButtons from './components/ActionItems';
import { Investigation } from '@/app/lib/types';


const InfoCard = dynamic(() => import('../InfoCard'), { ssr: false })
const InfoItem = dynamic(() => import('../InfoItem'), { ssr: false })

export const dynamicParams = true

export const getNextStatus = (userRole: string): { 
  prev_status: string | null; 
  inv_status: string | null; 
  bar_status: string | null; 
  rej_status: string | null; 
  next_status: string | null; 
  recommend: string | null; 
  endorse: string | null; 
  reject_label: string | null;
  approve_label: string | null;
  recommend_label: string | null;
  allocate?: boolean | false,
  submit?: boolean | false,
  endorse_label: string | null; } => {
  const statusTransition = statusTransitions[userRole.toLowerCase()] || statusTransitions['Default'];
  return statusTransition;
};

interface InvestigationViewProps {
  data: Investigation;
  userRole: Role;
}

  const InvestigationView: React.FC<InvestigationViewProps> = ({ data, userRole }) => {
    const renderSection = (content: React.ReactNode) => (
      <div className="mb-8">
        {content}
      </div>
    );
    const STATUSES = ['EXTERNAL-INVESTIGATION','CASE-CLOSED']
    const isShowInvInfo = STATUSES.includes(data?.complaint?.reg_status?.toUpperCase() ?? '');
  
    return (
      <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
        <div className="mb-4 flex-shrink-0 shadow-md">
          <div className='flex justify-between'>
            <h1 className="text-3xl font-bold text-gray-800">
              Complaint Details
            </h1>
            <ActionButtons 
              recordId={data?.complaint?.inquiry_number  ?? ''} 
              userRole={userRole} 
              current_status={data?.complaint?.reg_status ?? ''}
              preliminary_investigation={data.preliminary_investigation}
              investigation={data.investigation}
            />
          </div>
          <div className="mt-2 h-1 w-full bg-blue-400 rounded-full"></div>
        </div>
        <div className='flex-grow overflow-y-auto'>
          {/* max-h-[calc(100vh-200px)] */}
          <div className='space-y-8 pr-4'>
            {renderSection(renderPreliminaryDetails(data))} 
            {renderSection(renderReporterInfo(data))}
            {renderSection(renderComplaintInfo(data))}
            {renderSection(renderOffenderInfo(data))}
            {renderSection(renderPreInvestigationInfo(data))} 
            {isShowInvInfo && renderSection(renderInvestigationInfo(data))}
          </div>
      </div>
      </div>
    );
  };
   
  const renderReporterInfo = (data: Investigation) => (
    <InfoCard title='Reporter Information' icon={<Info className="w-6 h-6 text-blue-500"/>}>
      <InfoItem label="Name" value={data.reporter.name} isAnonymous={data.reporter.anonymous || false} isPersonalInfo/>
      <InfoItem label="Contact number" value={data.reporter.contact_number} isAnonymous={data.reporter.anonymous || false} isPersonalInfo/>
      <InfoItem label="Omang" value={data.reporter.Omang_id} isAnonymous={data.reporter.anonymous || false} isPersonalInfo/>
      <InfoItem label="Occupation" value={data.reporter.occupation} isAnonymous={data.reporter.anonymous || false} isPersonalInfo/>
      <InfoItem label="Sex" value={data.reporter.sex} isAnonymous={data.reporter.anonymous || false} isPersonalInfo/>
      <InfoItem label="Nationality" value={data.reporter.nationality} isAnonymous={data.reporter.anonymous || false} isPersonalInfo/>
      <InfoItem label="Address" value={data.reporter.address} isAnonymous={data.reporter.anonymous || false} isPersonalInfo/>
      <InfoItem label="Created At" value={data.reporter.created_at} isAnonymous={data.reporter.anonymous || false} isPersonalInfo isDate/>
      <InfoItem label="Updated At" value={data.reporter.updated_at} isAnonymous={data.reporter.anonymous || false} isPersonalInfo isDate/>
    </InfoCard>
  );

  const renderPreliminaryDetails = (data: Investigation) => (
    <InfoCard title='Pre-App Details' icon={<ClipboardCheck className="w-6 h-6 text-blue-500"/>} columns={3}>
        <InfoItem label="Status" value={data?.complaint?.reg_status}/>
        <InfoItem label="Submission type" value={data.reporter.submission_type}/>
        <InfoItem label="SLA" value={data.reporter.created_at} isSLA/>
    </InfoCard>
  )

  const renderComplaintInfo = (data: Investigation) => (
    <InfoCard title='Complaint Details' icon={<FileCheck className="w-6 h-6 text-blue-500"/>}>
      <InfoItem label="Case number" value={data.complaint.case_number}/>
      <InfoItem label="Inquiry number" value={data.complaint.inquiry_number}/>
      <InfoItem label="FIR number" value={data.complaint.fir_number}/>
      <InfoItem label="BIF number" value={data.complaint.bif_number}/>
      <InfoItem label="Crime location" value={data.complaint.crime_location}/>
      <InfoItem label="Nature of crime" value={data.complaint.nature_of_crime}/>
      <InfoItem label="Date" value={data.complaint.date}/>
      <InfoItem label="Time" value={data.complaint.time}/>
    </InfoCard>
  );

  const renderPreInvestigationInfo = (data: Investigation) => (
    <InfoCard title='Preliminary Investigation Details' icon={<FileCheck className="w-6 h-6 text-blue-500"/>} columns={2}>
      <InfoItem label="Details" value={data.preliminary_investigation.investigation_details}/>
      <InfoItem label="Outcome" value={data.preliminary_investigation.investigation_outcome}/>
    </InfoCard>
  );

  const renderOffenderInfo = (data: Investigation) => (
    <InfoCard title='Offender Information' icon={<Info className="w-6 h-6 text-blue-500"/>}>
      <InfoItem label="Name" value={data.offender.name}/>
      <InfoItem label="Sex" value={data.offender.sex}/>
      <InfoItem label="Nationality" value={data.offender.nationality}/>
      <InfoItem label="Date of birth" value={data.offender.dob}/>
      <InfoItem label="Age" value={data.offender.age?.toString()}/>
      <InfoItem label="Contact number" value={data.offender.contact_number}/>
      <InfoItem label="Omang/Passport" value={data.offender.id_passport_number}/>
      <InfoItem label="Address" value={data.offender.address}/>
      <InfoItem label="Ward" value={data.offender.ward}/>
      <InfoItem label="Occupation" value={data.offender.occupation}/>
      <InfoItem label="Place of work" value={data.offender.place_of_work}/>
    </InfoCard>
  );

  const renderInvestigationInfo = (data: Investigation) => (
    <InfoCard title='Investigation Information' icon={<FileText className="w-6 h-6 text-blue-500"/>}>
      <InfoItem label="Investigation officer" value={data.investigation.investigating_officer}/>
      <InfoItem label="Police station" value={data.investigation.police_station}/>
      <InfoItem label="CR number" value={data.investigation.cr_number}/>
      <InfoItem label="Offence" value={data.investigation.offence}/>
      <InfoItem label="Outcome" value={data.investigation.outcome}/>
    </InfoCard>
  );

  export default InvestigationView;