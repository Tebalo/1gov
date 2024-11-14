'use client'
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mgt, roleObjects } from "@/app/lib/store";
import { Search } from "@/app/components/dashboard/search";
import { InvestigationsTable } from "../investigations-table";
import Link from "next/link";
import { Plus } from "lucide-react";
import { TipOffsTable } from "../tipoffs-table";
import ActionButtons from "@/app/components/record/components/ActionItems";

interface Props {
  userRole: string
}

export const InvestigationsWork = ({ userRole }: Props) => {
  const { reg_application, lic_application, inv_application, reg_Next_Status, lic_Next_Status, tipoff_Next_Status, inv_Next_Status, defaultWork } = roleObjects[userRole] || {};

  const [table, setTable] = useState(defaultWork || '');

  const status = table === 'Investigations' ? inv_Next_Status : tipoff_Next_Status;

  const handleSelectChange = (newValue: string) => {
    setTable(newValue);
  }

  const renderTable = () => {
    if (!status) return null;
    
    if (mgt.includes(userRole)) {
      return table === 'Investigations' 
        ? <InvestigationsTable status={status} userRole={userRole} />
        : <InvestigationsTable status={status} userRole={userRole} />;
    } else if(table === 'Tip Offs') {
      return <TipOffsTable status={status} userRole={userRole} />;
    } else {
      return <InvestigationsTable status={status} userRole={userRole} />;
    }
  }
    
  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Left Section - Select and Filters */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Show work for</Label>
            <div className="flex items-center gap-3">
              <Select 
                onValueChange={handleSelectChange} 
                value={table}
              >
                <SelectTrigger className="w-[200px] bg-white">
                  <SelectValue placeholder="Select an application..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Application Type</SelectLabel>
                    {reg_application && 
                      <SelectItem value="RegistrationApplication">
                        Registration
                      </SelectItem>
                    }
                    {tipoff_Next_Status && 
                      <SelectItem value="Tip Offs">
                        Tip Offs
                      </SelectItem>
                    }
                    {inv_application && 
                      <SelectItem value="Investigations">
                        Investigations
                      </SelectItem>
                    }
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Right Section - Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
              <Link 
                href="/trls/work/investigation/create" 
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Plus className="h-4 w-4" />
                Investigation
              </Link>
            <Link 
              href="/trls/work/tipoff/create" 
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <Plus className="h-4 w-4" />
              Tip-off
            </Link>
          </div>
        </div>

        {/* Optional Search Bar */}
        <div className="mt-4 md:mt-6">
          <Search />
        </div>
      </div>
      
      {renderTable()}
    </>
  )
}