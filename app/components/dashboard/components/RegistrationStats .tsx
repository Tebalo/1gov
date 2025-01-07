'use client'
import { GetReports } from "@/app/lib/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react";
import { LoadingSkeleton } from "../../LoadingSkeleton";
import { Users, GraduationCap, UserCircle2, UserCircle } from "lucide-react"

interface Report {
    all_teacher_registrations_count: string;
    teacher_registrations_count: string;
    stud_teacher_registrations_count: number;
    males_count: number;
    females_count: number;
}

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    description?: string;
}

const StatCard = ({ title, value, icon, description }: StatCardProps) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
                {title}
            </CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            {description && (
                <p className="text-xs text-muted-foreground">
                    {description}
                </p>
            )}
        </CardContent>
    </Card>
);

export const RegistrationStats = () => {
    const [response, setResponse] = useState<Report | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function getReport() {
        setIsLoading(true);
        try {
            const response: Report = await GetReports();
            setResponse(response);
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getReport();
    }, []);

    const stats = [
        {
            title: "Teacher Registrations",
            value: response?.teacher_registrations_count || "N/A",
            icon: <Users className="h-4 w-4 text-muted-foreground" />
        },
        {
            title: "Issued Licenses",
            value: response?.teacher_registrations_count || "N/A",
            icon: <GraduationCap className="h-4 w-4 text-muted-foreground" />
        },
        {
            title: "Female Teachers",
            value: response?.females_count || 'N/A',
            icon: <UserCircle2 className="h-4 w-4 text-muted-foreground" />
        },
        {
            title: "Male Teachers",
            value: response?.males_count || 'N/A',
            icon: <UserCircle className="h-4 w-4 text-muted-foreground" />
        }
    ];

    if (isLoading) return <LoadingSkeleton />;
    if (!response) return null;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <StatCard
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                />
            ))}
        </div>
    );
};