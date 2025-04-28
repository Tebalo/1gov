'use client'

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { User, Clock, AlertCircle, ChevronDown, ChevronUp, Filter, Loader2 } from 'lucide-react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from '@/components/ui/button';
import { useAuditTrail } from '@/lib/hooks/useAuditTrail';  // Import the API-based hook
import { getAccessGroups } from '@/app/auth/auth';

// We'll use the API types
export type AuditActionType = 
  | 'status_change'
  | 'case_created'
  | 'case_updated'
  | 'comment_added'
  | 'document_added'
  | 'assignment_changed'
  | 'case_reopened'
  | 'sla_updated'
  | 'priority_changed'
  | 'viewed';

export interface UserInfo {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
}

// Updated to match the API response structure
interface AuditTrailEntry {
  id: string;
  timestamp: string;  // API returns timestamps as strings
  action: AuditActionType;
  userId: string;
  userName: string;
  userRole?: string;
  caseId: string;
  caseType: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
  description?: string;
  metadata?: string;  // API returns metadata as JSON string
}

// Props for the AuditTrail component
interface AuditTrailProps {
  caseId: string;
  caseType: string;
  // currentUser: UserInfo;
  className?: string;
  maxHeight?: string;
  showFilters?: boolean;
}

// Function to get appropriate icon for action type
const getActionIcon = (action: AuditActionType) => {
  switch (action) {
    case 'status_change':
      return <AlertCircle className="text-blue-500" />;
    case 'case_created':
    case 'case_updated':
      return <Clock className="text-green-500" />;
    case 'comment_added':
      return <AlertCircle className="text-purple-500" />;
    case 'document_added':
      return <AlertCircle className="text-yellow-500" />;
    case 'assignment_changed':
      return <User className="text-indigo-500" />;
    case 'case_reopened':
      return <AlertCircle className="text-red-500" />;
    case 'sla_updated':
      return <Clock className="text-orange-500" />;
    case 'priority_changed':
      return <AlertCircle className="text-pink-500" />;
    case 'viewed':
      return <User className="text-gray-500" />;
    default:
      return <AlertCircle className="text-gray-500" />;
  }
};

// Function to generate description text based on action type
const getActionDescription = (entry: AuditTrailEntry): string => {
  const { action, userName } = entry;
  
  switch (action) {
    case 'status_change':
      return `${userName} changed status from "${entry.oldValue}" to "${entry.newValue}"`;
    case 'case_created':
      return `${userName} created this case`;
    case 'case_updated':
      return `${userName} updated ${entry.field ? `the ${entry.field}` : 'case details'}`;
    case 'comment_added':
      return `${userName} added a comment: "${entry.description?.substring(0, 50)}${entry.description && entry.description.length > 50 ? '...' : ''}"`;
    case 'document_added':
      return `${userName} added document: ${entry.description || 'Unnamed document'}`;
    case 'assignment_changed':
      return `${userName} changed assignment from ${entry.oldValue || 'unassigned'} to ${entry.newValue}`;
    case 'case_reopened':
      return `${userName} reopened the case`;
    case 'sla_updated':
      return `${userName} updated the SLA deadline`;
    case 'priority_changed':
      return `${userName} changed priority from "${entry.oldValue}" to "${entry.newValue}"`;
    case 'viewed':
      return `${userName} viewed the case`;
    default:
      return entry.description || 'Performed an action on the case';
  }
};

// Function to get color class based on action type
const getActionColorClass = (action: AuditActionType): string => {
  switch (action) {
    case 'status_change':
      return 'border-blue-200 bg-blue-50';
    case 'case_created':
      return 'border-green-200 bg-green-50';
    case 'case_updated':
      return 'border-green-200 bg-green-50';
    case 'comment_added':
      return 'border-purple-200 bg-purple-50';
    case 'document_added':
      return 'border-yellow-200 bg-yellow-50';
    case 'assignment_changed':
      return 'border-indigo-200 bg-indigo-50';
    case 'case_reopened':
      return 'border-red-200 bg-red-50';
    case 'sla_updated':
      return 'border-orange-200 bg-orange-50';
    case 'priority_changed':
      return 'border-pink-200 bg-pink-50';
    case 'viewed':
      return 'border-gray-200 bg-gray-50';
    default:
      return 'border-gray-200 bg-gray-50';
  }
};

