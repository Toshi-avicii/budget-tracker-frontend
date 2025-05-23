"use client"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import Link from "next/link";

interface ExpensesChartProps {
    chartData: {
        month: string;
        expenses: number;
    }[];
}

const chartConfig = {
    expenses: {
        label: "Expenses",
        color: "hsl(var(--sapphire-chart-1))",
    },
} satisfies ChartConfig

export default function ExpensesChart({ chartData }: ExpensesChartProps) {
    return (
        <>
        {
            (chartData.length > 0) ? (
                <Card className="border border-slate-400 dark:border-gray-700 shadow-md bg-slate-50 dark:bg-slate-800 rounded-sm  lg:max-w-full sm:max-w xs:w-full chart-card">
                    <CardHeader>
                        <CardTitle>Total Expenses - Monthly Trend</CardTitle>
                        <CardDescription>
                            Showing total expenses for the last 6 months
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 md:p-4">
                        <ChartContainer config={chartConfig} className="min-h-[200px] max-h-[280px] w-full p-2 chart-container">
                            <AreaChart
                                accessibilityLayer
                                data={chartData}
                                margin={{
                                    left: 12,
                                    right: 12,
                                }}
                            >
                                <CartesianGrid vertical={false} horizontal />
                                <YAxis
                                    dataKey="expenses"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={16}
                                    tickFormatter={(value) => {
                                        return `${(value / 1000)}K`;
                                    }}
                                />
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
                                <defs>
                                    <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
                                        <stop
                                            offset="5%"
                                            stopColor="var(--color-expenses)"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="var(--color-expenses)"
                                            stopOpacity={0.1}
                                        />
                                    </linearGradient>
                                    <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop
                                            offset="5%"
                                            stopColor="var(--color-income)"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="var(--color-income)"
                                            stopOpacity={0.1}
                                        />
                                    </linearGradient>
                                </defs>
                                <Area
                                    dataKey="expenses"
                                    type="natural"
                                    fill="url(#fillExpenses)"
                                    fillOpacity={0.4}
                                    stroke="var(--color-expenses)"
                                    stackId="a"
                                    strokeWidth={2}
                                    dot={{
                                        fill: "var(--color-expenses)",
                                        fillOpacity: 1
                                    }}
                                    activeDot={{
                                        r: 6
                                    }}
                                    style={{
                                        marginLeft: '-8px'
                                    }}
                                />
                                <ChartLegend content={<ChartLegendContent />} />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            ) : (
                <Card className="border border-slate-400 dark:border-gray-700 shadow-md bg-slate-50 dark:bg-slate-800 rounded-sm min-h-[280px] flex justify-center items-center flex-col gap-y-4">
                    <h1>No Data Available</h1>
                    <Link href="/budget/new" className="normal-btn">Add Budget</Link>
                </Card>
            )
        }
        
        </>
    )
}
