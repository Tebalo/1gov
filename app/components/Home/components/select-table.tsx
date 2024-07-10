// components/SelectTable.tsx
'use client'
import { useState } from "react"
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Work } from "../../MyWork/work";
import { mgt, roleObjects } from "@/app/lib/store";
import { RegistrationTable } from "./registration-table";
import { EndorsementTable } from "./upper-mgt-table";
import { LicenseTable } from "./license-table";
import { LicenseEndorsementTable } from "./license-endorsement-table";

interface Props {
  userRole: string
}

export const SelectTable = ({ userRole }: Props) => {
  const { reg_application, lic_application, reg_Next_Status, lic_Next_Status, defaultWork } = roleObjects[userRole] || {};

  const [table, setTable] = useState(defaultWork || '');

  const status = table === 'RegistrationApplication' ? reg_Next_Status : lic_Next_Status;

  const handleSelectChange = (newValue: string) => {
    setTable(newValue);
  }

  const renderTable = () => {
    if (!status) return null;

    if (mgt.includes(userRole)) {
      return table === 'RegistrationApplication' 
        ? <EndorsementTable status={status} userRole={userRole} />
        : <LicenseEndorsementTable status={status} userRole={userRole} />;
    } else {
      return table === 'RegistrationApplication'
        ? <RegistrationTable status={status} userRole={userRole} />
        : <LicenseTable status={status} userRole={userRole} />;
    }
  }
    
  return (
    <>
      <div className="flex space-x-2 items-end">
        <div>
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
      {renderTable()}
    </>
  )
}