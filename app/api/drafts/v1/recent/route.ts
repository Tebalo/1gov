import { NextRequest, NextResponse } from 'next/server';
import { draftService } from "@/lib/draft-service";

export async function GET(request: NextRequest) {
  try {
    // Get userId from query parameters
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    // Validate userId is provided
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Call the draft service
    const draft = await draftService.getDraftByUpdateTime(userId);

    if (!draft) {
      return NextResponse.json(
        { error: 'No draft found' },
        { status: 404 }
      );
    }

    return NextResponse.json(draft, { status: 200 });

  } catch (error) {
    console.error('Error fetching draft:', error);
    return NextResponse.json(
      { error: 'Failed to fetch draft' },
      { status: 500 }
    );
  }
}