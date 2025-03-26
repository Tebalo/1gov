import { NextRequest, NextResponse } from 'next/server';
import { auditTrailService } from '@/lib/audit-trail-service';
export const runtime = 'edge';
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { caseId, caseType, user, content } = body;
    
    const comment = await auditTrailService.addComment(
      caseId,
      caseType,
      user,
      content
    );
    
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json(
      { error: 'Failed to add comment' },
      { status: 500 }
    );
  }
}