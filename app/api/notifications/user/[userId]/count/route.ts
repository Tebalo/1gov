import { notificationService } from '@/lib/notification-service';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
    params: {
        userId: string;
    };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { userId } = params;

        const count = await notificationService.countUnread(userId);

        return NextResponse.json({ count });
    } catch (error) {
        console.error(`GET /api/notifications/user/${params.userId}/count error:`, error);
        return NextResponse.json(
            { error: 'Failed to get unread notification count' },
            { status: 500 }
        );
    }
}