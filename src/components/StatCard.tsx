'use client';

import { ChangePeriods, CURRENCIES } from "@/lib/constants";
import { IoMdTrendingUp } from 'react-icons/io'
import { IoTrendingDown } from "react-icons/io5";
import { GoDash } from 'react-icons/go';
import clsx from "clsx";
import { formatAmount } from "@/lib/helpers";

interface StatCardProps {
    heading: string;
    amount: number;
    changePercentage: number;
    changePeriod: ChangePeriods;
    prevAmount: number;
    // currencySymbol: (typeof CURRENCIES)[keyof typeof CURRENCIES]['symbol'];
    currency?: keyof typeof CURRENCIES;
}

function StatCard({ heading, amount, prevAmount, changePercentage, changePeriod, currency }: StatCardProps) {

    return (
        <div className="w-full min-w-[280px] lg:w-auto lg:min-w-56 p-4 rounded-sm border border-slate-400 dark:border-gray-700 shadow-sm flex flex-col gap-3 bg-slate-50 dark:bg-slate-800">
            <h2 className="font-semibold text-xs">{heading}</h2>
            <h1 className="text-[clamp(1.25rem,2vw,1.75rem)] font-medium flex gap-2">
                <span>{formatAmount(amount, currency || 'INR')}</span>
            </h1>
            <hr className="border-b-0 dark:border-gray-700 border-slate-400" />
            <div className="flex gap-2 items-end">
                <div className={clsx("flex items-end gap-1 font-medium", 
                    (amount > prevAmount) && 'text-green-600',
                    (amount < prevAmount) && 'text-rose-600',
                    (amount === prevAmount) && 'text-slate-400'
                )}>
                    {
                        (amount > prevAmount) ? <IoMdTrendingUp className="text-xl" /> :
                        (amount < prevAmount) ? <IoTrendingDown className="text-lg" /> : 
                        <GoDash className="text-lg" />
                    }
                    <span className="text-sm">{
                        (amount > prevAmount) ? Math.abs(changePercentage) : 
                        changePercentage
                    }%</span>
                </div>
                <p className="text-slate-500 text-xs">{changePeriod}</p>
                <p className="text-sm text-slate-500 font-semibold">{formatAmount(prevAmount, currency || 'INR')}</p>
            </div>
        </div>
    )
}

export default StatCard