import { useState } from 'react';
import { AuditActionType, UserInfo } from '@/lib/audit-trail-service';

interface AuditTrailEntry {
  id: string;
  timestamp: string;
  action: AuditActionType;
  userId: string;
  userName: string;
  userRole?: string;
  caseId: string;
  caseType: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
  description?: string;
  metadata?: string;
}

export function useAuditTrail() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch audit trail for a case
  const fetchAuditTrail = async (
    caseId: string,
    caseType: string,
    filters?: {
      action?: AuditActionType | 'all';
      sortOrder?: 'newest' | 'oldest';
      limit?: number;
    }
  ): Promise<AuditTrailEntry[]> => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      
      if (filters?.action && filters.action !== 'all') {
        queryParams.set('action', filters.action);
      }
      
      if (filters?.sortOrder) {
        queryParams.set('sortOrder', filters.sortOrder);
      }
      
      if (filters?.limit) {
        queryParams.set('limit', filters.limit.toString());
      }
      
      const queryString = queryParams.toString();
      const url = `/api/audit-trail/${caseId}/${caseType}${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch audit trail');
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

  // Add a new audit entry
  const addAuditEntry = async (
    action: AuditActionType,
    caseId: string,
    caseType: string,
    user: UserInfo,
    details?: {
      field?: string;
      oldValue?: string;
      newValue?: string;
      description?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<AuditTrailEntry | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/audit-trail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          caseId,
          caseType,
          user,
          ...details,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add audit entry');
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

  // Log status change
  const logStatusChange = async (
    caseId: string,
    caseType: string,
    user: UserInfo,
    oldStatus: string,
    newStatus: string,
    description?: string
  ): Promise<AuditTrailEntry | null> => {
    return addAuditEntry('status_change', caseId, caseType, user, {
      field: 'status',
      oldValue: oldStatus,
      newValue: newStatus,
      description: description || `Status changed from "${oldStatus}" to "${newStatus}"`,
    });
  };

  // Log priority change
  const logPriorityChange = async (
    caseId: string,
    caseType: string,
    user: UserInfo,
    oldPriority: string,
    newPriority: string
  ): Promise<AuditTrailEntry | null> => {
    return addAuditEntry('priority_changed', caseId, caseType, user, {
      field: 'priority',
      oldValue: oldPriority,
      newValue: newPriority,
      description: `Priority changed from "${oldPriority}" to "${newPriority}"`,
    });
  };

  // Log SLA update
  const logSLAUpdate = async (
    caseId: string,
    caseType: string,
    user: UserInfo,
    oldSLA: string | null,
    newSLA: string
  ): Promise<AuditTrailEntry | null> => {
    return addAuditEntry('sla_updated', caseId, caseType, user, {
      field: 'sla_deadline',
      oldValue: oldSLA || 'Not set',
      newValue: newSLA,
      description: 'SLA deadline updated',
    });
  };

  // Log case view
  const logCaseViewed = async (
    caseId: string,
    caseType: string,
    user: UserInfo
  ): Promise<AuditTrailEntry | null> => {
    return addAuditEntry('viewed', caseId, caseType, user, {
      description: 'Case viewed',
    });
  };

  return {
    loading,
    error,
    fetchAuditTrail,
    addAuditEntry,
    logStatusChange,
    logPriorityChange,
    logSLAUpdate,
    logCaseViewed,
  };
}