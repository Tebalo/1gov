'use client'
import { getNext, getNextLicense } from "@/app/lib/actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import React, { Suspense, useState } from "react"
import { LoadingSkeleton } from "../../LoadingSkeleton";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface WorkProps{
    status: string;
    service_type: string;
}

interface Registration {
    national_id: string;
    reg_number: string;
    reg_status: string;
    registration_type: string;
    created_at: string;
    updated_at: string;
    updated_by: string;
    created_by: string;
}

export const GetNext: React.FC<WorkProps> = ({status, service_type}) => {
    const {toast} = useToast()
    const [response, setResponse] = useState<Registration | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [redirecting, setIsRedirecting] = useState(false);

    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "UTC"
    };

    function ConvertTime(time: string){
        return new Intl.DateTimeFormat("en-US", options).format(new Date(time))
    }

    function getRelativeTime(updateTime: string) {
        const now = new Date();
        const updated = new Date(updateTime);
        const diffSeconds = Math.floor((now.getTime() - updated.getTime()) / 1000);
        
        if (diffSeconds < 60) {
            return "Updated seconds ago";
        } else if (diffSeconds < 3600) {
            const minutes = Math.floor(diffSeconds / 60);
            return `Updated ${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (diffSeconds < 86400) {
            const hours = Math.floor(diffSeconds / 3600);
            return `Updated ${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (diffSeconds < 604800) {
            const days = Math.floor(diffSeconds / 86400);
            if (days === 1) {
                return "Updated a day ago";
            } else {
                return `Updated ${days} days ago`;
            }
        } else if (diffSeconds < 2592000) {
            const weeks = Math.floor(diffSeconds / 604800);
            if (weeks === 1) {
                return "Updated a week ago";
            } else {
                return `Updated ${weeks} weeks ago`;
            }
        } else if (diffSeconds < 31536000) {
            const months = Math.floor(diffSeconds / 2592000);
            if (months === 1) {
                return "Updated a month ago";
            } else {
                return `Updated ${months} months ago`;
            }
        } else {
            const years = Math.floor(diffSeconds / 31536000);
            if (years === 1) {
                return "Updated a year ago";
            } else {
                return `Updated ${years} years ago`;
            }
        }
    }

    function getSLAStatus(createdAt: string) {
        const created = new Date(createdAt);
        const today = new Date();
        const diffTime = today.getTime() - created.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const remainingDays = 30 - diffDays;

        let badgeColor = "bg-green-100 text-green-800";
        let displayText = `${remainingDays} days left`;

        if (remainingDays <= 5 && remainingDays > 0) {
            badgeColor = "bg-yellow-100 text-yellow-800";
        } else if (remainingDays <= 0) {
            badgeColor = "bg-red-100 text-red-800";
            const overdueDays = Math.abs(remainingDays);
            displayText = `Overdue by ${overdueDays} day${overdueDays !== 1 ? 's' : ''}`;
        }

        return { badgeColor, displayText };
    }

    async function handleWork(){
        setIsLoading(true);
        if(service_type==='license'){
            const response = await getNextLicense(status)
            if(response){
                setResponse(response ||  null)
            }else{
                setResponse(null)
            }
        }else if(service_type==='registration'){
            const response = await getNext(status)
            if(response){
                setResponse(response || null)
            }else{
                setResponse(null)
            }
        }
        setIsLoading(false)
    }

    function handleOpen(Id:string | undefined){
        setIsRedirecting(true)
        if(Id){
            if(service_type==='registration'){
                if(response?.registration_type==='Teacher'){
                    router.push(`/trls/work/object/${Id}`);
                }else if(response?.registration_type==='Student-Teacher'){
                    router.push(`/trls/work/student/${Id}`);
                }
            }else if(service_type==='license'){
                if(response?.registration_type==='Teacher'){
                    router.push(`/trls/work/license/teacher/${Id}`);
                }else if(response?.registration_type==='Student-Teacher'){
                    router.push(`/trls/work/license/student/${Id}`);
                }
            }
        }
    }

    return(
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                    onClick={handleWork}
                    >
                        Get Next Work
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-sky-700">Next Work</DialogTitle>
                        <DialogDescription className="text-gray-600">
                            Retrieves the next item in the list of applications based on creation date.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Suspense fallback={<LoadingSkeleton />}>
                        {isLoading ? (
                            <div className="flex flex-col items-center gap-4 p-6 rounded-">
                                <Loader2 className="h-12 w-12 animate-spin text-primary"/>
                                <div className="text-center space-y-1">
                                    <h3 className="font-medium">Loading your content</h3>
                                    <p className="text-sm text-muted-foreground">This may take a few moments</p>
                                </div>
                            </div>
                        ) : response ? (
                            <div className="space-y-4">
                                <InfoItem label="Registration ID" value={response?.national_id} />
                                <InfoItem label="Registration Status" value={response?.reg_status} />
                                <InfoItem label="Registration Type" value={response?.registration_type} />
                                <InfoItem label="Created" value={ConvertTime(response?.created_at)} />
                                <InfoItem label="Updated" value={getRelativeTime(response?.updated_at)} />
                                <div className="flex justify-between items-center">
                                    <Label className="font-semibold text-gray-700">SLA Status:</Label>
                                    <Badge className={`${getSLAStatus(response?.created_at).badgeColor} font-semibold px-3 py-1`}>
                                        {getSLAStatus(response?.created_at).displayText}
                                    </Badge>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-600 font-semibold">
                                No work found!
                            </div>
                        )}
                        </Suspense>
                    </div>
                    <DialogFooter>
                        {response && (
                            <Button 
                            type="submit" 
                            className={`${redirecting ? 'bg-sky-200' : 'bg-sky-400'} hover:bg-sky-600 text-white font-semibold transition-colors`}
                            onClick={() => handleOpen(response?.national_id)}
                            disabled={redirecting}
                            >
                                {redirecting ? 'Redirecting...' : 'Open'}
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

// Helper component for info items
const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex justify-between items-center">
        <Label className="font-semibold text-gray-700">{label}</Label>
        <span className="text-sm text-gray-600">{value}</span>
    </div>
);