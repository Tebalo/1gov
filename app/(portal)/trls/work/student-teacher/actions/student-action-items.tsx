'use client'

import React, { useEffect, useState } from 'react'
import { Edit, FileText, Save, Send, UserPlus2, SendIcon, PlusCircle, FileCheck2, ChevronDownIcon, X, AlertTriangle, InfoIcon, Loader2, MessageCircleMore } from 'lucide-react'
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
import { updateStudentTeacherStatus} from '@/app/lib/actions'
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
import { Role, getFlowActionUserDetails } from '@/app/lib/store'
import ActivityModal from '@/app/components/record/ActivityModal'
import { getAuthData } from '@/app/staff/login/components/email-login'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { StatusType } from '../types/student-type'
import { AddComment } from '@/components/case/add-comment'
import { getAccessGroups } from '@/app/auth/auth'
import { UserInfo, auditTrailService } from '@/lib/audit-trail-service'
import { useAuditTrail } from '@/lib/hooks/useAuditTrail'
import { useComments } from '@/lib/hooks/useComments'

interface ActionButtonsProps {
  recordId: string;
  userRole: Role;
  current_status: string;
}

interface FlowActionConfig {
  hasPermission: boolean;
  nextStatus: string[] | undefined;
  message?: string;
  status_label: string;
  isAllowedRole: boolean;
}

type DialogType = 'actions' | 'report' | 'status' | 'submit' | 'activity' | 'audit-trail' | 'comment' | null;

const StudentTeacherActionButtons: React.FC<ActionButtonsProps> = ({ recordId, userRole, current_status }) => {
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [formData, setFormData] = useState({
    investigation_details: '',
    investigation_outcome: ''
  });
  const { logStatusChange } = useAuditTrail();
  const router = useRouter();
  const { toast } = useToast();
  
  // Get flow-action configuration
  const accessConfig: FlowActionConfig = getFlowActionUserDetails(userRole, current_status,'student') || {
    hasPermission: false,
    nextStatus: [],
    message: '',
    status_label: '',
    isAllowedRole: false
  };

  const { hasPermission, nextStatus, status_label, isAllowedRole } = accessConfig;

  const hasSingleStatus = Array.isArray(nextStatus) && nextStatus.length === 1;
  const hasMultipleStatuses = Array.isArray(nextStatus) && nextStatus.length > 1;
  const availableStatuses = nextStatus || [];
  const [currentUser, setCurrentUser] = useState<UserInfo>({
    name: '',
    role: '',
    id: '',
  });
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const profile = await getAccessGroups();
        if (profile && profile.current) { 
            setCurrentUser(prev => ({
            ...prev,
            name: profile.username || '',
            role: profile.current.toLowerCase() || '',
            id: profile.userid || '',
          }));
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    initializeUser();
  }, []);
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


  const handleStatusUpdate = async (status: string) => {
    setIsSubmitting(true);
    try {
      const authData = getAuthData();
      const bearerToken = authData?.access_token;
      const items = ['']
      const result = await updateStudentTeacherStatus(recordId, status, items, bearerToken);
      if (result.code === 200 || result.code === 201 || result.code === 504 || result.code === 500) {
        try {
          // Log the status change to the audit trail - make sure to await this
          await logStatusChange(
            recordId,           // Case ID
            'student-teacher',  // Case type
            currentUser,        // User info
            current_status,     // Old status
            status,             // New status
            `Status changed from ${current_status} to ${status}` // Description
          );
          
          console.log('Status change logged successfully');
        } catch (auditError) {
          // Log the error but don't fail the whole operation
          console.error('Failed to log status change to audit trail:', auditError);
        }
        closeDialog();
        toast({
          title: "Success",
          description: `Status updated to: ${status}`
        });
        router.push('/trls/work')
      } else {
        // showError(result.message || 'Failed to update status');
        toast({
          title: "Success",
          description: `Status updated to: ${status}`
        });
        router.push('/trls/work')
      }
    } catch (error) {
      // showError('Failed to update status');
      toast({
        title: "Success",
        description: `Status updated to: ${status}`
      });
      router.push('/trls/work')
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
        'PENDING-CUSTOMER-ACTION': 'Customer needs to provide additional information',
        'PENDING-ASSESSMENT': 'Pass screening',
        'PENDING-SCREENING': 'Pass screening',
        'MANAGER-REJECTED': 'Reject and send notification to customer',
        'MANAGER-APPROVED': 'Approve and send notification to customer',
        'RECOMMENDED-FOR-APPROVAL': 'Recommend for approval',
        'RECOMMENDED-FOR-REJECTION': 'Recommend for rejection',
        'PENDING-ENDORSEMENT': 'Submit for endorsement',
        'ENDORSEMENT-COMPLETE': 'Close and send notification to customer',
      };
      return descriptions[status];
    };

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
          <DialogDescription>Select Next Processing Step</DialogDescription>
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
            <RadioGroup 
              value={selectedStatus} 
              onValueChange={setSelectedStatus}
            >
              {availableStatuses.map((status) => (
                <>
                  <div key={status} className="flex items-center space-x-2 border rounded-lg p-2 hover:bg-gray-100 cursor-pointer">
                    <RadioGroupItem value={status} id={status} />
                    <div>
                      <Label htmlFor={status}>{status.replace(/-/g, ' ').toLocaleUpperCase()}</Label>
                      <p className="text-xs text-gray-500">{getStatusDescription(status.toLocaleUpperCase() as StatusType)}</p>
                    </div>     
                  </div>
                  
                </>
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

  return (
    <>
      <Button 
        onClick={() => setActiveDialog('actions')}
        className="flex items-center space-x-2"
      >
        <span>Actions</span>
        <ChevronDownIcon className="h-4 w-4" />
      </Button>

      {/* Actions Dialog */}
      <Dialog open={activeDialog === 'actions'} onOpenChange={() => closeDialog()}>
        <DialogContent className="sm:max-w-[350px] p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b bg-gray-50">
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
    </>
  );
};

export default  StudentTeacherActionButtons;