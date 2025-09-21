import { useState, useCallback } from 'react';

interface UseDraftOptions {
  userId: string;
  userName: string;
  formType: string;
  currentStep?: number;
  userRole?: string;
  caseId?: string;
  caseType?: string;
}

export const useDraft = (options: UseDraftOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save draft
  const saveDraft = useCallback(async (formData: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/drafts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: JSON.stringify(formData),
          formType: options.formType,
          userId: options.userId,
          currentStep: options.currentStep,
          userName: options.userName,
          userRole: options.userRole,
          caseId: options.caseId,
          caseType: options.caseType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save draft');
      }

      const draft = await response.json();
      return draft;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save draft';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  // Load draft by ID
  const loadDraft = useCallback(async (draftId: String) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!draftId) {
        throw new Error('Draft ID is required');
      }

      const response = await fetch(`/api/drafts/v1/${draftId}`);

      if (!response.ok) {
        throw new Error('Failed to load draft');
      }

      const draft = await response.json();

      return draft ? { ...JSON.parse(draft.content), fields: draft.fields, status: draft.status, currentStep: draft.currentStep } : null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load draft';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete draft by ID
  const deleteDraft = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        userId: options.userId,
      });

      if (options.caseId) {
        params.append('caseId', options.caseId);
      }

      const response = await fetch(`/api/drafts/${options.formType}?${params}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete draft');
      }

      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete draft';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  // Update draft by ID (optional, can be implemented similarly to saveDraft)
  const updateDraft = useCallback(async (draftId: string, formData: any, currentStep:number) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!draftId) {
        throw new Error('Draft ID is required for update');
      }
      const response = await fetch(`/api/drafts/v1/${draftId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: JSON.stringify(formData),
          currentStep: currentStep,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update draft');
      }
      const updatedDraft = await response.json();
      return updatedDraft;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update draft';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update draft status by ID (optional)
  const updateDraftStatus = useCallback(async (draftId: string, status: string) => {
    setIsLoading(true);
    setError(null); 
    try {
      if (!draftId) {
        throw new Error('Draft ID is required for status update');
      }

      const response = await fetch(`/api/drafts/v1/${draftId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update draft status');
      }
      const updatedDraft = await response.json();
      return updatedDraft;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update draft status';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update fields in a draft by ID (optional)
   * @param draftId - ID of the draft to update
   * @param fields - Array of field names to update
   */
  const updateDraftFields = useCallback(async (draftId: string, fields: string[]) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!draftId) {
        throw new Error('Draft ID is required for fields update');
      }
      const response = await fetch(`/api/drafts/v1/${draftId}/fields`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields }),
      });
      if (!response.ok) {
        throw new Error('Failed to update draft fields');
      }
      const updatedDraft = await response.json();
      return updatedDraft;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update draft fields';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    saveDraft,
    loadDraft,
    deleteDraft,
    updateDraft,
    updateDraftStatus,
    updateDraftFields,
    isLoading,
    error,
  };
};