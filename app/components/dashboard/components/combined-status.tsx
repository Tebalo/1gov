"use client"

import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState, useCallback } from "react";
import { getStatuses } from "@/app/lib/actions";

interface DataPoint {
  status: string;
  total: number;
}

interface ErrorState {
  hasError: boolean;
  message: string;
}

const CHART_CONFIG = {
  height: 400,
  margins: { top: 20, right: 30, left: 30, bottom: 20 },
  yAxisWidth: 200, 
  colors: {
    primary: '#3b82f6',
    secondary: '#10b981', 
    gradient: 'url(#barGradient)'
  }
} as const;

export function HorizontalBarChartStatus() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ErrorState>({ hasError: false, message: '' });

  /**
   * Fetches status statistics using the existing getStatuses function
   */
  const fetchStatusStatistics = useCallback(async () => {
    setIsLoading(true);
    setError({ hasError: false, message: '' });
    
    try {
      const response: DataPoint[] = await getStatuses();
      
      if (!Array.isArray(response)) {
        throw new Error('Invalid data format received');
      }
      
      // Filter out zero values and sort by total descending
      const processedData = response
        .filter(item => item && typeof item.total === 'number' && item.total > 0)
        .map(item => ({
          ...item,
          status: formatStatusName(item.status) // Format status names for display
        }))
        .sort((a, b) => b.total - a.total);
      
      setData(processedData);
    } catch (error) {
      console.error("Error fetching status statistics:", error);
      
      setError({
        hasError: true,
        message: error instanceof Error ? error.message : 'Failed to load data'
      });
      
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatusStatistics();
  }, [fetchStatusStatistics]);

  /**
   * Format status names for better display
   */
  const formatStatusName = (status: string): string => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  /**
   * Custom tooltip formatter for better data display
   */
  const formatTooltip = (value: number, name: string) => [
    `${value.toLocaleString()} registrations`,
    'Total'
  ];

  /**
   * Custom label formatter for bars
   */
  const formatLabel = (value: number) => value.toLocaleString();

  /**
   * Retry function for error state
   */
  const handleRetry = useCallback(() => {
    fetchStatusStatistics();
  }, [fetchStatusStatistics]);

  // Loading state
  if (isLoading) {
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Registration Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-500">Loading chart data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error.hasError) {
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Registration Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-red-500 text-lg">⚠️</div>
              <div>
                <p className="text-sm font-medium text-gray-900">Unable to load data</p>
                <p className="text-xs text-gray-500 mt-1">{error.message}</p>
              </div>
              <button
                onClick={handleRetry}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Try Again
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Registration Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="text-gray-400 text-lg">📊</div>
              <p className="text-sm text-gray-500">No registration data available</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Registration Status Distribution
        </CardTitle>
        <p className="text-sm text-gray-500 mt-1">
          {/* {data.reduce((sum, item) => sum + item.total, 0).toLocaleString()} Total registrations */}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[400px] w-full" role="img" aria-label="Registration status distribution chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={CHART_CONFIG.margins}
              barCategoryGap="15%"
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity={1} />
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="3 3" 
                opacity={0.2}
                horizontal={true}
                vertical={false}
              />
              
              <XAxis 
                type="number" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickFormatter={formatLabel}
              />
              
              <YAxis 
                dataKey="status" 
                type="category" 
                width={CHART_CONFIG.yAxisWidth}
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fill: '#374151', 
                  fontSize: 12,
                  fontWeight: 500
                }}
                interval={0}
              />
              
              <Tooltip
                formatter={formatTooltip}
                labelStyle={{ color: '#374151', fontWeight: 500 }}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  fontSize: '12px'
                }}
                cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
              />
              
              <Bar 
                dataKey="total" 
                fill={CHART_CONFIG.colors.gradient}
                name="Registrations"
                radius={[0, 6, 6, 0]}
                label={{ 
                  position: 'right',
                  fill: '#6b7280',
                  fontSize: 11,
                  fontWeight: 500,
                  formatter: formatLabel
                }}
                style={{
                  filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}