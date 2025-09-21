import { useState } from "react";
interface NotificationAttachment {
  link: string;
  type: 'payment' | 'invoice' | 'receipt' | 'general' | string;
}

interface NotificationReference {
  status: string;
  user_id: string;
  application_id: string;
  type: string;
  service_code: string;
}

interface NotificationPayload {
  title: string;
  message: string;
  description?: string;
  attachments?: NotificationAttachment[];
  fields?: Record<string, any>[];
}

interface Notification {
  id: string;
  userId: string;
  draft_id?: string | null;
  reference: NotificationReference;
  payload: NotificationPayload;
  isRead: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface NotificationResponse {
  notifications: Notification[];
  totalCount: number;
  hasMore: boolean;
}
export function useNotifications() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch notifications for a user
     * @param userId - ID of the user
     * @param page - Page number for pagination
     * @param limit - Number of notifications per page
     * @param unreadOnly - Whether to fetch only unread notifications
     * @returns A promise that resolves to an array of notifications
     *  
     */
    const fetchNotifications = async (userId: string, page: string, limit: string, unreadOnly: boolean): Promise<NotificationResponse[]> => {
        setLoading(true);
        setError(null);
        
        try{
            const response = await fetch(`/notifications?userId=${userId}&page=${page}&limit=${limit}&unreadOnly=${unreadOnly}`);
            if(!response.ok){
                throw new Error('Failed to fetch notifications')
            }
            const data = await response.json();
            return data;
        } catch(err){
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            return [];
        } finally{
            setLoading(false);
        }
    }
    /**
     * Mark a notification as read
     * @param notificationId - ID of the notification to mark as read
     * @returns A promise that resolves to the updated notification
     */
    const markAsRead = async (notificationId: string): Promise<Notification | null> => {
        setLoading(true);
        setError(null); 
        try{
            const response = await fetch(`/notifications/${notificationId}/read`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            }); 
            if(!response.ok){
                throw new Error('Failed to mark notification as read');
            }
            const data = await response.json();
            return data;
        } catch(err){
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            return null;
        } finally{
            setLoading(false);
        }
    }

    /**
     * Mark all notifications as read for a user
     * @param userId - ID of the user
     * @returns A promise that resolves to a boolean indicating success 
     */
    const markAllAsRead = async (userId: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try{
            const response = await fetch(`/notifications/user/${userId}/read-all`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if(!response.ok){
                throw new Error('Failed to mark all notifications as read');
            }
            return true;
        } catch(err){
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            return false;
        } finally{
            setLoading(false);
        }
    }

    /**
     * Delete a notification
     * @param notificationId - ID of the notification to delete
     * @returns A promise that resolves to a boolean indicating success
     */
    const deleteNotification = async (notificationId: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try{
            const response = await fetch(`/notifications/${notificationId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if(!response.ok){
                throw new Error('Failed to delete notification');
            }
            return true;
        } catch(err){
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            return false;
        } finally{
            setLoading(false);
        }
    }

    /**
     * Send a new notification
     * @param notificationData - Data for the new notification
     * @returns A promise that resolves to the created notification
     */
    const sendNotification = async (notificationData: Omit<Notification, 'id' | 'isRead' | 'createdAt' | 'updatedAt'>): Promise<Notification | null> => {
        setLoading(true);
        setError(null);
        try{
            const response = await fetch('/notifications', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(notificationData)
            });
            if(!response.ok){
                throw new Error('Failed to send notification');
            }
            const data = await response.json();
            return data;
        } catch(err){
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            return null;
        } finally{
            setLoading(false);
        }
    }

    return {
        loading,
        error,
        fetchNotifications,
        markAsRead,
        markAllAsRead
    }
}