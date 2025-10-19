"use client"

import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState, useCallback } from "react";
import { getStatuses } from "@/app/lib/actions";

interface DataPoint {
  status: string;
  total: number;
}

interface ChartDataPoint extends DataPoint {
  fill: string;
  formattedStatus: string;
}

interface ErrorState {
  hasError: boolean;
  message: string;
}

// Color palette for bars
const BAR_COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Green
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Purple
  "#06b6d4", // Cyan
  "#f97316", // Orange
  "#ec4899", // Pink
  "#64748b", // Slate
  "#84cc16", // Lime
  "#6366f1", // Indigo
  "#14b8a6", // Teal
  "#f43f5e", // Rose
  "#a855f7", // Violet
  "#22c55e", // Emerald
];

// Constants for better maintainability
const CHART_CONFIG = {
  height: 400,
  margins: { top: 20, right: 30, left: 20, bottom: 20 },
  yAxisWidth: 140,
} as const;

export function HorizontalBarChartStatus() {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ErrorState>({ hasError: false, message: '' });

  // Format status names for display
  const formatStatusName = useCallback((status: string) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }, []);

  // Smart color assignment based on status type
  const getStatusColor = (status: string, index: number): string => {
    // Always use index-based colors for uniqueness, but with smart ordering
    const lowerStatus = status.toLowerCase();
    
    // Determine base color category, then add index offset
    let colorIndex = index;
    
    if (lowerStatus.includes('approved') || lowerStatus.includes('completed') || lowerStatus.includes('active')) {
      colorIndex = 1; // Green base
    } else if (lowerStatus.includes('rejected') || lowerStatus.includes('failed') || lowerStatus.includes('declined')) {
      colorIndex = 3; // Red base
    } else if (lowerStatus.includes('review') || lowerStatus.includes('verification') || lowerStatus.includes('processing')) {
      colorIndex = 4; // Purple base
    } else if (lowerStatus.includes('expired') || lowerStatus.includes('archived') || lowerStatus.includes('cancelled')) {
      colorIndex = 8; // Slate base
    }
    
    // Add index offset to ensure uniqueness while maintaining semantic meaning
    const finalIndex = (colorIndex + index) % BAR_COLORS.length;
    return BAR_COLORS[finalIndex];
  };

  /**
   * Fetches and processes status statistics data
   */
  const fetchStatusStatistics = useCallback(async () => {
    setIsLoading(true);
    setError({ hasError: false, message: '' });
    
    try {
      const response: DataPoint[] = await getStatuses();
      
      if (!Array.isArray(response)) {
        throw new Error('Invalid data format received');
      }
      
      // Filter out zero values, endorsement statuses, and sort by total descending
      const processedData = response
        .filter(item => {
          // Exclude endorsement-related statuses and zero totals
          const isEndorsementStatus = item.status.toLowerCase().includes('endorsement');
          return item && typeof item.total === 'number' && item.total > 0 && !isEndorsementStatus;
        })
        .sort((a, b) => b.total - a.total)
        .map((item, index) => ({
          ...item,
          fill: getStatusColor(item.status, index),
          formattedStatus: formatStatusName(item.status)
        }));
      
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
  }, [formatStatusName]);

  useEffect(() => {
    fetchStatusStatistics();
  }, [fetchStatusStatistics]);

  /**
   * Custom tooltip formatter for better data display
   */
  const formatTooltip = (value: number, name: string, props: any) => [
    `${value.toLocaleString()} registrations`,
    props.payload?.formattedStatus || 'Total'
  ];

  /**
   * Custom label formatter for bars
   */
  const formatLabel = (value: number) => value.toLocaleString();

  // Calculate total registrations
  const totalRegistrations = data.reduce((sum, item) => sum + item.total, 0);

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
                onClick={fetchStatusStatistics}
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
          {totalRegistrations.toLocaleString()} total registrations • {data.length} statuses
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[450px] w-full" role="img" aria-label="Registration status distribution chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={CHART_CONFIG.margins}
              barCategoryGap="15%"
            >
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
                dataKey="formattedStatus" 
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
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Color Legend */}
        {data.length > 1 && (
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            {data.slice(0, 6).map((item, index) => (
              <div key={item.status} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-sm flex-shrink-0" 
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-gray-600 truncate">
                  {item.formattedStatus} ({item.total.toLocaleString()})
                </span>
              </div>
            ))}
            {data.length > 6 && (
              <div className="col-span-2 text-center text-gray-500 mt-2">
                +{data.length - 6} more statuses
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}