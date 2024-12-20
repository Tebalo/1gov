"use client"
import { DataTable } from "../data-table";
import React, { useEffect, useState } from "react"
import TableLoadingSkeleton from "../../../TableLoadingSkeleton";
import { RenewalColumns } from "./renewal-columns";
import { Renewal } from "./schema/renewal";
import { getRenewals } from "@/app/lib/actions";

interface WorkProps {
    status: string;
    userRole: string;
}

// Updated utility function to safely handle null values and prevent recursion
const replaceNullWithEmptyString = (data: any): any => {
    if (data === null || data === undefined) {
        return '';
    }
    if (typeof data !== 'object') {
        return data;
    }
    if (Array.isArray(data)) {
        return data.map(item => replaceNullWithEmptyString(item));
    }
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
const processApiResponse = (data: any[]): Renewal[] => {
    return data.map(item => ({
        national_id: item.national_id || '',
        reg_number: item.reg_number || '',
        reg_status: item.reg_status || '',
        registration_number: item.registration_number || null,
        work_status: item.work_status || null,
        endorsement_status: item.endorsement_status || '',
        rejection_reason: item.rejection_reason || null,
        service_code: item.service_code || '',
        payment_ref: item.payment_ref || null,
        payment_amount: item.payment_amount || null,
        payment_name: item.payment_name || null,
        application_id: item.application_id || '',
        license_link: item.license_link || null,
        education_bg_checks: item.education_bg_checks || null,
        flags_no: item.flags_no || '0',
        institution_verification: item.institution_verification || '',
        course_verification: item.course_verification || '',
        license_status: item.license_status || '',
        pending_customer_action: item.pending_customer_action || 'false',
        registration_type: item.registration_type || '',
        created_at: item.created_at || '',
        updated_at: item.updated_at || ''
    }));
};

export const RenewalTable: React.FC<WorkProps> = ({status, userRole}) => {
    const [response, setResponse] = useState<Renewal[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    async function getList(status: string) {
        setIsLoading(true);
        setError(null);
        
        try {
            const result = await getRenewals(status, 100);
            
            if (result.data && Array.isArray(result.data)) {
                const processedData = processApiResponse(result.data);
                setResponse(processedData);
            } else {
                console.warn('Invalid or empty data received from API');
                setResponse(null);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            console.error('Error fetching renewals:', errorMessage);
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
                 <DataTable data={response} columns={RenewalColumns} userRole={userRole} />
            ) : (
                <DataTable data={[]} columns={RenewalColumns} userRole={userRole} />
            )}
        </div>
    )
}

export default RenewalTable;