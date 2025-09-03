'use client';
import { useUserData } from "@/lib/hooks/useUserData";
import { Bell, BellRing } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const {nationalId, passportId} = useUserData();
  const [userId, setUserId] = useState('');

  useEffect(() => {
    setUserId(nationalId || passportId || '');
  }, [nationalId, passportId]);

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
    if (!userId) return;

    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/notifications/user/${userId}/stats`);
        if (response.ok) {
          const data: NotificationStats = await response.json();
          
          // Use functional update to get current prevUnreadCount
          setPrevUnreadCount(currentPrevCount => {
            if (data.unread > currentPrevCount && currentPrevCount > 0) {
              setHasNewNotification(true);
              setTimeout(() => setHasNewNotification(false), 3000);
            }
            return data.unread;
          });
          
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
  }, [userId, refreshInterval]);

  // Format count for display
  const formatCount = (count: number) => {
    if (count > maxDisplay) {
      return `${maxDisplay}+`;
    }
    return count.toString();
  };

  // Get tooltip content
  const getTooltipContent = () => {
    if (error) {
      return (
        <div className="space-y-1">
          <div className="text-red-300 font-medium">Error</div>
          <div className="text-sm">{error}</div>
        </div>
      );
    }
    
    if (notificationsLoading) {
      return (
        <div className="text-sm">Loading notifications...</div>
      );
    }
    
    return (
      <div className="space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Total:</span>
            <span className="font-medium">{stats.total}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Unread:</span>
            <span className="font-medium text-orange-300">{stats.unread}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Read:</span>
            <span className="font-medium text-green-300">{stats.read}</span>
          </div>
        </div>
        
        {Object.keys(stats.byType).length > 0 && (
          <div className="space-y-2">
            <div className="text-xs text-gray-400 border-t border-gray-600 pt-2">
              By Type:
            </div>
            {Object.entries(stats.byType).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center text-sm">
                <span className="text-gray-300 truncate">{type}</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        )}
        
        {Object.keys(stats.byStatus).length > 0 && (
          <div className="space-y-2">
            <div className="text-xs text-gray-400 border-t border-gray-600 pt-2">
              By Status:
            </div>
            {Object.entries(stats.byStatus).map(([status, count]) => (
              <div key={status} className="flex justify-between items-center text-sm">
                <span className="text-gray-300">Status {status}</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
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

  const renderNotificationIcon = () => {
    // Loading state
    if (notificationsLoading) {
      return (
        <div className="relative">
          <Bell className="h-6 w-6 text-gray-400 animate-pulse" />
        </div>
      );
    }

    // Error state
    if (error && !notificationsLoading) {
      return (
        <div className="relative">
          <Bell className="h-6 w-6 text-red-500" />
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-3 h-3 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            !
          </span>
        </div>
      );
    }

    // Normal state
    return (
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
    );
  };

  const content = (
    <div 
      className={`relative cursor-pointer ${className}`}
      onClick={onClick}
    >
      {renderNotificationIcon()}
    </div>
  );

  // If tooltip is disabled, return the content directly
  if (!showTooltip) {
    return content;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent 
          side="bottom" 
          align="end"
          className="max-w-xs p-4 text-white bg-gray-900 border-gray-700"
        >
          {getTooltipContent()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};