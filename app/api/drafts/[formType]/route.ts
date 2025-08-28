import { draftService } from '@/lib/draft-service';
import { NextRequest, NextResponse } from 'next/server';


export async function DELETE(
  request: NextRequest,
  { params }: { params: { formType: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const caseId = searchParams.get('caseId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const deletedDraft = await draftService.deleteDraft(
      userId,
      params.formType,
      caseId || undefined
    );

    return NextResponse.json(deletedDraft);
  } catch (error) {
    console.error('Error in DELETE /api/drafts/[formType]:', error);
    return NextResponse.json(
      { error: 'Failed to delete draft' },
      { status: 500 }
    );
  }
}