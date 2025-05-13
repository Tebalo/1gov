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
import RenewalTable from "../renewal/renewal-table";
import ChangeOfCategoryTable from "../changeofcategory/changeofcategory-table";
import RestorationTable from "../restoration/restoration-table";
import { StudentTeacherTable } from "../studentteacher/studentteacher-table";
import TeacherTable from "../teacher/teacher-table";

interface Props {
  userRole: Role;
}

// Define available tables and their required permissions
const AVAILABLE_TABLES = {
  'Investigation Incoming': { // Investigation
    requiredPermission: 'view:complaints-incoming' as const,
    status: 'INCOMING',
    component: InvestigationsTable
  },
  'Investigation Under Review': { // Investigation
    requiredPermission: 'view:complaints-review' as const,
    status: 'UNDER-REVIEW',
    component: InvestigationsTable
  },
  'Investigation Assessment': { // Investigation
    requiredPermission: 'view:complaints-assessment' as const,
    status: 'ASSESSMENT',
    component: InvestigationsTable
  },
  'Tip Offs': { // Tipoffs
    requiredPermission: 'view:tipoffs' as const,
    status: 'INCOMING',
    component: TipOffsTable
  },
  'Investigation Ongoing': { // Investigation
    requiredPermission: 'view:complaints-ongoing-investigation' as const,
    status: 'ONGOING-INVESTIGATION',
    component: InvestigationsTable
  },
  'Investigation Ongoing Disciplinary': { // Investigation
    requiredPermission: 'view:complaints-ongoing-disciplinary' as const,
    status: 'ONGOING-DISCIPLINARY',
    component: InvestigationsTable
  },
  'Investigation Completed': { // Investigation
    requiredPermission: 'view:complaints-investigation-complete' as const,
    status: 'INVESTIGATION-COMPLETE',
    component: InvestigationsTable
  },
  'Investigation External-Review Recommended': { // Investigation
    requiredPermission: 'view:complaints-recommend-for-external-investigation' as const,
    status: 'RECOMMEND-FOR-EXTERNAL-INVESTIGATION',
    component: InvestigationsTable
  },
  'Investigation Disciplinary Recommended': { // Investigation
    requiredPermission: 'view:complaints-recommend-for-disciplinary' as const,
    status: 'RECOMMEND-FOR-DISCIPLINARY',
    component: InvestigationsTable
  },
  'Investigation Closure Recommended': { // Investigation
    requiredPermission: 'view:complaints-recommend-for-closure' as const,
    status: 'RECOMMEND-FOR-CLOSURE',
    component: InvestigationsTable
  },
  'Investigation RE-Investigation Recommended': { // Investigation
    requiredPermission: 'view:complaints-recommend-for-investigation' as const,
    status: 'RECOMMEND-FOR-INVESTIGATION',
    component: InvestigationsTable
  },
  'Investigation External-Review': { // Investigation
    requiredPermission: 'view:complaints-external-investigation' as const,
    status: 'EXTERNAL-INVESTIGATION',
    component: InvestigationsTable
  },
  'Investigation Closed Cases': { // Investigation
    requiredPermission: 'view:complaints-closed' as const,
    status: 'CASE-CLOSED',
    component: InvestigationsTable
  },
  'CPD Pending Screening': { // CPD
    requiredPermission: 'view:cpd-pending-screening' as const,
    status: 'PENDING-SCREENING',
    component: CPDTable
  },
  'CPD Pending Verification': { // CPD
    requiredPermission: 'view:cpd-pending-verification' as const,
    status: 'PENDING-VERIFICATION',
    component: CPDTable
  },
  'CPD Recommeded for Approval': { // CPD
    requiredPermission: 'view:cpd-recommed-for-approval' as const,
    status: 'RECOMMEND-FOR-APPROVAL',
    component: CPDTable
  },
  'Appeal Pending Screening': { // Appeals
    requiredPermission: 'view:appeal-pending-screening' as const,
    status: 'PENDING-SCREENING',
    component: AppealsTable
  },
  'Appeal Pending Assessment': { // Appeals
    requiredPermission: 'view:appeal-pending-assessment' as const,
    status: 'PENDING-ASSESSMENT',
    component: AppealsTable
  },
  'Appeal Pending Approval': { // Appeals
    requiredPermission: 'view:appeal-pending-approval' as const,
    status: 'PENDING-APPROVAL',
    component: AppealsTable
  },
  'Appeal Recommended for Approval': { // Appeals
    requiredPermission: 'view:appeal-recommed-for-approval' as const,
    status: 'RECOMMEND-FOR-APPROVAL',
    component: AppealsTable
  },
  'Appeal Recommended for Rejection': { // Appeals
    requiredPermission: 'view:appeal-recommed-for-rejection' as const,
    status: 'RECOMMEND-FOR-REJECTION',
    component: AppealsTable
  },
  'Appeal Recommended for Investigation': { // Appeals
    requiredPermission: 'view:appeal-recommed-for-investigation' as const,
    status: 'RECOMMEND-FOR-INVESTIGATION',
    component: AppealsTable
  },
  'Revocation Pending Screening': { // Revocation
    requiredPermission: 'view:revocation-pending-screening' as const,
    status: 'PENDING-SCREENING',
    component: RevocationTable
  },
  'Revocation Pending Assessment': { // Revocation
    requiredPermission: 'view:revocation-pending-assessment' as const,
    status: 'PENDING-ASSESSMENT',
    component: RevocationTable
  },
  'Revocation Pending Approval': { // Revocation
    requiredPermission: 'view:revocation-pending-approval' as const,
    status: 'PENDING-APPROVAL',
    component: RevocationTable
  },
  'Revocation Pending Endorsement': { // Revocation
    requiredPermission: 'view:revocation-pending-endorsement' as const,
    status: 'PENDING-ENDORSEMENT',
    component: RevocationTable
  },
  'Renewal Pending Screening': { // Renewal - License officer
    requiredPermission: 'view:renewal-pending-screening' as const,
    status: 'Pending-Screening',
    component: RenewalTable
  },
  'Renewal Pending Assessment': { // Renewal - Snr License Officer
    requiredPermission: 'view:renewal-pending-assessment' as const,
    status: 'Pending-Assessment',
    component: RenewalTable
  },
  'Renewal Pending Manager Approval': { // Renewal - License Manager
    requiredPermission: 'view:renewal-recommended-for-approval' as const,
    status: 'Pending-Manager-Approval',
    component: RenewalTable
  },
  'Renewal Pending Endorsement': { // Renewal - Director
    requiredPermission: 'view:renewal-pending-endorsement' as const,
    status: 'Pending-Endorsement',
    component: RenewalTable
  },
  'Renewal Endorsement Complete': { // Renewal - Director
    requiredPermission: 'view:renewal-endorsement-complete' as const,
    status: 'Endorsement-Complete',
    component: RenewalTable
  },
  'Category Pending Screening': { // Change of category - Gezzy - REG OFFICER
    requiredPermission: 'view:changeofcategory-pending-screening' as const,
    status: 'Pending-Screening',
    component: ChangeOfCategoryTable
  },
  'Category Pending Assessment': { // Change of category - Gezzy - SNR REG OFFICER
    requiredPermission: 'view:changeofcategory-pending-assessment' as const,
    status: 'Pending-Assessment',
    component: ChangeOfCategoryTable
  },
  'Category Pending Manager Approval': { // Change of category - Gezzy - Manager
    requiredPermission: 'view:changeofcategory-pending-manager-approval' as const,
    status: 'Pending-Manager-Approval',
    component: ChangeOfCategoryTable
  },
  'Category Pending Endorsement': { // Change of category - Gezzy - Director
    requiredPermission: 'view:changeofcategory-pending-endorsement' as const,
    status: 'Pending-Endorsement',
    component: ChangeOfCategoryTable
  },
  'Category Endorsement Complete': { // Change of category - Gezzy - Director
    requiredPermission: 'view:changeofcategory-endorsement-complete' as const,
    status: 'Endorsement-Complete',
    component: ChangeOfCategoryTable
  },
  'Restoration Pending Screening': { // Restoration - Gezzy - REG OFFICER
    requiredPermission: 'view:restoration-pending-screening' as const,
    status: 'Pending-Screening',
    component: RestorationTable
  },
  'Restoration Pending Assessment': { // Restoration - GEZZY - SNR REG OFFICER
    requiredPermission: 'view:restoration-pending-assessment' as const,
    status: 'Pending-Assessment',
    component: RestorationTable
  },
  'Restoration Pending Manager Approval': { // Restoration -GEZZY - MANAGER
    requiredPermission: 'view:restoration-pending-manager-approval' as const,
    status: 'Pending-Manager-Approval',
    component: RestorationTable
  },
  'Restoration Pending-Endorsement': { // Restoration - GEZZY - DIRECTOR
    requiredPermission: 'view:restoration-pending-endorsement' as const,
    status: 'Pending-Endorsement',
    component: RestorationTable
  },
  'Restoration Endorsement Complete': { // Restoration - GEZZY - DIRECTOR
    requiredPermission: 'view:restoration-endorsement-complete' as const,
    status: 'Endorsement-Complete',
    component: RestorationTable
  },
  'Student Pending Screening': { // Student - Gezzy - REG OFFICER
    requiredPermission: 'view:registration-pending-screening' as const,
    status: 'Pending-Screening',
    component: StudentTeacherTable
  },
  'Student Pending Assessment': { // Student - GEZZY - SNR REG OFFICER
    requiredPermission: 'view:registration-pending-assessment' as const,
    status: 'Pending-Assessment',
    component: StudentTeacherTable
  },
  'Student Pending Manager Approval': { // Student - MANAGER
    requiredPermission: 'view:registration-pending-manager-approval' as const,
    status: 'Pending-Manager-Approval',
    component: StudentTeacherTable
  },
  'Student Pending-Endorsement': { // Student - DIRECTOR
    requiredPermission: 'view:registration-pending-endorsement' as const,
    status: 'Pending-Endorsement',
    component: StudentTeacherTable
  },
  'Student Endorsement Complete': { // Student - DIRECTOR
    requiredPermission: 'view:registration-endorsement-complete' as const,
    status: 'Endorsement-Complete',
    component: StudentTeacherTable
  },
  'Teacher Pending Screening': { // Teacher - REG OFFICER
    requiredPermission: 'view:registration-pending-screening' as const,
    status: 'Pending-Screening',
    component: TeacherTable
  },
  'Teacher Pending Assessment': { // Teacher - SNR REG OFFICER
    requiredPermission: 'view:registration-pending-assessment' as const,
    status: 'Pending-Assessment',
    component: TeacherTable
  },
  'Teacher Pending Manager Approval': { // Teacher - MANAGER
    requiredPermission: 'view:registration-pending-manager-approval' as const,
    status: 'Pending-Manager-Approval',
    component: TeacherTable
  },
  'Teacher Pending-Endorsement': { // Teacher - DIRECTOR
    requiredPermission: 'view:registration-pending-endorsement' as const,
    status: 'Pending-Endorsement',
    component: TeacherTable
  },
  'Teacher Endorsement Complete': { // Teacher - DIRECTOR
    requiredPermission: 'view:registration-endorsement-complete' as const,
    status: 'Endorsement-Complete',
    component: TeacherTable
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