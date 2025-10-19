'use client'
import { GetReports } from "@/app/lib/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react";
import { LoadingSkeleton } from "../../LoadingSkeleton";
import { 
    Users, 
    GraduationCap, 
    UserCheck, 
    User, 
    Flag, 
    Globe,
    AlertCircle 
} from "lucide-react"

interface Report {
    all_teacher_registrations_count: string;
    teacher_registrations_count: string;
    stud_teacher_registrations_count: number;
    males_count: number;
    females_count: number;
    non_citizen_count: number;
    citizen_count: number;
}

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    description?: string;
    isLoading?: boolean;
}

const StatCard = ({ title, value, icon, description, isLoading }: StatCardProps) => (
    <Card className="transition-all duration-200 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
                {title}
            </CardTitle>
            <div className="text-primary">
                {icon}
            </div>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold text-foreground">
                {isLoading ? (
                    <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                ) : (
                    formatNumber(value)
                )}
            </div>
            {description && (
                <p className="text-xs text-muted-foreground mt-1">
                    {description}
                </p>
            )}
        </CardContent>
    </Card>
);

// Helper function to format numbers with commas
const formatNumber = (value: string | number): string => {
    if (value === "N/A" || value === null || value === undefined) return "N/A";
    const num = typeof value === 'string' ? parseInt(value) : value;
    return isNaN(num) ? "N/A" : num.toLocaleString();
};

// Error component
const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
    <Card className="col-span-full">
        <CardContent className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="h-8 w-8 text-destructive mb-2" />
            <p className="text-sm text-muted-foreground mb-4">
                Failed to load registration statistics
            </p>
            <button 
                onClick={onRetry}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors"
            >
                Try Again
            </button>
        </CardContent>
    </Card>
);

export const RegistrationStats = () => {
    const [response, setResponse] = useState<Report | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function getReport() {
        setIsLoading(true);
        setError(null);
        try {
            const response: Report = await GetReports();
            setResponse(response);
        } catch (error) {
            console.error('Error fetching reports:', error);
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getReport();
    }, []);

    // Move stats calculation outside of render to avoid recreation
    const getStats = (data: Report | null) => [
        {
            title: "Total Teacher Registrations",
            value: data?.teacher_registrations_count || "N/A",
            icon: <GraduationCap className="h-5 w-5" />,
            description: "All registered teachers"
        },
        {
            title: "Female Teachers",
            value: data?.females_count || 'N/A',
            icon: <UserCheck className="h-5 w-5" />,
            description: "Female registrations"
        },
        {
            title: "Male Teachers", 
            value: data?.males_count || 'N/A',
            icon: <User className="h-5 w-5" />,
            description: "Male registrations"
        },
        {
            title: "Citizen Registrations",
            value: data?.citizen_count || "N/A",
            icon: <Flag className="h-5 w-5" />,
            description: "Local citizens"
        },
        {
            title: "Non-Citizen Registrations",
            value: data?.non_citizen_count || "N/A",
            icon: <Globe className="h-5 w-5" />,
            description: "International teachers"
        },
    ];

    if (isLoading && !response) {
        return <RegistrationStatsCompactSkeleton />;
    }

    if (error && !response) {
        return <ErrorState onRetry={getReport} />;
    }

    const stats = getStats(response);
    const totalTeachers = (response?.males_count || 0) + (response?.females_count || 0);

    return (
        <div className="space-y-4">
            {/* Summary card */}
            {response && totalTeachers > 0 && (
                <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <Users className="h-8 w-8 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Total Active Teachers</p>
                                <p className="text-3xl font-bold text-primary">
                                    {formatNumber(totalTeachers)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {response.citizen_count ? 
                                        `${Math.round((response.citizen_count / totalTeachers) * 100)}% citizens` : 
                                        ''
                                    }
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Stats grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {stats.map((stat, index) => (
                    <StatCard
                        key={`${stat.title}-${index}`}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        description={stat.description}
                        isLoading={isLoading}
                    />
                ))}
            </div>
        </div>
    );
};

const RegistrationStatsCompactSkeleton = () => {
    return (
        <div className="space-y-3">
            {/* Compact summary */}
            <Card className="bg-muted/20">
                <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                            <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                        </div>
                        <div className="h-6 w-6 bg-muted animate-pulse rounded" />
                    </div>
                </CardContent>
            </Card>

            {/* Compact grid */}
            <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {Array.from({ length: 5 }).map((_, index) => (
                    <Card key={`compact-skeleton-${index}`} className="p-3">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="h-3 w-16 bg-muted animate-pulse rounded" />
                                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                            </div>
                            <div className="h-6 w-12 bg-muted animate-pulse rounded" />
                            <div className="h-2 w-14 bg-muted animate-pulse rounded" />
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};