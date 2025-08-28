import { notificationService } from '@/lib/notification-service';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
    params: {
        type: string;
    };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { type } = params;
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'userId parameter is required' },
                { status: 400 }
            );
        }

        const notifications = await notificationService.getNotificationsByType(userId, type);

        return NextResponse.json({
            userId,
            type,
            count: notifications.length,
            notifications
        });
    } catch (error) {
        console.error(`GET /api/notifications/type/${params.type} error:`, error);
        return NextResponse.json(
            { error: 'Failed to fetch notifications by type' },
            { status: 500 }
        );
    }
}
