'use client';

import { useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { EXPENSE_TYPES, PERIOD_TYPES } from '@/lib/constants';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { PiInfo } from 'react-icons/pi';
import { Popover, PopoverContent } from './ui/popover';
import { PopoverTrigger } from '@radix-ui/react-popover';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addNewBudgetFn } from '@/lib/helpers';
import { useAppSelector } from '@/store/reduxHooks';
import { toast } from 'sonner';
import { getBudgetCategories, getBudgetPeriods } from '@/app/(common)/budget/new/helpers';
import { Skeleton } from './ui/skeleton';

export interface BudgetFormSchema {
    name: string;
    expenseType: (keyof typeof EXPENSE_TYPES) | undefined;
    amount: number;
    periodType: (keyof typeof PERIOD_TYPES) | undefined;
}

interface BudgetCategory {
    name: string;
    _id: string;
}

interface BudgetPeriod {
    name: string;
    _id: string;
}

// export const expenseTypesSchema = z.enum(Object.values(EXPENSE_TYPES) as [string, ...string[]], { errorMap: () => ({ message: 'Expense Type is required' }) });

// export const expensePeriodSchema = z.enum(
//     Object.values(PERIOD_TYPES) as [string, ...string[]], { errorMap: () => ({ message: "Expense Period is required" }) });

const budgetFormSchema = z.object({
    name: z.string().trim().min(3, 'Name should be at least 3 characters long').max(30, 'Name cannot be longer than 30 characters'),
    expenseType: z.string({ required_error: 'Expense Type is Required' }),
    amount: z.number({ invalid_type_error: "Amount must be a number" }).min(100, 'Budget Amount cannot be be less than 100'),
    periodType: z.string({ required_error: 'Period Type is Required' })
});

function BudgetForm() {
    const token = useAppSelector(state => state.auth.token);

    const [formData] = useState<BudgetFormSchema>({
        amount: 0,
        expenseType: undefined,
        name: '',
        periodType: undefined
    });

    const budgetCategoryQuery = useQuery({
        queryKey: ['get-budget-categories-list'],
        queryFn: async () => {
            return await getBudgetCategories(token);
        },
    });

    const budgetPeriodQuery = useQuery({
        queryKey: ['get-budget-periods-list'],
        queryFn: async () => await getBudgetPeriods(token)
    });

    const form = useForm<z.infer<typeof budgetFormSchema>>({
        resolver: zodResolver(budgetFormSchema),
        defaultValues: {
            amount: 0,
            expenseType: undefined,
            name: '',
            periodType: undefined
        }
    });

    const addBudgetMutation = useMutation({
        mutationFn: addNewBudgetFn,
        onMutate() {
            toast.loading('Sending...', { id: 'loading-toast' });
        },
        onSuccess(data) {
            if (data) {
                toast.dismiss('loading-toast');
                toast.success(data.data.message);
                form.reset({
                    amount: 0,
                    expenseType: undefined,
                    name: '',
                    periodType: undefined
                }, { keepValues: false, keepDefaultValues: true });
            }
        },
        onError(error) {
            toast.dismiss('loading-toast');
            toast.error(error.message);
        },
    });

    const handleSubmit = async (values: z.infer<typeof budgetFormSchema>) => {
        addBudgetMutation.mutate({
            ...values,
            token
        })
    }

    return (
        <>
            {
                (budgetCategoryQuery.isLoading || budgetPeriodQuery.isLoading) ?
                    <div className='flex flex-col gap-y-4 min-h-[320px] justify-between items-center'>
                        {
                            Array.from({ length: 5 }, (_, i) => i + 1).map(item => {
                                return (
                                    <Skeleton key={item} className='h-[45px] rounded-md w-full' />
                                )
                            })
                        }
                    </div> :
                    <Form {...form}>
                        <form className='flex flex-col gap-y-4' onSubmit={form.handleSubmit(handleSubmit)}>
                            {/* budget name */}
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='flex gap-x-2 items-center'>
                                            <span>Budget Name</span>
                                            <Popover>
                                                <PopoverTrigger>
                                                    <PiInfo />
                                                </PopoverTrigger>
                                                <PopoverContent className='text-sm' side='top'>Name for the budget</PopoverContent>
                                            </Popover>
                                        </FormLabel>
                                        <FormControl>
                                            <Input type='text' placeholder='Budget Name' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* budget amount */}
                            <FormField
                                control={form.control}
                                name='amount'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='flex items-center gap-x-2'>
                                            <span>Budet Amount</span>
                                            <Popover>
                                                <PopoverTrigger>
                                                    <PiInfo />
                                                </PopoverTrigger>
                                                <PopoverContent className='text-sm' side='top'>Amount of the budget</PopoverContent>
                                            </Popover>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                placeholder='Budget Amount'
                                                {...field}
                                                min={0}
                                                onChange={(e) => field.onChange(+e.target.value)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* budget period */}
                            <FormField
                                control={form.control}
                                name='periodType'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='flex items-center gap-x-2'>
                                            <span>Budget Period</span>
                                            <Popover>
                                                <PopoverTrigger>
                                                    <PiInfo />
                                                </PopoverTrigger>
                                                <PopoverContent className='text-sm' side='top'>Period for the budget</PopoverContent>
                                            </Popover>
                                        </FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a period of budget" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {
                                                        (budgetPeriodQuery.isSuccess) && (budgetPeriodQuery.data?.data?.data as BudgetPeriod[]).map((item: BudgetPeriod) => {
                                                            return (
                                                                <SelectItem value={item._id} key={item._id}>
                                                                    {item.name}
                                                                </SelectItem>
                                                            )
                                                        })
                                                    }
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* budget expense type */}
                            <FormField
                                control={form.control}
                                name='expenseType'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='flex items-center gap-x-2'>
                                            <span>Budget Category</span>
                                            <Popover>
                                                <PopoverTrigger>
                                                    <PiInfo />
                                                </PopoverTrigger>
                                                <PopoverContent className='text-sm' side='top'>Choose any category for the budget</PopoverContent>
                                            </Popover>
                                        </FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select an expense type for budget" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {
                                                        (budgetCategoryQuery.isSuccess) && (budgetCategoryQuery.data?.data?.data as BudgetCategory[]).map((item: BudgetCategory) => {
                                                            return (
                                                                <SelectItem value={item._id} key={item._id}>
                                                                    {item.name}
                                                                </SelectItem>
                                                            )
                                                        })
                                                    }
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full">
                                Add
                            </Button>
                        </form>
                    </Form>
            }
        </>
    )
}

export default BudgetForm