'use client'
import { getAccessGroups } from "@/app/auth/auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCallback, useEffect, useState } from "react"
import { 
  Bell, 
  BellRing, 
  Check, 
  Eye, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Search, 
  Archive, 
  ExternalLink,
  FileText,
  CreditCard,
  Receipt,
  Tag,
  Hash,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from "next/navigation";

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

// Keep constants outside component to prevent re-renders
const BASE_URL = '/api';
const ITEMS_PER_PAGE = 5;

const Notifications = () => {
    //const {nationalId, passportId} = useUserData();
    const [userId, setUserId] = useState('');

    useEffect(() => {
      const fetchId = async () => {
        const result = await getAccessGroups();
        if (result) {
          setUserId(result.nationalId || result.passportId || result.userid);
        }
      };
      fetchId();
    }, []);

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [hasMore, setHasMore] = useState(false);

    // Enhanced filter state
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [stats, setStats] = useState({ 
      total: 0, 
      unread: 0, 
      read: 0,
      byType: {} as Record<string, number>,
      byStatus: {} as Record<string, number>
    });

    // Get icon for attachment type
    const getAttachmentIcon = (type: string) => {
      switch (type) {
        case 'payment': return <CreditCard className="h-3 w-3 text-green-600" />;
        case 'invoice': return <FileText className="h-3 w-3 text-blue-600" />;
        case 'receipt': return <Receipt className="h-3 w-3 text-purple-600" />;
        default: return <ExternalLink className="h-3 w-3 text-gray-600" />;
      }
    };

    // Get badge color for notification type
    const getTypeBadgeColor = (type: string) => {
      const colors: Record<string, string> = {
        'PushPayment': 'bg-green-100 text-green-800',
        'DocumentApproval': 'bg-blue-100 text-blue-800',
        'StatusUpdate': 'bg-yellow-100 text-yellow-800',
        'DocumentRequest': 'bg-orange-100 text-orange-800',
        'PassportApplication': 'bg-purple-100 text-purple-800',
        'LicenseRenewal': 'bg-indigo-100 text-indigo-800',
        'General': 'bg-gray-100 text-gray-800'
      };
      return colors[type] || 'bg-gray-100 text-gray-800';
    };

    // Get status badge color
    const getStatusBadgeColor = (status: string) => {
      const colors: Record<string, string> = {
        '1': 'bg-blue-100 text-blue-800',
        '2': 'bg-yellow-100 text-yellow-800',
        '3': 'bg-red-100 text-red-800',
        '4': 'bg-green-100 text-green-800'
      };
      return colors[status] || 'bg-gray-100 text-gray-800';
    };

    // Memoized functions to prevent dependency issues
    const fetchNotifications = useCallback(async (page = 1, unreadOnly = false, type = 'all', status = 'all') => {
      if (!userId) return; // Guard clause
      
      setLoading(true);
      try {
        const params = new URLSearchParams({
          userId,
          page: page.toString(),
          limit: ITEMS_PER_PAGE.toString(),
          unreadOnly: unreadOnly.toString()
        });

        if (type !== 'all') params.append('type', type);

        const response = await fetch(`${BASE_URL}/notifications?${params}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }

        const data: NotificationResponse = await response.json();
        
        // Filter by status on client side if needed
        let filteredNotifications = data.notifications;
        if (status !== 'all') {
          filteredNotifications = data.notifications.filter(n => n.reference.status === status);
        }
        
        setNotifications(filteredNotifications);
        setTotalCount(status !== 'all' ? filteredNotifications.length : data.totalCount);
        setHasMore(data.hasMore && status === 'all');
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    }, [userId]); // Only userId as dependency

    // Fetch enhanced notification statistics
    const fetchStats = useCallback(async () => {
      if (!userId) return; // Guard clause
      
      try {
        const response = await fetch(`${BASE_URL}/notifications/user/${userId}/stats`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    }, [userId]); // Only userId as dependency

    // Mark notification as read
    const markAsRead = useCallback(async (notificationId: string) => {
      try {
        const response = await fetch(`${BASE_URL}/notifications/${notificationId}/read`, {
          method: 'PATCH',
        });

        if (response.ok) {
          setNotifications(prev =>
            prev.map(notif =>
              notif.id === notificationId ? { ...notif, isRead: true } : notif
            )
          );
          fetchStats();
        }
      } catch (err) {
        console.error('Failed to mark as read:', err);
      }
    }, [fetchStats]);

    // Mark all as read
    const markAllAsRead = useCallback(async () => {
      if (!userId) return;
      
      try {
        const response = await fetch(`${BASE_URL}/notifications/user/${userId}/read-all`, {
          method: 'PATCH',
        });

        if (response.ok) {
          setNotifications(prev =>
            prev.map(notif => ({ ...notif, isRead: true }))
          );
          fetchStats();
        }
      } catch (err) {
        console.error('Failed to mark all as read:', err);
      }
    }, [userId, fetchStats]);

    // Delete notification
    const deleteNotification = useCallback(async (notificationId: string) => {
      try {
        const response = await fetch(`${BASE_URL}/notifications/${notificationId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
          fetchStats();
        }
      } catch (err) {
        console.error('Failed to delete notification:', err);
      }
    }, [fetchStats]);

    // Open attachment
    const openAttachment = useCallback((attachment: NotificationAttachment, notification: Notification) => {
      if (!notification.isRead) {
        markAsRead(notification.id);
      }
      window.open(attachment.link, '_blank');
    }, [markAsRead]);

    // Handle filter changes
    const handleFilterChange = useCallback(() => {
      const newUnreadOnly = !showUnreadOnly;
      setShowUnreadOnly(newUnreadOnly);
      setCurrentPage(1);
      fetchNotifications(1, newUnreadOnly, selectedType, selectedStatus);
    }, [showUnreadOnly, selectedType, selectedStatus, fetchNotifications]);

    const handleTypeFilter = useCallback((type: string) => {
      setSelectedType(type);
      setCurrentPage(1);
      fetchNotifications(1, showUnreadOnly, type, selectedStatus);
    }, [showUnreadOnly, selectedStatus, fetchNotifications]);

    const handleStatusFilter = useCallback((status: string) => {
      setSelectedStatus(status);
      setCurrentPage(1);
      fetchNotifications(1, showUnreadOnly, selectedType, status);
    }, [showUnreadOnly, selectedType, fetchNotifications]);

    // Handle page change
    const handlePageChange = useCallback((newPage: number) => {
      setCurrentPage(newPage);
      fetchNotifications(newPage, showUnreadOnly, selectedType, selectedStatus);
    }, [showUnreadOnly, selectedType, selectedStatus, fetchNotifications]);

    // Handle selection
    const toggleSelection = useCallback((notificationId: string) => {
      setSelectedNotifications(prev => {
        const newSet = new Set(prev);
        if (newSet.has(notificationId)) {
          newSet.delete(notificationId);
        } else {
          newSet.add(notificationId);
        }
        return newSet;
      });
    }, []);

    const selectAll = useCallback(() => {
      setSelectedNotifications(new Set(notifications.map(n => n.id)));
    }, [notifications]);

    const clearSelection = useCallback(() => {
      setSelectedNotifications(new Set());
    }, []);

    // Format date
    const formatDate = useCallback((dateString?: string) => {
      if (!dateString) return 'Unknown time';
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours}h ago`;
      if (diffInHours < 48) return 'Yesterday';
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }, []);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    const router = useRouter();

    // Load initial data - FIXED: Only depends on userId, no circular dependencies
    useEffect(() => {
      if (!userId) return;
      
      // Use hardcoded initial values to avoid dependency loops
      fetchNotifications(1, false, 'all', 'all');
      fetchStats();
    }, [userId, fetchNotifications, fetchStats]); // These are now memoized with useCallback

    const NotificationList = ({notifications}:{notifications: Notification[]}) => {
        return(
            <>
            {/* Enhanced Notifications List */}
            <div className="flex-1 overflow-auto">
              {notifications.length === 0 ? (
                <div className="p-8 lg:p-16 text-center">
                  <Bell className="h-12 w-12 lg:h-16 lg:w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                  <p className="text-sm lg:text-base text-gray-500">
                    {showUnreadOnly ? 'No unread notifications found.' : 'You have no notifications yet.'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-2 lg:gap-3 p-3 lg:p-4 hover:bg-gray-50 border-l-4 ${
                        !notification.isRead 
                          ? 'bg-blue-50/30 border-l-blue-500' 
                          : 'border-l-transparent'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedNotifications.has(notification.id)}
                        onChange={() => toggleSelection(notification.id)}
                        className="rounded border-gray-300 mt-1 flex-shrink-0"
                      />

                      <div className="flex-shrink-0 mt-1.5 lg:mt-1">
                        {notification.isRead ? (
                          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0 pr-2">
                            {/* Enhanced Title and Badges */}
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h3 className={`text-sm lg:text-base font-medium ${
                                notification.isRead ? 'text-gray-700' : 'text-gray-900'
                              }`}>
                                {notification.payload.title}
                              </h3>
                              <span className="text-xs text-gray-500 flex-shrink-0">
                                {formatDate(notification.createdAt)}
                              </span>
                            </div>

                            {/* Type and Status Badges */}
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                getTypeBadgeColor(notification.reference.type)
                              }`}>
                                <Tag className="h-3 w-3 mr-1" />
                                {notification.reference.type}
                              </span>
                              
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                getStatusBadgeColor(notification.reference.status)
                              }`}>
                                Status {notification.reference.status}
                              </span>

                              {/* <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                <Hash className="h-3 w-3 mr-1" />
                                {notification.reference.service_code}
                              </span> */}
                            </div>
                            
                            {/* Message */}
                            <p className={`text-sm leading-relaxed mb-2 ${
                              notification.isRead ? 'text-gray-600' : 'text-gray-700'
                            }`}>
                              {notification.payload.message}
                              {notification.draft_id && (
                                  <Button variant={"link"} onClick={()=>{router.push(`/customer/dashboard/teacher-application?draftId=${notification.draft_id}`)}}>{notification.draft_id}</Button>
                              )}
                            </p>

                            {/* Description */}
                            {notification.payload.description && notification.payload.description !== notification.payload.message && (
                              <p className="text-sm text-gray-500 mb-2">
                                {notification.payload.description}                             
                              </p>
                            )}

                            {/* Custom Fields */}
                            {notification.payload.fields && notification.payload.fields.length > 0 && (
                              <div className="mb-2">
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {notification.payload.fields.map((field, index) => (
                                      <Link
                                        key={index} 
                                        href={`/customer/dashboard/teacher-application?draftId=${notification.draft_id}`}
                                      >
                                        <span 
                                          key={index} 
                                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                                        >
                                          {field.replace(/_/g, ' ')}
                                        </span>
                                      </Link>
                                    ))}
                                  </div>
                              </div>
                            )}

                            {/* Attachments */}
                            {notification.payload.attachments && notification.payload.attachments.length > 0 && (
                              <div className="mb-2">
                                <div className="flex flex-wrap gap-2">
                                  {notification.payload.attachments.map((attachment, index) => (
                                    <button
                                      key={index}
                                      onClick={() => openAttachment(attachment, notification)}
                                      className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs transition-colors"
                                    >
                                      {getAttachmentIcon(attachment.type)}
                                      <span className="capitalize">{attachment.type}</span>
                                      <ExternalLink className="h-3 w-3" />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Application Info */}
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                App: {notification.reference.application_id.slice(0, 8)}...
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Action Buttons */}
                      <div className="flex items-start gap-0.5 lg:gap-1 mt-1 flex-shrink-0">
                        {notification.payload.attachments && notification.payload.attachments.length > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (notification.payload.attachments && notification.payload.attachments.length > 0) {
                                openAttachment(notification.payload.attachments[0], notification);
                              }
                            }}
                            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded touch-manipulation"
                            title="Open attachment"
                          >
                            <Eye className="h-3 w-3 lg:h-4 lg:w-4" />
                          </button>
                        )}
                        
                        {!notification.isRead && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            className="p-1.5 text-green-600 hover:bg-green-100 rounded touch-manipulation"
                            title="Mark as read"
                          >
                            <Check className="h-3 w-3 lg:h-4 lg:w-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-100 rounded touch-manipulation"
                          title="Delete"
                        >
                          <Trash2 className="h-3 w-3 lg:h-4 lg:w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            </>
        )
    }
    // Loading state UI
    if(loading && notifications){
        return(
            <div className="min-h-screen bg-white flex">
                <div className="w-full max-w-6xl mx-auto flex">
                    <div className="w-full bg-gray-50 border-r border-gray-200 p-4">
                        <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-8 bg-gray-200 rounded"></div>
                        <div className="space-y-2">
                            {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-6 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                        </div>
                    </div>
                    {/* <div className="flex-1 p-6">
                        <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="h-16 bg-gray-100 rounded"></div>
                        ))}
                        </div>
                    </div> */}
                </div>
            </div>
        )
    }

    return(
        <div className="min-h-screen bg-white flex">
            <Tabs defaultValue="all">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="unread">Unread</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                    <NotificationList notifications={notifications}/>
                </TabsContent>
                <TabsContent value="unread">
                    <NotificationList notifications={notifications}/>
                </TabsContent>
            </Tabs>
        </div>
    )
}



export default Notifications;