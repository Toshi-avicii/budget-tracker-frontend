'use client';

import { EXPENSE_TYPES } from "@/lib/constants";
import ExpensesChart from "./ExpensesChart"
import InteractiveExpensesPiChart from "./InteractiveExpensesPiChart"
import { useQuery } from "@tanstack/react-query";
import { getDataByExpenseTypes, getDataByRange } from "@/lib/helpers";
import { useAppSelector } from "@/store/reduxHooks";
import { useEffect, useState } from "react";
import IncomeChart from "./IncomeChart";

type ChartTypeInfo = {
    type: string;
    amount: number;
}

function DashboardChartWrapper() {
    const token = useAppSelector(state => state.auth.token);
    const [expensesLineChartData, setExpensesLineChartData] = useState<{ month: string; expenses: number }[]>([]);
    const [incomeLineCharData, setIncomeLineChartData] = useState<{ month: string; income: number, expenses: number }[]>([]);
    const [expenseTypePieChartData, setExpenseTypePieChartData] = useState<{
        type: string; amount: number; fill: string;
    }[]>([]);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const expenseTypeQuery = useQuery({
        queryKey: ['get-data-by-expense-types', {token, currentYear, currentMonth}],
        queryFn: async() => {
            return await getDataByExpenseTypes({ date: new Date(), token })
        }
    })
    
    const rangeDataQuery = useQuery({
        queryKey: ["get-data-by-range", {token, currentYear, currentMonth}],
        queryFn: async() => {
            return await getDataByRange({ monthFrom: 1, monthTo: currentMonth, token, yearFrom: currentYear, yearTo: currentYear });
        }
    });

    useEffect(() => {
        if(rangeDataQuery.isSuccess && rangeDataQuery.data?.data) {
            const result = rangeDataQuery.data?.data?.data.map((item: { data: { totalExpenses: number, balance: number, debt: number, totalIncome: number }, month: number, monthName: string, year: number }) => {
                return {
                    month: item.monthName,
                    expenses: item.data.totalExpenses
                }
            });

            const incomeResult = rangeDataQuery.data?.data?.data.map((item: { data: { totalExpenses: number, balance: number, debt: number, totalIncome: number }, month: number, monthName: string, year: number }) => {
                return {
                    month: item.monthName,
                    income: item.data.totalIncome,
                    expenses: item.data.totalExpenses
                }
            });

            setExpensesLineChartData(result);
            setIncomeLineChartData(incomeResult);
        }
    }, [rangeDataQuery.isSuccess, rangeDataQuery.data?.data])

    useEffect(() => {
        if(expenseTypeQuery.isSuccess && expenseTypeQuery.data?.data) {
            const data = expenseTypeQuery.data?.data.data;
            const totalExpenses = data.reduce((acc: number, item: { type: string, amount: number }) => {
                acc += item.amount;
                return acc;
            }, 0);

            console.log(totalExpenses);
            const result = data.map((item: { type: string; amount: number }) => {
                return {
                    type: item.type,
                    amount: (item.amount / totalExpenses) * 100,
                    fill: `var(--color-${item.type})`
                }
            });

            setExpenseTypePieChartData(result);
        }
    }, [expenseTypeQuery.isSuccess, expenseTypeQuery.data?.data])

    console.log(expenseTypePieChartData);

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex flex-wrap items-center gap-y-6 lg:gap-x-6 lg:p-4 xl:p-0">
                <div className="flex-1 lg:flex-[8] max-w-full lg:max-w-none">
                    <ExpensesChart chartData={expensesLineChartData} />
                </div>
                <div className="flex-1 lg:flex-[4] max-w-full lg:max-w-screen-xs">
                    <InteractiveExpensesPiChart chartData={expenseTypePieChartData} />
                </div>
            </div>
            <IncomeChart chartData={incomeLineCharData} />
        </div>
    )
}

export default DashboardChartWrapper