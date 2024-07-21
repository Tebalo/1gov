"use client"

import { getMonthlyTeacherRegistrations } from "@/app/lib/actions";
import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { LoadingSkeleton } from "../../LoadingSkeleton";

interface DataPoint {
    name: string;
    value: number;
}

export const MonthlyTeacherRegistrations = () => {
    const [response, setResponse] = useState<DataPoint[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function getMonthlyStatistics() {
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
        getMonthlyStatistics();
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
