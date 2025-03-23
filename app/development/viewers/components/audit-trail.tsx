import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { User, Clock, AlertCircle, ChevronDown, ChevronUp, Filter } from 'lucide-react';

// Audit event types
export type AuditActionType = 
  | 'status_change'
  | 'case_created'
  | 'case_updated'
  | 'comment_added'
  | 'document_added'
  | 'assignment_changed'
  | 'case_reopened'
  | 'sla_updated'
  | 'priority_changed';

// Define the structure for a user
export interface UserInfo {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

// Define the audit trail entry structure
export interface AuditTrailEntry {
  id: string;
  timestamp: Date;
  action: AuditActionType;
  user: UserInfo;
  details: {
    field?: string;
    oldValue?: string;
    newValue?: string;
    description?: string;
    metadata?: Record<string, any>;
  };
}

// Props for the AuditTrail component
interface AuditTrailProps {
  caseId: string;
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
    default:
      return <AlertCircle className="text-gray-500" />;
  }
};

// Function to generate description text based on action type
const getActionDescription = (entry: AuditTrailEntry): string => {
  const { action, details, user } = entry;
  
  switch (action) {
    case 'status_change':
      return `${user.name} changed status from "${details.oldValue}" to "${details.newValue}"`;
    case 'case_created':
      return `${user.name} created this case`;
    case 'case_updated':
      return `${user.name} updated ${details.field ? `the ${details.field}` : 'case details'}`;
    case 'comment_added':
      return `${user.name} added a comment: "${details.description?.substring(0, 50)}${details.description && details.description.length > 50 ? '...' : ''}"`;
    case 'document_added':
      return `${user.name} added document: ${details.description || 'Unnamed document'}`;
    case 'assignment_changed':
      return `${user.name} changed assignment from ${details.oldValue || 'unassigned'} to ${details.newValue}`;
    case 'case_reopened':
      return `${user.name} reopened the case`;
    case 'sla_updated':
      return `${user.name} updated the SLA deadline`;
    case 'priority_changed':
      return `${user.name} changed priority from "${details.oldValue}" to "${details.newValue}"`;
    default:
      return details.description || 'Performed an action on the case';
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
    default:
      return 'border-gray-200 bg-gray-50';
  }
};

// Service for fetching and adding audit trail entries
export const AuditTrailService = {
  // Fetch audit trail for a specific case
  fetchAuditTrail: async (caseId: string): Promise<AuditTrailEntry[]> => {
    // This would be replaced with an actual API call
    // For now, returning mock data
    return mockAuditTrail.filter(entry => entry.id.startsWith(`case-${caseId}`));
  },

  // Add a new audit entry
  addAuditEntry: async (caseId: string, entry: Omit<AuditTrailEntry, 'id'>): Promise<AuditTrailEntry> => {
    // This would be replaced with an actual API call
    const newEntry = {
      ...entry,
      id: `case-${caseId}-${Date.now()}`
    };
    
    // In a real implementation, this would be sent to the server
    console.log('New audit entry recorded:', newEntry);
    
    return newEntry;
  }
};

