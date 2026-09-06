import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/products`;

export const getProducts = async (params = {}) => {
    const response = await axios.get(API_URL, { params });
    return response.data;
};

export const getProductById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const createProduct = async (productData) => {
    const response = await axios.post(API_URL, productData);
    return response.data;
};

export const updateProduct = async (id, productData) => {
    const response = await axios.put(`${API_URL}/${id}`, productData);
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};


export const getCategories = async () => {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
};

export const updateProductQuantity = async (id, quantity) => {
    const response = await axios.patch(
        `${API_URL}/${id}/quantity`,
        { quantity }
    );


    

    return response.data;
};