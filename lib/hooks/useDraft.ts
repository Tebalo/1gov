import { useState, useCallback } from 'react';

interface UseDraftOptions {
  userId: string;
  userName: string;
  formType: string;
  userRole?: string;
  caseId?: string;
  caseType?: string;
}

export const useDraft = (options: UseDraftOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const loadDraft = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        userId: options.userId,
        formType: options.formType,
      });

      if (options.caseId) {
        params.append('caseId', options.caseId);
      }

      const response = await fetch(`/api/drafts?${params}`);

      if (!response.ok) {
        throw new Error('Failed to load draft');
      }

      const draft = await response.json();
      return draft ? JSON.parse(draft.content) : null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load draft';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

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

  return {
    saveDraft,
    loadDraft,
    deleteDraft,
    isLoading,
    error,
  };
};