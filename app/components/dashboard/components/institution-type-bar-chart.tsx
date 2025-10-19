"use client"
import { TrendingUp, TrendingDown, Minus, AlertCircle, Building } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
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
import { getInstitutionTypeStatistics } from "@/app/lib/actions"

interface InstitutionData {
  month: string;
  public: number;
  private: number;
}

interface TrendInfo {
  percentage: number;
  direction: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  message: string;
}

const chartConfig = {
  public: {
    label: "Public Institutions",
    color: "#3b82f6", // Blue
  },
  private: {
    label: "Private Institutions",
    color: "#10b981", // Green
  },
} satisfies ChartConfig

const LoadingSkeleton = () => (
  <Card className="h-full flex flex-col">
    <CardHeader className="flex-shrink-0">
      <div className="h-6 w-48 bg-muted animate-pulse rounded" />
      <div className="h-4 w-64 bg-muted animate-pulse rounded" />
    </CardHeader>
    <CardContent className="flex-1 flex items-center justify-center min-h-[400px]">
      <div className="h-full w-full bg-muted animate-pulse rounded" />
    </CardContent>
    <CardFooter className="flex-shrink-0">
      <div className="h-4 w-full bg-muted animate-pulse rounded" />
    </CardFooter>
  </Card>
);

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <Card className="h-full flex flex-col">
    <CardContent className="flex-1 flex flex-col items-center justify-center py-8 min-h-[400px]">
      <AlertCircle className="h-8 w-8 text-destructive mb-2" />
      <p className="text-sm text-muted-foreground mb-4">
        Failed to load institution type data
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
  <Card className="h-full flex flex-col">
    <CardHeader className="flex-shrink-0">
      <CardTitle className="flex items-center gap-2">
        <Building className="h-5 w-5" />
        Institution Type Registrations
      </CardTitle>
      <CardDescription>
        Monthly registration breakdown by institution type
      </CardDescription>
    </CardHeader>
    <CardContent className="flex-1 flex flex-col items-center justify-center py-8 min-h-[400px]">
      <Building className="h-12 w-12 text-muted-foreground/50 mb-4" />
      <p className="text-sm text-muted-foreground">
        No institution data available at the moment
      </p>
    </CardContent>
  </Card>
);

export default function InstitutionTypeBarChart() {
  const [data, setData] = useState<InstitutionData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getInstitutionStatistics() {
    setIsLoading(true);
    setError(null);
    try {
      const response: InstitutionData[] = await getInstitutionTypeStatistics();
      setData(response);
    } catch (err) {
      console.error("Error fetching institution statistics:", err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getInstitutionStatistics();
  }, []);

  // Calculate trend information
  const getTrendInfo = (): TrendInfo => {
    if (data.length < 2) {
      return { 
        percentage: 0, 
        direction: 'neutral', 
        icon: <Minus className="h-4 w-4" />,
        message: 'Insufficient data for trend analysis'
      };
    }

    // Get months with actual data
    const monthsWithData = data.filter(item => item.public + item.private > 0);
    if (monthsWithData.length < 2) {
      return { 
        percentage: 0, 
        direction: 'neutral', 
        icon: <Minus className="h-4 w-4" />,
        message: 'Limited activity to analyze trends'
      };
    }

    const latestMonth = monthsWithData[monthsWithData.length - 1];
    const previousMonth = monthsWithData[monthsWithData.length - 2];
    
    const currentTotal = latestMonth.public + latestMonth.private;
    const previousTotal = previousMonth.public + previousMonth.private;
    
    if (previousTotal === 0) {
      return { 
        percentage: 0, 
        direction: 'up', 
        icon: <TrendingUp className="h-4 w-4" />,
        message: `New activity in ${latestMonth.month} with ${currentTotal.toLocaleString()} registrations`
      };
    }

    const percentage = ((currentTotal - previousTotal) / previousTotal) * 100;
    
    if (percentage > 5) {
      return { 
        percentage, 
        direction: 'up', 
        icon: <TrendingUp className="h-4 w-4" />,
        message: `Trending up by ${percentage.toFixed(1)}% from previous month`
      };
    } else if (percentage < -5) {
      return { 
        percentage: Math.abs(percentage), 
        direction: 'down', 
        icon: <TrendingDown className="h-4 w-4" />,
        message: `Trending down by ${Math.abs(percentage).toFixed(1)}% from previous month`
      };
    }
    
    return { 
      percentage: Math.abs(percentage), 
      direction: 'neutral', 
      icon: <Minus className="h-4 w-4" />,
      message: 'Relatively stable registration activity'
    };
  };

  // Calculate totals and stats
  const getTotalRegistrations = () => {
    return data.reduce((total, item) => total + item.public + item.private, 0);
  };

  const getPublicPrivateRatio = () => {
    const totalPublic = data.reduce((total, item) => total + item.public, 0);
    const totalPrivate = data.reduce((total, item) => total + item.private, 0);
    const total = totalPublic + totalPrivate;
    
    if (total === 0) return { public: 0, private: 0 };
    
    return {
      public: Math.round((totalPublic / total) * 100),
      private: Math.round((totalPrivate / total) * 100)
    };
  };

  const getActiveMonths = () => {
    return data.filter(item => item.public + item.private > 0).length;
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorState onRetry={getInstitutionStatistics} />;
  }

  if (data.length === 0) {
    return <EmptyState />;
  }

  const trendInfo = getTrendInfo();
  const totalRegistrations = getTotalRegistrations();
  const ratio = getPublicPrivateRatio();
  const activeMonths = getActiveMonths();

  return (
    <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-lg">
      <CardHeader className="flex-shrink-0 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Building className="h-5 w-5 text-primary" />
          Institution Type Registrations
        </CardTitle>
        <CardDescription className="text-sm">
          {totalRegistrations.toLocaleString()} total registrations across {activeMonths} active month{activeMonths !== 1 ? 's' : ''}
          {ratio.public > 0 && ratio.private > 0 && (
            <span className="block mt-1 text-xs">
              Split: {ratio.public}% Public, {ratio.private}% Private
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-4 pt-0">
        <ChartContainer config={chartConfig} className="mx-auto max-h-[400px] min-h-[300px] w-full">
          <BarChart 
            accessibilityLayer 
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
            barCategoryGap="20%"
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              className="text-xs"
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              className="text-xs"
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <ChartTooltip
              cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
              content={<ChartTooltipContent 
                indicator="dashed" 
                formatter={(value, name) => [
                  `${Number(value).toLocaleString()} registrations`,
                  name
                ]}
                labelStyle={{ color: '#374151', fontWeight: 500 }}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  fontSize: '12px'
                }}
              />}
            />
            <Bar 
              dataKey="public" 
              fill="var(--color-public)" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={60}
              style={{
                filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
              }}
            />
            <Bar 
              dataKey="private" 
              fill="var(--color-private)" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={60}
              style={{
                filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
              }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-shrink-0 flex-col items-start gap-2 text-sm pt-2">
        <div className="flex gap-2 leading-none font-medium">
          {trendInfo.icon}
          <span className="text-xs">{trendInfo.message}</span>
        </div>
        <div className="text-muted-foreground leading-none text-xs">
          Data updated in real-time from registration system
        </div>
      </CardFooter>
    </Card>
  );
}