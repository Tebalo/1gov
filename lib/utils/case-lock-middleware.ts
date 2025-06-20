// /lib/utils/case-lock-middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { caseLockService } from '../case-lock-service';

// Middleware to check lock status before allowing modifications
export async function checkCaseLockMiddleware(
  request: NextRequest,
  caseId: string,
  caseType: string,
  userId: string
) {
  try {
    const lockDetails = await caseLockService.getLockDetails(caseId, caseType);
    
    if (lockDetails && lockDetails.lockedBy !== userId) {
      return NextResponse.json(
        {
          error: 'Case is locked by another user',
          lockDetails: {
            lockedBy: lockDetails.lockedBy,
            lockedAt: lockDetails.lockedAt,
            expiresAt: lockDetails.expiresAt,
          },
        },
        { status: 423 } // Locked status code
      );
    }
    
    return null; // No lock conflict
  } catch (error) {
    console.error('Error checking lock in middleware:', error);
    return NextResponse.json(
      { error: 'Failed to verify lock status' },
      { status: 500 }
    );
  }
}