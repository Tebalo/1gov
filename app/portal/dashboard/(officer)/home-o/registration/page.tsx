"use client"
import React, {useState}  from "react";

interface TeacherData {
    teacher_registrations: {
      reg_number: string;
      reg_status: string;
      registration_type: string;
    };
    bio_datas: {
      national_id: string;
      surname: string;
      forenames: string;
      dob: string;
      // to add other fields as needed
    };
}
interface RowData {
    id: string;
    title: string;
    date: string;
    status: string;
    action: string;
}
interface TeacherRegistrationProps {
    data: TeacherData;
  }

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
const Page: React.FC<TeacherRegistrationProps> = ({ data }) => {
    return (
        <main className="mx-10 mt-10 space-y-3">
            <div>
                <span>View Teacher registration</span>
                <p>Registration Number: {data?.teacher_registrations?.reg_number}</p>
                <p>Registration Status: {data?.teacher_registrations?.reg_status}</p>
                <p>Registration Type: {data?.teacher_registrations?.registration_type}</p>

                <h2>Bio Data</h2>
                <p>National ID: {data?.bio_datas?.national_id}</p>
                <p>Surname: {data?.bio_datas?.surname}</p>
                {/* to add more bio data fields here */}
            </div>
       </main>
    );
};

export default Page; 