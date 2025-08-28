import { notificationService } from '@/lib/notification-service';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
    params: {
        id: string;
    };
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = params;

        await notificationService.markAsRead(id);

        return NextResponse.json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error(`PATCH /api/notifications/${params.id}/read error:`, error);
        return NextResponse.json(
            { error: 'Failed to mark notification as read' },
            { status: 500 }
        );
    }
}