export interface Notification {
    id: string;
    userId: string;
    link?: string;
    message: string;
    isRead: boolean;
}

export const notificationService = {
    // Fetch notifications for a user
    getUserNotifications: async (userId: string): Promise<Notification[]> => {
        // Placeholder for fetching notifications from a database
        return [];
    },  
    // Mark a notification as read
    markAsRead: async (notificationId: string): Promise<void> => {
        // Placeholder for updating notification status in a database
        return;
    },
    // Send a new notification
    sendNotification: async (userId: string, message: string, link?: string): Promise<Notification> => {
        // Placeholder for creating a new notification in a database
        return {
            id: 'new-id',
            userId,
            message,
            link,
            isRead: false
        };
    },
    // Open a notification 
    openNotification: async (notificationId: string): Promise<Notification | null> => {
        // Placeholder for fetching a single notification from a database
        return null;
    },
    // Delete a notification
    deleteNotification: async (notificationId: string): Promise<void> => {
        // Placeholder for deleting a notification from a database
        return;
    },
    // Count unread notifications for a user
    countUnread: async (userId: string): Promise<number> => {
        // Placeholder for counting unread notifications in a database
        return 0;
    }
};