import axios, { AxiosError } from "axios"

export const getAllTransactionsByUser = async ({ page, limit, token }: { page: number, limit: number, token: string }) => {
    try {
        const requrl = `${process.env.NEXT_PUBLIC_API_URL}/transactions?page=${page}&limit=${limit}`;
        const response = await axios.get(requrl, {
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