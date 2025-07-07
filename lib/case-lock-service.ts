import { prisma } from "./prisma";

export interface CaseLock {
  id: string;  
  caseId: string;
  caseType: string;
  lockedBy: string;
  lockedAt: Date;
  expiresAt: Date;
  reason?: string;
  metadata?: Record<string, any>;
}

export interface CaseLockError {
  error: string;
  lockedBy?: string;
  lockedAt?: Date;
  expiresAt?: Date;
}

export const caseLockService = {
  // Acquire a lock on a case
  acquireLock: async (
    caseId: string, 
    caseType: string, 
    lockedBy: string, 
    reason?: string, 
    metadata?: Record<string, any>
  ): Promise<CaseLock | CaseLockError> => {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 60 * 1000); // Lock expires in 30 minutes

    try {
      // First check if there's an existing valid lock
      const existingLock = await prisma.caseLock.findFirst({
        where: {
          caseId,
          caseType,
          expiresAt: {
            gte: now,
          },
        },
      });

      if (existingLock) {
        // If the same user already has the lock, update it
        if (existingLock.lockedBy === lockedBy) {
          const updatedLock = await prisma.caseLock.update({
            where: { id: existingLock.id },
            data: {
              expiresAt,
              reason: reason ?? undefined,
              metadata: metadata ? JSON.stringify(metadata) : null,
            },
          });
          return {
            ...updatedLock,
            reason: updatedLock.reason ?? undefined,
            metadata: updatedLock.metadata ? JSON.parse(updatedLock.metadata) : undefined,
          };
        } else {
          // Another user has the lock
          return {
            error: "Case is already locked by another user",
            lockedBy: existingLock.lockedBy,
            lockedAt: existingLock.lockedAt,
            expiresAt: existingLock.expiresAt,
          };
        }
      }

      // Clean up any expired locks first
      await prisma.caseLock.deleteMany({
        where: {
          caseId,
          caseType,
          expiresAt: {
            lt: now,
          },
        },
      });

      // Create new lock
      const createdLock = await prisma.caseLock.create({
        data: {
          caseId,
          caseType,
          lockedBy,
          lockedAt: now,
          expiresAt,
          reason: reason ?? undefined,
          metadata: metadata ? JSON.stringify(metadata) : null,
        },
      });
      return {
        ...createdLock,
        metadata: createdLock.metadata ? JSON.parse(createdLock.metadata) : undefined,
        reason: createdLock.reason ?? undefined,
      };
    } catch (error) {
      // Handle unique constraint violation
      if (error instanceof Error && error.message.includes('Unique constraint')) {
        const existingLock = await prisma.caseLock.findFirst({
          where: { caseId, caseType },
        });
        
        if (existingLock) {
          return {
            error: "Case is already locked by another user",
            lockedBy: existingLock.lockedBy,
            lockedAt: existingLock.lockedAt,
            expiresAt: existingLock.expiresAt,
          };
        }
      }
      throw error;
    }
  },

  // Release a lock on a case
  releaseLock: async (caseId: string, caseType: string, lockedBy: string): Promise<boolean> => {
    const result = await prisma.caseLock.deleteMany({
      where: {
        caseId,
        caseType,
        lockedBy,
      },
    });
    return result.count > 0;
  },

  // Force release a lock (admin function)
  forceReleaseLock: async (caseId: string, caseType: string): Promise<boolean> => {
    const result = await prisma.caseLock.deleteMany({
      where: {
        caseId,
        caseType,
      },
    });
    return result.count > 0;
  },

  // Check if a case is locked
  isLocked: async (caseId: string, caseType: string): Promise<boolean> => {
    const lock = await prisma.caseLock.findFirst({
      where: {
        caseId,
        caseType,
        expiresAt: {
          gte: new Date(),
        },
      },
    });
    return !!lock;
  },

  // Get the lock details for a case
  getLockDetails: async (caseId: string, caseType: string): Promise<CaseLock | null> => {
    const lock = await prisma.caseLock.findFirst({
      where: {
        caseId,
        caseType,
        expiresAt: {
          gte: new Date(),
        },
      },
    });

    if (!lock) {
      return null;
    }

    // Parse metadata safely
    let parsedMetadata: Record<string, any> | undefined;
    if (lock.metadata) {
      try {
        parsedMetadata = JSON.parse(lock.metadata);
      } catch (e) {
        console.warn('Failed to parse lock metadata:', e);
        parsedMetadata = undefined;
      }
    }

    return {
      ...lock,
      metadata: parsedMetadata,
      reason: lock.reason ?? undefined,
    };
  },

  // Clean up expired locks (can be called periodically)
  cleanupExpiredLocks: async (): Promise<number> => {
    const result = await prisma.caseLock.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
    return result.count;
  },

  // Extend lock duration
  extendLock: async (caseId: string, caseType: string, lockedBy: string, additionalMinutes: number = 30): Promise<CaseLock | null> => {
    const lock = await prisma.caseLock.findFirst({
      where: {
        caseId,
        caseType,
        lockedBy,
        expiresAt: {
          gte: new Date(),
        },
      },
    });

    if (!lock) return null;

    const newExpiresAt = new Date(lock.expiresAt.getTime() + additionalMinutes * 60 * 1000);

    const updatedLock = await prisma.caseLock.update({
      where: { id: lock.id },
      data: { expiresAt: newExpiresAt },
    });

    // Parse metadata safely
    let parsedMetadata: Record<string, any> | undefined;
    if (updatedLock.metadata) {
      try {
        parsedMetadata = JSON.parse(updatedLock.metadata);
      } catch (e) {
        console.warn('Failed to parse lock metadata:', e);
        parsedMetadata = undefined;
      }
    }

    return {
      ...updatedLock,
      metadata: parsedMetadata,
      reason: updatedLock.reason ?? undefined,
    };
  },
};