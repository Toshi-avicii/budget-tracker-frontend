'use client';

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { PiInfo } from "react-icons/pi";
import { z } from "zod";
import { getBudgetList } from "../../budget/helpers";
import { useAppSelector } from "@/store/reduxHooks";
import { Textarea } from "@/components/ui/textarea";
import { AxiosResponse } from "axios";
import { getBudgetCategories } from "../../budget/new/helpers";
import { useState } from "react";
import { toast } from "sonner";
import { createTransaction, Transaction } from "./helpers";

interface BudgetItem {
    name: string;
    _id: string;
}

const newTransactionFormSchema = z.object({
    budgetId: z.string({ required_error: "Please select a budget" }).refine(val => val !== '', {
        message: "Please select a budget"
    }),
    amount: z.number({ required_error: "Amount is required" }).min(10, "Minimum Amount is 10 rupees"),
    transactionType: z.union([
        z.literal("expense"),
        z.literal("income"),
        z.undefined()
    ]).refine((val) => val === 'expense' || val === 'income', {
        message: 'Transaction type must be either "expense" or "income"'
    }),
    date: z.date({ required_error: "Date is required" }),
    paymentMethod: z.union([
        z.literal("cash"),
        z.literal("card"),
        z.literal("online"),
        z.undefined()
    ]).refine(val => val === 'card' || val === 'cash' || val === 'online', {
        message: "Payment method is not valid"
    }),
    isRecurring: z.union([
        z.literal("oneTime"),
        z.literal("recurring"),
        z.undefined()
    ]).refine(val => val === 'recurring' || val === 'oneTime', {
        message: "Payment method is not valid"
    }),
    description: z.string().optional(),
    expenseType: z.string().optional()
}).superRefine((data, ctx) => {
    if (data.transactionType === 'expense' && data.expenseType === '') {
        ctx.addIssue({
            path: ['expenseType'],
            code: z.ZodIssueCode.custom,
            message: "Please select an expense type"
        })
    }
})

