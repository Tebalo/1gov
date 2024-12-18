'use client'
import { useState } from "react";
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

interface Props {
  userRole: Role;
}

// Define available tables and their required permissions
const AVAILABLE_TABLES = {
  'Incoming Cases': { // Investigation
    requiredPermission: 'view:complaints-incoming' as const,
    status: 'INCOMING',
    component: InvestigationsTable
  },
  'Cases Under Review': { // Investigation
    requiredPermission: 'view:complaints-review' as const,
    status: 'UNDER-REVIEW',
    component: InvestigationsTable
  },
  'Assessment Cases': { // Investigation
    requiredPermission: 'view:complaints-assessment' as const,
    status: 'ASSESSMENT',
    component: InvestigationsTable
  },
  'Tip Offs': { // Tipoffs
    requiredPermission: 'view:tipoffs' as const,
    status: 'INCOMING',
    component: TipOffsTable
  },
  'Ongoing Investigations': { // Investigation
    requiredPermission: 'view:complaints-ongoing-investigation' as const,
    status: 'ONGOING-INVESTIGATION',
    component: InvestigationsTable
  },
  'Ongoing Disciplinary Cases': { // Investigation
    requiredPermission: 'view:complaints-ongoing-disciplinary' as const,
    status: 'ONGOING-DISCIPLINARY',
    component: InvestigationsTable
  },
  'Completed Investigations': { // Investigation
    requiredPermission: 'view:complaints-investigation-complete' as const,
    status: 'INVESTIGATION-COMPLETE',
    component: InvestigationsTable
  },
  'Recommended for EX-Investigations': { // Investigation
    requiredPermission: 'view:complaints-recommend-for-external-investigation' as const,
    status: 'RECOMMEND-FOR-EXTERNAL-INVESTIGATION',
    component: InvestigationsTable
  },
  'Recommended for Disciplinary': { // Investigation
    requiredPermission: 'view:complaints-recommend-for-disciplinary' as const,
    status: 'RECOMMEND-FOR-DISCIPLINARY',
    component: InvestigationsTable
  },
  'Recommended for Closure': { // Investigation
    requiredPermission: 'view:complaints-recommend-for-closure' as const,
    status: 'RECOMMEND-FOR-CLOSURE',
    component: InvestigationsTable
  },
  'Recommended for RE-Investigation': { // Investigation
    requiredPermission: 'view:complaints-recommend-for-investigation' as const,
    status: 'RECOMMEND-FOR-INVESTIGATION',
    component: InvestigationsTable
  },
  'External Investigations': { // Investigation
    requiredPermission: 'view:complaints-external-investigation' as const,
    status: 'EXTERNAL-INVESTIGATION',
    component: InvestigationsTable
  },
  'Closed Cases': { // Investigation
    requiredPermission: 'view:complaints-closed' as const,
    status: 'CASE-CLOSED',
    component: InvestigationsTable
  },
  // 'Incoming CPD Cases': { // CPD
  //   requiredPermission: 'view:cpd-incoming' as const,
  //   status: 'INCOMING',
  //   component: CPDTable
  // },
  'CPD Cases Pending-Screening': { // CPD
    requiredPermission: 'view:cpd-pending-screening' as const,
    status: 'PENDING-SCREENING',
    component: CPDTable
  },
  'CPD Cases Pending-Verification': { // CPD
    requiredPermission: 'view:cpd-pending-screening' as const,
    status: 'PENDING-VERIFICATION',
    component: CPDTable
  },
  'CPDs Cases Recommeded for Approval': { // CPD
    requiredPermission: 'view:cpd-recommed-for-approval' as const,
    status: 'RECOMMEND-FOR-APPROVAL',
    component: CPDTable
  },
  'Incoming-Appeal': { // Appeals
    requiredPermission: 'view:appeal-incoming' as const,
    status: 'INCOMING-APPEAL',
    component: AppealsTable
  },
  'Pending-Screening': { // Appeals
    requiredPermission: 'view:appeal-pending-screening' as const,
    status: 'PENDING-SCREENING',
    component: AppealsTable
  },
  'Pending-Assessment': { // Appeals
    requiredPermission: 'view:appeal-pending-assessment' as const,
    status: 'PENDING-ASSESSMENT',
    component: AppealsTable
  },
  'Pending-Approval': { // Appeals
    requiredPermission: 'view:appeal-pending-approval' as const,
    status: 'PENDING-APPROVAL',
    component: AppealsTable
  },
  'Recommended-for-Approval': { // Appeals
    requiredPermission: 'view:appeal-recommed-for-approval' as const,
    status: 'RECOMMEND-FOR-APPROVAL',
    component: AppealsTable
  },
  'Recommended-for-Rejection': { // Appeals
    requiredPermission: 'view:appeal-recommed-for-rejection' as const,
    status: 'RECOMMEND-FOR-REJECTION',
    component: AppealsTable
  },
  'Recommended-for-Investigation': { // Appeals
    requiredPermission: 'view:appeal-recommed-for-investigation' as const,
    status: 'RECOMMEND-FOR-INVESTIGATION',
    component: AppealsTable
  },
  // 'Revocation Cases Incoming': { // Revocation
  //   requiredPermission: 'view:revocation-pending-screening' as const,
  //   status: 'INCOMING',
  //   component: RevocationTable
  // },
  'Revocation Cases Pending-Screening': { // Revocation
    requiredPermission: 'view:revocation-pending-screening' as const,
    status: 'PENDING-SCREENING',
    component: RevocationTable
  },
  'Revocation Cases Pending-Assessment': { // Revocation
    requiredPermission: 'view:revocation-pending-assessment' as const,
    status: 'PENDING-ASSESSMENT',
    component: RevocationTable
  },
  'Revocation Cases Pending-Approval': { // Revocation
    requiredPermission: 'view:revocation-pending-approval' as const,
    status: 'PENDING-APPROVAL',
    component: RevocationTable
  },
  'Revocation Cases Pending-Endorsement': { // Revocation
    requiredPermission: 'view:revocation-pending-endorsement' as const,
    status: 'PENDING-ENDORSEMENT',
    component: RevocationTable
  },
} as const;

export const Work = ({ userRole }: Props) => {

  const availableTables = Object.entries(AVAILABLE_TABLES).filter(([_, config]) => 
    hasPermission(userRole, config.requiredPermission)
  );

  const defaultTable = availableTables.length > 0 ? availableTables[0][0] : '';
  const [selectedTable, setSelectedTable] = useState(defaultTable);
  const [refreshKey, setRefreshKey] = useState(0); // Add a key state to force table refresh


  const handleSelectChange = (newValue: string) => {
    setSelectedTable(newValue);

    // Increment refresh key to force table reload
    setRefreshKey(prev => prev + 1);
  };

  const renderTable = () => {
    if(!selectedTable) return null;

    const config = AVAILABLE_TABLES[selectedTable as keyof typeof AVAILABLE_TABLES];
    const TableComponent = config.component;

    return (
      <TableComponent
        key={refreshKey}
        status={config.status}
        userRole={userRole}
      />
    )
  };

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-2">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Left Section - Select and Filters */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Show work for</Label>
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