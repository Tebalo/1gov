'use client'
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "@/app/components/dashboard/search";
import { InvestigationsTable } from "../investigations-table";
import { TipOffsTable } from "../tipoffs-table";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Role, hasPermission } from "@/app/lib/store";
import CPDTable from "../cpd-table";
import AppealsTable from "../appeals-table";
import RevocationTable from "../revocation/revocation-table";
import RenewalTable from "../renewal/renewal-table";
import ChangeOfCategoryTable from "../changeofcategory/changeofcategory-table";
import RestorationTable from "../restoration/restoration-table";
import { StudentTeacherTable } from "../studentteacher/studentteacher-table";
import TeacherTable from "../teacher/teacher-table";

interface Props {
  userRole: Role;
}

// Custom hook for safe localStorage access with SSR support
const useLocalStorage = (key: string, defaultValue: string) => {
  const [storedValue, setStoredValue] = useState<string>(defaultValue);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(item);
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  const setValue = (value: string) => {
    try {
      setStoredValue(value);
      if (isClient) {
        window.localStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, isClient] as const;
};

// Define available tables and their required permissions
const AVAILABLE_TABLES = {
  'Investigation Incoming': {
    requiredPermission: 'view:complaints-incoming' as const,
    status: 'INCOMING',
    component: InvestigationsTable
  },
  'Investigation Under Review': {
    requiredPermission: 'view:complaints-review' as const,
    status: 'UNDER-REVIEW',
    component: InvestigationsTable
  },
  'Investigation Assessment': {
    requiredPermission: 'view:complaints-assessment' as const,
    status: 'ASSESSMENT',
    component: InvestigationsTable
  },
  'Tip Offs': {
    requiredPermission: 'view:tipoffs' as const,
    status: 'INCOMING',
    component: TipOffsTable
  },
  'Investigation Ongoing': {
    requiredPermission: 'view:complaints-ongoing-investigation' as const,
    status: 'ONGOING-INVESTIGATION',
    component: InvestigationsTable
  },
  'Investigation Ongoing Disciplinary': {
    requiredPermission: 'view:complaints-ongoing-disciplinary' as const,
    status: 'ONGOING-DISCIPLINARY',
    component: InvestigationsTable
  },
  'Investigation Completed': {
    requiredPermission: 'view:complaints-investigation-complete' as const,
    status: 'INVESTIGATION-COMPLETE',
    component: InvestigationsTable
  },
  'Investigation External-Review Recommended': {
    requiredPermission: 'view:complaints-recommend-for-external-investigation' as const,
    status: 'RECOMMEND-FOR-EXTERNAL-INVESTIGATION',
    component: InvestigationsTable
  },
  'Investigation Disciplinary Recommended': {
    requiredPermission: 'view:complaints-recommend-for-disciplinary' as const,
    status: 'RECOMMEND-FOR-DISCIPLINARY',
    component: InvestigationsTable
  },
  'Investigation Closure Recommended': {
    requiredPermission: 'view:complaints-recommend-for-closure' as const,
    status: 'RECOMMEND-FOR-CLOSURE',
    component: InvestigationsTable
  },
  'Investigation RE-Investigation Recommended': {
    requiredPermission: 'view:complaints-recommend-for-investigation' as const,
    status: 'RECOMMEND-FOR-INVESTIGATION',
    component: InvestigationsTable
  },
  'Investigation External-Review': {
    requiredPermission: 'view:complaints-external-investigation' as const,
    status: 'EXTERNAL-INVESTIGATION',
    component: InvestigationsTable
  },
  'Investigation Closed Cases': {
    requiredPermission: 'view:complaints-closed' as const,
    status: 'CASE-CLOSED',
    component: InvestigationsTable
  },
  'CPD Pending Screening': {
    requiredPermission: 'view:cpd-pending-screening' as const,
    status: 'PENDING-SCREENING',
    component: CPDTable
  },
  'CPD Pending Verification': {
    requiredPermission: 'view:cpd-pending-verification' as const,
    status: 'PENDING-VERIFICATION',
    component: CPDTable
  },
  'CPD Recommeded for Approval': {
    requiredPermission: 'view:cpd-recommed-for-approval' as const,
    status: 'RECOMMEND-FOR-APPROVAL',
    component: CPDTable
  },
  'Appeal Pending Screening': {
    requiredPermission: 'view:appeal-pending-screening' as const,
    status: 'PENDING-SCREENING',
    component: AppealsTable
  },
  'Appeal Pending Assessment': {
    requiredPermission: 'view:appeal-pending-assessment' as const,
    status: 'PENDING-ASSESSMENT',
    component: AppealsTable
  },
  'Appeal Pending Approval': {
    requiredPermission: 'view:appeal-pending-approval' as const,
    status: 'PENDING-APPROVAL',
    component: AppealsTable
  },
  'Appeal Recommended for Approval': {
    requiredPermission: 'view:appeal-recommed-for-approval' as const,
    status: 'RECOMMEND-FOR-APPROVAL',
    component: AppealsTable
  },
  'Appeal Recommended for Rejection': {
    requiredPermission: 'view:appeal-recommed-for-rejection' as const,
    status: 'RECOMMEND-FOR-REJECTION',
    component: AppealsTable
  },
  'Appeal Recommended for Investigation': {
    requiredPermission: 'view:appeal-recommed-for-investigation' as const,
    status: 'RECOMMEND-FOR-INVESTIGATION',
    component: AppealsTable
  },
  'Revocation Pending Screening': {
    requiredPermission: 'view:revocation-pending-screening' as const,
    status: 'PENDING-SCREENING',
    component: RevocationTable
  },
  'Revocation Pending Assessment': {
    requiredPermission: 'view:revocation-pending-assessment' as const,
    status: 'PENDING-ASSESSMENT',
    component: RevocationTable
  },
  'Revocation Pending Approval': {
    requiredPermission: 'view:revocation-pending-approval' as const,
    status: 'PENDING-APPROVAL',
    component: RevocationTable
  },
  'Revocation Pending Endorsement': {
    requiredPermission: 'view:revocation-pending-endorsement' as const,
    status: 'PENDING-ENDORSEMENT',
    component: RevocationTable
  },
  'Renewal Pending Screening': {
    requiredPermission: 'view:renewal-pending-screening' as const,
    status: 'Pending-Screening',
    component: RenewalTable
  },
  'Renewal Pending Assessment': {
    requiredPermission: 'view:renewal-pending-assessment' as const,
    status: 'Pending-Assessment',
    component: RenewalTable
  },
  'Renewal Pending Manager Approval': {
    requiredPermission: 'view:renewal-recommended-for-approval' as const,
    status: 'Pending-Manager-Approval',
    component: RenewalTable
  },
  'Renewal Pending Endorsement': {
    requiredPermission: 'view:renewal-pending-endorsement' as const,
    status: 'Pending-Endorsement',
    component: RenewalTable
  },
  'Renewal Endorsement Complete': {
    requiredPermission: 'view:renewal-endorsement-complete' as const,
    status: 'Endorsement-Complete',
    component: RenewalTable
  },
  'Category Pending Screening': {
    requiredPermission: 'view:changeofcategory-pending-screening' as const,
    status: 'Pending-Screening',
    component: ChangeOfCategoryTable
  },
  'Category Pending Assessment': {
    requiredPermission: 'view:changeofcategory-pending-assessment' as const,
    status: 'Pending-Assessment',
    component: ChangeOfCategoryTable
  },
  'Category Pending Manager Approval': {
    requiredPermission: 'view:changeofcategory-pending-manager-approval' as const,
    status: 'Pending-Manager-Approval',
    component: ChangeOfCategoryTable
  },
  'Category Pending Endorsement': {
    requiredPermission: 'view:changeofcategory-pending-endorsement' as const,
    status: 'Pending-Endorsement',
    component: ChangeOfCategoryTable
  },
  'Category Endorsement Complete': {
    requiredPermission: 'view:changeofcategory-endorsement-complete' as const,
    status: 'Endorsement-Complete',
    component: ChangeOfCategoryTable
  },
  'Restoration Pending Screening': {
    requiredPermission: 'view:restoration-pending-screening' as const,
    status: 'Pending-Screening',
    component: RestorationTable
  },
  'Restoration Pending Assessment': {
    requiredPermission: 'view:restoration-pending-assessment' as const,
    status: 'Pending-Assessment',
    component: RestorationTable
  },
  'Restoration Pending Manager Approval': {
    requiredPermission: 'view:restoration-pending-manager-approval' as const,
    status: 'Pending-Manager-Approval',
    component: RestorationTable
  },
  'Restoration Pending-Endorsement': {
    requiredPermission: 'view:restoration-pending-endorsement' as const,
    status: 'Pending-Endorsement',
    component: RestorationTable
  },
  'Restoration Endorsement Complete': {
    requiredPermission: 'view:restoration-endorsement-complete' as const,
    status: 'Endorsement-Complete',
    component: RestorationTable
  },
  'Student Pending Screening': {
    requiredPermission: 'view:registration-pending-screening' as const,
    status: 'Pending-Screening',
    component: StudentTeacherTable
  },
  'Student Pending Assessment': {
    requiredPermission: 'view:registration-pending-assessment' as const,
    status: 'Pending-Assessment',
    component: StudentTeacherTable
  },
  'Student Pending Manager Approval': {
    requiredPermission: 'view:registration-pending-manager-approval' as const,
    status: 'Pending-Manager-Approval',
    component: StudentTeacherTable
  },
  'Student Pending-Endorsement': {
    requiredPermission: 'view:registration-pending-endorsement' as const,
    status: 'Pending-Endorsement',
    component: StudentTeacherTable
  },
  'Student Endorsement Complete': {
    requiredPermission: 'view:registration-endorsement-complete' as const,
    status: 'Endorsement-Complete',
    component: StudentTeacherTable
  },
  'Teacher Pending Screening': {
    requiredPermission: 'view:registration-pending-screening' as const,
    status: 'Pending-Screening',
    component: TeacherTable
  },
  'Teacher Pending Assessment': {
    requiredPermission: 'view:registration-pending-assessment' as const,
    status: 'Pending-Assessment',
    component: TeacherTable
  },
  'Teacher Pending Manager Approval': {
    requiredPermission: 'view:registration-pending-manager-approval' as const,
    status: 'Pending-Manager-Approval',
    component: TeacherTable
  },
  'Teacher Pending-Endorsement': {
    requiredPermission: 'view:registration-pending-endorsement' as const,
    status: 'Pending-Endorsement',
    component: TeacherTable
  },
  'Teacher Endorsement Complete': {
    requiredPermission: 'view:registration-endorsement-complete' as const,
    status: 'Endorsement-Complete',
    component: TeacherTable
  },
} as const;

export const Work = ({ userRole }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const availableTables = Object.entries(AVAILABLE_TABLES).filter(([_, config]) => 
    hasPermission(userRole, config.requiredPermission)
  );

  const defaultTable = availableTables.length > 0 ? availableTables[0][0] : '';
  
  // Use localStorage hook for fallback storage
  const [lastSelectedTable, setLastSelectedTable, isClient] = useLocalStorage('selectedWorkTable', defaultTable);
  
  // Priority-based table selection logic
  const getInitialTable = (): string => {
    // 1. First priority: URL parameter (highest priority - shareable, bookmarkable)
    const tableFromUrl = searchParams.get('table');
    if (tableFromUrl && availableTables.some(([name]) => name === tableFromUrl)) {
      return tableFromUrl;
    }
    
    // 2. Second priority: localStorage (user's last selection)
    if (isClient && lastSelectedTable && availableTables.some(([name]) => name === lastSelectedTable)) {
      return lastSelectedTable;
    }
    
    // 3. Third priority: First available table (fallback)
    return defaultTable;
  };

  const [selectedTable, setSelectedTable] = useState(getInitialTable);
  const [refreshKey, setRefreshKey] = useState(0);

  // Update initial table when client loads or available tables change
  useEffect(() => {
    const initialTable = getInitialTable();
    if (initialTable !== selectedTable) {
      setSelectedTable(initialTable);
      setRefreshKey(prev => prev + 1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient, lastSelectedTable, availableTables]);

  // Handle table selection changes
  const handleSelectChange = (newValue: string) => {
    setSelectedTable(newValue);
    setRefreshKey(prev => prev + 1);
    
    // Update localStorage for future visits
    setLastSelectedTable(newValue);
    
    // Update URL params for shareability (but don't override manual URL changes)
    const currentUrlTable = searchParams.get('table');
    if (currentUrlTable !== newValue) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('table', newValue);
      router.push(`?${params.toString()}`, { scroll: false });
    }
  };

  // Sync with URL parameter changes (e.g., browser back/forward, direct URL access)
  useEffect(() => {
    const tableFromUrl = searchParams.get('table');
    
    if (tableFromUrl) {
      // If URL has a valid table parameter, use it
      if (availableTables.some(([name]) => name === tableFromUrl)) {
        if (tableFromUrl !== selectedTable) {
          setSelectedTable(tableFromUrl);
          setLastSelectedTable(tableFromUrl); // Also update localStorage
          setRefreshKey(prev => prev + 1);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, availableTables]);

  const renderTable = () => {
    if (!selectedTable) return null;

    const config = AVAILABLE_TABLES[selectedTable as keyof typeof AVAILABLE_TABLES];
    if (!config) return null;
    
    const TableComponent = config.component;

    return (
      <TableComponent
        key={refreshKey}
        status={config.status}
        userRole={userRole}
      />
    );
  };

  return (
    <>
      <div className="bg-white w-full p-4 rounded-lg shadow-sm border mb-2">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Left Section - Select and Filters */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Assignment source</Label>
            <div className="flex items-center gap-3">
              <Select 
                onValueChange={handleSelectChange} 
                value={selectedTable}
              >
                <SelectTrigger className="w-[300px] bg-white">
                  <SelectValue placeholder="Select work basket" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Work queues</SelectLabel>
                    {availableTables.map(([tableName]) => (
                      <SelectItem key={tableName} value={tableName}>
                        {tableName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Right Section - Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {hasPermission(userRole, 'create:complaints') && (
              <Link 
                href="/trls/work/investigation/create" 
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Plus className="h-4 w-4" />
                Investigation
              </Link>
            )}
            {hasPermission(userRole, 'create:tipoffs') && (
              <Link 
                href="/trls/work/tipoff/create" 
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <Plus className="h-4 w-4" />
                Tip-off
              </Link>
            )}
          </div>
        </div>

        {/* Search Bar */}
        {hasPermission(userRole, 'view:search-registration') && (
          <div className="mt-4 md:mt-6">
            <Search />
          </div>
        )}
      </div>
      
      {renderTable()}
    </>
  );
};