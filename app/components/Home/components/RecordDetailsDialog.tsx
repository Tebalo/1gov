'use client'
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Registration } from '@/app/lib/types';
import { useState } from "react";

interface RecordDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  record: Registration;
  onOpen: () => void;
}

const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <Label className="font-semibold text-gray-700">{label}</Label>
    <span className="text-sm text-gray-600">{value}</span>
  </div>
);

export const RecordDetailsDialog: React.FC<RecordDetailsDialogProps> = ({ isOpen, onClose, record, onOpen }) => {
  const [redirecting, setIsRedirecting] = useState(false);

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-sky-700">Record Details</DialogTitle>
          <DialogDescription className="text-gray-600">
            Details of the selected application.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <InfoItem label="Registration Number" value={record.national_id} />
            <InfoItem label="Registration Status" value={record.reg_status} />
            <InfoItem label="Registration Type" value={record.registration_type} />
            <InfoItem label="Created" value={new Date(record.created_at).toLocaleString()} />
            <InfoItem label="Updated" value={getRelativeTime(record.updated_at)} />
            <div className="flex justify-between items-center">
              <Label className="font-semibold text-gray-700">SLA Status:</Label>
              <Badge className={`${getSLAStatus(record.created_at).badgeColor} font-semibold px-3 py-1`}>
                {getSLAStatus(record.created_at).displayText}
              </Badge>
            </div>
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