// Component for displaying a single audit trail entry
const AuditTrailEntry: React.FC<{
  entry: AuditTrailEntry;
  isExpanded: boolean;
  onToggleExpand: () => void;
}> = ({ entry, isExpanded, onToggleExpand }) => {
  const actionColorClass = getActionColorClass(entry.action);
  
  // Parse the metadata if it exists and is a string
  const parsedMetadata = entry.metadata ? 
    (typeof entry.metadata === 'string' ? JSON.parse(entry.metadata) : entry.metadata) : 
    null;
  
  return (
    <div className={`border-l-4 p-3 mb-3 rounded-r shadow-sm ${actionColorClass}`}>
      <div className="flex items-start">
        <div className="mr-3 mt-1">
          {getActionIcon(entry.action)}
        </div>
        
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium text-gray-800">
                {getActionDescription(entry)}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {format(new Date(entry.timestamp), 'MMM d, yyyy • h:mm a')}
              </div>
            </div>
            
            {(parsedMetadata || entry.description) && (
              <button 
                onClick={onToggleExpand}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            )}
          </div>
          
          {isExpanded && (
            <div className="mt-3 text-sm border-t pt-2 text-gray-700">
              {entry.description && (
                <div className="mb-2">
                  <span className="font-semibold">Description: </span> 
                  {entry.description}
                </div>
              )}
              
              {parsedMetadata && Object.keys(parsedMetadata).length > 0 && (
                <div className="bg-gray-50 p-2 rounded text-xs font-mono">
                  {JSON.stringify(parsedMetadata, null, 2)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main AuditTrail component - updated to use the API-based hook
export const AuditTrail: React.FC<AuditTrailProps> = ({ 
  caseId, 
  caseType,
  //currentUser,
  className = '', 
  maxHeight = '600px',
  showFilters = true
}) => {
  // Use the API-based hook
  const { 
    fetchAuditTrail, 
    loading, 
    error,
    logCaseViewed
  } = useAuditTrail();
  
  const [auditEntries, setAuditEntries] = useState<AuditTrailEntry[]>([]);
  const [expandedEntries, setExpandedEntries] = useState<Record<string, boolean>>({});
  const [filterAction, setFilterAction] = useState<AuditActionType | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [currentUser, setCurrentUser] = useState<UserInfo>({
    name: '',
    role: '',
    id: '',
  });
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const profile = await getAccessGroups();
        if (profile && profile.current) {  // Add null check
            setCurrentUser(prev => ({
            ...prev,
            name: profile.username || '',
            role: profile.current.toLowerCase() || '',
            id: profile.userid || '',
          }));
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    initializeUser();
  }, []);
  // Toggle expanded state for an entry
  const toggleExpand = (entryId: string) => {
    setExpandedEntries(prev => ({
      ...prev,
      [entryId]: !prev[entryId]
    }));
  };
  
  // Load audit trail data
  const loadAuditTrail = async () => {
    const data = await fetchAuditTrail(caseId, caseType, {
      action: filterAction === 'all' ? undefined : filterAction,
      sortOrder: sortOrder
    });
    setAuditEntries(data);
  };
  
  // Log that the case was viewed when opening the audit trail
  const handleSheetOpen = async () => {
    try {
      // Refresh the audit trail to include the view event
      loadAuditTrail();
    } catch (error) {
      console.error("Failed to log case view:", error);
    }
  };
  
  // Load initial data
  useEffect(() => {
    loadAuditTrail();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId, caseType, filterAction, sortOrder]);
  
  // Filter entries - handled by the API now via the fetchAuditTrail parameters
  const filteredEntries = auditEntries;

  return (
    <Sheet onOpenChange={(isOpen) => { if (isOpen) handleSheetOpen(); }}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Clock className="mr-2" size={16} />
          Audit Trail
        </Button>
      </SheetTrigger>
      <SheetContent>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Audit Trail</h2>
            
            <Button 
              variant="ghost"
              size="sm"
              onClick={loadAuditTrail}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Refresh
            </Button>
          </div>
          
          {showFilters && (
            <div className="p-3 bg-gray-50 border-b flex flex-wrap gap-3 items-center">
              <div className="flex items-center">
                <Filter size={16} className="text-gray-500 mr-2" />
                <span className="text-sm text-gray-600 mr-2">Filter:</span>
                <select 
                  value={filterAction}
                  onChange={(e) => setFilterAction(e.target.value as AuditActionType | 'all')}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value="all">All Activities</option>
                  <option value="status_change">Status Changes</option>
                  <option value="case_created">Creation</option>
                  <option value="case_updated">Updates</option>
                  <option value="comment_added">Comments</option>
                  <option value="document_added">Documents</option>
                  <option value="assignment_changed">Assignments</option>
                  <option value="case_reopened">Reopening</option>
                  <option value="sla_updated">SLA Updates</option>
                  <option value="priority_changed">Priority Changes</option>
                  <option value="viewed">Views</option>
                </select>
              </div>
              
              <div className="flex items-center ml-auto">
                <span className="text-sm text-gray-600 mr-2">Sort:</span>
                <select 
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          )}
          
          <div 
            className="p-4 overflow-y-auto flex-1" 
            style={{ maxHeight: "calc(100vh - 160px)" }}
          >
            {loading ? (
              <div className="py-8 text-center text-gray-500 flex flex-col items-center">
                <Loader2 className="h-6 w-6 animate-spin mb-2" />
                Loading audit trail...
              </div>
            ) : error ? (
              <div className="py-8 text-center text-red-500">
                Error loading audit trail: {error}
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                No audit trail entries available.
              </div>
            ) : (
              filteredEntries.map(entry => (
                <AuditTrailEntry 
                  key={entry.id}
                  entry={entry}
                  isExpanded={!!expandedEntries[entry.id]}
                  onToggleExpand={() => toggleExpand(entry.id)}
                />
              ))
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AuditTrail;