function NewTransactionForm() {
    const queryClient = useQueryClient();
    const token = useAppSelector(state => state.auth.token);
    const budgetListQuery = useQuery({
        queryKey: ['get-budget-list'],
        queryFn: async () => await getBudgetList(token)
    });

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

    const transactionMutation = useMutation({
        mutationFn: createTransaction,
        onMutate() {
            toast.loading('Sending...', { id: 'budget-update-toast' });
        },
        onSuccess(data) {
            if (data) {
                toast.dismiss('budget-update-toast');
                toast.success(data.data.data.message);
                form.reset({
                    budgetId: '',
                    amount: 0,
                    transactionType: undefined,
                    date: new Date(),
                    isRecurring: undefined,
                    paymentMethod: undefined,
                    expenseType: ''
                });
            }
        },
        onError(error) {
            toast.dismiss('budget-update-toast');
            toast.error(error.message);
        },
    })

    const form = useForm<z.infer<typeof newTransactionFormSchema>>({
        resolver: zodResolver(newTransactionFormSchema),
        defaultValues: {
            budgetId: '',
            amount: 0,
            transactionType: undefined,
            date: new Date(),
            isRecurring: undefined,
            paymentMethod: undefined,
            expenseType: ''
        }
    });

    const [transactionTypeState, setTransactionTypeState] = useState(form.getValues().transactionType)

    const handleSubmit = async (values: z.infer<typeof newTransactionFormSchema>) => {
        let body: Transaction;

        if(!values.expenseType) {
            body = {
                amount: values.amount,
                budgetId: values.budgetId,
                transactionType: values.transactionType,
                description: values.description,
                date: values.date,
                paymentMethod: values.paymentMethod,
                isRecurring: values.isRecurring === 'oneTime' ? false : true
            }
        } else {
            body = {
                amount: values.amount,
                budgetId: values.budgetId,
                transactionType: values.transactionType,
                description: values.description,
                date: values.date,
                paymentMethod: values.paymentMethod,
                isRecurring: values.isRecurring === 'oneTime' ? false : true,
                expenseType: values.expenseType
            }
        }
        transactionMutation.mutate({
            token,
            body
        })
    }

    return (
        <div>
            <Form 
                {...form}
                key={form.watch('paymentMethod') + form.watch('expenseType') + form.watch('isRecurring')}
            >
                <form
                    onSubmit={form.handleSubmit(handleSubmit, (errors) => {
                        console.log(errors);
                    })}
                >
                    <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-4 lg:w-2/3">
                        {/* budget type */}
                        <FormField
                            control={form.control}
                            name='budgetId'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='flex gap-x-2 items-center'>
                                        <span>Budget</span>
                                        <Popover>
                                            <PopoverTrigger>
                                                <PiInfo />
                                            </PopoverTrigger>
                                            <PopoverContent className='text-sm' side='top'>
                                                Select the budget you created
                                            </PopoverContent>
                                        </Popover>
                                    </FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Budget" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    (budgetListQuery.isSuccess) && (budgetListQuery.data?.data?.data as BudgetItem[]).map((item: BudgetItem) => {
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

                        {/* transaction amount */}
                        <FormField
                            control={form.control}
                            name='amount'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='flex gap-x-2 items-center'>
                                        <span>Amount</span>
                                        <Popover>
                                            <PopoverTrigger>
                                                <PiInfo />
                                            </PopoverTrigger>
                                            <PopoverContent className='text-sm' side='top'>Transaction Amount</PopoverContent>
                                        </Popover>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type='number'
                                            placeholder='Transaction Amount'
                                            onChange={(e) => field.onChange(+e.target.value)}
                                            min={0}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* transaction date */}
                        <FormField
                            control={form.control}
                            name='date'
                            render={({ field }) => (
                                <FormItem className="min-w-full">
                                    <FormLabel className='flex gap-x-2 items-center'>
                                        <span>Date</span>
                                        <Popover>
                                            <PopoverTrigger>
                                                <PiInfo />
                                            </PopoverTrigger>
                                            <PopoverContent className='text-sm' side='top'>Transaction Date</PopoverContent>
                                        </Popover>
                                    </FormLabel>
                                    <FormControl>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* payment method */}
                        <FormField
                            control={form.control}
                            name='paymentMethod'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='flex gap-x-2 items-center'>
                                        <span>Payment Method</span>
                                        <Popover>
                                            <PopoverTrigger>
                                                <PiInfo />
                                            </PopoverTrigger>
                                            <PopoverContent className='text-sm' side='top'>Select your payment method</PopoverContent>
                                        </Popover>
                                    </FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Transaction Payment method" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="cash" key="cash">Cash</SelectItem>
                                                <SelectItem value="card" key="card">Card</SelectItem>
                                                <SelectItem value="online" key="online">Online</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* transaction type */}
                        <FormField
                            control={form.control}
                            name='transactionType'
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel className='flex gap-x-2 items-center'>
                                            <span>Type</span>
                                            <Popover>
                                                <PopoverTrigger>
                                                    <PiInfo />
                                                </PopoverTrigger>
                                                <PopoverContent className='text-sm' side='top'>Transaction Type</PopoverContent>
                                            </Popover>
                                        </FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={(value) => {
                                                    if (value === 'expense' || value === 'income') {
                                                        setTransactionTypeState(value)
                                                    }
                                                    return field.onChange(value);
                                                }}
                                                // defaultValue={field.value}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a period of budget" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="expense" key="expense">Expense</SelectItem>
                                                    <SelectItem value="income" key="income">Income</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>

                                )
                            }}
                        />

                        {/* expense type */}
                        <FormField
                            control={form.control}
                            name='expenseType'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='flex gap-x-2 items-center'>
                                        <span>Category</span>
                                        <Popover>
                                            <PopoverTrigger>
                                                <PiInfo />
                                            </PopoverTrigger>
                                            <PopoverContent className='text-sm' side='top'>
                                                Select the expense type
                                            </PopoverContent>
                                        </Popover>
                                    </FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            disabled={transactionTypeState !== 'expense'}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Type of expense" />
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

                        {/* transaction occurrence */}
                        <FormField
                            control={form.control}
                            name='isRecurring'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='flex gap-x-2 items-center'>
                                        <span>Occurence</span>
                                        <Popover>
                                            <PopoverTrigger>
                                                <PiInfo />
                                            </PopoverTrigger>
                                            <PopoverContent className='text-sm' side='top'>Transaction Occurence</PopoverContent>
                                        </Popover>
                                    </FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Transaction Occurence" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="recurring" key="recurring">Recurring</SelectItem>
                                                <SelectItem value="oneTime" key="oneTime">One Time</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* transaction description */}
                        <FormField
                            control={form.control}
                            name='description'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='flex gap-x-2 items-center'>
                                        <span>Description (optional)</span>
                                        <Popover>
                                            <PopoverTrigger>
                                                <PiInfo />
                                            </PopoverTrigger>
                                            <PopoverContent className='text-sm' side='top'>Transaction Description</PopoverContent>
                                        </Popover>
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Transaction description"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button type="submit" className="my-4">
                        <Save />
                        Create Transaction
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default NewTransactionForm