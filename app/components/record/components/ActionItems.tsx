'use client'

import React, { useState } from 'react'
import { Edit, FileText, RefreshCw, Save, Send, PlusCircleIcon, ChevronDown, ChevronDownIcon, UserPlus2, SendIcon, PlusCircle } from 'lucide-react'
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
import { createReport, updateComplaintStatus } from '@/app/lib/actions'
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
import { Loader2 } from 'lucide-react'
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast'
import { investigationStatuses } from '@/app/lib/store'
import ActivityModal from '../ActivityModal'

interface ActionButtonsProps {
  recordId: string;
  access: string;
  next_status: string | null;
  label?: string | null;
  allocate?: boolean | false;
  submit?: boolean | false;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ recordId, access, next_status, label, allocate, submit }) => {
  const [isActionsOpen, setIsActionsOpen] = useState(false)
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [isStatusOpen, setIsStatusOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmittingReport, setIsSubmittingReport] = useState(false)
  const [isSubmitOpen, setIsSubmitOpen] = useState(false)
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  const [error, setError] = useState('')
  const router = useRouter()
  const {toast} = useToast()
  
  const [formData, setFormData] = useState({
    investigation_details: '',
    investigation_outcome: ''
  })

  const [status, setStatus] = useState('')

  const handleDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      investigation_details: e.target.value
    }))
  }

  const handleOutcomeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      investigation_outcome: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingReport(true) 
    setError('')
 
    try {
      const result = await createReport(formData, recordId)
      if (result.code === 200 || result.code === 201) {
        setIsReportOpen(false)
        window.location.reload()
      } else {
        setError(result.message || 'Failed to create report')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create report'
      // console.error('Failed to create report:', error)
      setError(errorMessage)
    } finally {
      setIsSubmittingReport(false)
    }
  }

  const handleAddReport = () => {
    setError('')
    setIsActionsOpen(false)
    setIsReportOpen(true)
  }

  const handleAddSubmission = () => {
    setError('')
    setIsActionsOpen(false)
    setIsSubmitOpen(true)
  }

  const handleStatusChange = (value: string) => {
    setError('')
    setStatus(value)
  }

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const result = await updateComplaintStatus(recordId.toString(), status)
      if (result.code === 200 || result.code === 201) {
        setIsStatusOpen(false)
 
        window.location.reload()
      } else {
        setError(result.message)
      }
    } catch (error) {
      //setIsSubmitOpen(false)
      setError('Failed to update status')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusDialog = () => {
    setError('')
    setIsActionsOpen(false)
    setIsStatusOpen(true)
  }

  const handleAddActivity = () => {
    setIsActionsOpen(false);
    setIsActivityModalOpen(true);
  };

  const handleCloseActivityModal = () => {
    setIsActivityModalOpen(false);
  };

  const handleSingleStatusChange = async (ID: string, status: string) => {
    setIsSubmitting(true)
    setError('')
    
    try {
      const result = await updateComplaintStatus(ID, status)
      if (result.code === 200 || result.code === 201) {
        setIsSubmitOpen(false)
        toast({
          title: "Routed successfully",
          description: "The record has been routed with the status: "+status,
          action: (
          <ToastAction altText="Ok">Ok</ToastAction>
          ),
        })
        router.refresh()
      } else {
        toast({
          title: "Failed!!!",
          description: "Something went wrong",
          action: (
          <ToastAction altText="Ok">Ok</ToastAction>
          ),
        })
        setError((result.message || 'Failed to update status')+'Try again.')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update status, Try again.'
      //console.error('Failed to update status:', error)
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = () => {
    setError('')
    setIsActionsOpen(false)  // Close actions dialog first
    window.open(`/trls/work/investigation/edit/${recordId}`, '_self')
  }

  const hasAccess = (itemRoles: string[]) => {
    return itemRoles.includes("*") || itemRoles.includes(access.toLowerCase())
  }

  return (
    <>
      <Dialog open={isActionsOpen} onOpenChange={setIsActionsOpen}>
        <Button 
            onClick={() => setIsActionsOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white flex items-center space-x-2"
          >
            <span>Actions</span>
            <ChevronDownIcon  className="h-4 w-4" />
        </Button>
        <DialogContent className="sm:max-w-[350px] p-0 overflow-hidden">
            <DialogHeader className="px-6 py-4 border-b bg-gray-50">
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Actions 
              </DialogTitle>
            </DialogHeader>
            <div className="px-2 py-3">
              <div className="space-y-1">
                {/* Allocate */}
                {allocate && <Button 
                  variant="ghost" 
                  className="w-full justify-start hover:bg-gray-100 rounded-lg px-4 py-2.5 transition-colors"
                  onClick={handleStatusDialog}
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <UserPlus2 className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-medium">Allocate</span>
                  </div>
                </Button>}

                {/* Submit for \\status// */}
                {submit && <Button 
                  variant="ghost" 
                  className="w-full justify-start hover:bg-gray-100 rounded-lg px-4 py-2.5 transition-colors"
                  onClick={handleAddSubmission}
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <SendIcon className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="font-medium">Submit for {label}</span>
                  </div>
                </Button>}

                {/* Add Activity */}
                <Button
                  variant="ghost"
                  className="w-full justify-start hover:bg-gray-100 rounded-lg px-4 py-2.5 transition-colors"
                  onClick={handleAddActivity}
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <PlusCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="font-medium">Add Activity</span>
                  </div>
                </Button>

                {/* Add Report */}
                <Button 
                  variant="ghost" 
                  className="w-full justify-start hover:bg-gray-100 rounded-lg px-4 py-2.5 transition-colors"
                  onClick={handleAddReport}
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                      <FileText className="w-4 h-4 text-amber-600" />
                    </div>
                    <span className="font-medium">Add Report</span>
                  </div>
                </Button>

                {/* Update Record */}
                <Button 
                  variant="ghost" 
                  className="w-full justify-start hover:bg-gray-100 rounded-lg px-4 py-2.5 transition-colors"
                  onClick={handleUpdate}
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                      <Edit className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="font-medium">Update Record</span>
                  </div>
                </Button>
              </div>
            </div>
        </DialogContent>
      </Dialog>

      {/* Report Dialog */}
      <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Investigation Details</DialogTitle>
            <DialogDescription>
              Update the investigation details and outcome below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="text-red-500 text-sm">
                  {error}
                </div>
              )}
            <div className="space-y-2">
              <Label htmlFor="investigation_details">Investigation Details</Label>
              <Textarea
                id="investigation_details"
                value={formData.investigation_details}
                onChange={handleDetailsChange}
                placeholder="Enter investigation details..."
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="investigation_outcome">Investigation Outcome</Label>
              <Select
                value={formData.investigation_outcome}
                onValueChange={handleOutcomeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select outcome" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Under review">Under review</SelectItem>
                  <SelectItem value="In progress">In progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="On hold">On hold</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsReportOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={
                  isSubmittingReport || 
                  !formData.investigation_details || 
                  !formData.investigation_outcome
                }
              >
                <Send className="w-4 h-4 mr-2" /> 
                {isSubmittingReport ? 'Submitting...' : 'Submit report'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={isStatusOpen} onOpenChange={setIsStatusOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Allocate</DialogTitle>
            <DialogDescription>
              Select allocation for this record.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateStatus} className="space-y-4">
            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="status">Allocate to</Label>
              <Select
                value={status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Allocate to" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {investigationStatuses
                      .filter(item => hasAccess(item.access))
                      .map((item) => (
                        <SelectItem 
                          key={item.value} 
                          value={item.value}
                        >
                          {item.label}
                        </SelectItem>
                      ))
                    }
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsStatusOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting || !status}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Allocating...' : 'Allocate'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* Submit Dialog */}
      <AlertDialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
          <AlertDialogContent className="sm:max-w-[500px]">
            <AlertDialogHeader>
              <AlertDialogTitle>Submit for {next_status}</AlertDialogTitle>
              <AlertDialogDescription>
                This action will change the status to <span className='italic font-medium'>{next_status}</span>, and this will route the application to the next level.
              </AlertDialogDescription>
            </AlertDialogHeader>
            {error && (
              <div className="text-red-500 text-sm mt-4">
                {error}
              </div>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel 
                onClick={() => setIsSubmitOpen(false)}
              >
                Cancel
              </AlertDialogCancel>
              <Button
                className="bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                onClick={() => handleSingleStatusChange(recordId, next_status!)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
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
      </AlertDialog>
      {/* Activity Dialog */}
      {isActivityModalOpen && (
        <ActivityModal onClose={handleCloseActivityModal} recordId={recordId}/>)}
    </>
  )
}

export default ActionButtons