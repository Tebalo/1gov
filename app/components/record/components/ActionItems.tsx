'use client'

import React, { useState } from 'react'
import { Edit, FileText, Save, Send, UserPlus2, SendIcon, PlusCircle, FileCheck2, ChevronDownIcon, X, AlertTriangle, InfoIcon, Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createInvestigationReport, createReport, updateComplaintStatus } from '@/app/lib/actions'
import { useRouter } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/components/ui/use-toast'
import { Role, canUserAccessStatusFull } from '@/app/lib/store'
import ActivityModal from '../ActivityModal'
import { Separator } from '@/components/ui/separator'
import { investigation, preliminary_investigation } from '@/app/lib/types'
import { Input } from '@/components/ui/input'
import InfoCard from '../../InfoCard'
import { cn } from '@/lib/utils'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  InboxIcon,
  ClipboardCheck,
  Search,
  FileSearch,
  Microscope,
  Building2,
  Globe,
  Scale,
  Gavel,
  FolderClosed,
} from "lucide-react";
import { Badge } from '@/components/ui/badge'
interface ActionButtonsProps {
  recordId: string;
  userRole: Role;
  current_status: string;
  investigation: investigation;
  preliminary_investigation: preliminary_investigation;
}

interface StatusAccessConfig {
  hasPermission: boolean;
  nextStatus: string[] | undefined;
  status_label: string;
  isAllowedRole: boolean;
}

type DialogType = 'actions' | 'report' | 'status' | 'submit' | 'activity' | 'investigation' | null;

type StatusType = 
| 'INCOMING'
| 'ASSESSMENT'
| 'UNDER-REVIEW'
| 'RECOMMEND-FOR-INVESTIGATION'
| 'ONGOING-INVESTIGATION'
| 'INVESTIGATION-COMPLETE'
| 'RECOMMEND-FOR-EXTERNAL-INVESTIGATION'
| 'EXTERNAL-INVESTIGATION'
| 'RECOMMEND-FOR-DISCIPLINARY'
| 'RECOMMEND-FOR-CLOSURE'
| 'ONGOING-DISCIPLINARY'
| 'CASE-CLOSED';

