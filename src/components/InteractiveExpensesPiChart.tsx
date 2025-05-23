"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

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
    ChartStyle,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { EXPENSE_TYPES, months } from "@/lib/constants"
import Link from "next/link"

interface InteractiveExpensesPiChartProps {
    chartData: {
        type: string;
        amount: number;
        fill: string;
    }[];
}

type ChartTypeInfo = {
    label: string;
    color: string;
};

export default function InteractiveExpensesPiChart({ chartData }: InteractiveExpensesPiChartProps) {
    const id = "pie-interactive";
    const chartTypes = chartData.reduce<Record<string, ChartTypeInfo>>((acc, { type }, index) => {
        acc[type] = {
            label: type.charAt(0).toUpperCase() + type.slice(1),
            color: `hsl(var(--chart-${Math.abs(5 - index) === 0 ? 2 : Math.abs(5 - index)}))`,
        };
        return acc;
    }, {});

    let chartConfig = {
        percentage: {
            label: "Percentage",
        },
        amount: {
            label: "Amount",
        },
        ...chartTypes
    } satisfies ChartConfig;

    const [activeType, setActiveType] = React.useState<string>(() => {
        if (chartData.length > 0) {
            return chartData[0].type;
        } else {
            return EXPENSE_TYPES.FOOD;
        }
    });

    const activeIndex = React.useMemo(
        () => chartData.findIndex((item) => {
            console.log(item);
            return item.type.toLowerCase() === activeType.toLowerCase()
        }),
        [activeType]
    )
  
    const expenseTypes = React.useMemo(() => chartData.map((item) => item.type), [chartData]);

    return (
        <>
            {
                (chartData.length > 0) ? (
                    <Card data-chart={id} className="flex flex-col border border-slate-400 dark:border-gray-700 shadow-md bg-slate-50 dark:bg-slate-800 rounded-sm">
                        <ChartStyle id={id} config={chartConfig} />
                        <CardHeader className="flex-row items-start space-y-0 pb-0">
                            <div className="grid gap-1">
                                <CardTitle>Expenses - Category wise</CardTitle>
                                <CardDescription>{months[new Date().getMonth()]} - {new Date().getFullYear()}</CardDescription>
                            </div>
                            <Select value={activeType} onValueChange={(value) => setActiveType(value as EXPENSE_TYPES)}>
                                <SelectTrigger
                                    className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
                                    aria-label="Select a value"
                                >
                                    <SelectValue placeholder="Select month" />
                                </SelectTrigger>
                                <SelectContent align="end" className="rounded-xl">
                                    {expenseTypes.map((key) => {
                                        const config = chartConfig[key as keyof typeof chartConfig]

                                        if (!config) {
                                            return null
                                        }

                                        return (
                                            <SelectItem
                                                key={key}
                                                value={key}
                                                className="rounded-lg [&_span]:flex"
                                            >
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span
                                                        className="flex h-3 w-3 shrink-0 rounded-sm"
                                                        style={{
                                                            backgroundColor: `var(--color-${key})`,
                                                        }}
                                                    />
                                                    {config?.label}
                                                </div>
                                            </SelectItem>
                                        )
                                    })}
                                </SelectContent>
                            </Select>
                        </CardHeader>
                        <CardContent className="flex flex-1 justify-center pb-0">
                            <ChartContainer
                                id={id}
                                config={chartConfig}
                                className="w-full max-w-[300px] min-h-[220px] lg:min-h-[300px] xl:min-h-[340px]"
                            >
                                <PieChart>
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Pie
                                        data={chartData}
                                        dataKey="amount"
                                        nameKey="type"
                                        innerRadius={60}
                                        strokeWidth={5}
                                        activeIndex={activeIndex}
                                        activeShape={({
                                            outerRadius = 0,
                                            ...props
                                        }: PieSectorDataItem) => (
                                            <g>
                                                <Sector {...props} outerRadius={outerRadius + 10} />
                                                <Sector
                                                    {...props}
                                                    outerRadius={outerRadius + 25}
                                                    innerRadius={outerRadius + 12}
                                                />
                                            </g>
                                        )}
                                    >
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
                                                                className="fill-foreground text-3xl font-bold"
                                                            >
                                                                {chartData[(activeIndex < 0 ? 0 : activeIndex)].amount.toFixed(2)}
                                                            </tspan>
                                                            <tspan
                                                                x={viewBox.cx}
                                                                y={(viewBox.cy || 0) + 24}
                                                                className="fill-muted-foreground"
                                                            >
                                                                Percent
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
                    </Card>
                ) : (
                    <Card className="border border-slate-400 dark:border-gray-700 shadow-md bg-slate-50 dark:bg-slate-800 rounded-sm  min-h-[280px] flex justify-center items-center gap-y-4 flex-col">
                        <h1>No Data Available</h1>
                        <Link href="/budget/new" className="normal-btn">Add Budget</Link>
                    </Card>
                )
            }
        </>
    )
}
