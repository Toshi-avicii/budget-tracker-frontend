import { LoginFormData } from "@/components/Login";
import { SignUpFormData } from "@/components/SignUpForm";
import { QueryFunctionContext } from "@tanstack/react-query";
import axios, { AxiosError } from 'axios';
import { Session } from "next-auth";

export async function register({ email, password, username }: SignUpFormData) {
    const body = { username, password, email }
    try {
        const reqUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/sign-up`;
        const req = await fetch(reqUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (req.status >= 200 && req.status < 300) {
            const response = await req.json();
            return response;
        } else {
            const error: { message: string } = await req.json();
            throw new Error(error.message);
        }
    } catch (err) {
        if (err instanceof Error) {
            throw new Error(err.message);
        }
    }
}

export async function login({ email, password }: LoginFormData) {
    const body = { email, password };
    try {
        const reqUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;
        const response = await axios.post(reqUrl, body);
        return response;
    } catch (err) {
        if (err instanceof AxiosError) {
            throw new Error(err.response?.data?.message)
        } else if (err instanceof Error) {
            throw new Error(err.message);
        }
    }
}

export async function logout({ queryKey }: QueryFunctionContext<[string, string]>) {
    const [, token] = queryKey;
    const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        credentials: 'include'
    });

    const response = await req.json();
    return response;
}

export async function requestCookie(token: string) {
    const reqUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/set-cookie`;
    const response = await axios.post(reqUrl, { token }, {
        withCredentials: true
    });

    return response;
}

export async function forgotPasswordFn(body: { email: string }) {
    const reqUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`;
    const response = await axios.post(reqUrl, body);
    return response;
}

export async function resetPasswordFn(body: { password: string, token: string }) {
    const reqUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`;
    const response = await axios.post(reqUrl, body);
    return response;
}

export async function googleSignInFn(body: Session) {
    const reqUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/google-sign-in`;
    const reqBody = {
        expires: body.expires,
        userData: {
            name: body.user?.name,
            email: body.user?.email,
            image: body.user?.image
        }

    }
    const response = await axios.post(reqUrl, reqBody);
    return response;
}

export async function getToken() {
    const reqUrl = `http://localhost:3000/api/get-token`;
    const response = await axios.get(reqUrl);
    return response;
}

export async function addNewBudgetFn(body: {
    name: string,
    amount: number,
    expenseType: string,
    periodType: string,
    token: string
}) {
    try {
        const reqUrl = `${process.env.NEXT_PUBLIC_API_URL}/budget/add-new`;
        const response = await axios.post(reqUrl, {
            budgetName: body.name,
            amount: body.amount,
            budgetExpensePeriodType: body.periodType,
            budgetExpenseType: body.expenseType,
            currencyCode: "INR"
        }, {
            headers: {
                Authorization: `Bearer ${body.token}`
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

interface StatData {
    amount: number;
    prevAmount: number;
}

export class StatCardData {
    public amount: number;
    public prevAmount: number;

    constructor(data: StatData) {
        this.amount = data.amount;
        this.prevAmount = data.prevAmount;
    }

    calcPercentage(): number {
        if (this.prevAmount === 0) {
            return +(((this.amount - this.prevAmount) / 1) * 100).toFixed(2);
        } else {
            return +(((this.amount - this.prevAmount) / (this.prevAmount)) * 100).toFixed(2);
        }
    }
}

export function formatAmount(amount: number, currency: string) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

export async function getConversation({ token, user1, user2 }: { token: string, user1: string, user2: string }) {
    try {
        const reqUrl = `${process.env.NEXT_PUBLIC_API_URL}/messages/${user1}/${user2}`;
        const response = await axios.get(reqUrl, {
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

export async function getSummaryData({ from, to, token }: { from: Date, to: Date, token: string }) {
    try {
         const reqUrl = `${process.env.NEXT_PUBLIC_API_URL}/dashboard/data/summary?from=${from.toUTCString()}&to=${to.toUTCString()}`;
        const response = await axios.get(reqUrl, {
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

export async function getDataByRange({ monthFrom, monthTo, yearFrom, yearTo, token }: { monthFrom: number, monthTo: number, yearFrom: number, yearTo: number, token: string }) {
    try {
         const reqUrl = `${process.env.NEXT_PUBLIC_API_URL}/dashboard/data/monthly?monthFrom=${monthFrom}&monthTo=${monthTo}&yearFrom=${yearFrom}&yearTo=${yearTo}`;
        const response = await axios.get(reqUrl, {
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

export async function getDataByExpenseTypes({ date, token }: { date: Date, token: string }) {
    try {
        const reqUrl = `${process.env.NEXT_PUBLIC_API_URL}/dashboard/data/expense-types?date=${date}`;
        const response = await axios.get(reqUrl, {
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