const ActionButtons: React.FC<ActionButtonsProps> = ({ recordId, userRole, current_status, investigation, preliminary_investigation }) => {
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [formData, setFormData] = useState({
    investigation_details: preliminary_investigation?.investigation_details ?? '',
    investigation_outcome: preliminary_investigation?.investigation_outcome ?? ''
  });

  const [invFormData, setInvFormData] = useState({
    investigating_officer: investigation.investigating_officer ?? '',
    police_station: investigation.police_station ?? '',
    cr_number: investigation.cr_number ?? '',
    offence: investigation.offence ?? '',
    outcome: investigation.outcome ?? '',
  })
  
  const router = useRouter();
  const { toast } = useToast();
  
  // Get status configuration
  const accessConfig: StatusAccessConfig = canUserAccessStatusFull(userRole, current_status) || {
    hasPermission: false,
    nextStatus: [],
    status_label: '',
    isAllowedRole: false
  };

  const { hasPermission, nextStatus, status_label, isAllowedRole } = accessConfig;

  const hasSingleStatus = Array.isArray(nextStatus) && nextStatus.length === 1;
  const hasMultipleStatuses = Array.isArray(nextStatus) && nextStatus.length > 1;
  const availableStatuses = nextStatus || [];

  // Helper functions
  const closeDialog = () => {
    setActiveDialog(null);
    setError('');
    setSelectedStatus('');
  };

  const showError = (message: string) => {
    setError(message);
    toast({
      title: "Error",
      description: message,
      variant: "destructive"
    });
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const result = await createReport(formData, recordId);
      if (result.code === 200 || result.code === 201) {
        closeDialog();
        window.location.reload();
      } else {
        showError(result.message || 'Failed to create report');
      }
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to create report');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInvestigationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await createInvestigationReport(invFormData, recordId);
      if(response.code == 200 || response.code == 201){
        closeDialog();
        window.location.reload();
      }else{
        showError(response.message || 'Failed to add investigation report')
      }
    } catch (error){
      showError(error instanceof Error ? error.message : 'Failed to add investigation report');
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleStatusUpdate = async (status: string) => {
    setIsSubmitting(true);
    try {
      const result = await updateComplaintStatus(recordId, status);
      if (result.code === 200 || result.code === 201) {
        closeDialog();
        toast({
          title: "Success",
          description: `Status updated to: ${status}`
        });
        router.refresh();
      } else {
        showError(result.message || 'Failed to update status');
      }
    } catch (error) {
      showError('Failed to update status');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render action button
  const renderActionButton = (
    icon: React.ElementType,
    label: string,
    onClick: () => void,
    colorClass: string
  ) => {
    const Icon = icon;
    return (
      <Button 
        variant="ghost" 
        className="w-full justify-start hover:bg-gray-100 rounded-lg px-4 py-2.5 transition-colors"
        onClick={onClick}
      >
        <div className="flex items-center">
          <div className={`h-8 w-8 rounded-full bg-${colorClass}-100 flex items-center justify-center mr-3`}>
            <Icon className={`w-4 h-4 text-${colorClass}-600`} />
          </div>
          <span className="font-medium">{label}</span>
        </div>
      </Button>
    );
  };

  // Render submit dialog content based on status count
  const renderSubmitContent = () => {


    const getStatusDescription = (status: StatusType): string => {
      const descriptions: Record<StatusType, string> = {
        'INCOMING': 'New case awaiting assessment',
        'ASSESSMENT': 'Assess case details and evidence ',
        'UNDER-REVIEW': 'Submit for Senior Officer review',
        'RECOMMEND-FOR-INVESTIGATION': 'Request to open investigation',
        'ONGOING-INVESTIGATION': 'Conduct active investigation',
        'INVESTIGATION-COMPLETE': 'Submit investigation findings',
        'RECOMMEND-FOR-EXTERNAL-INVESTIGATION': 'Request external body investigation',
        'EXTERNAL-INVESTIGATION': 'Monitor external investigation progress',
        'RECOMMEND-FOR-DISCIPLINARY': 'Submit for disciplinary action',
        'ONGOING-DISCIPLINARY': 'Track disciplinary proceedings',
        'RECOMMEND-FOR-CLOSURE': 'Submit closure recommendation',
        'CASE-CLOSED': 'Case processing complete'
      };
      return descriptions[status];
    };



    const getStatusIcon = (status: StatusType) => {
      const icons: Record<StatusType, JSX.Element> = {
        'INCOMING': <InboxIcon className="h-5 w-5 text-blue-500" />,
        'ASSESSMENT': <ClipboardCheck className="h-5 w-5 text-orange-500" />,
        'UNDER-REVIEW': <Search className="h-5 w-5 text-purple-500" />,
        'RECOMMEND-FOR-INVESTIGATION': <FileSearch className="h-5 w-5 text-yellow-500" />,
        'ONGOING-INVESTIGATION': <Microscope className="h-5 w-5 text-blue-600" />,
        'INVESTIGATION-COMPLETE': <CheckCircle2 className="h-5 w-5 text-green-500" />,
        'RECOMMEND-FOR-EXTERNAL-INVESTIGATION': <Building2 className="h-5 w-5 text-indigo-500" />,
        'EXTERNAL-INVESTIGATION': <Globe className="h-5 w-5 text-cyan-500" />,
        'RECOMMEND-FOR-DISCIPLINARY': <Scale className="h-5 w-5 text-red-500" />,
        'ONGOING-DISCIPLINARY': <Gavel className="h-5 w-5 text-red-600" />,
        'RECOMMEND-FOR-CLOSURE': <FolderClosed className="h-5 w-5 text-gray-500" />,
        'CASE-CLOSED': <CheckCircle2 className="h-5 w-5 text-green-500" />,
      };
      return icons[status] || null;
    };
    
    const getStatusColor = (status: StatusType) => {
      const colors: Record<StatusType, string> = {
        'INCOMING': 'bg-blue-50 text-blue-700',
        'ASSESSMENT': 'bg-orange-50 text-orange-700',
        'UNDER-REVIEW': 'bg-purple-50 text-purple-700',
        'RECOMMEND-FOR-INVESTIGATION': 'bg-yellow-50 text-yellow-700',
        'ONGOING-INVESTIGATION': 'bg-blue-50 text-blue-700',
        'INVESTIGATION-COMPLETE': 'bg-green-50 text-green-700',
        'RECOMMEND-FOR-EXTERNAL-INVESTIGATION': 'bg-indigo-50 text-indigo-700',
        'EXTERNAL-INVESTIGATION': 'bg-cyan-50 text-cyan-700',
        'RECOMMEND-FOR-DISCIPLINARY': 'bg-red-50 text-red-700',
        'ONGOING-DISCIPLINARY': 'bg-red-50 text-red-700',
        'RECOMMEND-FOR-CLOSURE': 'bg-gray-50 text-gray-700',
        'CASE-CLOSED': 'bg-gray-50 text-gray-700'
      };
      return colors[status] || 'bg-gray-50 text-gray-700';
    };

    interface StatusBadgeProps {
      status: StatusType;
    }

    const getStepDescription = (status: StatusType) => {
      switch(status){
        case 'INCOMING':
          return 'Investigation officer'
        case 'UNDER-REVIEW':
          return 'Senior Investigation officer'
        case 'ASSESSMENT':
          return 'Investigation manager'
        case 'ONGOING-INVESTIGATION':
          return 'Investigation team'
        case 'INVESTIGATION-COMPLETE':
          return 'Investigation manager'
        case 'RECOMMEND-FOR-INVESTIGATION':
          return 'Investigation director'
        case 'RECOMMEND-FOR-DISCIPLINARY':
          return 'Investigation director'
        case 'ONGOING-DISCIPLINARY':
          return 'Discplinary committe'
        case 'RECOMMEND-FOR-CLOSURE':
          return 'Investigation director'
        case 'RECOMMEND-FOR-EXTERNAL-INVESTIGATION':
          return 'Investigation director'
        case 'EXTERNAL-INVESTIGATION':
          return 'Investigation manager'
        case 'CASE-CLOSED':
          return 'Investigation Completed'
        default:
          return 'Select an action'
      }
    }
    
    const StatusBadge = ({ status }: StatusBadgeProps) => {
      return (
        <Badge 
          className={cn(
            "flex items-center gap-2 px-3 py-1",
            getStatusColor(status)
          )}
        >
          {getStatusIcon(status)}
          <span>{status.replace(/-/g, ' ')}</span>
        </Badge>
      );
    };

    if (hasSingleStatus && availableStatuses[0]) {
      return (
        <AlertDialogContent className="sm:max-w-[500px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900">
              {status_label}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600">
              <div className="flex items-center gap-2">
                {getStatusIcon(availableStatuses[0] as StatusType)}
                <span className="font-medium text-blue-900 group-hover:text-blue-800 transition-colors">
                  {getStepDescription(availableStatuses[0] as StatusType)}
                </span>
              </div>
              <p className="text-sm text-blue-600 group-hover:text-blue-700 transition-colors mt-1">
                {getStatusDescription(availableStatuses[0].toUpperCase() as StatusType)}
              </p>
              {/* This action will update the status to{" "}
              <span className="font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                {availableStatuses[0].replace(/-/g, ' ').toLowerCase()}
              </span> */}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {error && (
            <div className="p-4 rounded-lg border border-red-200 bg-red-50 transition-all duration-200">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <p className="ml-3 text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          )}
    
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel 
              onClick={closeDialog}
              className="text-slate-600 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </AlertDialogCancel>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200
                flex items-center justify-center gap-2 min-w-[100px]
                disabled:bg-blue-300"
              onClick={() => handleStatusUpdate(availableStatuses[0])}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Submit</span>
                </>
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      );
    }

    return (
      <DialogContent className="sm:max-w-[400px] md:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{status_label}</DialogTitle>
          <DialogDescription>Select the next step for this case</DialogDescription>
        </DialogHeader>
        {error && (
          <div className="p-4 rounded-md bg-red-50">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <p className="ml-3 text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}
        <div className="space-y-4">
          <div className="space-y-2">
            {/* <Label>Allocate</Label> */}

            <RadioGroup 
                value={selectedStatus} 
                onValueChange={setSelectedStatus}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
              {availableStatuses.map((status) => (
                <div key={status}>
                  <RadioGroupItem
                    value={status}
                    id={status}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={status}
                    className="group flex flex-col items-start justify-between rounded-lg border-2 border-muted bg-popover p-4 
                      transition-all duration-200 ease-in-out
                      hover:bg-blue-50 hover:border-blue-200
                      peer-data-[state=checked]:border-blue-500 [&:has([data-state=checked])]:border-blue-500 
                      cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      {getStatusIcon(status as StatusType)}
                      <span className="font-medium text-blue-900 group-hover:text-blue-800 transition-colors">
                        {getStepDescription(status as StatusType)}
                      </span>
                    </div>
                    <p className="text-sm text-blue-600 group-hover:text-blue-700 transition-colors mt-1">
                      {getStatusDescription(status.toUpperCase() as StatusType)}
                    </p>
                    <p className="text-xs text-blue-400 group-hover:text-blue-500 transition-colors italic">
                      STATUS: {status}
                    </p>
                  </Label>
                </div>
              ))}
            </RadioGroup>
            
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button
              onClick={() => handleStatusUpdate(selectedStatus)}
              disabled={isSubmitting || !selectedStatus}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    );
  };
  const preliminary_investigation_statuses = ['INCOMING','UNDER-REVIEW','ASSESSMENT']

  return (
    <>
      <Button 
        onClick={() => setActiveDialog('actions')}
        className="bg-blue-500 hover:bg-blue-600 text-white flex items-center space-x-2"
      >
        <span>Actions</span>
        <ChevronDownIcon className="h-4 w-4" />
      </Button>

      {/* Actions Dialog */}
      <Dialog open={activeDialog === 'actions'} onOpenChange={() => closeDialog()}>
        <DialogContent className="sm:max-w-[350px] p-0 overflow-hidden">
          <DialogHeader className="px-6 py-2 border-b bg-gray-50">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Actions
            </DialogTitle>
          </DialogHeader>
          <div className="px-2 py-3">
            <div className="space-y-1">
              {hasPermission && availableStatuses.length > 0 && (
                renderActionButton(
                  hasSingleStatus ? Send : UserPlus2,
                  status_label,
                  () => setActiveDialog('submit'),
                  'blue'
                )
              )}
              <Separator/>
              {renderActionButton(
                PlusCircle,
                'Add an Activity',
                () => setActiveDialog('activity'),
                'green'
              )}
              <Separator/>
              {preliminary_investigation_statuses.includes(current_status) && renderActionButton(
                PlusCircle,
                'Add Preliminary Report',
                () => setActiveDialog('report'),
                'amber'
              )}
              {/* <Separator/>
              {renderActionButton(
                PlusCircle,
                'Add Investigation Report',
                () => setActiveDialog('investigation'),
                'blue'
              )}
              <Separator/>
              {renderActionButton(
                Edit,
                'Edit',
                () => window.open(`/trls/work/investigation/edit/${recordId}`, '_self'),
                'red'
              )} */}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      {activeDialog === 'submit' && (
        hasSingleStatus ? (
          <AlertDialog open={true} onOpenChange={() => closeDialog()}>
            {renderSubmitContent()}
          </AlertDialog>
        ) : (
          <Dialog open={true} onOpenChange={() => closeDialog()}>
            {renderSubmitContent()}
          </Dialog>
        )
      )}

      {/* Pre-Investigation Details Dialog */}
      <Dialog open={activeDialog === 'report'} onOpenChange={() => closeDialog()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Preliminary Investigation Details</DialogTitle>
            <DialogDescription>
              Update the preliminary investigation details and outcome below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleReportSubmit} className="space-y-4">
            {error && (
              <div className="p-4 rounded-md bg-red-50">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <p className="ml-3 text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label>Preliminary Investigation Details</Label>
              <Textarea
                value={formData.investigation_details}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  investigation_details: e.target.value 
                }))}
                placeholder="Enter investigation details..."
                rows={4}
                className="resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label>Preliminary Investigation Outcome</Label>
              <Select
                value={formData.investigation_outcome}
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  investigation_outcome: value 
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select outcome" />
                </SelectTrigger>
                <SelectContent>
                  {['Under review', 'In progress', 'Completed', 'On hold', 'Closed'].map(outcome => (
                    <SelectItem key={outcome} value={outcome}>
                      {outcome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting || !formData.investigation_details || !formData.investigation_outcome}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Report
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Investigation Dialog */}
      <Dialog open={activeDialog === 'investigation'} onOpenChange={() => closeDialog()}>
        <DialogContent className="sm:max-w-[500px] md:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Update Investigation Details</DialogTitle>
            <DialogDescription>
              Update the investigation details below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleInvestigationSubmit} className="space-y-4">
            {error && (
              <div className="p-4 rounded-md bg-red-50">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <p className="ml-3 text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}
            <div className='grid md:grid-cols-2 gap-6'>
              <div className="space-y-2">
                <Label>Investigation Officer</Label>
                <Input
                  value={invFormData.investigating_officer ?? ''}
                  onChange={(e) => setInvFormData(prev => ({
                    ...prev,
                    investigating_officer: e.target.value
                  }))}
                  placeholder='Enter investigation officer name'
                  className=''
                />
              </div>
              <div className="space-y-2">
                <Label>Police Station</Label>
                <Input
                  value={invFormData.police_station ?? ''}
                  onChange={(e) => setInvFormData(prev => ({
                    ...prev,
                    police_station: e.target.value
                  }))}
                  placeholder='Enter police station'
                  className=''
                />
              </div>
              <div className="space-y-2">
                <Label>CR Number</Label>
                <Input
                  value={invFormData.cr_number ?? ''}
                  onChange={(e) => setInvFormData(prev => ({
                    ...prev,
                    cr_number: e.target.value
                  }))}
                  placeholder='Enter CR Number'
                  className=''
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Offence</Label>
              <Textarea
                value={invFormData.offence}
                onChange={(e) => setInvFormData(prev => ({ 
                  ...prev, 
                  offence: e.target.value 
                }))}
                placeholder="Enter offence details..."
                rows={2}
                className="resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label>Outcome</Label>
              <Textarea
                value={invFormData.outcome}
                onChange={(e) => setInvFormData(prev => ({ 
                  ...prev, 
                  outcome: e.target.value 
                }))}
                placeholder="Enter outcome details..."
                rows={2}
                className="resize-none"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting || !formData.investigation_details || !formData.investigation_outcome}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Report
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Activity Modal */}
      <Dialog open={activeDialog === 'activity'} onOpenChange={() => closeDialog()}>
        <DialogContent className="sm:max-w-[500px] md:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Update Investigation Details</DialogTitle>
            <DialogDescription>
              Update the investigation details below.
            </DialogDescription>
          </DialogHeader>
          <ActivityModal 
            onClose={() => closeDialog()} 
            recordId={recordId}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ActionButtons;