'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table'
import { BriefcaseMedical, ChevronDown, ChevronUp, Edit3, GraduationCap, MoreHorizontal, Plane, Puzzle, Shirt, Trash, Tv, UtensilsCrossed } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import EditBudgetForm from './edit-budget-form';
import { Budget } from './types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteBudget } from './helpers';
import { useAppSelector } from '@/store/reduxHooks';

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
            const token = useAppSelector(state => state.auth.token);
            const budgetEntry = row.original;
            const queryClient = useQueryClient();
            const [dialogType, setDialogType] = useState<'edit' | 'delete' | null>(null);
            const deleteBudgetMutation = useMutation({
                mutationFn: deleteBudget,
                onMutate() {
                    toast.loading('Sending...', { id: 'budget-delete-toast' });
                },
                onSuccess(data) {
                    if (data) {
                        toast.dismiss('budget-delete-toast');
                        toast.success(data.data.data.message);
                        setDialogType(null);
                        queryClient.invalidateQueries({ queryKey: ['get-budget-list']});
                    }
                },
                onError(error) {
                    toast.dismiss('budget-delete-toast');
                    toast.error(error.message);
                },
            })
            return (
                <Dialog open={dialogType !== null} onOpenChange={(open) => !open && setDialogType(null)}>
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <DialogTrigger asChild>
                                    <div className='flex gap-x-2 items-center text-sm cursor-pointer w-full' onClick={() => setDialogType('edit')}>
                                        <Edit3 size={14} />
                                        Edit
                                    </div>
                                </DialogTrigger>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => console.log(budgetEntry._id)}>
                                <DialogTrigger asChild onClick={() => setDialogType('delete')}>
                                    <div className='flex gap-x-2 w-full items-center text-sm cursor-pointer'>
                                        <Trash size={14} />
                                        Delete
                                    </div>
                                </DialogTrigger>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {
                        dialogType === 'edit' &&
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Budget</DialogTitle>
                            </DialogHeader>
                            {/* dialog body */}
                            <EditBudgetForm budgetData={budgetEntry} onSuccessfulFormSubmit={() => setDialogType(null)} />
                        </DialogContent>
                    }

                    {
                        dialogType === 'delete' &&
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Delete Budget</DialogTitle>
                            </DialogHeader>
                            <div>
                                <p>Are you sure you want to delete this budget? All the transactions related to this budget will also get deleted.</p>
                            </div>
                            {/* dialog footer */}
                            <DialogFooter>
                                <Button 
                                    onClick={() => deleteBudgetMutation.mutate({
                                        token,
                                        budgetId: budgetEntry._id
                                    })}
                                >
                                    <Trash />
                                    Delete
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    }
                    
                </Dialog>
            )
        }
    }
]