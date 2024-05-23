"use client"

import { getMonthlyTeacherRegistrations } from "@/app/lib/actions";
import { set } from "date-fns";
import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { LoadingSkeleton } from "../../LoadingSkeleton";

// const data = [
//   {
//     name: "Jan",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Feb",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Mar",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Apr",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "May",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Jun",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Jul",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Aug",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Sep",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Oct",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Nov",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
//   {
//     name: "Dec",
//     total: Math.floor(Math.random() * 5000) + 1000,
//   },
// ]





interface DataPoint {
    name: string;
    value: number;
}

const getMonthlyTeacherRegistrationsTHC = async (): Promise<DataPoint[]> => {
    return [
      { "name": "Jan", "value": 0 },
      { "name": "Feb", "value": 1 },
      { "name": "Mar", "value": 5 },
      { "name": "Apr", "value": 3 },
      { "name": "May", "value": 12 },
      { "name": "Jun", "value": 0 },
      { "name": "Jul", "value": 0 },
      { "name": "Aug", "value": 0 },
      { "name": "Sep", "value": 0 },
      { "name": "Oct", "value": 0 },
      { "name": "Nov", "value": 0 },
      { "name": "Dec", "value": 0 }
    ];
  };

export const MonthlyTeacherRegistrations = () => {
    const [response, setResponse] = useState<DataPoint[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function getMonthlyStatics() {
      setIsLoading(true);
      try {
        const response: DataPoint[]  = await getMonthlyTeacherRegistrations();
        setResponse(response);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    useEffect(() => {
        getMonthlyStatics();
    },[]);

    return (
        <ResponsiveContainer width="100%" height={350}>
            {response ? (<BarChart data={response}>
                <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                />
                <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
                />
                <Bar
                dataKey="value"
                fill="currentColor"
                radius={[4, 4, 0, 0]}
                className="fill-primary"
                />
            </BarChart>
            ):(<><LoadingSkeleton/></>)
            }
        </ResponsiveContainer>
    )
}
