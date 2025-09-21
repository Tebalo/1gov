import { draftService } from '@/lib/draft-service';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }    
) {
  try {
    const draftId = params.id;
    const { status } = await request.json();
    if (!draftId) {
      return NextResponse.json(
        { error: 'Draft ID is required' },
        { status: 400 }
      );
    }
    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    const updatedDraft = await draftService.updateDraftStatus(draftId, status);
    if (!updatedDraft) {
      return NextResponse.json(
        { error: 'Draft not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(updatedDraft);
    } catch (error) {
    console.error('Error in PATCH /api/drafts/[id]/status:', error);
    return NextResponse.json(
      { error: 'Failed to update draft status' },
      { status: 500 }
    );
  } 
}