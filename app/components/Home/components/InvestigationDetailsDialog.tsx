'use client'
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { useState } from "react";

import { Investigations, complaintwithNullValues } from '../data/schema';

interface InvestigationsDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  record: complaintwithNullValues;
  onOpen: () => void;
}

const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <Label className="font-semibold text-gray-700">{label}</Label>
    <span className="text-sm text-gray-600">{value}</span>
  </div>
);

export const InvestigationsDetailsDialog: React.FC<InvestigationsDetailsDialogProps> = ({ isOpen, onClose, record, onOpen }) => {
  const [redirecting, setIsRedirecting] = useState(false);

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-sky-700">Complaint Details</DialogTitle>
          <DialogDescription className="text-gray-600">
            Details of the selected application.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <InfoItem label="Case ID" value={record.case_number ?? ''} />
            <InfoItem label="Status" value={record.reg_status ?? ''} />
            <InfoItem label="Inquiry number" value={record.inquiry_number ?? ''} />
            <InfoItem label="Created" value={new Date(record.date_of_submission ?? '').toLocaleString()} />
            {/* <InfoItem label="Updated" value={getRelativeTime(record.)} /> */}
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="submit" 
            className={`${redirecting ? 'bg-sky-200' : 'bg-sky-400'} hover:bg-sky-600 text-white font-semibold transition-colors`}
            onClick={onOpen}
          >
            {redirecting ? 'Redirecting...' : 'Open'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};