'use client';

import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table'
import { BriefcaseMedical, ChevronDown, ChevronUp, GraduationCap, Plane, Puzzle, Shirt, Tv, UtensilsCrossed } from 'lucide-react';
import { Budget } from './types';
import TableCell from '@/components/TableCell';

export const columns: ColumnDef<Budget>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            return (
                <div className='w-full min-w-[150px]'>
                    {row.original.name}
                </div>
            )
        }
    },
    {
        accessorKey: "expensePeriodType",
        header: "Period",
        filterFn: (row, columnId, filterValue) => {
            if (!filterValue || filterValue.length === 0) return true;
            return filterValue.includes(row.getValue(columnId))
        },
    },
    {
        accessorKey: "expenseType",
        // header: ({ column }) => {
        //     const currentValue = column.getFilterValue() as string;
        //     return (
        //         <>
        //             <TableHeaderDropdown currentValue={currentValue} column={column} options={typeOptions} />
        //         </>
        //     )
        // },
        header: 'Expense Type',
        cell: ({ row }) => {
            const expenseType = row.original.expenseType.toLowerCase();
            const formattedExpenseType = expenseType[0].toUpperCase() + expenseType.slice(1).toLowerCase();
            return (
                <div className='flex gap-x-2 items-center'>
                    {
                        expenseType === 'travel' ? <><Plane size={16} />{formattedExpenseType}</> :
                        expenseType === 'healthcare' ? <><BriefcaseMedical size={16} />{formattedExpenseType}</> : 
                        expenseType === 'education' ? <><GraduationCap size={16} />{formattedExpenseType}</> :                    expenseType === 'clothes' ? <><Shirt size={16} />{formattedExpenseType}</> :
                        expenseType === 'entertainment' ? <><Tv size={16} />{formattedExpenseType}</> :
                        expenseType === 'food' ? <><UtensilsCrossed size={16} />{formattedExpenseType}</> :
                        expenseType === 'other' ? <><Puzzle size={16} />{formattedExpenseType}</> :
                        formattedExpenseType
                    }
                </div>
            )
        },
        filterFn: (row, columnId, filterValue) => {
            if (!filterValue || filterValue.length === 0) return true;
            // let filterValueLowerCase = filterValue.map((item: string) => item.toLowerCase())
            return filterValue.includes(row.getValue(columnId))
        },
    },
    {
        accessorKey: "amount",
        header: ({ column, table }) => {
            const isSorted = table.getState().sorting.find((s) => s.id === column.id);
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Amount
                    {
                        isSorted ? (isSorted.desc ? <ChevronDown size={16} /> : <ChevronUp size={16} />) : null
                    }
                </Button>
            )
        },
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: row.original.currencyCode,
            }).format(amount)

            return <div className="font-medium">{formatted}</div>
        }
    },
    {
        id: 'actions',
        header: "Actions",
        cell: ({ row }) => {
            return <TableCell row={row} />
        }
    }
]