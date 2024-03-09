import CaseDetails from "@/app/components/case/casedetails";
import Utilities from "@/app/components/case/utilities";
import WorkArea from "@/app/components/case/workarea";
import { getNext } from "@/app/lib/route";
import React, {useState}  from "react";

interface Record{
    national_id: string;
}

const Page: React.FC<Record> = async () => {
    const work = await getNext()
    const details = {
        'status': work.reg_status,
        'type': work.registration_type,
        'id': work.national_id,
        'createdBy': work.forenames +' '+ work.surname,
        'createdAt': work.created_at,
        'updatedAt': work.updated_at,
    }
    const recordDetails = {
        'preliminary': {
            'type': work.registration_type,
            'work_status': work.work_status,
            'practice_category': work.practice_category,
            'sub_cateogry': work.sub_cateogry,
        }, 
    }
    return (
        <main className="h-full">
            <div className="flex flex-row h-full gap-1">
                <CaseDetails {...details}/>
                <WorkArea {...recordDetails}/>
                {/**<Utilities/>*/}
            </div>
       </main>
    );
};

export default Page; 