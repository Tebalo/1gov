'use client'
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "@/app/components/dashboard/search";
import { InvestigationsTable } from "../investigations-table";
import { TipOffsTable } from "../tipoffs-table";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Role, hasPermission, roleObjects } from "@/app/lib/store";

interface Props {
  userRole: Role;
}

// Define available tables and their required permissions
const AVAILABLE_TABLES = {
  'Incoming Cases': {
    requiredPermission: 'view:complaints-incoming' as const,
    status: 'Incoming'
  },
  'Under-Review Cases': {
    requiredPermission: 'view:complaints-review' as const,
    status: 'Under-Review'
  },
  'Assessment Cases': {
    requiredPermission: 'view:complaints-assessment' as const,
    status: 'Under-Review'
  },
  'Tip Offs': {
    requiredPermission: 'view:tipoffs' as const,
    status: 'Incoming'
  },
  'Investigation Cases': {
    requiredPermission: 'view:complaints-ongoing-investigation' as const,
    status: 'Ongoing-Investigation'
  },
  'External INV Cases': {
    requiredPermission: 'view:recommend-for-external-investigation' as const,
    status: 'Recommend-for-External-Investigation'
  }
} as const;

export const InvestigationsWork = ({ userRole }: Props) => {
  const { inv_Next_Status } = roleObjects[userRole] || {};
  // Get available tables based on user permissions
  const availableTables = Object.entries(AVAILABLE_TABLES).filter(([_, config]) => 
    hasPermission(userRole, config.requiredPermission)
  );

  // Set default table to first available table or empty string if none available
  const defaultTable = availableTables.length > 0 ? availableTables[0][0] : '';
  const [selectedTable, setSelectedTable] = useState(defaultTable);

  // Get current table configuration
  const currentTableConfig = selectedTable ? AVAILABLE_TABLES[selectedTable as keyof typeof AVAILABLE_TABLES] : null;

  // Add a key state to force table refresh
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSelectChange = (newValue: string) => {
    setSelectedTable(newValue);

    // Increment refresh key to force table reload
    setRefreshKey(prev => prev + 1);
  };

  const renderTable = () => {
    // if (!currentStatus) return null;

    switch (selectedTable) {
      case 'Tip Offs':
        return <TipOffsTable status={"Incoming"} userRole={userRole} />;
      case 'Incoming Cases':
        return <InvestigationsTable key={refreshKey} status={'Incoming'} userRole={userRole} />;
      case 'Under-Review Cases':
        return <InvestigationsTable key={refreshKey} status={"Under-Review"} userRole={userRole} />;
      case 'Assessment Cases':
        return <InvestigationsTable key={refreshKey} status={"Assessment"} userRole={userRole} />;
      case 'Investigation Cases':
        return <InvestigationsTable key={refreshKey} status={"Ongoing-Investigation"} userRole={userRole} />;
      case 'External INV Cases':
        return <InvestigationsTable key={refreshKey} status={"Recommend-for-External-Investigation"} userRole={userRole} />;
      default:
        return null;
    }
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
                <SelectTrigger className="w-[200px] bg-white">
                  <SelectValue placeholder="Select work basket" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Work basket</SelectLabel>
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
        <div className="mt-4 md:mt-6">
          <Search />
        </div>
      </div>
      
      {renderTable()}
    </>
  );
};