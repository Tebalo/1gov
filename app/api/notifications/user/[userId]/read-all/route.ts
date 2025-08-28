import { notificationService } from '@/lib/notification-service';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
    params: {
        userId: string;
    };
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const { userId } = params;

        await notificationService.markAllAsRead(userId);

        return NextResponse.json({ 
            message: 'All notifications marked as read for user' 
        });
    } catch (error) {
        console.error(`PATCH /api/notifications/user/${params.userId}/read-all error:`, error);
        return NextResponse.json(
            { error: 'Failed to mark all notifications as read' },
            { status: 500 }
        );
    }
}