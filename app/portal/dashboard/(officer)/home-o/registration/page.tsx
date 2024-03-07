"use client"
import React, {useState}  from "react";
import {motion} from 'framer-motion';

interface RowData {
    id: string;
    title: string;
    date: string;
    status: string;
    action: string;
}

const rowData: RowData[] = [
    { id: '67bf7nfe74unf843m', title: 'Teacher registration', date: '02 Feb 2024 - 12:48', status: 'Draft', action: '' },
];

const MyApplications: React.FC = () => {
    return(
        <main className="mx-10 mt-10 space-y-3">
            <span>View Teacher registration</span>
        </main>
    )
}
export default MyApplications;