'use client'

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FileText, RefreshCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DownloadLinkProps {
  label: string;
  url: string | null | undefined;
  filename?: string;
  showPreview?: boolean;
  variant?: 'default' | 'compact';
}

export const DownloadLink: React.FC<DownloadLinkProps> = ({
  label,
  url,
  filename,
  showPreview = true,
  variant = 'default'
}) => {
  if (!url) {
    return (
      <div className="space-y-1">
        <Label className="text-gray-800 font-medium">
          {label}
        </Label>
        <div>
          <span className="text-gray-500 text-sm">--</span>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-start justify-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="link" 
              size="sm"
              className="space-x-2 pl-0"
            >
              <FileText className="h-4 w-4 text-green-600" />
              <div>View Document</div>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl w-[90vw] max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                {filename || 'Document Viewer'}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4 h-[75vh] overflow-hidden rounded-md border">
              <PDFViewer url={url} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
    
  return (
    <div className="">
      <Label className="text-gray-800 font-medium">
        {label}
      </Label>
      <div className="flex items-start">
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="link" 
              className="space-x-2 pl-0"
            >
              <FileText className="h-4 w-4 text-green-600" />
              <div>Open Document</div>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl w-[90vw] max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                {filename || 'Document Viewer'}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4 h-[75vh] overflow-hidden rounded-md border">
              <PDFViewer url={url} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

const PDFViewer: React.FC<{ url: string }> = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin">
              <RefreshCw className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">Loading document...</p>
          </div>
        </div>
      )}
      <iframe 
        src={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`} 
        width="100%" 
        height="100%"
        onLoad={() => setIsLoading(false)}
        className={`w-full h-full border-0 transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        title="Document viewer"
      />
    </div>
  );
};