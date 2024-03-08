"use client"
import CaseDetails from "@/app/components/case/casedetails";
import Utilities from "@/app/components/case/utilities";
import WorkArea from "@/app/components/case/workarea";
import React, {useState}  from "react";
const data = {
    "teacher_registrations":{
        "reg_number":"GH6778888",
        "reg_status":"Pending-Screening",
        "registration_type":"Teacher"
    },
    "bio_datas":{
        "national_id":"936510813",
        "surname":"Serala",
        "forenames":"Oaitse",
        "dob":"1996-02-15",
        "pob":"Mahalapye",
        "gender":"Male",
        "nationality":"Motswana",
        "postal_address":"P O Box 7886, Mahalapye",
        "physical_address":"Block 10, Gaborone",
        "email":"johndoe@gmail.com",
        "mobile":"26774217788",
        "marital_status":"Single",
        "next_of_kin_name":"Sarah Cornor",
        "next_of_kin_relation":"Mother",
        "next_of_kin_contact":"26776554321",
        "disability":"Yes",
        "disability_description":"left eye is impaired and dont see clearly on cold conditions"
    },
}

const Page: React.FC = () => {
    return (
        <main className="h-full">
            <div className="flex flex-row h-full gap-1">
                <CaseDetails/>
                <WorkArea/>
                {/**<Utilities/>*/}
            </div>
       </main>
    );
};

export default Page; 