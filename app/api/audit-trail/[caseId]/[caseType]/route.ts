import { NextRequest, NextResponse } from 'next/server';
import { auditTrailService } from '@/lib/audit-trail-service';
// export const runtime = 'edge';
export async function GET(
  request: NextRequest,
  { params }: { params: { caseId: string; caseType: string } }
) {
  try {
    const { caseId, caseType } = params;
    const { searchParams } = new URL(request.url);
    
    const action = searchParams.get('action') || 'all';
    const sortOrder = (searchParams.get('sortOrder') || 'newest') as 'newest' | 'oldest';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    
    const auditTrail = await auditTrailService.getAuditTrail(caseId, caseType, {
      action: action as any,
      sortOrder,
      limit,
    });
    
    return NextResponse.json(auditTrail);
  } catch (error) {
    console.error('Error fetching audit trail:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit trail' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { caseId: string; caseType: string } }
) {
  try {
    const { caseId, caseType } = params;
    
    // Delete all audit trail entries for this case
    const result = await auditTrailService.deleteAuditTrail(caseId, caseType);
    
    return NextResponse.json({ success: true, deletedCount: result.count });
  } catch (error) {
    console.error('Error deleting audit trail:', error);
    return NextResponse.json(
      { error: 'Failed to delete audit trail' },
      { status: 500 }
    );
  }
}