// components/SelectTable.tsx
'use client'
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mgt, roleObjects } from "@/app/lib/store";
import { Work } from "@/app/components/MyWork/work";
import { Search } from "@/app/components/dashboard/search";
import { InvestigationsTable } from "../investigations-table";

interface Props {
  userRole: string
}

export const InvestigationsWork = ({ userRole }: Props) => {
  const { reg_application, lic_application, inv_application, reg_Next_Status, lic_Next_Status, inv_Next_Status, defaultWork } = roleObjects[userRole] || {};

  const [table, setTable] = useState(defaultWork || '');

  const status = table === 'Investigations' ? inv_Next_Status : lic_Next_Status;

  const handleSelectChange = (newValue: string) => {
    setTable(newValue);
  }

  const renderTable = () => {
    if (!status) return null;

    if (mgt.includes(userRole)) {
      return table === 'Investigations' 
        ? <InvestigationsTable status={status} userRole={userRole} />
        : <InvestigationsTable status={status} userRole={userRole} />;
    } else {
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
                    {lic_application && <SelectItem value="licenseApplication">License</SelectItem>}
                    {inv_application && <SelectItem value="Investigations">Investigations</SelectItem>}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {!mgt.includes(userRole) && (
              <>
                {reg_Next_Status && <Work status={reg_Next_Status} service_type="registration" />}
                {lic_Next_Status && <Work status={lic_Next_Status} service_type="license" />}
              </>
            )}
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