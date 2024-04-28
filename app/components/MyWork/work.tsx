import React from "react"
import { GetNext } from "./components/getNext";

interface WorkProps{
    status: string;
    service_type: string;
}

export const Work: React.FC<WorkProps> = ({status, service_type}) => {
    return(
        <>
            <div>
                <GetNext status={status} service_type={service_type}/>
            </div>
        </>
    )
}