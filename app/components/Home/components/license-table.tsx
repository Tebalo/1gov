"use client"
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getLicenseApplications } from "@/app/lib/actions"
import React, { Suspense, useEffect, useState } from "react"
import { LoadingSkeleton } from "../../LoadingSkeleton";
import { licenseColumns } from "./license-columns";

interface WorkProps{
    status: string;
    userRole: string;
}
interface Registration {
    national_id: string;
    reg_number: string;
    reg_status: string;
    registration_type: string;
    created_at: string;
    updated_at: string;
    updated_by: string;
    created_by: string;
}

interface License {
    national_id: string;
    reg_number: string;
    reg_status: string;
    registration_type: string;
    created_at: string;
    updated_at: string;
    updated_by: string;
    created_by: string;
}

interface Response {
    service_type: string;
    version: string;
    licenses: License[];
 } 
 export const LicenseTable: React.FC<WorkProps> = ({status, userRole}) => {
    
    const [response, setResponse] = useState<Response | null>(null)
    const [isLoading, setIsLoading] = useState(false);

    async function getApplications(status:string){
        setIsLoading(true);
        const response: Response = await getLicenseApplications(status,'20');
        setResponse(response);
        setIsLoading(false)
    } 

    useEffect(() => {
        getApplications(status);
    }, [status]);

    return(
        <div className="h-full">
            {isLoading ? (
                <LoadingSkeleton/>
            ):response?.licenses ? (
                <DataTable data={response.licenses} columns={licenseColumns} userRole={userRole}/>
            ): <DataTable data={[]} columns={licenseColumns} userRole={userRole}/>}
        </div>
    )
 }