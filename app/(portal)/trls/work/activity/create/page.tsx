'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import InfoCard from '@/app/components/InfoCard'
import { FileCheck, Info, SaveIcon } from 'lucide-react'
import { createActivity } from '@/app/lib/actions'
import { ActivityPayload } from '@/app/lib/types'


const initialState: ActivityPayload = {
  activities: '',
  action_taken: '',
  record_type: '',
  record_id: ''
}

export default function CreateActivityPage() {
  const router = useRouter()
  const [activityDetails, setActivityDetails] = useState<ActivityPayload>(initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setActivityDetails(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (value: string) => {
    setActivityDetails(prev => ({
      ...prev,
      record_type: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const res = await createActivity(activityDetails)

      if (res.code === 200 || res.code === 201) {
        router.push('/trls/home')
      } else {
        setError(res.message || 'Failed to submit activity')
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred while submitting the activity'
      console.error('Failed to submit activity:', error)
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
      <div className="mb-4 flex-shrink-0 shadow-md">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold text-gray-800">
            Submit Activity
          </h1>
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} onClick={handleSubmit}>
              <SaveIcon className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </div>
        <div className="mt-2 h-1 w-full bg-blue-400 rounded-full"></div>
      </div>

      <div className="flex-grow overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="text-red-500 mb-4">
              {error}
            </div>
          )}

          {/* Activity Details */}
          <InfoCard title="Activity Information" icon={<Info className="w-6 h-6 text-blue-500"/>}>
            <div>
              <label htmlFor="activities" className="block text-sm font-medium text-gray-700">Activities</label>
              <Textarea
                id="activities"
                name="activities"
                value={activityDetails.activities}
                onChange={handleInputChange}
                required
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="action_taken" className="block text-sm font-medium text-gray-700">Action Taken</label>
              <Textarea
                id="action_taken"
                name="action_taken"
                value={activityDetails.action_taken}
                onChange={handleInputChange}
                required
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </InfoCard>

          {/* Record Information */}
          <InfoCard title="Record Information" icon={<FileCheck className="w-6 h-6 text-blue-500"/>}>
            <div>
              <label htmlFor="record_type" className="block text-sm font-medium text-gray-700">Record Type</label>
              <Select
                value={activityDetails.record_type}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select record type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COMPLAINT">Complaint</SelectItem>
                  <SelectItem value="INVESTIGATION">Investigation</SelectItem>
                  <SelectItem value="REGISTRATION">REGISTRATION</SelectItem>
                  <SelectItem value="TIPOFF">Tip-off</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="record_id" className="block text-sm font-medium text-gray-700">Record ID</label>
              <Input
                type="text"
                id="record_id"
                name="record_id"
                value={activityDetails.record_id || ''}
                onChange={handleInputChange}
                required
              />
            </div>
          </InfoCard>
        </form>
      </div>
    </div>
  )
}