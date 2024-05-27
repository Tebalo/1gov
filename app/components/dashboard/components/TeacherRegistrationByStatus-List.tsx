'use client'
import { getTeacherRegistrationsByStatus } from "@/app/lib/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

  interface StatusesByCount {
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
  export function ListOfTeacherRegistrationsByStatus() {
    const [response, setResponse] = useState<StatusesByCount | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function getMonthlyStatics() {
        setIsLoading(true);
        try {
          const response: StatusesByCount  = await getTeacherRegistrationsByStatus();
          setResponse(response);
        } catch (error) {
          console.error('Error fetching reports:', error);
        } finally {
          setIsLoading(false);
        }
      }
      
      useEffect(() => {
          getMonthlyStatics();
      },[]);

    return (
      <div className="space-y-8">
        <div className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">Total Teacher Registrations</p>
            <p className="text-sm text-muted-foreground">
                Description here...
            </p>
          </div>
          <div className="ml-auto font-medium">{response?.allTeacherRegistrationsCount}</div>
        </div>
        <div className="flex items-center">
          <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
            <AvatarImage src="/avatars/02.png" alt="Avatar" />
            <AvatarFallback>JL</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">Pending-Screening</p>
            <p className="text-sm text-muted-foreground">Description here...</p>
          </div>
          <div className="ml-auto font-medium">{response?.screeningCount}</div>
        </div>
        <div className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/03.png" alt="Avatar" />
            <AvatarFallback>IN</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">Pending-Assessment</p>
            <p className="text-sm text-muted-foreground">
                Description here...
            </p>
          </div>
          <div className="ml-auto font-medium">{response?.assessmentCount}</div>
        </div>
        <div className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/04.png" alt="Avatar" />
            <AvatarFallback>WK</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">Pending-Customer-Action</p>
            <p className="text-sm text-muted-foreground">Description here...</p>
          </div>
          <div className="ml-auto font-medium">{response?.customerActionCount}</div>
        </div>
        <div className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/05.png" alt="Avatar" />
            <AvatarFallback>SD</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">Manager-Rejected</p>
            <p className="text-sm text-muted-foreground">Description here...</p>
          </div>
          <div className="ml-auto font-medium">{response?.managerRejectedCount}</div>
        </div>
      </div>
    )
  }
  