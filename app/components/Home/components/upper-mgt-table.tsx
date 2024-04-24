"use client"
import { DataTable } from "./data-table";
import { getEndorsementRecords } from "@/app/lib/actions"
import React, { useEffect, useState } from "react"
import { LoadingSkeleton } from "../../LoadingSkeleton";
import { endorse_columns } from "./upper-mgt-columns";

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
 export const EndorsementTable: React.FC<WorkProps> = ({status, userRole}) => {
    
    const [response, setResponse] = useState<Registration[] | null>(null)
    const [isLoading, setIsLoading] = useState(false);

    async function getApplications(status:string){
        setIsLoading(true);
        const response: Registration[] = await getEndorsementRecords(status,'20');
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
            ):response ? (
                <DataTable data={response} columns={endorse_columns} userRole={userRole}/>
            ): <DataTable data={[]} columns={endorse_columns} userRole={userRole}/>}
        </div>
    )
 }