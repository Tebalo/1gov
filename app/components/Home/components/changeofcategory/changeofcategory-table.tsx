"use client"
import { DataTable } from "../data-table";
import { getRevocations} from "@/app/lib/actions"
import React, { useEffect, useState } from "react"
import TableLoadingSkeleton from "../../../TableLoadingSkeleton";
import { Revocation } from "./schema/changeofcategory";
import { revocation } from "./types/changeofcategory";
import { ChangeOfCategoryColumns } from "./changeofcategory-columns";

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
const processApiResponse = (data: any[]): Revocation[] => {
    return data.map(item => ({
        revocation_number: item.revocation_number || '',
        userid: item.userid || '',
        sla: item.sla || '',
        reg_status: item.reg_status || '',
        registration_number: item.registration_number || '',
        current_employer: item.current_employer || '',
        reason: item.reason || '',
        date_of_submission: item.date_of_submission || '',
    }));
};

export const ChangeOfCategoryTable: React.FC<WorkProps> = ({status, userRole}) => {
    const [response, setResponse] = useState<revocation[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    async function getList(status: string) {
        setIsLoading(true);
        setError(null);
        
        try {
            const result = await getRevocations(status, 100);
            
            if (result.applications && Array.isArray(result.applications)) {
                const processedData = processApiResponse(result.applications);
                setResponse(processedData);
            } else {
                console.warn('Invalid or empty data received from API');
                setResponse(null);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            console.error('Error fetching data:', errorMessage);
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
                Error loading data: {error}
            </div>
        );
    }

    return (
        <div className="h-full">
            {isLoading ? (
                <TableLoadingSkeleton rows={6} columns={6} className="mt-4" />
            ) : response ? (
                <DataTable data={response} columns={ChangeOfCategoryColumns} userRole={userRole} />
            ) : (
                <DataTable data={[]} columns={ChangeOfCategoryColumns} userRole={userRole} />
            )}
        </div>
    )
}

export default ChangeOfCategoryTable;