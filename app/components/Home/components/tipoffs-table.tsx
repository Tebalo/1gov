"use client"
import { DataTable } from "./data-table";
import { getInvestigations, getInvRecords, getRegApplications } from "@/app/lib/actions"
import React, { useEffect, useState } from "react"
import TableLoadingSkeleton from "../../TableLoadingSkeleton";
import { investigationsColumns } from "./investigations-columns";
import { Complaint } from "@/app/lib/types";

interface WorkProps {
    status: string;
    userRole: string;
}

interface Investigations{
    id:number;
    name:string;
    contact_number:string;
    Omang_id:string;
    passport_no:string;
    occupation:string;
    sex:string;
    nationality:string;
    address:string;
    reg_status:string;
    inquiry_number:string;
    case_number:string;
    created_at:string;
    updated_at:string;
}


export const TipOffsTable: React.FC<WorkProps> = ({status, userRole}) => {
    
    const [response, setResponse] = useState<Investigations[] | null>(null)
    const [isLoading, setIsLoading] = useState(false);

    async function getApplications(status: string) {
        setIsLoading(true);
        try {
            // const jsonResponse = await getInvestigations("All", '100');
            const response: Investigations[] = await getInvRecords("Incoming", '100'); 
            setResponse(response);
            // console.log("Fetched data:", parsedResponse);  // Add this line for debugging
        } catch (error) {
            console.error('Error fetching investigations:', error);
            setResponse(null);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getApplications(status);
    }, [status]);

    return (
        <div className="h-full">
            {isLoading ? (
                <TableLoadingSkeleton rows={6} columns={5} className="mt-4" />
            ) : response ? (
                <DataTable data={response} columns={investigationsColumns} userRole={userRole} />
            ) : (
                <DataTable data={[]} columns={investigationsColumns} userRole={userRole} />
            )}
        </div>
    )
}