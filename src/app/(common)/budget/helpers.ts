import axios, { AxiosError } from "axios";

type BudgetFnPaylod = { budgetId: string; token: string }

type UpdateBudgetFnPaylod = BudgetFnPaylod & {
    data: {
        amount: number;
        expenseType: string;
        periodType: string;
        name: string;
    }
}

export const getBudgetList = async (token: string) => {
    const reqUrl = `${process.env.NEXT_PUBLIC_API_URL}/budget`;
    const response = await axios.get(reqUrl, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response;
}

export const getBudgetById = async ({ budgetId, token }: BudgetFnPaylod) => {
    const reqUrl = `${process.env.NEXT_PUBLIC_API_URL}/budget/${budgetId}`;
    const response = await axios.get(reqUrl, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response;
}

export const updateBudget = async ({ budgetId, token, data }: UpdateBudgetFnPaylod) => {
    try {
        const reqUrl = `${process.env.NEXT_PUBLIC_API_URL}/budget/${budgetId}`;
        const body = {
            amount: data.amount,
            expenseType: data.expenseType,
            name: data.name,
            expensePeriodType: data.periodType
        }
        const response = await axios.put(reqUrl, body, {
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

export const deleteBudget = async ({ budgetId, token }: BudgetFnPaylod) => {
    try {
        const reqUrl = `${process.env.NEXT_PUBLIC_API_URL}/budget/${budgetId}`;
        const response = await axios.delete(reqUrl, {
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