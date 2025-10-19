"use client"
import { TrendingUp, TrendingDown, Minus, AlertCircle } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useEffect, useState } from "react"
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
import { InstitutionData, getInstitutionTypeStatistics } from "@/app/lib/actions"


const chartConfig = {
  public: {
    label: "Public Institutions",
    color: "var(--chart-1)",
  },
  private: {
    label: "Private Institutions", 
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

interface TrendInfo {
  percentage: number;
  direction: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
}

const LoadingSkeleton = () => (
  <Card>
    <CardHeader>
      <div className="h-6 w-48 bg-muted animate-pulse rounded" />
      <div className="h-4 w-64 bg-muted animate-pulse rounded" />
    </CardHeader>
    <CardContent>
      <div className="h-80 w-full bg-muted animate-pulse rounded" />
    </CardContent>
    <CardFooter>
      <div className="h-4 w-full bg-muted animate-pulse rounded" />
    </CardFooter>
  </Card>
);

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <Card>
    <CardContent className="flex flex-col items-center justify-center py-8">
      <AlertCircle className="h-8 w-8 text-destructive mb-2" />
      <p className="text-sm text-muted-foreground mb-4">
        Failed to load institution statistics
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

export function ChartAreaStackedInstitutionType() {
  const [data, setData] = useState<InstitutionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getInstitutionTypeStatistics();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate trend information
  const getTrendInfo = (): TrendInfo => {
    if (data.length < 2) {
      return { percentage: 0, direction: 'neutral', icon: <Minus className="h-4 w-4" /> };
    }

    // Get the last two months with data
    const monthsWithData = data.filter(item => item.public + item.private > 0);
    if (monthsWithData.length < 2) {
      return { percentage: 0, direction: 'neutral', icon: <Minus className="h-4 w-4" /> };
    }

    const currentMonth = monthsWithData[monthsWithData.length - 1];
    const previousMonth = monthsWithData[monthsWithData.length - 2];
    
    const currentTotal = currentMonth.public + currentMonth.private;
    const previousTotal = previousMonth.public + previousMonth.private;
    
    if (previousTotal === 0) {
      return { percentage: 0, direction: 'neutral', icon: <Minus className="h-4 w-4" /> };
    }

    const percentage = ((currentTotal - previousTotal) / previousTotal) * 100;
    
    if (percentage > 0) {
      return { percentage: Math.abs(percentage), direction: 'up', icon: <TrendingUp className="h-4 w-4" /> };
    } else if (percentage < 0) {
      return { percentage: Math.abs(percentage), direction: 'down', icon: <TrendingDown className="h-4 w-4" /> };
    }
    
    return { percentage: 0, direction: 'neutral', icon: <Minus className="h-4 w-4" /> };
  };

  // Get current year for display
  const getCurrentYear = () => new Date().getFullYear();

  // Get months with data for display
  const getActiveMonths = () => {
    const monthsWithData = data.filter(item => item.public + item.private > 0);
    if (monthsWithData.length === 0) return "No data available";
    if (monthsWithData.length === 1) return monthsWithData[0].month;
    return `${monthsWithData[0].month} - ${monthsWithData[monthsWithData.length - 1].month} ${getCurrentYear()}`;
  };

  // Calculate total registrations
  const getTotalRegistrations = () => {
    return data.reduce((total, item) => total + item.public + item.private, 0);
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorState onRetry={fetchData} />;
  }

  const trendInfo = getTrendInfo();
  const totalRegistrations = getTotalRegistrations();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Institution Type Registrations</CardTitle>
        <CardDescription>
          Monthly teacher registrations by institution type ({totalRegistrations.toLocaleString()} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="private"
              type="natural"
              fill="var(--color-private)"
              fillOpacity={0.4}
              stroke="var(--color-private)"
              stackId="a"
            />
            <Area
              dataKey="public"
              type="natural"
              fill="var(--color-public)"
              fillOpacity={0.4}
              stroke="var(--color-public)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            {trendInfo.direction !== 'neutral' && (
              <div className="flex items-center gap-2 leading-none font-medium">
                Trending {trendInfo.direction} by {trendInfo.percentage.toFixed(1)}% this period 
                {trendInfo.icon}
              </div>
            )}
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              {getActiveMonths()}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}