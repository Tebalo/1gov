'use client'
import { getNext, getNextLicense } from "@/app/lib/actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import React, { Suspense, useState } from "react"
import { LoadingSkeleton } from "../../LoadingSkeleton";
import { useRouter } from "next/navigation";

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
interface license {
    national_id: string;
    reg_number: string;
    reg_status: string;
    registration_type: string;
    created_at: string;
    updated_at: string;
    updated_by: string;
    created_by: string;
}
interface Response {
    services_type: string;
    version: string;
    license: license;
}

export const GetNext: React.FC<WorkProps> = ({status, service_type}) => {
    const {toast} = useToast()
    const [response, setResponse] = useState<Registration | null>(null);
    const [license, setLicense] = useState<Registration | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [redirecting, setIsRedirecting] = useState(false);
    // const timeString = "2024-04-25T11:10:33.000000Z";
    // const date = new Date(timeString);
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
    async function handleWork(){
        setIsLoading(true);
        if(service_type==='license'){
            const response = await getNextLicense(status)
            if(response){
                console.log(response)
                setResponse(response ||  null)
            }else{
                setLicense(null)
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
                    router.push(`/trls/home/teacher/${Id}`);
                }else if(response?.registration_type==='Student-Teacher'){
                    router.push(`/trls/home/student/${Id}`);
                }
            }else if(service_type==='license'){
                if(response?.registration_type==='Teacher'){
                    router.push(`/trls/home/license/teacher/${Id}`);
                }else if(response?.registration_type==='Student-Teacher'){
                    router.push(`/trls/home/license/student/${Id}`);
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
                className="bg-sky-400 hover:bg-sky-600"
                >
                    Get Next Work
                </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Next Work</DialogTitle>
                    <DialogDescription>
                        Retrieves next item in a list of applications based on date of creation.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Suspense fallback={isLoading? 'Loading...':''}>
                    {response ? (
                        <div className="grid grid-cols-1">
                            <div className="grid grid-cols-2 items-center"><Label>Registration Number: </Label><span className="font-light italic text-sm">{response.national_id}</span></div>
                            {/* <div className="grid grid-cols-2 items-center"><Label>Registration Number: </Label><span className="font-light italic text-sm">{response.reg_number}</span></div> */}
                            <div className="grid grid-cols-2 items-center"><Label>Registration Status: </Label><span className="font-light italic text-sm">{response.reg_status}</span></div>
                            <div className="grid grid-cols-2 items-center"><Label>Registration Type: </Label><span className="font-light italic text-sm">{response.registration_type}</span></div>
                            <div className="grid grid-cols-2 items-center"><Label>Created At: </Label><span className="font-light italic text-sm">{ConvertTime(response.created_at)}</span></div>
                            <div className="grid grid-cols-2 items-center"><Label>Updated At: </Label><span className="font-light italic text-sm">{ConvertTime(response.updated_at)}</span></div>
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
                        className={`${redirecting ? 'bg-sky-200':'bg-sky-300'} hover:bg-sky-600`}
                        onClick={() => handleOpen(response?.national_id)}
                        disabled={redirecting}
                        >{redirecting ? (<>Redirecting...</>):(<>Open</>)}</Button>
                    </div>
                </DialogFooter>
          </DialogContent>
        </Dialog>
        </>
    )
}