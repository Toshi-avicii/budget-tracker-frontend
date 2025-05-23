import axios, { AxiosError } from "axios";

export type Transaction = {
    amount: number;
    budgetId: string;
    transactionType: "expense" | "income";
    description: string | undefined;
    date: Date;
    paymentMethod: "card" | "cash" | "online";
    expenseType?: string | undefined;
    isRecurring: boolean;
}

type AddTransactionParams = {
    token: string;
    body: Transaction;
}

export const createTransaction = async ({ token, body }: AddTransactionParams) => {
    try {
        const reqUrl = `${process.env.NEXT_PUBLIC_API_URL}/transactions`;
        const response = await axios.post(reqUrl, body, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response;
    } catch (err) {
        if (err instanceof AxiosError) {
            throw new Error(err.response?.data?.message)
        } else if (err instanceof Error) {
            throw new Error(err.message);
        }
    }

}