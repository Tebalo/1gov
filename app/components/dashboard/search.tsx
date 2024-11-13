import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search as SearchIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { Suspense, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ComplaintSearchResponse, reporter } from "@/app/lib/types"
import { searchComplaintByInquiry } from "@/app/lib/actions"
import { LoadingSkeleton } from "../LoadingSkeleton"

export const Search: React.FC = () => {
    const [response, setResponse] = useState<reporter | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [redirecting, setIsRedirecting] = useState(false);
    const [inputId, setInputId] = useState("");

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

    function ConvertTime(time: string | null) {
        if (!time) return "N/A";
        return new Intl.DateTimeFormat("en-US", options).format(new Date(time))
    }

    function getRelativeTime(updateTime: string | null) {
        if (!updateTime) return "Never updated";
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
        } else {
            const days = Math.floor(diffSeconds / 86400);
            return `Updated ${days} day${days > 1 ? 's' : ''} ago`;
        }
    }

    async function search(id: string) {
        setIsLoading(true);
        const results:ComplaintSearchResponse = await searchComplaintByInquiry(id);
        if (results.reporter) {
            await setResponse(results.reporter);
            console.log(response?.name)
        } else {
            setResponse(null);
        }
        setIsLoading(false);
    }

    function handleOpen(inquiryNumber: string | null) {
        if (!inquiryNumber) return;
        setIsRedirecting(true);
        router.push(`/trls/work/investigation/${inquiryNumber}`);
    }

    return (
        <div className="flex w-full max-w-sm items-end space-x-2">
            <div className="flex-grow">
                <Input 
                    type="text" 
                    id="ID" 
                    placeholder="Search by Inquiry Number" 
                    value={inputId}
                    onChange={(e) => setInputId(e.target.value)}
                />
            </div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button 
                        type="submit" 
                        className="flex items-center"
                        onClick={() => search(inputId)}
                    >
                        <SearchIcon className="h-4 w-4 mr-2" />
                        Search
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-sky-700">Complaint Details</DialogTitle>
                        <DialogDescription className="text-gray-600">
                            Search results for complaint inquiry
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Suspense fallback={<LoadingSkeleton />}>
                            {isLoading ? (
                                <LoadingSkeleton />
                            ) : response ? (
                                <div className="space-y-4">
                                    <InfoItem label="Inquiry Number" value={response.inquiry_number || 'N/A'} />
                                    <InfoItem label="Case Number" value={response.case_number || 'N/A'} />
                                    <InfoItem label="Status" value={response.reg_status || 'N/A'} />
                                    <InfoItem label="Submission Type" value={response.submission_type || 'N/A'} />
                                    {/* <InfoItem label="Reporter Name" value={response.anonymous === 'Yes' ? 'Anonymous' : (response.name || 'N/A')} /> */}
                                    <InfoItem label="Created" value={ConvertTime(response.created_at)} />
                                    <InfoItem label="Last Updated" value={getRelativeTime(response.updated_at)} />
                                    {/* {response.anonymous !== 'Yes' && (
                                        <>
                                            <InfoItem label="Contact" value={response.contact_number || 'N/A'} />
                                            <InfoItem label="ID Number" value={response.Omang_id || response.passport_no || 'N/A'} />
                                            <InfoItem label="Nationality" value={response.nationality || 'N/A'} />
                                        </>
                                    )} */}
                                </div>
                            ) : (
                                <div className="text-center text-gray-600 font-semibold">
                                    No complaint found matching the provided inquiry number.
                                </div>
                            )}
                        </Suspense>
                    </div>
                    <DialogFooter>
                        {response && (
                            <Button 
                                type="submit" 
                                className={`${redirecting ? 'bg-sky-200' : 'bg-sky-400'} hover:bg-sky-600 text-white font-semibold transition-colors`}
                                onClick={() => handleOpen(response?.inquiry_number)}
                                disabled={redirecting}
                            >
                                {redirecting ? 'Redirecting...' : 'Open Complaint'}
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

// Helper component for info items
const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex justify-between items-center">
        <Label className="font-semibold text-gray-700">{label}</Label>
        <span className="text-sm text-gray-600">{value}</span>
    </div>
);