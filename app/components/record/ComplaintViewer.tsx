import React from 'react';
import { FaExclamationTriangle, FaCheckCircle, FaFilePdf } from 'react-icons/fa';

import { statusTransitions } from '@/app/lib/store';
import { 
  Info, MapPin, User, FileText, Calendar, 
  Truck, FileCheck, BarChart2, Users, Clock
} from 'lucide-react'

import dynamic from 'next/dynamic'
import ActionButtons from './components/ActionItems';
import { Investigation } from '@/app/lib/types';

const InfoCard = dynamic(() => import('../InfoCard'), { ssr: false })
const InfoItem = dynamic(() => import('../InfoItem'), { ssr: false })

export const dynamicParams = true

const PDFViewer: React.FC<{ url: string }> = ({ url }) => (
  <iframe src={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`} width="100%" height="500px" />
);
  
export const getNextStatus = (userRole: string): { prev_status: string | null; inv_status: string | null; bar_status: string | null; rej_status: string | null; next_status: string | null; recommend: string | null; endorse: string | null;        reject_label: string | null;
  approve_label: string | null;
  recommend_label: string | null;
  endorse_label: string | null; } => {
  const statusTransition = statusTransitions[userRole.toLowerCase()] || statusTransitions['Default'];
  return statusTransition;
};

interface InvestigationViewProps {
  data: Investigation;
  userRole: string;
}

  const InvestigationView: React.FC<InvestigationViewProps> = ({ data, userRole }) => {

    const { prev_status, next_status, rej_status, bar_status, inv_status, recommend, endorse, approve_label, reject_label, recommend_label, endorse_label } = getNextStatus(userRole);
  
    const handleStatusChange = async (id: string, status: string, rejection_reason: string) => {
      
    };
    const renderSection = (content: React.ReactNode) => (
      <div className="mb-8">
        {content}
      </div>
    );
  
    return (
      <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
        <div className="mb-4 flex-shrink-0 shadow-md">
          <div className='flex justify-between'>
            <h1 className="text-3xl font-bold text-gray-800">
              Complaint Information
            </h1>
            <ActionButtons caseCode={data.reporter.inquiry_number  ?? ''} />
          </div>
          <div className="mt-2 h-1 w-full bg-blue-400 rounded-full"></div>
        </div>
        <div className='flex-grow overflow-y-auto'>
          {/* max-h-[calc(100vh-200px)] */}
          <div className='space-y-8 pr-4'>
            {renderSection(renderReportInfo(data))}
            {renderSection(renderComplaintInfo(data))}
            {renderSection(renderOffenderInfo(data))}
            {renderSection(renderInvestigationInfo(data))}
          </div>
      </div>
      </div>
    );
  };
  
  const DocumentItem: React.FC<{ label: string; url: string | null; onView: (url: string) => void }> = ({ label, url, onView }) => (
    <div className="flex items-center mb-2">
      <FaFilePdf className="text-red-500 mr-2" />
      <span className="font-medium mr-2">{label}:</span>
      {url ? (
        <>
          <button onClick={() => onView(url)} className="text-blue-500 hover:underline mr-2">View</button>
          <a href={url} download className="text-green-500 hover:underline">Download</a>
        </>
      ) : (
        <span className="text-gray-500">Not provided</span>
      )}
    </div>
  );
  
  const renderReportInfo = (data: Investigation) => (
    <InfoCard title='Reporter Information' icon={<Info className="w-6 h-6 text-blue-500"/>}>
      <InfoItem label="Name" value={data.reporter.name}/>
      <InfoItem label="Contact number" value={data.reporter.contact_number}/>
      <InfoItem label="Omang" value={data.reporter.Omang_id}/>
      <InfoItem label="Passport number" value={data.reporter.passport_no}/>
      <InfoItem label="Occupation" value={data.reporter.occupation}/>
      <InfoItem label="Sex" value={data.reporter.sex}/>
      <InfoItem label="Nationality" value={data.reporter.nationality}/>
      <InfoItem label="Address" value={data.reporter.address}/>
      <InfoItem label="Status" value={data.reporter.reg_status}/>
      {/* <InfoItem label="Inquiry number" value={data.reporter.inquiry_number}/> */}
      {/* <InfoItem label="Case number" value={data.reporter.case_number}/> */}
      <InfoItem label="Anonymous" value={data.reporter.anonymous}/>
      <InfoItem label="Submission type" value={data.reporter.submission_type}/>
      <InfoItem label="Created At" value={data.reporter.created_at}/>
      <InfoItem label="Updated At" value={data.reporter.updated_at}/>
    </InfoCard>
  );

  const renderComplaintInfo = (data: Investigation) => (
    <InfoCard title='Complaint Details' icon={<FileCheck className="w-6 h-6 text-blue-500"/>}>
      <InfoItem label="Case number" value={data.complaint.case_number}/>
      <InfoItem label="Inquiry number" value={data.reporter.inquiry_number}/>
      <InfoItem label="FIR number" value={data.complaint.fir_number}/>
      <InfoItem label="BIF number" value={data.complaint.bif_number}/>
      <InfoItem label="Crime location" value={data.complaint.crime_location}/>
      <InfoItem label="Nature of crime" value={data.complaint.nature_of_crime}/>
      <InfoItem label="Date" value={data.complaint.date}/>
      <InfoItem label="Time" value={data.complaint.time}/>
      <InfoItem label="Outcome" value={data.complaint.outcome}/>
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
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "UTC"
};

function ConvertTime(time: string){
    return new Intl.DateTimeFormat("en-US", options).format(new Date(time))
}

function getRelativeTime(updateTime: string) {
    const now = new Date();
    const updated = new Date(updateTime);
    const diffSeconds = Math.floor((now.getTime() - updated.getTime()) / 1000);
    
    if (diffSeconds < 60) {
        return "Updated seconds ago";
    } else if (diffSeconds < 3600) {
        const minutes = Math.floor(diffSeconds / 60);
        return `Updated ${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffSeconds < 86400) {
        const hours = Math.floor(diffSeconds / 3600);
        return `Updated ${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffSeconds < 604800) {
        const days = Math.floor(diffSeconds / 86400);
        if (days === 1) {
            return "Updated a day ago";
        } else {
            return `Updated ${days} days ago`;
        }
    } else if (diffSeconds < 2592000) {
        const weeks = Math.floor(diffSeconds / 604800);
        if (weeks === 1) {
            return "Updated a week ago";
        } else {
            return `Updated ${weeks} weeks ago`;
        }
    } else if (diffSeconds < 31536000) {
        const months = Math.floor(diffSeconds / 2592000);
        if (months === 1) {
            return "Updated a month ago";
        } else {
            return `Updated ${months} months ago`;
        }
    } else {
        const years = Math.floor(diffSeconds / 31536000);
        if (years === 1) {
            return "Updated a year ago";
        } else {
            return `Updated ${years} years ago`;
        }
    }
  }

  export default InvestigationView;