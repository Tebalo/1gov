'use client'

import { useState } from "react"
import { RecordTable } from "./registration-table"
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Work } from "../../MyWork/work";
import { roleObjects } from "@/app/lib/store";

interface Props{
    userRole: string
}

export const getRoleObjects = (userRole: string): { reg_application: boolean | false; lic_application: boolean | false; reg_Next_Status: string | null; lic_Next_Status: string | null} => {
    const roleObject = roleObjects[userRole];
    return roleObject
}

export const SelectTable = async ({userRole}:Props) => {
    const {reg_application, lic_application, reg_Next_Status, lic_Next_Status} = getRoleObjects(userRole);
    const [table, setTable] = useState('teacherRegistration')
    const handleSelectChange = (newValue: string) => {
        setTable(newValue);
    }
    return(
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
                            {reg_application && <SelectItem value="teacherRegistration">Registration</SelectItem>}
                            {lic_application && <SelectItem value="licenseRenewal">License</SelectItem>}
                            {/* <SelectItem value="license">License</SelectItem> */}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                {reg_Next_Status && <Work status={reg_Next_Status}/>} {/* Add documentation on stackoverflow */}
            </div>
            {table === 'teacherRegistration' && (reg_Next_Status && <RecordTable status={reg_Next_Status}/>)}
            {table === 'licenseRenewal' && (lic_Next_Status && <RecordTable status={lic_Next_Status}/>)}
            {table === 'license' && <RecordTable status="License" />}
        </>
    )
}