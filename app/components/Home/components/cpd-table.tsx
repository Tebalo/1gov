"use client"
import { DataTable } from "./data-table";
import { getCPDs} from "@/app/lib/actions"
import React, { useEffect, useState } from "react"
import TableLoadingSkeleton from "../../TableLoadingSkeleton";
import { CPDColumns } from "./cpd-columns";
import { CPD } from "../data/schema";

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
const processApiResponse = (data: any[]): CPD[] => {
    return data.map(item => ({
        id: item.id || 0,
        user_id: item.user_id || '',
        cpd_number: item.cpd_number || '',
        cumulative_points: item.cumulative_points || '',
        reg_status: item.reg_status || '',
        sla: item.sla || '',
        cpd_activity: item.cpd_activity || '',
        cpd_points: item.cpd_points || '',
        cpd_activity_description: item.cpd_activity_description || '',
        service_provider: item.service_provider || '',
        duration: item.duration || '',
        declaration: item.declaration || '',
        profile_data_consent: item.profile_data_consent || '',
        created_at: item.created_at || '',
        updated_at: item.updated_at || ''
    }));
};

export const CPDTable: React.FC<WorkProps> = ({status, userRole}) => {
    const [response, setResponse] = useState<CPD[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    async function getCPDsList(status: string) {
        setIsLoading(true);
        setError(null);
        
        try {
            const result = await getCPDs(status, 100);
            
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
        getCPDsList(status || '');
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
                <DataTable data={response} columns={CPDColumns} userRole={userRole} />
            ) : (
                <DataTable data={[]} columns={CPDColumns} userRole={userRole} />
            )}
        </div>
    )
}

export default CPDTable;