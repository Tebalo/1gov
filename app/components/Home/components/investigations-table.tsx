"use client"
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getInvestigations, getRegApplications } from "@/app/lib/actions"
import React, { useEffect, useState } from "react"
import { LoadingSkeleton } from "../../LoadingSkeleton";
import TableLoadingSkeleton from "../../TableLoadingSkeleton";
import { investigationsColumns } from "./investigations-columns";
import { Complaint } from "@/app/lib/types";

interface WorkProps {
    status: string;
    userRole: string;
}

interface InvestigationsResponse {
    status: string;
    count: number;
    data: Complaint[];
}

export const InvestigationsTable: React.FC<WorkProps> = ({status, userRole}) => {
    
    const [response, setResponse] = useState<Complaint[] | null>(null)
    const [isLoading, setIsLoading] = useState(false);

    async function getApplications(status: string) {
        setIsLoading(true);
        try {
            const jsonResponse = await getInvestigations("All", '100');
            const parsedResponse: InvestigationsResponse = JSON.parse(jsonResponse);
            setResponse(parsedResponse.data);
            console.log("Fetched data:", parsedResponse.data);  // Add this line for debugging
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