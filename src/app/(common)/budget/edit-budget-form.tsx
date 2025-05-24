'use client';

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { PiInfo } from "react-icons/pi";
import { z } from "zod";
import { getBudgetCategories, getBudgetPeriods } from "./new/helpers";
import { useAppSelector } from "@/store/reduxHooks";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { Save } from "lucide-react";
import { Budget } from "./types";
import { AxiosResponse } from "axios";
import { toast } from "sonner";
import { updateBudget } from "./helpers";

interface BudgetItem {
    name: string;
    _id: string;
}

export interface EditBudgetFormSchema {
    name: string;
    expenseType: string | undefined;
    amount: number;
    periodType: string | undefined;
}

const editBudgetFormSchema = z.object({
    name: z.string().trim().min(3, 'Name should be at least 3 characters long').max(30, 'Name cannot be longer than 30 characters'),
    expenseType: z.string({ required_error: "Expense Type is required" }),
    amount: z.number({ invalid_type_error: "Amount must be a number" }).min(100, 'Budget Amount cannot be be less than 100'),
    periodType: z.string({ required_error: "Period type is required" })
});

interface EditBudgetFormProps {
    budgetData: Budget;
    onSuccessfulFormSubmit: () => void;
}

function EditBudgetForm({ budgetData, onSuccessfulFormSubmit }: EditBudgetFormProps) {
    const queryClient = useQueryClient();
    const token = useAppSelector(state => state.auth.token);
    const budgetCategoryQuery = useQuery({
        queryKey: ['get-budget-categories-list'],
        queryFn: async () => {
            // don't run this query if the previous data is the same as the new one.
            const previousData = queryClient.getQueryData(['get-budget-categories-list']) as AxiosResponse<BudgetItem[]>;
            const newData = await getBudgetCategories(token);
            if (previousData && JSON.stringify(previousData.data) === JSON.stringify(newData.data)) return previousData;
            return newData;
        },
        staleTime: (1000 * 60 * 5)
    });

    const budgetPeriodQuery = useQuery({
        queryKey: ['get-budget-periods-list'],
        queryFn: async () => {
            const previousData = queryClient.getQueryData<AxiosResponse<BudgetItem[]>>(['get-budget-periods-list']);
            const newData = await getBudgetPeriods(token);
            if (previousData && JSON.stringify(previousData.data) === JSON.stringify(newData.data)) return previousData;
            return newData;
        },
        staleTime: (1000 * 60 * 5)
    });

    const updateBudgetMutation = useMutation({
        mutationFn: updateBudget,
        onMutate() {
            toast.loading('Sending...', { id: 'budget-update-toast' });
        },
        onSuccess(data) {
            if (data) {
                toast.dismiss('budget-update-toast');
                toast.success(data.data.data.message);
                onSuccessfulFormSubmit();
                queryClient.invalidateQueries({ queryKey: ['get-budget-list']});
            }
        },
        onError(error) {
            toast.dismiss('budget-update-toast');
            toast.error(error.message);
        },
    });

    const form = useForm<z.infer<typeof editBudgetFormSchema>>({
        resolver: zodResolver(editBudgetFormSchema),
        defaultValues: {
            amount: 0,
            expenseType: undefined,
            name: '',
            periodType: undefined
        }
    });

    const handleSubmit = async (values: z.infer<typeof editBudgetFormSchema>) => {
        updateBudgetMutation.mutate({
            budgetId: budgetData._id,
            token,
            data: values
        })
    }

    useEffect(() => {
        if (budgetData && budgetPeriodQuery.isSuccess && budgetCategoryQuery.isSuccess) {
            const period: BudgetItem = budgetPeriodQuery.data.data.data.find((item: BudgetItem) => item.name === budgetData.expensePeriodType);

            const category: BudgetItem = budgetCategoryQuery.data.data.data.find((item: BudgetItem) => item.name === budgetData.expenseType);

            if (period && category) {
                form.reset({
                    amount: budgetData.amount,
                    expenseType: category._id,
                    periodType: period._id,
                    name: budgetData.name
                })
            }

        }
    }, [budgetData, form, budgetCategoryQuery.isSuccess, budgetPeriodQuery.isSuccess]);

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
                    <Form {...form} key={form.watch('periodType') + form.watch('expenseType')}>
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
                                render={({ field }) => {
                                    return (
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
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a period of budget" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            (budgetPeriodQuery.isSuccess) && (budgetPeriodQuery.data?.data?.data as BudgetItem[]).map((item: BudgetItem) => {
                                                                return (
                                                                    <SelectItem value={item._id} key={item._id}>
                                                                        {item._id === field.value ? item.name : item.name}
                                                                    </SelectItem>
                                                                )
                                                            })
                                                        }
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                }}
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
                                                        (budgetCategoryQuery.isSuccess) && (budgetCategoryQuery.data?.data?.data as BudgetItem[]).map((item: BudgetItem) => {
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

                            <Button>
                                <Save />
                                Save Changes
                            </Button>
                        </form>
                    </Form>
            }
        </>
    )
}

export default EditBudgetForm