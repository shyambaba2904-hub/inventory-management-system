import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/dashboard`;

export const getDashboard = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};