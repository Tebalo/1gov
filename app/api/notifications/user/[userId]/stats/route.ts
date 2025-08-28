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

        const stats = await notificationService.getNotificationStats(userId);

        return NextResponse.json(stats);
    } catch (error) {
        console.error(`GET /api/notifications/user/${params.userId}/stats error:`, error);
        return NextResponse.json(
            { error: 'Failed to get notification statistics' },
            { status: 500 }
        );
    }
}