// /components/CaseLockStatus.tsx
// Simple status component for displaying lock information
'use client';

import React from 'react';
import { CaseLock } from '@/lib/case-lock-service';
import { Lock, Clock, User } from 'lucide-react';

interface CaseLockStatusProps {
  lockDetails: CaseLock | null;
  isOwnLock: boolean;
  className?: string;
}

export const CaseLockStatus: React.FC<CaseLockStatusProps> = ({
  lockDetails,
  isOwnLock,
  className = '',
}) => {
  if (!lockDetails) {
    return null;
  }

  const timeRemaining = Math.max(
    0,
    new Date(lockDetails.expiresAt).getTime() - Date.now()
  );
  const minutesRemaining = Math.floor(timeRemaining / (1000 * 60));

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      <Lock className="h-4 w-4" />
      
      {isOwnLock ? (
        <span className="text-blue-600">You have this case locked</span>
      ) : (
        <div className="flex items-center gap-2 text-amber-600">
          <User className="h-3 w-3" />
          <span>Locked by {lockDetails.lockedBy}</span>
        </div>
      )}
      
      <div className="flex items-center gap-1 text-gray-500">
        <Clock className="h-3 w-3" />
        <span>{minutesRemaining}m remaining</span>
      </div>
      
      {lockDetails.reason && (
        <span className="text-gray-600 italic">({lockDetails.reason})</span>
      )}
    </div>
  );
};