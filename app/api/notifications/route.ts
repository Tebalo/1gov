import { notificationService, CreateNotificationRequest } from '@/lib/notification-service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const unreadOnly = searchParams.get('unreadOnly') === 'true';
        const notificationType = searchParams.get('type');
        const serviceCode = searchParams.get('serviceCode');

        if (!userId) {
            return NextResponse.json(
                { error: 'userId parameter is required' },
                { status: 400 }
            );
        }

        const result = await notificationService.getPaginatedNotifications(
            userId,
            page,
            limit,
            unreadOnly,
            notificationType || undefined,
            serviceCode || undefined
        );

        return NextResponse.json(result);
    } catch (error) {
        console.error('GET /api/notifications error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch notifications' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        // Check if it's new format or legacy format
        if (body.reference && body.payload) {
            // New enhanced format
            const notificationData: CreateNotificationRequest = {
                reference: body.reference,
                payload: body.payload
            };

            // Validate required fields
            if (!notificationData.reference.user_id || !notificationData.payload.title) {
                return NextResponse.json(
                    { error: 'reference.user_id and payload.title are required' },
                    { status: 400 }
                );
            }

            const notification = await notificationService.createNotification(notificationData);
            return NextResponse.json(notification, { status: 201 });
        } else {
            // Legacy format - fallback
            const { userId, message, link } = body;

            if (!userId || !message) {
                return NextResponse.json(
                    { error: 'userId and message are required' },
                    { status: 400 }
                );
            }

            const notification = await notificationService.sendNotification(userId, message, link);
            return NextResponse.json(notification, { status: 201 });
        }
    } catch (error) {
        console.error('POST /api/notifications error:', error);
        return NextResponse.json(
            { error: 'Failed to create notification' },
            { status: 500 }
        );
    }
}