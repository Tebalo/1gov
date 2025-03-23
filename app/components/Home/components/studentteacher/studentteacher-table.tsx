"use client"
import { DataTable } from "../data-table";
import { getStudentTeacherList} from "@/app/lib/actions"
import React, { useEffect, useState } from "react"
import TableLoadingSkeleton from "../../../TableLoadingSkeleton";
import { StudentTeacher } from "./schema/studenteacher";
import { studentteacher } from "./types/studentteacher";
import { StudentTeacherColumns } from "./studentteacher-columns";
import { AlertCircle } from "lucide-react";

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
const processApiResponse = (data: any[]): StudentTeacher[] => {
    return data.map(item => ({
          national_id: item.national_id || '',
          reg_number: item.reg_number || '',
          reg_status: item.reg_status || '',
          endorsement_status: item.endorsement_status || '',
          rejection_reason: item.rejection_reason || '',
          service_code: item.service_code || '',
          payment_ref: item.payment_ref || '',
          payment_amount: item.payment_amount || '',
          payment_name: item.payment_name || '',
          application_id: item.application_id || '',
          license_link: item.license_link || '',
          education_bg_checks: item.education_bg_checks || '',
          flags_no: item.flags_no || '',
          institution_verification: item.institution_verification || '',
          course_verification: item.course_verification || '',
          license_status: item.license_status || '',
          pending_customer_action: item.pending_customer_action || '',
          registration_type: item.registration_type || '',
          created_at: item.created_at || '',
          updated_at: item.updated_at || '',
    }));
};

export const StudentTeacherTable: React.FC<WorkProps> = ({status, userRole}) => {
    const [response, setResponse] = useState<studentteacher[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    async function getList(status: string) {
        setIsLoading(true);
        setError(null);
        
        try {
            const result = await getStudentTeacherList(status, 100);
            
            if (result.data && Array.isArray(result.data)) {
                const processedData = processApiResponse(result.data);
                setResponse(processedData);
            } else {
                console.warn('Invalid or empty data received from API');
                setResponse(null);
                setError('Invalid or empty data received from API Cause: Connect Timeout Error');
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

    // If data fetching failed, show error state
    if (!response) {
        return (
        <div className="">  
            <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-red-50 p-3 mb-4">
                    <AlertCircle className="h-10 w-10 text-red-500" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Data Connection Error</h2>
                <p className="text-gray-500 max-w-md mb-6">
                    Failed to connect to the data component. Please try again later or contact support if the issue persists.
                </p>
                <p className="text-sm text-gray-400 mb-6 flex">
                    Error details: <p className="text-red-400 italic">{error}</p>
                </p>
                <div className="flex items-center justify-end">
                    {/* <RefreshButton /> */}
                </div>
            </div>
            </div>
        </div>
        );
    }

    return (
        <div className="h-full">
            {isLoading ? (
                <TableLoadingSkeleton rows={6} columns={6} className="mt-4" />
            ) : response ? (
                <DataTable data={response} columns={StudentTeacherColumns} userRole={userRole} />
            ) : (
                <DataTable data={[]} columns={StudentTeacherColumns} userRole={userRole} />
            )}
        </div>
    )
}

export default StudentTeacherTable;