'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FaFilePdf } from 'react-icons/fa';
import { RefreshCw, Shield } from 'lucide-react'; // Add Shield icon for anonymous data

interface InfoItemProps {
  label: string;
  value: string | null | undefined;
  isAnonymous?: boolean; // Add anonymous property
  isPersonalInfo?: boolean; // Optional: to specify which fields to hide when anonymous
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

const InfoItem: React.FC<InfoItemProps> = ({ label, value, isAnonymous = false, isPersonalInfo = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenPDF = () => {
    setIsModalOpen(true);
  };

  const PDF_LABELS = [
    "Valuation Report",
    "Picture",
    "attachments",
    "",
    "National ID Copy",
    "Qualification Documents",
    "Proof of Payment"
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
      <FaFilePdf className="text-red-500 mr-2" />
      <Button 
        onClick={handleOpenPDF} 
        variant="link" 
        className="text-blue-500 hover:underline mr-2 p-0"
      >
        View
      </Button>
      <a 
        href={value} 
        download 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-green-500 hover:underline"
      >
        Download
      </a>
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
  ) : (
    <p className="font-medium mt-1">{value || 'N/A'}</p>
  )}
</div>
  );
};

export default InfoItem;