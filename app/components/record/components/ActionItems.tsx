'use client'

import React, { useState } from 'react'
import { Edit, FileText, RefreshCw, Save, PlusCircleIcon, ChevronDown, ChevronDownIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createReport, updateComplaintStatus } from '@/app/lib/actions'
import { useRouter } from 'next/navigation'

interface ActionButtonsProps {
  recordId: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ recordId }) => {
  const [isActionsOpen, setIsActionsOpen] = useState(false)
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [isStatusOpen, setIsStatusOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmittingReport, setIsSubmittingReport] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  
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
      console.error('Failed to create report:', error)
      setError(errorMessage)
    } finally {
      setIsSubmittingReport(false)
    }
  }

  const handleAddReport = () => {
    setIsActionsOpen(false)
    setIsReportOpen(true)
  }

  const handleStatusChange = (value: string) => {
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
      setError('Failed to update status')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusDialog = () => {
    setIsActionsOpen(false)
    setIsStatusOpen(true)
  }

  const handleUpdate = () => {
    console.log('clicked')
    window.open(`/trls/work/investigation/edit/${recordId}`, '_self')
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
        <DialogContent className="sm:max-w-[300px]">
          <DialogHeader>
            <DialogTitle>Actions</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-3">

            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={handleStatusDialog}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Update Status
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={handleAddReport}
            >
              <FileText className="w-4 h-4 mr-2" />
              Add Report
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {handleUpdate}}
            >
              <Edit className="w-4 h-4 mr-2" />
              Update Record
            </Button>
          
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
              disabled={isSubmittingReport || !status}
              >
                <Save className="w-4 h-4 mr-2" /> 
                {isSubmitting ? 'Saving...': 'Save Changes' }
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={isStatusOpen} onOpenChange={setIsStatusOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
            <DialogDescription>
              Select the new status for this record.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateStatus} className="space-y-4">
            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="Incoming">Incoming</SelectItem>
                    <SelectItem value="Registered">Registered</SelectItem>
                    <SelectItem value="Under-Review">Under-Review</SelectItem>
                    <SelectItem value="Assessment">Assessment</SelectItem>
                    <SelectItem value="Ongoing-investigation">Ongoing-investigation</SelectItem>
                    <SelectItem value="Complete-investigations">Complete-investigations</SelectItem>
                    <SelectItem value="Recommend for closure">Recommend for closure</SelectItem>
                    <SelectItem value="Recommend for re-investigation">Recommend for re-investigation</SelectItem>
                    <SelectItem value="Recommend for Disciplinary">Recommend for Disciplinary</SelectItem>
                    <SelectItem value="Approve endorsement">Approve endorsement</SelectItem>
                    <SelectItem value="Reject endorsement">Approve endorsement</SelectItem>
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
                {isSubmitting ? 'Updating...' : 'Update Status'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ActionButtons