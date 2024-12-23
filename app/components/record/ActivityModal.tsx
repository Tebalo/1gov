"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InfoCard from '@/app/components/InfoCard';
import { FileCheck, Info, User, SaveIcon } from 'lucide-react';
import { createActivity } from '@/app/lib/actions';
import { ActivityPayload } from '@/app/lib/types';
import { getAccessGroups } from '@/app/auth/auth';
import InfoCardTwo from '../InfoCardTwoColumn';
import { useToast } from '@/components/ui/use-toast';

interface ActivityModalProps {
    onClose: () => void;
    recordId: string;
}

const ActivityModal: React.FC<ActivityModalProps> = ({ onClose, recordId }) => {
  const router = useRouter();
  const [activityDetails, setActivityDetails] = useState<ActivityPayload>({
    full_name: '',
    role: '',
    activities: '',
    action_taken: '',
    record_type: '',
    anonymous: 'false',
    submission_type: 'Walk-In',
    userid: '',
    record_id: recordId,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const profile = await getAccessGroups();
        if (profile && profile.current) {  // Add null check
          setActivityDetails(prev => ({
            ...prev,
            full_name: profile.username || '',
            role: profile.current.toLowerCase(),
            userid: profile.userid || '',
          }));
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    initializeUser();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setActivityDetails(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (field: string) => (value: string) => {
    setActivityDetails(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    
    try {
      const res = await createActivity(activityDetails)

      if (res.code === 200 || res.code === 201) {
        toast({
          title: "Success",
          description: "Activity submitted successfully",
          variant: "default",
        });
        router.refresh();
        onClose();
      } else {
        toast({
          title: "Error",
          description: res.message || 'Failed to submit activity',
          variant: "destructive",
        });
        setError(res.message || 'Failed to submit activity');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl h-[72vh] overflow-y-auto">
      <div className="mb-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Submit Activity</h1>
            <div>      
                <Button type="button" variant="ghost" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} onClick={handleSubmit}>
                <SaveIcon className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
            </div>
        </div>
        {/* Render the 'Submit Activity' form here */}
        <div className="flex-grow">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="text-red-500 mb-4">
              {error}
            </div>
          )}

          {/* User Information */}
          <InfoCard title="User Information" icon={<User className="w-6 h-6 text-blue-500"/>}>
            <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <Input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={activityDetails.full_name}
                  readOnly
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                <Input
                  type="text"
                  id="role"
                  name="role"
                  value={activityDetails.role}
                  readOnly
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <label htmlFor="userid" className="block text-sm font-medium text-gray-700">User ID</label>
                <Input
                  type="text"
                  id="userid"
                  name="userid"
                  value={activityDetails.userid}
                  readOnly
                  disabled
                  className="bg-gray-50"
                />
              </div>
          </InfoCard>

          {/* Activity Details */}
          <InfoCardTwo title="Activity Information" icon={<Info className="w-6 h-6 text-blue-500"/>}>
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
          </InfoCardTwo>

          {/* Record Information */}
          <InfoCardTwo title="Record Information" icon={<FileCheck className="w-6 h-6 text-blue-500"/>}>
            <div>
              <label htmlFor="record_type" className="block text-sm font-medium text-gray-700">Record Type</label>
              <Select value={activityDetails.record_type} onValueChange={handleSelectChange('record_type')}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select record type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="complaint">Complaint</SelectItem>
                  {/* <SelectItem value="continuous professional development">Continuous Professional Development</SelectItem> */}
                  <SelectItem value="investigation">Investigation</SelectItem>
                  {/* <SelectItem value="registration">Registration</SelectItem> */}
                  {/* <SelectItem value="tip-off">Tip-off</SelectItem> */}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="record_id" className="block text-sm font-medium text-gray-700">Record ID</label>
              <Input
                type="text"
                id="record_id"
                name="record_id"
                value={activityDetails.record_id}
                onChange={handleInputChange}
                readOnly
                disabled
              />
            </div>
          </InfoCardTwo>
        </form>
      </div>
      </div>
    </div>
  );
};

export default ActivityModal;