"use client"

import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getStatuses } from "@/app/lib/actions";

interface DataPoint {
  status: string;
  total: number;
}

export function HorizontalBarChartStatus() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function getStatusStatistics() {
    setIsLoading(true);
    try {
      const response: DataPoint[] = await getStatuses();
      const filteredData = response.filter(item => item.total > 0);
      setData(filteredData);
    } catch (error) {
      console.error("Error fetching statuses:", error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getStatusStatistics();
  }, []);

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Registration Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis type="number" />
              <YAxis 
                dataKey="status" 
                type="category" 
                width={100}
                tick={{ fill: '#888', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar 
                dataKey="total" 
                fill="#82ca9d"
                name="Total Registrations"
                radius={[0, 4, 4, 0]}
                label={{ 
                  position: 'right',
                  fill: '#666',
                  fontSize: 12
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}