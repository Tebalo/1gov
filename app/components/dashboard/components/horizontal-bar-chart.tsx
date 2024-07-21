"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import { useEffect, useState } from "react";

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
import { getStatuses } from "@/app/lib/actions";

const chartConfig = {
  desktop: {
    label: "Total",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig

interface DataPoint {
  status: string;
  total: number;
}

export function HorizontalBarChartStatus() {
  const [response, setResponse] = useState<DataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function getStatusStatistics() {
    setIsLoading(true);
    try {
      const data: DataPoint[] = await getStatuses();
      // Filter out data points where total is 0
      const filteredData = data.filter(item => item.total > 0);
      setResponse(filteredData);
    } catch (error) {
      console.error("Error fetching statuses:", error);
      setResponse([]);
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getStatusStatistics();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teacher Registrations by Status</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={response}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="status"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="total" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="total"
              layout="vertical"
              fill="var(--color-desktop)"
              radius={4}
            >
              <LabelList
                dataKey="status"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey="total"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing total registrations by status for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}