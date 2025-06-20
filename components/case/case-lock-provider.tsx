// /components/CaseLockProvider.tsx
'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useCaseLock } from '@/lib/hooks/useCaseLock';

interface CaseLockContextType {
  isLocked: boolean;
  isOwnLock: boolean;
  canEdit: boolean;
  acquireLock: (reason?: string, metadata?: Record<string, any>) => Promise<boolean>;
  releaseLock: () => Promise<boolean>;
  extendLock: (additionalMinutes?: number) => Promise<boolean>;
}

const CaseLockContext = createContext<CaseLockContextType | null>(null);

interface CaseLockProviderProps {
  caseId: string;
  caseType: string;
  userId: string;
  autoAcquire?: boolean;
  children: ReactNode;
}

export const CaseLockProvider: React.FC<CaseLockProviderProps> = ({
  caseId,
  caseType,
  userId,
  autoAcquire = false,
  children,
}) => {
  const lockData = useCaseLock({
    caseId,
    caseType,
    userId,
    autoAcquire,
  });

  return (
    <CaseLockContext.Provider value={lockData}>
      {children}
    </CaseLockContext.Provider>
  );
};

export const useCaseLockContext = (): CaseLockContextType => {
  const context = useContext(CaseLockContext);
  if (!context) {
    throw new Error('useCaseLockContext must be used within a CaseLockProvider');
  }
  return context;
};