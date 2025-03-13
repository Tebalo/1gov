'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FaFilePdf } from 'react-icons/fa';
import { RefreshCw, Shield } from 'lucide-react'; // Add Shield icon for anonymous data
import { Badge } from '@/components/ui/badge';
import { Value } from '@radix-ui/react-select';

interface InfoItemProps {
  label: string;
  value: string | null | undefined;
  isAnonymous?: boolean; 
  isLicenseStatus?: boolean;
  isPersonalInfo?: boolean; 
  isSLA?: boolean;
  isDate?: boolean;
}

const PDFViewer: React.FC<{ url: string }> = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-[650px]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin">
              <RefreshCw className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-sm text-gray-600">Loading document...</p>
          </div>
        </div>
      )}
      <iframe 
        src={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`} 
        width="100%" 
        height="500px"
        onLoad={() => setIsLoading(false)}
        className={`w-full h-full ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      />
    </div>
  );
};

const InfoItem: React.FC<InfoItemProps> = ({ 
  label, 
  value, 
  isAnonymous = false, 
  isPersonalInfo = false,
  isLicenseStatus = false, 
  isSLA = false,
  isDate=false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenPDF = () => {
    setIsModalOpen(true);
  };

  const PDF_LABELS = [
    "Valuation Report",
    "Picture",
    "attachments",
    "",
    "Attachment Letter",
    "National ID Copy",
    "Qualification Documents",
    "Proof of Payment",
    "Employment Contract",
    "Teaching Certificate",
    "CPD Transcript" 
  ];
  
  const isPDFLink = value && PDF_LABELS.includes(label);

  // Check if this value should be hidden due to anonymous submission
  const shouldHideValue = isAnonymous && (
    isPersonalInfo || 
    label==="Name" || 
    label==="Contact" || 
    label==="Address" ||
    label === "Omang" ||
    label==="Passport" 
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

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toISOString(); // or any other consistent format
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

  function getSLAStatus(createdAt: string) {
    const created = new Date(createdAt);
    const today = new Date();
    const diffTime = today.getTime() - created.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const remainingDays = 30 - diffDays;

    let badgeColor = "bg-green-100 text-green-800";
    let displayText = `${remainingDays} days left`;

    if (remainingDays <= 5 && remainingDays > 0) {
        badgeColor = "bg-yellow-100 text-yellow-800";
    } else if (remainingDays <= 0) {
        badgeColor = "bg-red-100 text-red-800";
        const overdueDays = Math.abs(remainingDays);
        displayText = `Overdue by ${overdueDays} day${overdueDays !== 1 ? 's' : ''}`;
    }

    return { badgeColor, displayText };
  }

  function getLicenseStatus(reg_status: string){
    let badgeColor = "bg-green-100 text-green-800";

    if(reg_status == 'Invalid'){
      badgeColor = "bg-red-100 text-red-800";
    }
    return {badgeColor};
  }

  return (
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      {shouldHideValue ? (
        <div className="flex items-center mt-1 text-gray-500">
          <Shield className="h-4 w-4 mr-2" />
          <span className="italic">Anonymous</span>
        </div>
      ) : isPDFLink ? (
        <div className="flex items-center mt-1">
          
          <Button 
            onClick={handleOpenPDF} 
            variant="link" 
            className="text-blue-500 hover:underline mr-2 p-0">
            <FaFilePdf className="text-red-500 mr-2 h-5 w-5" />
            Open
          </Button>
          {/* <a 
            href={value} 
            download 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-green-500 hover:underline"
          >
            Download
          </a> */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Document Viewer</DialogTitle>
              </DialogHeader>
              <div className="mt-2 h-[85vh]">
                <PDFViewer url={value} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : isSLA ? (
        <div>{value && 
          <Badge className={`${getSLAStatus(value).badgeColor} font-semibold px-3 py-1 hover:bg-slate-300`}>
              {getSLAStatus(value).displayText}
          </Badge>}
        </div>
      ): isDate ? (
        <p>{value ? new Date(value).toLocaleDateString(): ''}</p>
      ): isLicenseStatus ? (
        <div>{value && 
          <Badge className={`${getLicenseStatus(value).badgeColor} font-semibold px-3 py-1 hover:bg-slate-300`}>
              {value || 'N/A'}
          </Badge>}
        </div>
      ):(
        <p className="font-medium mt-1">{value || 'N/A'}</p>
      )}
    </div>
  );
};

export default InfoItem;