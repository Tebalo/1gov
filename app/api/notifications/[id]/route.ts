import { notificationService } from '@/lib/notification-service';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
    params: {
        id: string;
    };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = params;

        const notifications = await notificationService.getNotificationsByApplication(id);

        return NextResponse.json({
            id,
            count: notifications.length,
            notifications
        });
    } catch (error) {
        console.error(`GET /api/notifications/application/${params.id} error:`, error);
        return NextResponse.json(
            { error: 'Failed to fetch notifications by application' },
            { status: 500 }
        );
    }
}