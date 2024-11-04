// app/components/record/ReportInfoCard.tsx
"use client"

import { GETReportResponse } from '@/app/lib/types';
import { Info } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react';
import { getReportRecordById } from '@/app/lib/actions';

const InfoCard = dynamic(() => import('../InfoCard'), { ssr: false })
const InfoItem = dynamic(() => import('../InfoItem'), { ssr: false })

interface ReportInfoCardProps {
  inquiryNumber: string;
}

const ReportInfoCard: React.FC<ReportInfoCardProps> = ({ inquiryNumber }) => {
  const [report, setReport] = useState<GETReportResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setIsLoading(true);
        const response = await getReportRecordById(inquiryNumber);
        setReport(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch report');
        console.error('Error fetching report:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (inquiryNumber) {
      fetchReport();
    }
  }, [inquiryNumber]);

  if (isLoading) {
    return (
      <InfoCard title='Report Information' icon={<Info className="w-6 h-6 text-blue-500"/>}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </InfoCard>
    );
  }

  if (error) {
    return (
      <InfoCard title='Report Information' icon={<Info className="w-6 h-6 text-blue-500"/>}>
        <div className="text-red-500">Failed to load report information</div>
      </InfoCard>
    );
  }

  if (!report?.data) {
    return (
      <InfoCard title='Report Information' icon={<Info className="w-6 h-6 text-blue-500"/>}>
        <div className="text-gray-500">No report information available</div>
      </InfoCard>
    );
  }

  const reportDetails = report.data;

  return (
    <InfoCard title='Report Information' icon={<Info className="w-6 h-6 text-blue-500"/>}>
      <InfoItem 
        label='Investigation Details' 
        value={reportDetails.investigation_details ?? 'No details provided'}
      />
      <InfoItem 
        label='Investigation Outcome' 
        value={reportDetails.investigation_outcome ?? 'Pending'}
      />
      <InfoItem 
        label="Created At" 
        value={reportDetails.created_at ? ConvertTime(reportDetails.created_at) : 'N/A'}
      />
      <InfoItem 
        label="Updated At" 
        value={reportDetails.updated_at ? getRelativeTime(reportDetails.updated_at) : 'N/A'}
      />
    </InfoCard>
  );
};

// Time formatting functions
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

function ConvertTime(time: string) {
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
    return days === 1 ? "Updated a day ago" : `Updated ${days} days ago`;
  } else if (diffSeconds < 2592000) {
    const weeks = Math.floor(diffSeconds / 604800);
    return weeks === 1 ? "Updated a week ago" : `Updated ${weeks} weeks ago`;
  } else if (diffSeconds < 31536000) {
    const months = Math.floor(diffSeconds / 2592000);
    return months === 1 ? "Updated a month ago" : `Updated ${months} months ago`;
  } else {
    const years = Math.floor(diffSeconds / 31536000);
    return years === 1 ? "Updated a year ago" : `Updated ${years} years ago`;
  }
}

export default ReportInfoCard;