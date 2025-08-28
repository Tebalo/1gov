"use client";
import { useDraft } from '@/lib/hooks/useDraft';
import { useEffect, useState } from 'react';

interface MyFormProps {
  userId: string;
  userName: string;
  userRole?: string;
  caseId?: string;
  caseType?: string;
}

export const MyForm = ({ userId, userName, userRole, caseId, caseType }: MyFormProps) => {
  const [formData, setFormData] = useState({
    field1: '',
    field2: '',
    // ... other form fields
  });

  const { saveDraft, loadDraft, deleteDraft, isLoading, error } = useDraft({
    userId,
    userName,
    formType: 'myFormType', // Identify your form type
    userRole,
    caseId,
    caseType,
  });

  // Load draft on component mount
  useEffect(() => {
    const loadExistingDraft = async () => {
      const draftData = await loadDraft();
      if (draftData) {
        setFormData(draftData);
      }
    };

    loadExistingDraft();
  }, [loadDraft]);

  // Auto-save draft on form data change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.field1 || formData.field2) { // Only save if there's content
        saveDraft(formData).catch(console.error);
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(timer);
  }, [formData, saveDraft]);

  const handleSubmit = async () => {
    // Submit your form
    // After successful submission, delete the draft
    await deleteDraft();
  };

  const handleSaveDraft = () => {
    saveDraft(formData);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={formData.field1}
          onChange={(e) => setFormData(prev => ({ ...prev, field1: e.target.value }))}
          placeholder="Field 1"
        />
        <input
          value={formData.field2}
          onChange={(e) => setFormData(prev => ({ ...prev, field2: e.target.value }))}
          placeholder="Field 2"
        />
        
        <button type="button" onClick={handleSaveDraft} disabled={isLoading}>
          Save Draft
        </button>
        <button type="submit">Submit</button>
        
        {error && <div className="error">{error}</div>}
        {isLoading && <div>Saving...</div>}
      </form>
    </div>
  );
};