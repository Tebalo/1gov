import { notificationService, CreateNotificationRequest } from '@/lib/notification-service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { notifications } = body;

        if (!Array.isArray(notifications) || notifications.length === 0) {
            return NextResponse.json(
                { error: 'notifications array is required and must not be empty' },
                { status: 400 }
            );
        }

        // Validate each notification
        for (const notif of notifications) {
            if (notif.reference && notif.payload) {
                // New format validation
                if (!notif.reference.user_id || !notif.payload.title) {
                    return NextResponse.json(
                        { error: 'Each notification must have reference.user_id and payload.title' },
                        { status: 400 }
                    );
                }
            } else {
                // Legacy format validation
                if (!notif.userId || !notif.message) {
                    return NextResponse.json(
                        { error: 'Each notification must have userId and message (legacy format)' },
                        { status: 400 }
                    );
                }
            }
        }

        // Convert legacy format notifications to new format if needed
        const enhancedNotifications: CreateNotificationRequest[] = notifications.map(notif => {
            if (notif.reference && notif.payload) {
                return notif;
            } else {
                // Convert legacy format
                return {
                    reference: {
                        status: "1",
                        user_id: notif.userId,
                        application_id: `legacy-${Date.now()}-${Math.random()}`,
                        type: "General",
                        service_code: "LEGACY_001"
                    },
                    payload: {
                        title: "Notification",
                        message: notif.message,
                        description: notif.message,
                        attachments: notif.link ? [{ link: notif.link, type: 'general' }] : []
                    }
                };
            }
        });

        const createdNotifications = await notificationService.sendBulkNotifications(enhancedNotifications);

        return NextResponse.json(
            { 
                message: 'Bulk notifications sent successfully',
                count: createdNotifications.length,
                notifications: createdNotifications
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('POST /api/notifications/bulk error:', error);
        return NextResponse.json(
            { error: 'Failed to send bulk notifications' },
            { status: 500 }
        );
    }
}