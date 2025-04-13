import { useState } from 'react';
import { UserInfo } from '@/lib/audit-trail-service';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  userName: string;
  userRole?: string;
  caseId: string;
  caseType: string;
}

export function useComments() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch comments for a case
  const fetchComments = async (
    caseId: string,
    caseType: string
  ): Promise<Comment[]> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/comments/${caseId}/${caseType}`);

      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Add a new comment
  const addComment = async (
    caseId: string,
    caseType: string,
    user: UserInfo,
    content: string
  ): Promise<Comment | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caseId,
          caseType,
          user,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchComments,
    addComment,
  };
}