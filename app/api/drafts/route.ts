import { draftService } from '@/lib/draft-service';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, formType, userId, userName, userRole, caseId, caseType } = body;

    // Validate required fields
    if (!content || !formType || !userId || !userName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const draft = await draftService.saveDraft({
      content,
      formType,
      userId,
      userName,
      userRole,
      caseId,
      caseType,
    });

    return NextResponse.json(draft);
  } catch (error) {
    console.error('Error in POST /api/drafts:', error);
    return NextResponse.json(
      { error: 'Failed to save draft' },
      { status: 500 }
    );
  }
}

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const userId = searchParams.get('userId');
//     const formType = searchParams.get('formType');
//     const caseId = searchParams.get('caseId');

//     if (!userId) {
//       return NextResponse.json(
//         { error: 'userId is required' },
//         { status: 400 }
//       );
//     }

//     if (formType) {
//       // Get specific draft
//       const draft = await draftService.getDraft(userId, formType, caseId || undefined);
//       return NextResponse.json(draft);
//     } else {
//       // Get all user drafts
//       const drafts = await draftService.getUserDrafts(userId);
//       return NextResponse.json(drafts);
//     }
//   } catch (error) {
//     console.error('Error in GET /api/drafts:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch drafts' },
//       { status: 500 }
//     );
//   }
// }

export async function PATCH(request: NextRequest) {
  try{
    const {searchParams} = new URL(request.url);
    const draftId = searchParams.get('draftId');
    const status = searchParams.get('status');
    if(!draftId){
      return NextResponse.json(
        { error: 'Id is required'},
        {status: 400}
      )
    }
    if(!status){
      return NextResponse.json(
        { error: 'status is required'}, 
        {status: 400}
      )
    }
    const response = await draftService.updateDraftStatus(draftId, status);
    return NextResponse.json(
      response,
      {status: 200}
    )
  } catch (error){
    return NextResponse.json(
      { error: 'Failed to update status'},
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try{
    const {searchParams} = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    if(!userId){
      return NextResponse.json(
        { error: 'userId is required'},
        {status: 400}
      )
    }
    if(!status){
      return NextResponse.json(
        { error: 'status is required'}, 
        {status: 400}
      )
    }
    const response = await draftService.getUserDraftsByStatus(userId, status);
    return NextResponse.json(
      response,
      {status: 200}
    )
  } catch (error){
    return NextResponse.json(
      { error: 'Failed to update status'},
      { status: 500 }
    )
  }
}