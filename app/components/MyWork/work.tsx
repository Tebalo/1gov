import React from "react"
import { GetNext } from "./components/getNext";

interface WorkProps{
    status: string;
}

export const Work: React.FC<WorkProps> = ({status}) => {
    return(
        <>
            <div>
                <GetNext status={"Pending-Review"}/>
            </div>
        </>
    )
}