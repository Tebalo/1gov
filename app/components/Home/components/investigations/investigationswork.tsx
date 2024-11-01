// components/SelectTable.tsx
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
    }else if(table === 'Tip Offs'){
        return table === 'Tip Offs' 
        ? <TipOffsTable status={status} userRole={userRole} />
        : <TipOffsTable status={status} userRole={userRole} />;

    }else {
      return table === 'Investigations'
        ? <InvestigationsTable status={status} userRole={userRole} />
        : <InvestigationsTable status={status} userRole={userRole} />;
    }
  }
    
  return (
    <>
      <div className="grid grid-cols-2 pb-5">
        <div className="">
          <div className="flex space-x-2 items-end">
            <div className="">
              <Label className="font-light">Show work for</Label>
              <Select onValueChange={handleSelectChange} value={table}>
                <SelectTrigger className="w-[180px]">
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
            <div className="mt-4 w-full flex justify-start px-4">
              <Link 
                href="/trls/work/investigation/create" 
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Plus className="h-4 w-4" />
                Create New Investigation
              </Link>

            </div>
              <div className="mt-4 w-full flex justify-start px-4">
                <Link 
                  href="/trls/work/tipoff/create" 
                  className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Plus className="h-4 w-4" />
                  Create New TipOff
                </Link>
            </div>
          </div>
        </div>
        <div className="place-self-end">
          <Search/>
        </div>
      </div>
      {renderTable()}
    </>
  )
}