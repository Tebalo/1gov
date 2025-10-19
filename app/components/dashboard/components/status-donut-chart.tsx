"use client"
import * as React from "react"
import { TrendingUp, TrendingDown, Minus, AlertCircle, PieChart as PieChartIcon } from "lucide-react"
import { Label, Pie, PieChart, Cell } from "recharts"
import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { getStatuses } from "@/app/lib/actions"

interface DataPoint {
  status: string;
  total: number;
}

interface ChartDataPoint extends DataPoint {
  fill: string;
  percentage: number;
  formattedStatus: string;
}

interface TrendInfo {
  percentage: number;
  direction: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  message: string;
}

const CHART_COLORS = [
  "#3b82f6", // Blue - for approved/completed statuses
  "#10b981", // Green - for active/in-progress statuses  
  "#f59e0b", // Amber - for pending/waiting statuses
  "#ef4444", // Red - for rejected/failed statuses
  "#8b5cf6", // Purple - for review/verification statuses
  "#06b6d4", // Cyan - for submitted/new statuses
  "#f97316", // Orange - for draft/incomplete statuses
  "#ec4899", // Pink - for special/priority statuses
  "#64748b", // Slate - for archived/inactive statuses
  "#84cc16", // Lime - for approved variants
];

const LoadingSkeleton = () => (
  <Card className="flex flex-col h-full">
    <CardHeader className="items-center pb-0">
      <div className="h-6 w-48 bg-muted animate-pulse rounded" />
      <div className="h-4 w-32 bg-muted animate-pulse rounded" />
    </CardHeader>
    <CardContent className="flex-1 pb-0">
      <div className="mx-auto aspect-square max-h-[400px] min-h-[300px] bg-muted animate-pulse rounded-full" />
    </CardContent>
    <CardFooter className="flex-col gap-2">
      <div className="h-4 w-full bg-muted animate-pulse rounded" />
      <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
    </CardFooter>
  </Card>
);

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <Card className="flex flex-col h-full">
    <CardContent className="flex flex-col items-center justify-center py-8 min-h-[400px] flex-1">
      <AlertCircle className="h-8 w-8 text-destructive mb-2" />
      <p className="text-sm text-muted-foreground mb-4">
        Failed to load status distribution
      </p>
      <button 
        onClick={onRetry}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors"
      >
        Try Again
      </button>
    </CardContent>
  </Card>
);

const EmptyState = () => (
  <Card className="flex flex-col h-full">
    <CardHeader className="items-center pb-0">
      <CardTitle className="flex items-center gap-2">
        <PieChartIcon className="h-5 w-5" />
        Registration Status Distribution
      </CardTitle>
      <CardDescription>Current status breakdown</CardDescription>
    </CardHeader>
    <CardContent className="flex-1 pb-0">
      <div className="flex flex-col items-center justify-center py-8 min-h-[400px]">
        <PieChartIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <p className="text-sm text-muted-foreground">
          No status data available
        </p>
      </div>
    </CardContent>
  </Card>
);

