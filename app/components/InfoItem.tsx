'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FaFilePdf } from 'react-icons/fa';
import { RefreshCw, Shield, FileText } from 'lucide-react';
import Link from 'next/link';

interface InfoItemProps {
  label: string;
  value: string | null | undefined;
  isAnonymous?: boolean; 
  isLicenseStatus?: boolean;
  isPersonalInfo?: boolean; 
  isSLA?: boolean;
  isDate?: boolean;
  isAttachment?: boolean;
  slaMaxDays?: number; // Make SLA period configurable
}

const PDFViewer: React.FC<{ url: string }> = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full h-[650px]">
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin">
              <RefreshCw className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-sm text-gray-600">Loading document...</p>
          </div>
        </div>
      )}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center gap-2">
            <FileText className="h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-600">Unable to preview document</p>
            <Link 
              href={url} 
              target="_blank" 
              className="text-blue-500 hover:underline text-sm"
            >
              Download instead
            </Link>
          </div>
        </div>
      )}
      <iframe 
        src={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`} 
        width="100%" 
        height="500px"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        className={`w-full h-full ${isLoading || hasError ? 'opacity-0' : 'opacity-100'}`}
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
  isAttachment = false,
  isDate = false,
  slaMaxDays = 30 // Default to 30 days but make it configurable
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenPDF = () => {
    setIsModalOpen(true);
  };

  // Check if this value should be hidden due to anonymous submission
  const shouldHideValue = isAnonymous && (
    isPersonalInfo || 
    label === "Name" || 
    label === "Contact" || 
    label === "Address" ||
    label === "Omang" ||
    label === "Passport" 
  );

  function getSLAStatus(createdAt: string, maxDays: number = slaMaxDays) {
    try {
      const created = new Date(createdAt);
      const today = new Date();
      
      // Validate date
      if (isNaN(created.getTime())) {
        return { badgeColor: "bg-gray-100 text-gray-800", displayText: "Invalid date" };
      }
      
      const diffTime = today.getTime() - created.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const remainingDays = maxDays - diffDays;

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
    } catch (error) {
      return { badgeColor: "bg-gray-100 text-gray-800", displayText: "Invalid date" };
    }
  }

  function getLicenseStatus(reg_status: string) {
    let badgeColor = "bg-green-100 text-green-800";

    if (reg_status === 'Invalid') {
      badgeColor = "bg-red-100 text-red-800";
    }
    return { badgeColor };
  }

  function formatDate(dateValue: string) {
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) {
        return '--';
      }
      return date.toISOString().split('T')[0];
    } catch (error) {
      return '--';
    }
  }

  function isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  return (
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      {shouldHideValue ? (
        <div className="flex items-center mt-1 text-gray-500">
          <Shield className="h-4 w-4 mr-2" />
          <span className="italic">Anonymous</span>
        </div>
      ) : isAttachment ? (
        <div className="flex items-center mt-1">
          {value && isValidUrl(value) ? (
            <Button 
              onClick={handleOpenPDF} 
              variant="link" 
              className="text-blue-500 hover:underline mr-2 p-0"
            >
              <FaFilePdf className="text-red-500 mr-2 h-5 w-5" />
              View Document
            </Button>
          ) : (
            <p className='font-medium mt-1'>--</p>
          )}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <div className='flex justify-between pr-5'>
                  <DialogTitle>Document Viewer</DialogTitle>
                  <Link
                    href={value || ''}
                    className='text-sky-600 italic underline'
                    rel='_blank'
                  >
                    Download
                  </Link>
                </div>
              </DialogHeader>
              <div className="mt-2 h-[85vh]">
                {value && isValidUrl(value) ? (
                  <PDFViewer url={value} />
                ) : (
                  <p>No document available</p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : isSLA ? (
        <div>
          {value && (
            <div className={`${getSLAStatus(value).badgeColor} font-semibold px-3 py-1 w-fit hover:bg-slate-300 rounded`}>
              {getSLAStatus(value).displayText}
            </div>
          )}
        </div>
      ) : isDate ? (
        <p className="font-medium mt-1">{value ? formatDate(value) : '--'}</p>
      ) : isLicenseStatus ? (
        <div>
          {value && (
            <div className={`${getLicenseStatus(value).badgeColor} font-semibold px-3 py-1 w-fit hover:bg-slate-300 rounded`}>
              {value.toUpperCase() || '--'}
            </div>
          )}
        </div>
      ) : (
        <p className="font-medium mt-1">{value || '--'}</p>
      )}
    </div>
  );
};

export default InfoItem;