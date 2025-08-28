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

        const notifications = await notificationService.getUserNotifications(userId);

        return NextResponse.json(notifications);
    } catch (error) {
        console.error(`GET /api/notifications/user/${params.userId} error:`, error);
        return NextResponse.json(
            { error: 'Failed to fetch user notifications' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { userId } = params;

        await notificationService.deleteAllUserNotifications(userId);

        return NextResponse.json({ 
            message: 'All notifications deleted successfully for user' 
        });
    } catch (error) {
        console.error(`DELETE /api/notifications/user/${params.userId} error:`, error);
        return NextResponse.json(
            { error: 'Failed to delete user notifications' },
            { status: 500 }
        );
    }
}