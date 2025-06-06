'use client';

import { ColumnDef } from "@tanstack/react-table";
import { Transaction, TransactionType } from "./types";
import { BanknoteArrowDown, BanknoteArrowUp } from 'lucide-react'
import TransactionTableCell from "@/components/TransactionTableCell";

export const transactionsTableColumns: ColumnDef<Transaction>[] = [
    {
        accessorKey: 'budget',
        header: 'Budget',
        cell: ({ row }) => {
            return (
                <div>{row.original.budget.name}</div>
            )
        }
    },
    {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => {
            const date = new Date(row.getValue('date'));
            const formattedDate = new Intl.DateTimeFormat('en-UK', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            }).format(date);

            return (
                <div>{formattedDate}</div>
            )
        }
    },
    {
        accessorKey: 'amount',
        header: "Amount",
        cell: ({ row }) => {
            const formattedAmount = new Intl.NumberFormat('en-UK', {
                style: 'currency',
                currency: 'INR',
                currencyDisplay: 'symbol',
                currencySign: 'standard'
            }).format(row.original.amount);

            return (
                <div className="font-medium">{formattedAmount}</div>
            )
        }
    },
    {
        accessorKey: 'type',
        header: "Transaction Type",
        cell: ({ row }) => {
            const transactionType = row.getValue("type") as TransactionType;

            return (
                <div className="capitalize flex gap-x-2 items-center">
                    {
                        transactionType === 'expense' ?
                        <BanknoteArrowDown size={16} /> : 
                        <BanknoteArrowUp size={16} />
                    }
                    {transactionType}
                </div>
            )
        }
    },
    {
        accessorKey: 'expenseType',
        header: 'Expense Type',
        cell: ({ row }) => {
            return (
                <div className="capitalize">{row.original.expenseType.name}</div>
            )
        }
    },
    {
        accessorKey: 'paymentMethod',
        header: 'Payment Method',
        cell: ({ row }) => {
            return (
                <div className="capitalize">{row.original.paymentMethod}</div>
            )
        }
    },
    {
        accessorKey: "description",
        header: 'Description',
        cell({row}) {
           return <TransactionTableCell row={row} />
        },
    }
]