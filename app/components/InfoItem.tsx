'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FaFilePdf } from 'react-icons/fa';
import { Shield } from 'lucide-react'; // Add Shield icon for anonymous data

interface InfoItemProps {
  label: string;
  value: string | null | undefined;
  isAnonymous?: boolean; // Add anonymous property
  isPersonalInfo?: boolean; // Optional: to specify which fields to hide when anonymous
}

const PDFViewer: React.FC<{ url: string }> = ({ url }) => (
  <iframe src={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`} width="100%" height="500px" />
);

const InfoItem: React.FC<InfoItemProps> = ({ label, value, isAnonymous = false, isPersonalInfo = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenPDF = () => {
    setIsModalOpen(true);
  };

  const isPDFLink = value && (
    label === "Valuation Report" ||
    label.includes("Picture") 
  );

  // Check if this value should be hidden due to anonymous submission
  const shouldHideValue = isAnonymous && (
    isPersonalInfo || 
    label.includes("Name") || 
    label.includes("Contact") || 
    label.includes("Address") ||
    label.includes("Omang") ||
    label.includes("Passport") ||
    label.includes("ID")
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
          <Button onClick={handleOpenPDF} variant="link" className="text-blue-500 hover:underline mr-2 p-0">
            View
          </Button>
          <a href={value} download className="text-green-500 hover:underline">Download</a>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Document Viewer</DialogTitle>
              </DialogHeader>
              <div className="mt-4 h-[70vh]">
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