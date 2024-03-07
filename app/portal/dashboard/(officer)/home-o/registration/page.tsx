"use client"
import React, {useState}  from "react";
import {motion} from 'framer-motion';
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

const rowData: RowData[] = [
    { id: '67bf7nfe74unf843m', title: 'Teacher registration', date: '02 Feb 2024 - 12:48', status: 'Draft', action: '' },
];

const MyApplications: React.FC<TeacherRegistrationProps> = ({data}) => {
    return(
        <main className="mx-10 mt-10 space-y-3">
            <div>
            <span>View Teacher registration</span>
            <p>Registration Number: {data.teacher_registrations.reg_number}</p>
            <p>Registration Status: {data.teacher_registrations.reg_status}</p>
            <p>Registration Type: {data.teacher_registrations.registration_type}</p>
            
            <h2>Bio Data</h2>
            <p>National ID: {data.bio_datas.national_id}</p>
            <p>Surname: {data.bio_datas.surname}</p>
      {/* to add more bio data fields here */}


            </div>

        </main>
    )
}
export default MyApplications;