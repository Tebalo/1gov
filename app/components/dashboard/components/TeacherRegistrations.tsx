'use client'
import { GetReports } from "@/app/lib/actions";
import { Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import { useEffect, useState } from "react";
import { LoadingSkeleton } from "../../LoadingSkeleton";

interface Report {
    all_teacher_registrations_count: string;
    teacher_registrations_count: string;
    stud_teacher_registrations_count: number;
    males_count: number;
    females_count: number;
}

export const TeacherRegistrations = () => {
    const [response, setResponse] = useState<Report | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function getReport(){
        setIsLoading(true);
        try{
            const response: Report = await GetReports();
            setResponse(response);
        }catch (error){
            console.error('Error fetching reports:', error);
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        getReport();
    },[]);

    return (
        <>
            {isLoading ? (
                <LoadingSkeleton/>
            ):response ? (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                        Teacher Registrations
                        </CardTitle>
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{response?.teacher_registrations_count}</div>
                        {/* <p className="text-xs text-muted-foreground">
                        +{response?.teacher_registrations_count}% from last month
                        </p> */}
                    </CardContent>
                </Card>
                ):<></>
            }
        </>
    )
}