'use client';

import { useAppSelector } from "@/store/reduxHooks";
import { useQuery } from "@tanstack/react-query";
import { getBudgetList } from "./helpers";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Skeleton } from "@/components/ui/skeleton";

function BudgetTable() {
    const token = useAppSelector(state => state.auth.token);

    const budgetListQuery = useQuery({
        queryKey: ['get-budget-list'],
        queryFn: async () => await getBudgetList(token)
    });

    return (
        <div>
            {
                budgetListQuery.isLoading && 
                <div className='flex flex-col gap-y-2 min-h-[320px] justify-between items-center'>
                    <div className="flex justify-between items-center mb-4">
                        <Skeleton className="h-[35px] w-[300px] rounded-md" />
                        <Skeleton className="h-[35px] w-[100px] rounded-md" />
                    </div>
                    {
                        Array.from({ length: 5 }, (_, i) => i + 1).map(item => {
                            return (
                                <Skeleton key={item} className='h-[40px] rounded-md w-full' />
                            )
                        })
                    } 
                </div>
            }
            {
                (budgetListQuery.isSuccess) && 
                <DataTable columns={columns} data={budgetListQuery.data?.data?.data} />
            }
            {
                (budgetListQuery.isError) &&
                <div>
                    <p>{budgetListQuery.error.message}</p>
                </div>
            }
        </div>
    )
}

export default BudgetTable