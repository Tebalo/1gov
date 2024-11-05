'use client'

import React, { useState } from 'react'
import { Edit, Trash2, Save, PlusCircleIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useAssetActions } from '@/lib/hooks/useAssetAction'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createActivity, createReport } from '@/app/lib/actions'

interface ActionButtonsProps {
  caseCode: string;
  currentData?: {
    investigation_details: string;
    investigation_outcome: string;
  };
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ caseCode, currentData }) => {
  const { handleUpdate, handleDelete, isDeleting } = useAssetActions(caseCode)
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    investigation_details: '',
    investigation_outcome: ''
  })

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
    await createReport(formData, caseCode)
    setIsOpen(false)
  }

  return (
    <div className="flex justify-end space-x-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            <PlusCircleIcon className="w-4 h-4 mr-2" /> Add Report
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Investigation Details</DialogTitle>
            <DialogDescription>
              Update the investigation details and outcome below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Button onClick={handleUpdate} className="bg-blue-500 hover:bg-blue-600 text-white">
        <Edit className="w-4 h-4 mr-2" /> Update
      </Button>
    </div>
  )
}

export default ActionButtons