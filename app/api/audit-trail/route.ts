import { NextRequest, NextResponse } from 'next/server';
import { auditTrailService } from '@/lib/audit-trail-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const entry = await auditTrailService.addAuditEntry(body);
    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error('Error adding audit entry:', error);
    return NextResponse.json(
      { error: 'Failed to add audit entry' },
      { status: 500 }
    );
  }
}