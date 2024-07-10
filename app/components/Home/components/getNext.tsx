'use client'
import { getNext } from "@/app/lib/actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import React, { Suspense, useState } from "react"
import { LoadingSkeleton } from "../../LoadingSkeleton";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface WorkProps {
    status: string;
}

interface Registration {
    national_id: string;
    reg_number: string;
    reg_status: string;
    registration_type: string;
    created_at: string;
    updated_at: string;
}

export const GetNext: React.FC<WorkProps> = ({status}) => {
    const {toast} = useToast()
    const [response, setResponse] = useState<Registration | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function handleWork(){
        setIsLoading(true);
        const response = await getNext(status)
        if(response){
            setResponse(response[0] || null)
        } else {
            setResponse(null)
        }
        setIsLoading(false)
    }

    function handleOpen(Id:string | undefined){
        if(Id){
            router.push(`/trls/home/${Id}`);
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

    return(
        <>
        <Dialog>
            <DialogTrigger asChild>
                <Button
                onClick={handleWork}
                className="bg-sky-300 hover:bg-sky-600"
                >
                    Get Next Work
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Next Work</DialogTitle>
                    <DialogDescription>
                        Add description here...
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Suspense fallback={isLoading? 'Loading...':''}>
                    {response ? (
                        <div className="grid grid-cols-1 gap-2">
                            <div className="grid grid-cols-2 items-center"><Label>National/Passport: </Label><span className="font-light italic text-sm">{response.national_id}</span></div>
                            <div className="grid grid-cols-2 items-center"><Label>Registration Number: </Label><span className="font-light italic text-sm">{response.reg_number}</span></div>
                            <div className="grid grid-cols-2 items-center"><Label>Registration Status: </Label><span className="font-light italic text-sm">{response.reg_status}</span></div>
                            <div className="grid grid-cols-2 items-center"><Label>Registration Type: </Label><span className="font-light italic text-sm">{response.registration_type}</span></div>
                            <div className="grid grid-cols-2 items-center"><Label>Updated At: </Label><span className="font-light italic text-sm">{response.updated_at}</span></div>
                            <div className="grid grid-cols-2 items-center">
                                <Label>SLA Status: </Label>
                                <Badge className={`${getSLAStatus(response.created_at).badgeColor} font-semibold`}>
                                    {getSLAStatus(response.created_at).displayText}
                                </Badge>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full flex justify-center">
                            {isLoading ? (
                                <LoadingSkeleton/>
                            ):(
                            <Label>No work found!!!</Label>
                            )}
                        </div>
                    )}
                    </Suspense>
                </div>
                <DialogFooter>
                    <div className={`${response? 'block':'hidden'}`}>
                        <Button 
                        type="submit" 
                        className="bg-sky-300 hover:bg-sky-600"
                        onClick={() => handleOpen(response?.national_id)}
                        >Open</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    )
}