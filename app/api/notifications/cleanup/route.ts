import { notificationService } from '@/lib/notification-service';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const daysOld = parseInt(searchParams.get('daysOld') || '30');

        const deletedCount = await notificationService.deleteOldNotifications(daysOld);

        return NextResponse.json({ 
            message: 'Old notifications cleaned up successfully',
            deletedCount 
        });
    } catch (error) {
        console.error('DELETE /api/notifications/cleanup error:', error);
        return NextResponse.json(
            { error: 'Failed to cleanup old notifications' },
            { status: 500 }
        );
    }
}