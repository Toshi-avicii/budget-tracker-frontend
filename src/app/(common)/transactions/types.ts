export type PaymentMethod = "online" | "cash" | "card";
export type TransactionType = "expense" | "income";

export type Transaction = {
    amount: number;
    budget: { name: string; id: string; }
    date: Date;
    description?: string;
    expenseType: { name: string; id: string; }
    isRecurring: boolean;
    paymentMethod: PaymentMethod;
    type: TransactionType
    userId: string;
    _id: string;
}