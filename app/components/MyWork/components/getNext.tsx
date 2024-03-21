'use client'
import { getNext } from "@/app/lib/actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import React, { Suspense, useState } from "react"
import { LoadingSkeleton } from "../../LoadingSkeleton";

interface WorkProps{
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

    async function handleWork(){
        setIsLoading(true);
        const response = await getNext('Pending-Review')
        setResponse(response[0] || null)
        // toast({
        //     title: JSON.stringify(response)
        //   })
        setIsLoading(false)
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
                        <div className="grid grid-cols-1">
                            <div className="grid grid-cols-2 items-center"><Label>National/Passport: </Label><span className="font-light italic text-sm">{response.national_id}</span></div>
                            <div className="grid grid-cols-2 items-center"><Label>Registration Number: </Label><span className="font-light italic text-sm">{response.reg_number}</span></div>
                            <div className="grid grid-cols-2 items-center"><Label>Registration Status: </Label><span className="font-light italic text-sm">{response.reg_status}</span></div>
                            <div className="grid grid-cols-2 items-center"><Label>Registration Type: </Label><span className="font-light italic text-sm">{response.registration_type}</span></div>
                            <div className="grid grid-cols-2 items-center"><Label>Created At: </Label><span className="font-light italic text-sm">{response.created_at}</span></div>
                            <div className="grid grid-cols-2 items-center"><Label>Updated At: </Label><span className="font-light italic text-sm">{response.updated_at}</span></div>
                        </div>
                    ) : (
                        <div><LoadingSkeleton/></div>
                    )}
                    </Suspense>
                </div>
                <DialogFooter>
                    <Button type="submit" className="bg-sky-300 hover:bg-sky-600">Open</Button>
                </DialogFooter>
          </DialogContent>
        </Dialog>
        </>
    )
}