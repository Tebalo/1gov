"use client"
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getRegApplications } from "@/app/lib/actions"
import React, { useEffect, useState } from "react"
import { LoadingSkeleton } from "../../LoadingSkeleton";

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

  

 export const RegistrationTable: React.FC<WorkProps> = ({status, userRole}) => {
    
    const [response, setResponse] = useState<Registration[] | null>(null)
    const [isLoading, setIsLoading] = useState(false);

    async function getApplications(status:string){
        setIsLoading(true);
        const response: Registration[] = await getRegApplications(status,'100');
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
                <DataTable data={response} columns={columns} userRole={userRole} />
            ): <DataTable data={[]} columns={columns} userRole={userRole}/>}
        </div>
    )
 }