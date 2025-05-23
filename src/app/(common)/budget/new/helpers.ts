import axios from "axios";

export const getBudgetCategories = async(token: string) => {
    const reqUrl = `${process.env.NEXT_PUBLIC_API_URL}/budget/categories`;
    const response = await axios.get(reqUrl, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response;
}

export const getBudgetPeriods = async(token: string) => {
    const reqUrl = `${process.env.NEXT_PUBLIC_API_URL}/budget/periods`;
    const response = await axios.get(reqUrl, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response;
}