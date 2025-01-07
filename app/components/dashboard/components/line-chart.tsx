'use client'
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from 'react';
import { getStatuses } from "@/app/lib/actions";

interface DataPoint {
  status: string;
  total: number;
}

export default function CombinedStatusChart() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function getStatusStatistics() {
    setIsLoading(true);
    try {
      const response: DataPoint[] = await getStatuses();
      const filteredData = response.filter((item: DataPoint) => item.total > 0);
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
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Registration Status Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="status" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar 
                yAxisId="right"
                dataKey="total" 
                fill="#82ca9d" 
                name="Total Registrations"
                barSize={30}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="total"
                stroke="#8884d8"
                name="Trend"
                strokeWidth={2}
                dot={{ fill: '#8884d8', r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}