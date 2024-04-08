import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge"
import Props from "./components/types";
import { mgt } from "@/app/lib/store";

interface Work{
    data: Props,
    userRole: string
}

const CaseDetails: React.FC<Work> = (data,userRole) => {
  return (       
    <>  
        <div className="items-start bg-gray-50 justify-start h-dvh w-1/4">
        <Card className="h-full">
            <div className="max-w-sm p-2 w-full bg-sky-400 border rounded-lg border-gray-200 shadow">
                <div className='flex gap-2 items-center'>
                    <div className='rounded-lg bg-sky-100 m-2 p-2'>
                        <Image
                            src="/botepco.png"
                            width={40}
                            height={40}
                            alt="Picture of the coat of arms"
                        />
                    </div>
                    <div className='font-sans text-white text-lg'>
                        <a href="#">
                            <p>{data?.data?.teacher_registrations?.national_id}</p>
                            <h5 className="mb-2 tracking-tight">{data?.data?.teacher_registrations?.registration_type}</h5>
                        </a>
                    </div>
                </div>
            </div>
            
            <div className='flex border-b-2 border-dotted border-gray-500 justify-end w-full px-2 py-2'>
                <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm px-4 py-1 me-2">
                    Actions
                </button>
            </div>
            <div className='m-3 space-y-5 mb-10'>
                <div>
                    <h1 className='text-sm text-gray-500'>Priority</h1>
                    <h5 className='text-2xl font-semibold tracking-tight'>LOW</h5>
                </div>
                <div className='flex space-x-3'>
                    <h1 className='text-sm text-gray-500'>Status</h1>
                    <Badge className="flex w-fit"><h1 className='text-nowrap'>{data?.data?.teacher_registrations?.reg_status}</h1></Badge>
                </div>
                {mgt.includes(data?.userRole) && <div className='flex space-x-3'>
                    <h1 className='text-sm text-gray-500'>Status</h1>
                    <Badge className="w-fit"><h1 className='text-nowrap'>{data?.data?.teacher_registrations?.endorsement_status}</h1></Badge>
                </div>}
                <div className='flex space-x-9'>
                    <h1 className='text-sm text-gray-500'>Created</h1>
                    <div className=''>
                        <h1 className='text-xs text-sky-600'>{data?.data?.bio_datas?.forenames} {data?.data?.bio_datas?.surname}</h1>
                        <h1 className='text-xs font-thin'>{data?.data?.teacher_registrations?.created_at}</h1>
                    </div>
                </div>
                <div className='flex space-x-9'>
                    <h1 className='text-sm text-gray-500'>Updated</h1>
                    <div className=''>
                        <h1 className='text-xs text-sky-600'>{data?.data?.bio_datas?.forenames} {data?.data?.bio_datas?.surname}</h1>
                        <h1 className='text-xs font-thin'>{data?.data?.teacher_registrations?.updated_at}</h1>
                    </div>
                </div>
            </div>
            <div className=''>
                <div className='border-r-4 border-r-blue-700 border-y-2  h-12 items-center py-3 px-2 cursor-pointer'>
                    <span className='text-thin text-ellipsis font-light'>
                        Details
                    </span>
                </div>
                <div className='border-r-4 h-12 items-center border-y-2  py-3 px-2 cursor-pointer'>
                    <span className='text-thin text-ellipsis font-light'>
                        Comments
                    </span>
                </div>
            </div>
            </Card>
        </div>
    </> 
    );
}
export default CaseDetails;