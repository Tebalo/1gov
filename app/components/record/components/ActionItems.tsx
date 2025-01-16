'use client'

import React, { useState } from 'react'
import { Edit, FileText, Save, Send, UserPlus2, SendIcon, PlusCircle, FileCheck2, ChevronDownIcon, X, AlertTriangle, InfoIcon, Loader2 } from 'lucide-react'
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
    if (hasSingleStatus && availableStatuses[0]) {
      return (
        <AlertDialogContent className="sm:max-w-[500px]">
          <AlertDialogHeader>
            <AlertDialogTitle>{status_label}</AlertDialogTitle>
            <AlertDialogDescription>
              This action will update the status to <span className="font-medium text-green-600">{availableStatuses[0]}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error && (
            <div className="p-4 rounded-md bg-red-50">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <p className="ml-3 text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDialog}>Cancel</AlertDialogCancel>
            <Button
              className="bg-blue-700 hover:bg-blue-800"
              onClick={() => handleStatusUpdate(availableStatuses[0])}
              disabled={isSubmitting}
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
          </AlertDialogFooter>
        </AlertDialogContent>
      );
    }

    return (
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{status_label}</DialogTitle>
          <DialogDescription>Select the next step for this record</DialogDescription>
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
            <Label>Allocate</Label>
            <Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select next step" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {availableStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.replace(/-/g, ' ').toLocaleLowerCase()}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
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
              {renderActionButton(
                PlusCircle,
                'Add Preliminary Report',
                () => setActiveDialog('report'),
                'amber'
              )}
              <Separator/>
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
              )}
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
      {activeDialog === 'activity' && (
        <ActivityModal 
          onClose={() => closeDialog()} 
          recordId={recordId}
        />
      )}
    </>
  );
};

export default ActionButtons;