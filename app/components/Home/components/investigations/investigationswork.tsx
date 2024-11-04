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
      <div className="flex flex-col gap-4 pb-5 md:grid md:grid-cols-2">
        <div className="space-y-4 md:space-y-0">
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            {/* Select dropdown */}
            <div className="w-full md:w-auto">
              <Label className="font-light">Show work for</Label>
              <Select onValueChange={handleSelectChange} value={table}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Select an application..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Application Type</SelectLabel>
                    {reg_application && <SelectItem value="RegistrationApplication">Registration</SelectItem>}
                    {tipoff_Next_Status && <SelectItem value="Tip Offs">Tip Offs</SelectItem>}
                    {inv_application && <SelectItem value="Investigations">Investigations</SelectItem>}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2 md:items-end">
              <Link 
                href="/trls/work/investigation/create" 
                className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full md:w-auto"
              >
                <Plus className="h-4 w-4" />
                <span>Investigation</span>
              </Link>

              <Link 
                href="/trls/work/tipoff/create" 
                className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full md:w-auto"
              >
                <Plus className="h-4 w-4" />
                <span>Tip-off</span>
              </Link>
            </div>
          </div>
        </div>


        <div className="w-full md:place-self-end">
          <Search />
        </div>
      </div>
      
      {renderTable()}
    </>
  )
}