export function StatusDonutChart() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getStatusStatistics() {
    setIsLoading(true);
    setError(null);
    try {
      const response: DataPoint[] = await getStatuses();
      
      // Filter out zero totals and exclude endorsement meta-statuses
      const filteredData = response
        .filter((item: DataPoint) => {
          // Exclude endorsement-related statuses and zero totals
          const isEndorsementStatus = item.status.toLowerCase().includes('endorsement');
          return item.total > 0 && !isEndorsementStatus;
        })
        .reduce((acc: DataPoint[], current: DataPoint) => {
          // Check if status already exists in accumulator
          const existingIndex = acc.findIndex(item => item.status === current.status);
          if (existingIndex === -1) {
            acc.push(current);
          }
          return acc;
        }, []);
      
      setData(filteredData);
    } catch (err) {
      console.error("Error fetching statuses:", err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getStatusStatistics();
  }, []);

  // Format status names for display
  const formatStatusName = React.useCallback((status: string) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }, []);

  // Unique color assignment - each status gets its own color
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
    const finalIndex = (colorIndex + index) % CHART_COLORS.length;
    return CHART_COLORS[finalIndex];
  };

  // Calculate total registrations
  const totalRegistrations = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.total, 0);
  }, [data]);

  // Prepare chart data with colors and percentages
  const chartData: ChartDataPoint[] = React.useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      fill: getStatusColor(item.status, index),
      percentage: totalRegistrations > 0 ? (item.total / totalRegistrations) * 100 : 0,
      formattedStatus: formatStatusName(item.status)
    }));
  }, [data, totalRegistrations, formatStatusName]);

  // Simplified chart config - just for tooltip labels
  const chartConfig: ChartConfig = React.useMemo(() => {
    return {
      total: {
        label: "Registrations",
      },
    };
  }, []);

  // Calculate trend information
  const getTrendInfo = (): TrendInfo => {
    if (chartData.length === 0) {
      return { 
        percentage: 0, 
        direction: 'neutral', 
        icon: <Minus className="h-4 w-4" />,
        message: 'No trend data available'
      };
    }

    if (chartData.length === 1) {
      return { 
        percentage: 100, 
        direction: 'neutral', 
        icon: <Minus className="h-4 w-4" />,
        message: `All registrations are ${chartData[0].formattedStatus.toLowerCase()}`
      };
    }

    // Find dominant status
    const dominantStatus = chartData.reduce((prev, current) => 
      (prev.total > current.total) ? prev : current
    );

    const dominantPercentage = dominantStatus.percentage;

    if (dominantPercentage > 60) {
      return { 
        percentage: dominantPercentage, 
        direction: 'up', 
        icon: <TrendingUp className="h-4 w-4" />,
        message: `${dominantStatus.formattedStatus} dominates at ${dominantPercentage.toFixed(1)}%`
      };
    } else if (dominantPercentage < 30) {
      return { 
        percentage: dominantPercentage, 
        direction: 'down', 
        icon: <TrendingDown className="h-4 w-4" />,
        message: 'Evenly distributed across statuses'
      };
    }

    return { 
      percentage: dominantPercentage, 
      direction: 'neutral', 
      icon: <Minus className="h-4 w-4" />,
      message: `${dominantStatus.formattedStatus} leads with ${dominantPercentage.toFixed(1)}%`
    };
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorState onRetry={getStatusStatistics} />;
  }

  if (data.length === 0) {
    return <EmptyState />;
  }

  const trendInfo = getTrendInfo();

  return (
    <Card className="flex flex-col h-full transition-all duration-200 hover:shadow-lg">
      <CardHeader className="items-center pb-0">
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5 text-primary" />
          Registration Status Distribution
        </CardTitle>
        <CardDescription>
          {chartData.length} status{chartData.length !== 1 ? 'es' : ''} tracked • Real-time data
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[400px] min-h-[300px] w-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent 
                hideLabel 
                formatter={(value, name, props) => [
                  `${Number(value).toLocaleString()} registrations (${props.payload?.percentage?.toFixed(1)}%) `,
                  props.payload?.formattedStatus || name
                ]}
              />}
            />
            <Pie
              data={chartData}
              dataKey="total"
              nameKey="formattedStatus"
              innerRadius={80}
              outerRadius={160}
              strokeWidth={3}
              stroke="var(--background)"
              className="drop-shadow-sm"
              animationBegin={0}
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {totalRegistrations.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 28}
                          className="fill-muted-foreground text-sm font-medium"
                        >
                          Total Registrations
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      
      {/* Color Legend */}
      {chartData.length > 1 && (
        <div className="px-6 pb-4">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {chartData.slice(0, 4).map((item, index) => (
              <div key={item.status} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-muted-foreground truncate">
                  {item.formattedStatus} ({item.percentage.toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
          {chartData.length > 4 && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              +{chartData.length - 4} more statuses
            </p>
          )}
        </div>
      )}
      
      <CardFooter className="flex-col gap-2 text-sm pt-0">
        <div className="flex items-center gap-2 leading-none font-medium">
          {trendInfo.icon}
          {trendInfo.message}
        </div>
        <div className="text-muted-foreground leading-none text-center">
          Live status distribution from registration system
        </div>
      </CardFooter>
    </Card>
  )
}