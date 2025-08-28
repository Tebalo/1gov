import { prisma } from "./prisma";
import { Prisma } from "@prisma/client";

export interface NotificationAttachment {
    link: string;
    type: 'payment' | 'invoice' | 'receipt' | 'general' | string;
    [key: string]: any;
}

export interface NotificationReference {
    status: string;
    user_id: string;
    application_id: string;
    type: string;
    service_code: string;
    [key: string]: any;
}

export interface NotificationPayload {
    title: string;
    message: string;
    description?: string;
    attachments?: NotificationAttachment[];
    fields?: Record<string, any>[];
    [key: string]: any;
}

export interface Notification {
    id: string;
    userId: string;
    reference: NotificationReference;
    payload: NotificationPayload;
    isRead: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateNotificationRequest {
    reference: NotificationReference;
    payload: NotificationPayload;
}

// Helper function to safely cast JSON values
function parseNotificationReference(json: Prisma.JsonValue): NotificationReference {
    if (json && typeof json === 'object' && json !== null && !Array.isArray(json)) {
        const obj = json as Record<string, any>;
        return {
            status: obj.status || '',
            user_id: obj.user_id || '',
            application_id: obj.application_id || '',
            type: obj.type || '',
            service_code: obj.service_code || ''
        };
    }
    throw new Error('Invalid notification reference data');
}

function parseNotificationPayload(json: Prisma.JsonValue): NotificationPayload {
    if (json && typeof json === 'object' && json !== null && !Array.isArray(json)) {
        const obj = json as Record<string, any>;
        return {
            title: obj.title || '',
            message: obj.message || '',
            description: obj.description,
            attachments: obj.attachments || [],
            fields: obj.fields || []
        };
    }
    throw new Error('Invalid notification payload data');
}

// Helper function to convert Prisma result to our Notification interface
function convertPrismaNotificationToNotification(prismaNotification: any): Notification {
    return {
        id: prismaNotification.id,
        userId: prismaNotification.userId,
        reference: parseNotificationReference(prismaNotification.reference),
        payload: parseNotificationPayload(prismaNotification.payload),
        isRead: prismaNotification.isRead,
        createdAt: prismaNotification.createdAt,
        updatedAt: prismaNotification.updatedAt
    };
}

export const notificationService = {
    // Send a new notification with enhanced payload
    createNotification: async (
        notificationData: CreateNotificationRequest
    ): Promise<Notification> => {
        try {
            const prismaNotification = await prisma.notification.create({
                data: {
                    userId: notificationData.reference.user_id,
                    reference: notificationData.reference,
                    payload: notificationData.payload,
                    isRead: false
                }
            });
            
            return convertPrismaNotificationToNotification(prismaNotification);
        } catch (error) {
            console.error('Error creating notification:', error);
            throw new Error('Failed to create notification');
        }
    },

    // Legacy method for backwards compatibility
    sendNotification: async (
        userId: string, 
        message: string, 
        link?: string
    ): Promise<Notification> => {
        try {
            // Convert legacy format to new format
            const notificationData: CreateNotificationRequest = {
                reference: {
                    status: "1",
                    user_id: userId,
                    application_id: `legacy-${Date.now()}`,
                    type: "General",
                    service_code: "LEGACY_001"
                },
                payload: {
                    title: "Notification",
                    message: message,
                    description: message,
                    attachments: link ? [{ link, type: 'general' }] : []
                }
            };

            return await notificationService.createNotification(notificationData);
        } catch (error) {
            console.error('Error sending notification:', error);
            throw new Error('Failed to send notification');
        }
    },

    // Fetch notifications for a user
    getUserNotifications: async (userId: string): Promise<Notification[]> => {
        try {
            const prismaNotifications = await prisma.notification.findMany({
                where: {
                    userId: userId
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            
            return prismaNotifications.map(convertPrismaNotificationToNotification);
        } catch (error) {
            console.error('Error fetching user notifications:', error);
            throw new Error('Failed to fetch notifications');
        }
    },
    
    // Mark a notification as read
    markAsRead: async (notificationId: string): Promise<void> => {
        try {
            await prisma.notification.update({
                where: {
                    id: notificationId
                },
                data: {
                    isRead: true,
                    updatedAt: new Date()
                }
            });
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw new Error('Failed to mark notification as read');
        }
    },
    
    // Mark all notifications as read for a user
    markAllAsRead: async (userId: string): Promise<void> => {
        try {
            await prisma.notification.updateMany({
                where: {
                    userId: userId,
                    isRead: false
                },
                data: {
                    isRead: true,
                    updatedAt: new Date()
                }
            });
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            throw new Error('Failed to mark all notifications as read');
        }
    },
    
    // Send bulk notifications with new format
    sendBulkNotifications: async (
        notifications: CreateNotificationRequest[]
    ): Promise<Notification[]> => {
        try {
            const createdNotifications = await Promise.all(
                notifications.map(notification => 
                    notificationService.createNotification(notification)
                )
            );
            
            return createdNotifications;
        } catch (error) {
            console.error('Error sending bulk notifications:', error);
            throw new Error('Failed to send bulk notifications');
        }
    },
    
    // Open a notification (fetch single notification)
    openNotification: async (notificationId: string): Promise<Notification | null> => {
        try {
            const prismaNotification = await prisma.notification.findUnique({
                where: {
                    id: notificationId
                }
            });
            
            if (!prismaNotification) {
                return null;
            }

            // Automatically mark as read when opened
            if (!prismaNotification.isRead) {
                await prisma.notification.update({
                    where: {
                        id: notificationId
                    },
                    data: {
                        isRead: true,
                        updatedAt: new Date()
                    }
                });
                
                const updatedNotification = convertPrismaNotificationToNotification(prismaNotification);
                return {
                    ...updatedNotification,
                    isRead: true
                };
            }
            
            return convertPrismaNotificationToNotification(prismaNotification);
        } catch (error) {
            console.error('Error opening notification:', error);
            throw new Error('Failed to open notification');
        }
    },
    
    // Delete a notification
    deleteNotification: async (notificationId: string): Promise<void> => {
        try {
            await prisma.notification.delete({
                where: {
                    id: notificationId
                }
            });
        } catch (error) {
            console.error('Error deleting notification:', error);
            throw new Error('Failed to delete notification');
        }
    },
    
    // Delete all notifications for a user
    deleteAllUserNotifications: async (userId: string): Promise<void> => {
        try {
            await prisma.notification.deleteMany({
                where: {
                    userId: userId
                }
            });
        } catch (error) {
            console.error('Error deleting all user notifications:', error);
            throw new Error('Failed to delete all notifications');
        }
    },
    
    // Delete old notifications (older than specified days)
    deleteOldNotifications: async (daysOld: number = 30): Promise<number> => {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysOld);
            
            const result = await prisma.notification.deleteMany({
                where: {
                    createdAt: {
                        lt: cutoffDate
                    }
                }
            });
            
            return result.count;
        } catch (error) {
            console.error('Error deleting old notifications:', error);
            throw new Error('Failed to delete old notifications');
        }
    },
    
    // Count unread notifications for a user
    countUnread: async (userId: string): Promise<number> => {
        try {
            const count = await prisma.notification.count({
                where: {
                    userId: userId,
                    isRead: false
                }
            });
            
            return count;
        } catch (error) {
            console.error('Error counting unread notifications:', error);
            throw new Error('Failed to count unread notifications');
        }
    },
    
    // Get paginated notifications with filtering
    getPaginatedNotifications: async (
        userId: string,
        page: number = 1,
        limit: number = 10,
        unreadOnly: boolean = false,
        notificationType?: string,
        serviceCode?: string
    ): Promise<{
        notifications: Notification[];
        totalCount: number;
        hasMore: boolean;
    }> => {
        try {
            const skip = (page - 1) * limit;
            
            // Build where clause
            const whereClause: any = {
                userId: userId,
                ...(unreadOnly && { isRead: false })
            };
            
            const [prismaNotifications, totalCount] = await Promise.all([
                prisma.notification.findMany({
                    where: whereClause,
                    orderBy: {
                        createdAt: 'desc'
                    },
                    skip,
                    take: limit
                }),
                prisma.notification.count({
                    where: whereClause
                })
            ]);
            
            // Convert to our interface
            let notifications = prismaNotifications.map(convertPrismaNotificationToNotification);
            
            // Filter by type and service code client-side
            if (notificationType) {
                notifications = notifications.filter(n => n.reference.type === notificationType);
            }
            
            if (serviceCode) {
                notifications = notifications.filter(n => n.reference.service_code === serviceCode);
            }
            
            const hasMore = skip + notifications.length < totalCount;
            
            return {
                notifications,
                totalCount: notifications.length,
                hasMore
            };
        } catch (error) {
            console.error('Error getting paginated notifications:', error);
            throw new Error('Failed to get paginated notifications');
        }
    },

    // Get notifications by application ID
    getNotificationsByApplication: async (
        applicationId: string
    ): Promise<Notification[]> => {
        try {
            const prismaNotifications = await prisma.notification.findMany({
                orderBy: {
                    createdAt: 'desc'
                }
            });
            
            const notifications = prismaNotifications.map(convertPrismaNotificationToNotification);
            
            return notifications.filter(n => n.reference.application_id === applicationId);
        } catch (error) {
            console.error('Error fetching notifications by application:', error);
            throw new Error('Failed to fetch notifications by application');
        }
    },

    // Get notifications by type
    getNotificationsByType: async (
        userId: string,
        type: string
    ): Promise<Notification[]> => {
        try {
            const prismaNotifications = await prisma.notification.findMany({
                where: {
                    userId: userId
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
            
            const notifications = prismaNotifications.map(convertPrismaNotificationToNotification);
            
            return notifications.filter(n => n.reference.type === type);
        } catch (error) {
            console.error('Error fetching notifications by type:', error);
            throw new Error('Failed to fetch notifications by type');
        }
    },

    // Get notification statistics for a user with enhanced filtering
    getNotificationStats: async (userId: string): Promise<{
        total: number;
        unread: number;
        read: number;
        byType: Record<string, number>;
        byStatus: Record<string, number>;
    }> => {
        try {
            const prismaNotifications = await prisma.notification.findMany({
                where: { userId },
                select: {
                    isRead: true,
                    reference: true
                }
            });
            
            const total = prismaNotifications.length;
            const unread = prismaNotifications.filter(n => !n.isRead).length;
            const read = total - unread;
            
            // Count by type and status
            const byType: Record<string, number> = {};
            const byStatus: Record<string, number> = {};
            
            prismaNotifications.forEach(notification => {
                try {
                    const reference = parseNotificationReference(notification.reference);
                    const type = reference.type;
                    const status = reference.status;
                    
                    byType[type] = (byType[type] || 0) + 1;
                    byStatus[status] = (byStatus[status] || 0) + 1;
                } catch (error) {
                    console.error('Error parsing notification reference:', error);
                }
            });
            
            return {
                total,
                unread,
                read,
                byType,
                byStatus
            };
        } catch (error) {
            console.error('Error getting notification stats:', error);
            throw new Error('Failed to get notification statistics');
        }
    }
};