'use client'
import { GetStudentStats } from "@/app/lib/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useState } from "react";
import { Users, GraduationCap, UserCircle, AlertCircle, ClipboardCheck, CircleAlert } from "lucide-react"

interface StatusStatistics {
    allTeacherRegistrationsCount: number;
    screeningCount: number;
    assessmentCount: number;
    customerActionCount: number;
    approvalRecommendationCount: number;
    approvalCount: number;
    managerApprovedCount: number;
    managerRejectedCount: number;
    endorsementRecommendationCount: number;
    endorsementCompleteCount: number;
    pendingEndorsementCount: number;
    notPendingEndorsementCount: number;
}

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    description?: string;
}

const StatCard = ({ title, value, icon, description }: StatCardProps) => (
    <Card className="min-w-full">
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

export const StudentRegistrationCard = () => {
    const [statistics, setStatistics] = useState<StatusStatistics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchStatistics() {
            setIsLoading(true);
            setError(null);
            
            try {
                const data = await GetStudentStats();
                console.log('Fetched statistics:', data);
                setStatistics(data);
            } catch (err) {
                console.error('Error fetching statistics:', err);
                setError('Failed to load statistics. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        }

        fetchStatistics();
    }, []);

    const stats = [
        {
            title: "All Teacher Registrations",
            value: statistics?.allTeacherRegistrationsCount ?? "--",
            icon: <Users className="h-4 w-4 text-muted-foreground" />
        },
        {
            title: "Screening",
            value: statistics?.screeningCount ?? "--",
            icon: <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
        },
        {
            title: "Assessment",
            value: statistics?.assessmentCount ?? "--",
            icon: <GraduationCap className="h-4 w-4 text-muted-foreground" />
        },
        {
            title: "Customer Action Required",
            value: statistics?.customerActionCount ?? "--",
            icon: <AlertCircle className="h-4 w-4 text-muted-foreground" />
        },
        {
            title: "Pending Endorsement",
            value: statistics?.pendingEndorsementCount ?? "--",
            icon: <CircleAlert className="h-4 w-4 text-muted-foreground" />
        },
        {
            title: "Manager Approved",
            value: statistics?.managerApprovedCount ?? "--",
            icon: <UserCircle className="h-4 w-4 text-muted-foreground" />
        }
    ];

    if (isLoading) {
        return <LoadingCardsSkeleton />;
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    if (!statistics) {
        return <div className="text-gray-500 text-center">No data available</div>;
    }

    return (
        <div className="h-96 w-full">
            <ScrollArea className="h-screen w-full rounded-md border p-4">
                <div className="grid gap-4 grid-cols-1 pr-4">
                    {stats.map((stat, index) => (
                        <StatCard
                            key={index}
                            title={stat.title}
                            value={stat.value}
                            icon={stat.icon}
                        />
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};

export const LoadingCardsSkeleton = () => {
    // Array with 3 elements to create 3 skeleton cards
    const skeletonCards = Array(3).fill(null);
    
    return (
      <div className="grid grid-cols-1 gap-4">
        {skeletonCards.map((_, index) => (
          <Card key={index} className="w-full overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              {/* Skeleton for title */}
              <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
              {/* Skeleton for icon */}
              <div className="h-4 w-4 bg-gray-200 animate-pulse rounded-full"></div>
            </CardHeader>
            <CardContent>
              {/* Skeleton for value */}
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mb-2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };