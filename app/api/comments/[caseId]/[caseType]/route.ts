import { NextRequest, NextResponse } from 'next/server';
import { auditTrailService } from '@/lib/audit-trail-service';
// export const runtime = 'edge';
export async function GET(
  request: NextRequest,
  { params }: { params: { caseId: string; caseType: string } }
) {
  try {
    const { caseId, caseType } = params;
    const comments = await auditTrailService.getComments(caseId, caseType);
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}
