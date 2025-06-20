// /lib/hooks/useCaseLock.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { CaseLock, CaseLockError } from '../case-lock-service';

interface UseCaseLockOptions {
  caseId: string;
  caseType: string;
  userId: string;
  autoAcquire?: boolean;
  autoRelease?: boolean;
  pollInterval?: number;
  onLockAcquired?: (lock: CaseLock) => void;
  onLockReleased?: () => void;
  onLockError?: (error: string) => void;
  onLockConflict?: (conflictInfo: CaseLockError) => void;
}

interface UseCaseLockReturn {
  isLocked: boolean;
  isOwnLock: boolean;
  lockDetails: CaseLock | null;
  isLoading: boolean;
  error: string | null;
  acquireLock: (reason?: string, metadata?: Record<string, any>) => Promise<boolean>;
  releaseLock: () => Promise<boolean>;
  extendLock: (additionalMinutes?: number) => Promise<boolean>;
  refreshLockStatus: () => Promise<void>;
  canEdit: boolean;
}

export const useCaseLock = ({
  caseId,
  caseType,
  userId,
  autoAcquire = false,
  autoRelease = true,
  pollInterval = 30000, // Poll every 30 seconds
  onLockAcquired,
  onLockReleased,
  onLockError,
  onLockConflict,
}: UseCaseLockOptions): UseCaseLockReturn => {
  const [isLocked, setIsLocked] = useState(false);
  const [lockDetails, setLockDetails] = useState<CaseLock | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const pollIntervalRef = useRef<NodeJS.Timeout>();
  const isUnmountedRef = useRef(false);
  const lastActivityRef = useRef(Date.now());

  const isOwnLock = lockDetails?.lockedBy === userId;
  const canEdit = !isLocked || isOwnLock;

  // Track user activity
  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  useEffect(() => {
    const handleActivity = () => updateActivity();
    
    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);
    
    return () => {
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [updateActivity]);

  const refreshLockStatus = useCallback(async () => {
    if (isUnmountedRef.current) return;
    
    try {
      const response = await fetch(`/api/case-lock/${caseId}/${caseType}`);
      const data = await response.json();
      
      if (isUnmountedRef.current) return;
      
      setIsLocked(data.isLocked);
      setLockDetails(data.lockDetails);
      setError(null);
    } catch (err) {
      if (!isUnmountedRef.current) {
        setError('Failed to check lock status');
        onLockError?.('Failed to check lock status');
      }
    }
  }, [caseId, caseType, onLockError]);

  const acquireLock = useCallback(async (reason?: string, metadata?: Record<string, any>): Promise<boolean> => {
    if (isUnmountedRef.current) return false;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/case-lock/${caseId}/${caseType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lockedBy: userId, reason, metadata }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (!isUnmountedRef.current) {
          setIsLocked(true);
          setLockDetails(data.lock);
          onLockAcquired?.(data.lock);
          updateActivity();
        }
        return true;
      } else {
        if (!isUnmountedRef.current) {
          setError(data.error || 'Failed to acquire lock');
          if (response.status === 409) {
            onLockConflict?.(data);
          } else {
            onLockError?.(data.error || 'Failed to acquire lock');
          }
        }
        return false;
      }
    } catch (err) {
      if (!isUnmountedRef.current) {
        const errorMsg = 'Network error while acquiring lock';
        setError(errorMsg);
        onLockError?.(errorMsg);
      }
      return false;
    } finally {
      if (!isUnmountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [caseId, caseType, userId, onLockAcquired, onLockConflict, onLockError, updateActivity]);

  const releaseLock = useCallback(async (): Promise<boolean> => {
    if (isUnmountedRef.current) return false;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/case-lock/${caseId}/${caseType}?lockedBy=${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (!isUnmountedRef.current) {
          setIsLocked(false);
          setLockDetails(null);
          onLockReleased?.();
        }
        return true;
      } else {
        if (!isUnmountedRef.current) {
          setError(data.error || 'Failed to release lock');
          onLockError?.(data.error || 'Failed to release lock');
        }
        return false;
      }
    } catch (err) {
      if (!isUnmountedRef.current) {
        const errorMsg = 'Network error while releasing lock';
        setError(errorMsg);
        onLockError?.(errorMsg);
      }
      return false;
    } finally {
      if (!isUnmountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [caseId, caseType, userId, onLockReleased, onLockError]);

  const extendLock = useCallback(async (additionalMinutes = 30): Promise<boolean> => {
    if (isUnmountedRef.current) return false;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/case-lock/${caseId}/${caseType}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lockedBy: userId, additionalMinutes }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (!isUnmountedRef.current) {
          setLockDetails(data.lock);
          updateActivity();
        }
        return true;
      } else {
        if (!isUnmountedRef.current) {
          setError(data.error || 'Failed to extend lock');
          onLockError?.(data.error || 'Failed to extend lock');
        }
        return false;
      }
    } catch (err) {
      if (!isUnmountedRef.current) {
        const errorMsg = 'Network error while extending lock';
        setError(errorMsg);
        onLockError?.(errorMsg);
      }
      return false;
    } finally {
      if (!isUnmountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [caseId, caseType, userId, onLockError, updateActivity]);

  // Auto-extend lock when user is active
  useEffect(() => {
    if (!isOwnLock || !lockDetails) return;

    const checkAndExtend = () => {
      const now = Date.now();
      const lockExpiry = new Date(lockDetails.expiresAt).getTime();
      const timeUntilExpiry = lockExpiry - now;
      const timeSinceActivity = now - lastActivityRef.current;

      // If lock expires in less than 5 minutes and user was active in last 2 minutes
      if (timeUntilExpiry < 5 * 60 * 1000 && timeSinceActivity < 2 * 60 * 1000) {
        extendLock();
      }
    };

    const interval = setInterval(checkAndExtend, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [isOwnLock, lockDetails, extendLock]);

  // Initial load and auto-acquire
  useEffect(() => {
    refreshLockStatus().then(() => {
      if (autoAcquire && !isLocked) {
        acquireLock();
      }
    });
  }, [refreshLockStatus, autoAcquire, acquireLock, isLocked]);

  // Polling for lock status updates
  useEffect(() => {
    if (pollInterval > 0) {
      pollIntervalRef.current = setInterval(refreshLockStatus, pollInterval);
      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      };
    }
  }, [refreshLockStatus, pollInterval]);

  // Auto-release on cleanup
  useEffect(() => {
    return () => {
      isUnmountedRef.current = true;
      if (autoRelease && isOwnLock) {
        // Fire and forget - don't wait for response
        fetch(`/api/case-lock/${caseId}/${caseType}?lockedBy=${userId}`, {
          method: 'DELETE',
        }).catch(() => {
          // Ignore errors during cleanup
        });
      }
    };
  }, [autoRelease, caseId, caseType, userId, isOwnLock]);

  // Handle page visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshLockStatus();
        updateActivity();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [refreshLockStatus, updateActivity]);

  // Handle beforeunload for cleanup
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (autoRelease && isOwnLock) {
        // Use sendBeacon for reliable cleanup on page unload
        const data = new URLSearchParams();
        data.append('lockedBy', userId);
        
        navigator.sendBeacon(
          `/api/case-lock/${caseId}/${caseType}?lockedBy=${userId}`,
          data
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [autoRelease, caseId, caseType, userId, isOwnLock]);

  return {
    isLocked,
    isOwnLock,
    lockDetails,
    isLoading,
    error,
    acquireLock,
    releaseLock,
    extendLock,
    refreshLockStatus,
    canEdit,
  };
};