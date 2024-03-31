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

export const SelectTable = async () => {
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
                            <SelectItem value="teacherRegistration">Registration</SelectItem>
                            <SelectItem value="licenseRenewal">License renewal</SelectItem>
                            <SelectItem value="license">License</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <Work status={"Pending-Director-Review"}/>
            </div>
            {table === 'teacherRegistration' && <RecordTable status="Pending-Review"/>}
            {table === 'licenseRenewal' && <RecordTable status="License-Renewal" />}
            {table === 'license' && <RecordTable status="License" />}
        </>
    )
}