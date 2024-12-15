"use client"
import { DataTable } from "../data-table";
import { getAppeals} from "@/app/lib/actions"
import React, { useEffect, useState } from "react"
import TableLoadingSkeleton from "../../../TableLoadingSkeleton";
import { Appeal } from "../../data/schema";
import { RenewalColumns } from "./renewal-columns";

interface WorkProps {
    status: string;
    userRole: string;
}


// Updated utility function to safely handle null values and prevent recursion
const replaceNullWithEmptyString = (data: any): any => {
    // If data is null or undefined, return empty string
    if (data === null || data === undefined) {
        return '';
    }

    // If data is not an object (including arrays), return as is
    if (typeof data !== 'object') {
        return data;
    }

    // Handle arrays
    if (Array.isArray(data)) {
        return data.map(item => replaceNullWithEmptyString(item));
    }

    // Handle objects
    const result: { [key: string]: any } = {};
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const value = data[key];
            result[key] = replaceNullWithEmptyString(value);
        }
    }
    return result;
};

// Helper function to safely process the API response
const processApiResponse = (data: any[]): Appeal[] => {
    return data.map(item => ({
        id: item.id || 0,
        user_id: item.user_id || '',
        application: item.application || '',
        appeals_number: item.appeals_number || '',
        reg_status: item.reg_status || '',
        sla: item.sla || '',
        appeal_decision: item.appeal_decision || '',
        appeal_reason: item.appeal_reason || '',
        cpd_activity_description: item.cpd_activity_description || '',
        supporting_document_key: item.supporting_document_key || '',
        declaration: item.declaration || '',
        profile_data_consent: item.profile_data_consent || '',
        created_at: item.created_at || '',
        updated_at: item.updated_at || ''
    }));
};

export const RenewalTable: React.FC<WorkProps> = ({status, userRole}) => {
    const [response, setResponse] = useState<Appeal[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    async function getList(status: string) {
        setIsLoading(true);
        setError(null);
        
        try {
            const result = await getAppeals(status, 100);
            
            if (result.data && Array.isArray(result.data)) {
                const processedData = processApiResponse(result.data);
                setResponse(processedData);
            } else {
                console.warn('Invalid or empty data received from API');
                setResponse(null);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            console.error('Error fetching tipoffs:', errorMessage);
            setError(errorMessage);
            setResponse(null);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getList(status || '');
    }, [status]);

    if (error) {
        return (
            <div className="p-4 text-red-500">
                Error loading CPDs: {error}
            </div>
        );
    }

    return (
        <div className="h-full">
            {isLoading ? (
                <TableLoadingSkeleton rows={6} columns={6} className="mt-4" />
            ) : response ? (
                <div></div>
                // <DataTable data={response} columns={RenewalColumns} userRole={userRole} />
            ) : (
                <div></div>
                // <DataTable data={[]} columns={RenewalColumns} userRole={userRole} />
            )}
        </div>
    )
}

export default RenewalTable;