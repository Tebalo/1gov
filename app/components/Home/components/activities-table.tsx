"use client"
import { DataTable } from "./data-table";
import { getTipOffs, getUserActivities } from "@/app/lib/actions"
import React, { useEffect, useState } from "react"
import TableLoadingSkeleton from "../../TableLoadingSkeleton";
import { roleObjects } from "@/app/lib/store";
import { Activity, ActivityList } from "@/app/lib/types";
import { ActivityColumns } from "./activities-columns";

interface WorkProps {
    userRole: string;
    userid: string;
}


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
const processApiResponse = (data: any[]): ActivityList[] => {
    return data.map(item => ({
        activities: item.activities || '',
        full_name: item.full_name || '',
        role: item.role || '',
        record_type: item.record_type || '',
        record_id: item.record_id || '',
        activity_number: item.activity_number || '',
        submission_type: item.submission_type || '',
        date_of_submission: item.date_of_submission || '',
        anonymous: item.anonymous || '', 
    }));
};

export const ActivitiesTable: React.FC<WorkProps> = ({ userRole, userid}) => {
    const { activity_object } = roleObjects[userRole] || {};
    const [response, setResponse] = useState<ActivityList[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function getUserActivity(userid: string, count: number) {
        setIsLoading(true);
        setError(null);
        
        try {
            const result = await getUserActivities(userid, 500);
            if (result.data && Array.isArray(result.data)) {
                const processedData = processApiResponse(result.data);
                setResponse(processedData);
            } else {
                console.warn('Invalid or empty data received from API');
                setResponse(null);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            console.error('Error fetching activities:', errorMessage);
            setError(errorMessage);
            setResponse(null);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getUserActivity(userid, 500);
    }, [userid]);
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
                <DataTable data={response} columns={ActivityColumns} userRole={userRole} />
            ) : (
                <DataTable data={[]} columns={ActivityColumns} userRole={userRole} />
            )}
        </div>
    )
}

export default ActivitiesTable;