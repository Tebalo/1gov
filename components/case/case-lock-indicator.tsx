// /components/CaseLockIndicator.tsx
'use client';

import React from 'react';
import { useCaseLock } from '@/lib/hooks/useCaseLock';
import { Lock, LockOpen, AlertTriangle, Clock, User } from 'lucide-react';

interface CaseLockIndicatorProps {
  caseId: string;
  caseType: string;
  userId: string;
  autoAcquire?: boolean;
  className?: string;
  onStatusChange?: (canEdit: boolean) => void;
}

export const CaseLockIndicator: React.FC<CaseLockIndicatorProps> = ({
  caseId,
  caseType,
  userId,
  autoAcquire = false,
  className = '',
  onStatusChange,
}) => {
  const {
    isLocked,
    isOwnLock,
    lockDetails,
    isLoading,
    error,
    acquireLock,
    releaseLock,
    extendLock,
    canEdit,
  } = useCaseLock({
    caseId,
    caseType,
    userId,
    autoAcquire,
    onLockAcquired: (lock) => {
      console.log('Lock acquired:', lock);
      onStatusChange?.(true);
    },
    onLockReleased: () => {
      console.log('Lock released');
      onStatusChange?.(true);
    },
    onLockError: (error) => {
      console.error('Lock error:', error);
    },
    onLockConflict: (conflict) => {
      console.log('Lock conflict:', conflict);
      onStatusChange?.(false);
    },
  });

  React.useEffect(() => {
    onStatusChange?.(canEdit);
  }, [canEdit, onStatusChange]);

  const handleAcquireLock = async () => {
    await acquireLock('User requested lock');
  };

  const handleReleaseLock = async () => {
    await releaseLock();
  };

  const handleExtendLock = async () => {
    await extendLock(30);
  };

  const formatTimeRemaining = (expiresAt: Date): string => {
    const now = new Date();
    const timeLeft = expiresAt.getTime() - now.getTime();
    
    if (timeLeft <= 0) return 'Expired';
    
    const minutes = Math.floor(timeLeft / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
        <span className="text-sm text-gray-600">Checking lock status...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <AlertTriangle className="h-4 w-4 text-red-500" />
        <span className="text-sm text-red-700">{error}</span>
      </div>
    );
  }

  if (!isLocked) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg ${className}`}>
        <LockOpen className="h-4 w-4 text-green-600" />
        <span className="text-sm text-green-700">Available for editing</span>
        <button
          onClick={handleAcquireLock}
          className="ml-2 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Acquire Lock
        </button>
      </div>
    );
  }

  if (isOwnLock && lockDetails) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg ${className}`}>
        <Lock className="h-4 w-4 text-blue-600" />
        <div className="flex-1">
          <div className="text-sm text-blue-700">You have locked this case</div>
          <div className="flex items-center gap-2 text-xs text-blue-600">
            <Clock className="h-3 w-3" />
            <span>Expires in {formatTimeRemaining(lockDetails.expiresAt)}</span>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={handleExtendLock}
            className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Extend
          </button>
          <button
            onClick={handleReleaseLock}
            className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Release
          </button>
        </div>
      </div>
    );
  }

  if (lockDetails) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg ${className}`}>
        <Lock className="h-4 w-4 text-yellow-600" />
        <div className="flex-1">
          <div className="text-sm text-yellow-700">Case is locked by another user</div>
          <div className="flex items-center gap-2 text-xs text-yellow-600">
            <User className="h-3 w-3" />
            <span>User: {lockDetails.lockedBy}</span>
            <Clock className="h-3 w-3 ml-2" />
            <span>Expires in {formatTimeRemaining(lockDetails.expiresAt)}</span>
          </div>
        </div>
        <div className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
          Read-only
        </div>
      </div>
    );
  }

  return null;
};
