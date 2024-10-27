'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FaFilePdf } from 'react-icons/fa';

interface InfoItemProps {
  label: string;
  value: string | null | undefined;
}

const PDFViewer: React.FC<{ url: string }> = ({ url }) => (
  <iframe src={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`} width="100%" height="500px" />
);

const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenPDF = () => {
    setIsModalOpen(true);
  };

  const isPDFLink = value && (
    label === "Valuation Report" ||
    label.includes("Picture") 
  );

  return (
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      {isPDFLink ? (
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