// Custom hook for audit trail operations
export const useAuditTrail = (caseId: string) => {
  const [auditTrail, setAuditTrail] = useState<AuditTrailEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Load the audit trail
  const loadAuditTrail = async () => {
    try {
      setIsLoading(true);
      const data = await AuditTrailService.fetchAuditTrail(caseId);
      setAuditTrail(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load audit trail'));
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new audit entry
  const addAuditEntry = async (
    action: AuditActionType,
    user: UserInfo,
    details: AuditTrailEntry['details']
  ) => {
    try {
      const newEntry = await AuditTrailService.addAuditEntry(caseId, {
        timestamp: new Date(),
        action,
        user,
        details
      });
      
      setAuditTrail(prev => [newEntry, ...prev]);
      return newEntry;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add audit entry'));
      throw err;
    }
  };

  // Load data on initial render
  useEffect(() => {
    loadAuditTrail();
  }, [caseId]);

  return {
    auditTrail,
    isLoading,
    error,
    addAuditEntry,
    refreshAuditTrail: loadAuditTrail
  };
};

// Component for displaying a single audit trail entry
const AuditTrailEntry: React.FC<{
  entry: AuditTrailEntry;
  isExpanded: boolean;
  onToggleExpand: () => void;
}> = ({ entry, isExpanded, onToggleExpand }) => {
  const actionColorClass = getActionColorClass(entry.action);
  
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
            
            {(entry.details.metadata || entry.details.description) && (
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
              {entry.details.description && (
                <div className="mb-2">
                  <span className="font-semibold">Description: </span> 
                  {entry.details.description}
                </div>
              )}
              
              {entry.details.metadata && Object.keys(entry.details.metadata).length > 0 && (
                <div className="bg-gray-50 p-2 rounded text-xs font-mono">
                  {JSON.stringify(entry.details.metadata, null, 2)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main AuditTrail component
export const AuditTrail: React.FC<AuditTrailProps> = ({ 
  caseId, 
  className = '', 
  maxHeight = '600px',
  showFilters = true
}) => {
  const { auditTrail, isLoading, error, refreshAuditTrail } = useAuditTrail(caseId);
  const [expandedEntries, setExpandedEntries] = useState<Record<string, boolean>>({});
  const [filterAction, setFilterAction] = useState<AuditActionType | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  
  // Toggle expanded state for an entry
  const toggleExpand = (entryId: string) => {
    setExpandedEntries(prev => ({
      ...prev,
      [entryId]: !prev[entryId]
    }));
  };
  
  // Filter and sort entries
  const filteredEntries = auditTrail
    .filter(entry => filterAction === 'all' || entry.action === filterAction)
    .sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Audit Trail</h2>
        
        <button 
          onClick={refreshAuditTrail}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Refresh
        </button>
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
        className="p-4 overflow-y-auto" 
        style={{ maxHeight }}
      >
        {isLoading ? (
          <div className="py-8 text-center text-gray-500">
            Loading audit trail...
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">
            Error loading audit trail: {error.message}
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
  );
};

// Sample mock data for demonstration
const mockAuditTrail: AuditTrailEntry[] = [
  {
    id: 'case-1001-1',
    timestamp: new Date('2023-08-15T14:32:10'),
    action: 'case_created',
    user: {
      id: 'user123',
      name: 'John Smith',
      role: 'investigations_officer'
    },
    details: {
      description: 'Initial case creation',
      metadata: {
        caseType: 'complaint',
        source: 'web_form'
      }
    }
  },
  {
    id: 'case-1001-2',
    timestamp: new Date('2023-08-15T14:45:22'),
    action: 'status_change',
    user: {
      id: 'user123',
      name: 'John Smith',
      role: 'investigations_officer'
    },
    details: {
      field: 'status',
      oldValue: 'incoming',
      newValue: 'under-review',
      description: 'Case submitted for review'
    }
  },
  {
    id: 'case-1001-3',
    timestamp: new Date('2023-08-15T16:20:47'),
    action: 'comment_added',
    user: {
      id: 'user456',
      name: 'Sarah Johnson',
      role: 'senior_investigations_officer'
    },
    details: {
      description: 'Initial review completed. Requires more supporting documents before proceeding to assessment.'
    }
  },
  {
    id: 'case-1001-4',
    timestamp: new Date('2023-08-16T09:12:33'),
    action: 'document_added',
    user: {
      id: 'user123',
      name: 'John Smith',
      role: 'investigations_officer'
    },
    details: {
      description: 'Supporting Evidence.pdf',
      metadata: {
        fileSize: '2.4MB',
        fileType: 'application/pdf'
      }
    }
  },
  {
    id: 'case-1001-5',
    timestamp: new Date('2023-08-16T10:30:15'),
    action: 'status_change',
    user: {
      id: 'user456',
      name: 'Sarah Johnson',
      role: 'senior_investigations_officer'
    },
    details: {
      field: 'status',
      oldValue: 'under-review',
      newValue: 'assessment',
      description: 'Case meets criteria for further assessment'
    }
  },
  {
    id: 'case-1001-6',
    timestamp: new Date('2023-08-18T11:45:22'),
    action: 'assignment_changed',
    user: {
      id: 'user789',
      name: 'Michael Thompson',
      role: 'investigations_manager'
    },
    details: {
      oldValue: 'Investigations Team',
      newValue: 'David Wilson',
      description: 'Assigned to senior investigator'
    }
  },
  {
    id: 'case-1001-7',
    timestamp: new Date('2023-08-18T13:20:10'),
    action: 'status_change',
    user: {
      id: 'user789',
      name: 'Michael Thompson',
      role: 'investigations_manager'
    },
    details: {
      field: 'status',
      oldValue: 'assessment',
      newValue: 'ongoing-investigation',
      description: 'Investigation initiated following assessment'
    }
  },
  {
    id: 'case-1001-8',
    timestamp: new Date('2023-08-25T16:05:42'),
    action: 'priority_changed',
    user: {
      id: 'user789',
      name: 'Michael Thompson',
      role: 'investigations_manager'
    },
    details: {
      field: 'priority',
      oldValue: 'Medium',
      newValue: 'High',
      description: 'Priority escalated due to new evidence'
    }
  },
  {
    id: 'case-1001-9',
    timestamp: new Date('2023-09-10T10:15:33'),
    action: 'sla_updated',
    user: {
      id: 'user789',
      name: 'Michael Thompson',
      role: 'investigations_manager'
    },
    details: {
      oldValue: '2023-09-15',
      newValue: '2023-09-30',
      description: 'SLA deadline extended due to complexity of the case',
      metadata: {
        approvedBy: 'Director of Investigations',
        reason: 'Case complexity'
      }
    }
  },
  {
    id: 'case-1001-10',
    timestamp: new Date('2023-09-28T14:45:20'),
    action: 'status_change',
    user: {
      id: 'user456',
      name: 'Sarah Johnson',
      role: 'senior_investigations_officer'
    },
    details: {
      field: 'status',
      oldValue: 'ongoing-investigation',
      newValue: 'investigation-complete',
      description: 'Investigation completed with findings'
    }
  }
];

// Example usage component
export const CaseDetailPage: React.FC = () => {
  // This would typically come from your router or state management
  const caseId = '1001';
  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Case #1001: Misconduct Investigation</h1>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">Investigation Complete</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Priority</p>
                <p className="font-medium">High</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Assigned To</p>
                <p className="font-medium">David Wilson</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">SLA Deadline</p>
                <p className="font-medium">Sep 30, 2023</p>
              </div>
            </div>
            
            {/* Case content would go here */}
            <p className="text-gray-600 mb-4">
              This case involves allegations of misconduct by a department officer. 
              Investigation has been completed and findings have been documented.
            </p>
          </div>
          
          {/* Other case sections like documents, comments, etc. would go here */}
        </div>
        
        <div className="lg:col-span-1">
          <AuditTrail 
            caseId={caseId} 
            maxHeight="800px"
          />
        </div>
      </div>
    </div>
  );
};

export default AuditTrail;