'use client';
import { useUserData } from "@/lib/hooks/useUserData";
import { Bell, BellRing } from "lucide-react";
import { useEffect, useState } from "react";

interface NotificationStats {
  total: number;
  unread: number;
  read: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
}

interface NotificationCounterProps {
  showAnimation?: boolean;
  showTooltip?: boolean;
  maxDisplay?: number;
  refreshInterval?: number;
  className?: string;
  onClick?: () => void;
}

export const NotificationCounter: React.FC<NotificationCounterProps> = ({ 
  showAnimation = true,
  showTooltip = true,
  maxDisplay = 99,
  refreshInterval = 60000, // 1 minute default
  className = "",
  onClick
}) => {
  const { userData, loading, nationalId, passportId, userId, userRoles } = useUserData()
  console.log(userData?.profile.personal_info.national_id)
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    read: 0,
    byType: {},
    byStatus: {}
  });
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  // Keep track of previous unread count to detect new notifications
  const [prevUnreadCount, setPrevUnreadCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/notifications/user/${userId}/stats`);
        if (response.ok) {
          const data: NotificationStats = await response.json();
          
          // Check if there are new unread notifications
          if (data.unread > prevUnreadCount && prevUnreadCount > 0) {
            setHasNewNotification(true);
            // Reset animation after 3 seconds
            setTimeout(() => setHasNewNotification(false), 3000);
          }
          
          setPrevUnreadCount(data.unread);
          setStats(data);
          setError(null);
        } else {
          throw new Error('Failed to fetch notification stats');
        }
      } catch (error) {
        console.error('Failed to fetch notification stats:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setNotificationsLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, refreshInterval);

    return () => clearInterval(interval);
  }, [userId, refreshInterval, prevUnreadCount]);

  // Format count for display
  const formatCount = (count: number) => {
    if (count > maxDisplay) {
      return `${maxDisplay}+`;
    }
    return count.toString();
  };

  // Get tooltip content
  const getTooltipContent = () => {
    if (error) return `Error: ${error}`;
    if (notificationsLoading) return 'Loading notifications...';
    
    const typeBreakdown = Object.entries(stats.byType)
      .map(([type, count]) => `${type}: ${count}`)
      .join('\n');
    
    return `Total: ${stats.total}
    Unread: ${stats.unread}
    Read: ${stats.read}

    By Type:
    ${typeBreakdown || 'No notifications'}`;
  };

  const bellIcon = stats.unread > 0 ? (
    <BellRing className={`h-6 w-6 ${
      hasNewNotification && showAnimation ? 'animate-bounce' : ''
    } ${stats.unread > 0 ? 'text-blue-600' : 'text-gray-700'}`} />
  ) : (
    <Bell className="h-6 w-6 text-gray-700" />
  );

  const counterBadge = stats.unread > 0 && (
    <span className={`absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white rounded-full min-w-[1.25rem] h-5 ${
      hasNewNotification && showAnimation 
        ? 'bg-red-500 animate-pulse' 
        : 'bg-red-600'
    }`}>
      {formatCount(stats.unread)}
    </span>
  );

  return (
    <div 
      className={`relative cursor-pointer ${className}`}
      onClick={onClick}
      title={showTooltip ? getTooltipContent() : undefined}
    >
      {/* Loading state */}
      {notificationsLoading && (
        <div className="relative">
          <Bell className="h-6 w-6 text-gray-400 animate-pulse" />
        </div>
      )}

      {/* Error state */}
      {error && !notificationsLoading && (
        <div className="relative">
          <Bell className="h-6 w-6 text-red-500" />
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-3 h-3 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            !
          </span>
        </div>
      )}

      {/* Normal state */}
      {!notificationsLoading && !error && (
        <div className="relative">
          {bellIcon}
          {counterBadge}
          
          {/* Priority indicator for high-priority notifications */}
          {stats.byStatus && stats.byStatus['3'] > 0 && (
            <span className="absolute -bottom-1 -left-1 inline-flex items-center justify-center w-3 h-3 text-xs font-bold leading-none text-white bg-orange-500 rounded-full">
              !
            </span>
          )}
        </div>
      )}

      {/* Enhanced tooltip for desktop */}
      {showTooltip && (
        <div className="hidden group-hover:block absolute bottom-full right-0 mb-2 w-64 p-3 text-sm text-white bg-gray-800 rounded-lg shadow-lg z-50">
          {notificationsLoading && "Loading notifications..."}
          {error && `Error: ${error}`}
          {!notificationsLoading && !error && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-medium">{stats.total}</span>
              </div>
              <div className="flex justify-between">
                <span>Unread:</span>
                <span className="font-medium text-orange-300">{stats.unread}</span>
              </div>
              <div className="flex justify-between">
                <span>Read:</span>
                <span className="font-medium text-green-300">{stats.read}</span>
              </div>
              
              {Object.keys(stats.byType).length > 0 && (
                <>
                  <hr className="border-gray-600" />
                  <div className="text-xs text-gray-300">By Type:</div>
                  {Object.entries(stats.byType).map(([type, count]) => (
                    <div key={type} className="flex justify-between text-xs">
                      <span className="truncate">{type}</span>
                      <span>{count}</span>
                    </div>
                  ))}
                </>
              )}
              
              {Object.keys(stats.byStatus).length > 0 && (
                <>
                  <hr className="border-gray-600" />
                  <div className="text-xs text-gray-300">By Status:</div>
                  {Object.entries(stats.byStatus).map(([status, count]) => (
                    <div key={status} className="flex justify-between text-xs">
                      <span>Status {status}</span>
                      <span>{count}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
          
          {/* Tooltip arrow */}
          <div className="absolute bottom-full right-4 border-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
};