'use client';

import { getSummaryData, StatCardData } from "@/lib/helpers";
import StatCard from "./StatCard";
import { ChangePeriods } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/store/reduxHooks";

function DashboardCardRow() {
    const token = useAppSelector(state => state.auth.token);

    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;

    const currentMonthDataQuery = useQuery({
        queryKey: ['get-summary-data', { month, year, token }],
        queryFn: async() => await getSummaryData({ from: new Date(year, month - 1, 1), to: new Date(year, month, 1), token })
    });

    const previousMonthDataQuery = useQuery({
        queryKey: ['get-summary-data', { month: month -1, year, token }],
        queryFn: async() => await getSummaryData({ from: new Date(year, month - 2, 1), to: new Date(year, month - 1, 1), token })
    });

    const errorBox = () => {
        let err1: null | string = null;
        let err2: null | string = null;

        if(currentMonthDataQuery.isError) {
            err1 = currentMonthDataQuery.error.message;
        }

        if(previousMonthDataQuery.isError) {
            err2 = previousMonthDataQuery.error.message;
        }

        if(err1 || err2) {
            return <p>{err1}, {err2}</p>
        }

        return null;
    }

    return (
        <div className="flex md:justify-between gap-6 my-8 lg:gap-8 flex-wrap justify-center lg:justify-normal lg:p-4 xl:p-0">
            {/* total balance */}
            <div className="flex-1">
                {
                    (currentMonthDataQuery.isLoading || previousMonthDataQuery.isLoading) && (
                        <p>Loading...</p>
                    )
                }
                {
                    (currentMonthDataQuery.isSuccess && previousMonthDataQuery.isSuccess) && (
                        <StatCard
                            heading="Total Balance"
                            amount={currentMonthDataQuery.data?.data.data.balance}
                            changePercentage={+(((currentMonthDataQuery.data?.data.data.balance - previousMonthDataQuery.data?.data.data.balance) / (previousMonthDataQuery.data?.data.data.balance === 0 ? 1 : previousMonthDataQuery.data?.data.data.balance)) * 100).toFixed(2)}
                            changePeriod={ChangePeriods.MONTHLY}
                            prevAmount={previousMonthDataQuery.data?.data.data.balance}
                        />
                    )
                }
                { errorBox() }        
            </div>

            {/* total income */}
            <div className="flex-1">
                {
                    (currentMonthDataQuery.isLoading || previousMonthDataQuery.isLoading) && (
                        <p>Loading...</p>
                    )
                }
                {
                    (currentMonthDataQuery.isSuccess && previousMonthDataQuery.isSuccess) && (
                        <StatCard
                            heading="Total Income"
                            amount={currentMonthDataQuery.data?.data.data.totalIncome}
                            changePercentage={+(((currentMonthDataQuery.data?.data.data.totalIncome - previousMonthDataQuery.data?.data.data.totalIncome) / (previousMonthDataQuery.data?.data.data.totalIncome === 0 ? 1 : previousMonthDataQuery.data?.data.data.totalIncome)) * 100).toFixed(2)}
                            changePeriod={ChangePeriods.MONTHLY}
                            prevAmount={previousMonthDataQuery.data?.data.data.totalIncome}
                        />
                    )
                }
                {errorBox()}
            </div>

            {/* total expense */}
            <div className="flex-1">
                {
                    (currentMonthDataQuery.isLoading || previousMonthDataQuery.isLoading) && (
                        <p>Loading...</p>
                    )
                }
                {
                    (currentMonthDataQuery.isSuccess && previousMonthDataQuery.isSuccess) && (
                        <StatCard
                            heading="Total Expenses"
                            amount={currentMonthDataQuery.data?.data.data.totalExpenses}
                            changePercentage={+(((currentMonthDataQuery.data?.data.data.totalExpenses - previousMonthDataQuery.data?.data.data.totalExpenses) / (previousMonthDataQuery.data?.data.data.totalExpenses === 0 ? 1 : previousMonthDataQuery.data?.data.data.totalExpenses)) * 100).toFixed(2)}
                            changePeriod={ChangePeriods.MONTHLY}
                            prevAmount={previousMonthDataQuery.data?.data.data.totalExpenses}
                        />
                    )
                }
                {errorBox()}
            </div>

            {/* total debt */}
            <div className="flex-1">
                {
                    (currentMonthDataQuery.isLoading || previousMonthDataQuery.isLoading) && (
                        <p>Loading...</p>
                    )
                }

                {
                    (currentMonthDataQuery.isSuccess && previousMonthDataQuery.isSuccess) && (
                        <StatCard
                            heading="Total Debt (If Any)"
                            amount={currentMonthDataQuery.data?.data.data.debt}
                            changePercentage={+(((currentMonthDataQuery.data?.data.data.debt - previousMonthDataQuery.data?.data.data.debt) / (previousMonthDataQuery.data?.data.data.debt === 0 ? 1 : previousMonthDataQuery.data?.data.data.debt)) * 100).toFixed(2)}
                            changePeriod={ChangePeriods.MONTHLY}
                            prevAmount={previousMonthDataQuery.data?.data.data.debt}
                        />
                    )
                }
                {errorBox()}
            </div>
        </div>
    )
}

export default DashboardCardRow