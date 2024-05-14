"use client"
import { DataTable } from "./data-table";
import { getLicenseEndorsementRecords } from "@/app/lib/actions"
import React, { useEffect, useState } from "react"
import { LoadingSkeleton } from "../../LoadingSkeleton";
import { endorse_columns } from "./upper-mgt-columns";
import { license_endorse_columns } from "./license-endorsement-column";

interface WorkProps{
    status: string;
    userRole: string;
}
interface Registration {
    national_id: string;
    reg_number: string;
    reg_status: string;
    registration_type: string;
    endorsement_status: string;
    created_at: string;
    updated_at: string;
    updated_by: string;
    created_by: string;
  }
  interface Response {
    service_type: string;
    version: string;
    teacher_registrations: Registration[];
 } 
 export const LicenseEndorsementTable: React.FC<WorkProps> = ({status, userRole}) => {
    
    const [response, setResponse] = useState<Response | null>(null)
    const [isLoading, setIsLoading] = useState(false);

    async function getApplications(status:string){
        setIsLoading(true);
        const response: Response = await getLicenseEndorsementRecords(status,'20');
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
            ):response?.teacher_registrations ? (
                <DataTable data={response.teacher_registrations} columns={license_endorse_columns} userRole={userRole}/>
            ): <DataTable data={[]} columns={license_endorse_columns} userRole={userRole}/>}
        </div>
    )
 }