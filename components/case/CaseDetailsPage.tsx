// Example usage in a case details page
// /components/CaseDetailsPage.tsx
'use client';

import React, { useState } from 'react';
// import { CaseLockIndicator, CaseLockProvider, useCaseLockContext } from '@/components/case/CaseLockIndicator';
import { Save, Edit, X } from 'lucide-react';
import { CaseLockProvider, useCaseLockContext } from './case-lock-provider';
import { CaseLockIndicator } from './case-lock-indicator';
import { tr } from '@faker-js/faker';

interface CaseDetailsPageProps {
  caseId: string;
  caseType: string;
  userId: string;
  initialData: {
    title: string;
    status: string;
    description: string;
  };
}

// Internal component that uses the lock context
const CaseForm: React.FC<{
  initialData: any;
  onSave: (data: any) => Promise<void>;
}> = ({ initialData, onSave }) => {
  const { canEdit, releaseLock } = useCaseLockContext();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      setIsEditing(false);
      // Release lock after successful save
      await releaseLock();
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialData);
    setIsEditing(false);
  };

  if (!canEdit) {
    return (
      <div className="space-y-4 opacity-75">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900">{formData.title}</h3>
          <p className="text-sm text-gray-600 mt-1">Status: {formData.status}</p>
          <p className="text-gray-700 mt-2">{formData.description}</p>
        </div>
        <div className="text-sm text-gray-500 italic">
          This case is locked for editing by another user.
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-900">{formData.title}</h3>
        <p className="text-sm text-gray-600 mt-1">Status: {formData.status}</p>
        <p className="text-gray-700 mt-2">{formData.description}</p>
      </div>
      
      <button
        onClick={() => setIsEditing(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        <Edit className="h-4 w-4" />
        Edit Case
      </button>
    </div>
  );
};

// Main component with lock provider
export const CaseDetailsPage: React.FC<CaseDetailsPageProps> = ({
  caseId,
  caseType,
  userId,
  initialData,
}) => {
  const handleSave = async (data: any) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Saving case data:', data);
    // Here you would make your actual API call to save the case
  };

  return (
    <CaseLockProvider
      caseId={caseId}
      caseType={caseType}
      userId={userId}
      autoAcquire={false}
    >
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Case Details: {caseId}
          </h1>
        </div>

        {/* Lock Status Indicator */}
        <CaseLockIndicator
          caseId={caseId}
          caseType={caseType}
          userId={userId}
          className="w-full"
        />

        {/* Case Form */}
        <CaseForm
          initialData={initialData}
          onSave={handleSave}
        />
      </div>
    </CaseLockProvider>
  );
};

