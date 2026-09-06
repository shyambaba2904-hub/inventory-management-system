import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getProductById,
    createProduct,
    updateProduct
} from "../services/productService";

function ProductForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        price: "",
        quantity: ""
    });

    const [loading, setLoading] = useState(false);
    const [loadingProduct, setLoadingProduct] = useState(isEditMode);
    
    const [toast, setToast] = useState({
        message: "",
        type: ""
    });


    const showToast = (message, type) => {
        setToast({
            message,
            type
        });

        setTimeout(() => {
            setToast({
                message: "",
                type: ""
            });
        }, 3000);
    };

    useEffect(() => {
        if (!isEditMode) return;

        const fetchProduct = async () => {
            try {
                setLoadingProduct(true);

                const data = await getProductById(id);
                const product = data.product;

                setFormData({
                    name: product.name,
                    category: product.category,
                    price: product.price,
                    quantity: product.quantity
                });
            } catch (error) {
                console.error("Get product error:", error);
               
                showToast(
                    error.response?.data?.message ||
                    "Failed to load product",
                    "error"
                );
            } finally {
                setLoadingProduct(false);
            }
        };

        fetchProduct();
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            return "Product name is required";
        }

        if (!formData.category.trim()) {
            return "Category is required";
        }

        if (formData.price === "" || formData.price === null) {
            return "Price is required";
        }

        const numericPrice = Number(formData.price);

        if (!Number.isFinite(numericPrice) || numericPrice < 0) {
            return "Price must be a valid number greater than or equal to 0";
        }

        if (formData.quantity === "" || formData.quantity === null) {
            return "Quantity is required";
        }

        const numericQuantity = Number(formData.quantity);

        if (!Number.isInteger(numericQuantity) || numericQuantity < 0) {
            return "Quantity must be a valid non-negative integer";
        }

        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        

        const validationError = validateForm();

        if (validationError) {
            showToast(validationError, "error");
            return;
        }

        const productData = {
            name: formData.name.trim(),
            category: formData.category.trim(),
            price: Number(formData.price),
            quantity: Number(formData.quantity)
        };

        try {
            setLoading(true);

            if (isEditMode) {
                await updateProduct(id, productData);
                showToast("Product updated successfully", "success");
            } else {
                await createProduct(productData);
                showToast("Product created successfully", "success");
            }

            setTimeout(() => {
                navigate("/products");
            }, 800);
        } catch (error) {
            console.error("Save product error:", error);

            showToast(
                error.response?.data?.message ||
                "Failed to save product",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    if (loadingProduct) {
        
        return (
            <div className="product-form-page">

                {toast.message && (
                    <div className={`toast ${toast.type}`}>
                        {toast.message}
                    </div>
                )}
                <div className="page-header">
                    <div>
                        <h1>Edit Product</h1>
                        <p>Update product information.</p>
                    </div>
                </div>

                <div className="message-card">
                    <p>Loading product...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="product-form-page">
            <div className="page-header">
                <div>
                    <h1>{isEditMode ? "Edit Product" : "Add Product"}</h1>
                    <p>
                        {isEditMode
                            ? "Update the details of this product."
                            : "Add a new product to your inventory."}
                    </p>

                    {toast.message && (
                        <div className={`toast ${toast.type}`}>
                            {toast.message}
                        </div>
                    )}
                </div>
            </div>

            <div className="product-form-card">
                

                <form onSubmit={handleSubmit} className="product-form">
                    <div className="form-field">
                        <label htmlFor="name">
                            Product Name
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter product name"
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="category">
                            Category
                        </label>

                        <input
                            id="category"
                            name="category"
                            type="text"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="Enter category"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-field">
                            <label htmlFor="price">
                                Price
                            </label>

                            <input
                                id="price"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="Enter price"
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="quantity">
                                Quantity
                            </label>

                            <input
                                id="quantity"
                                name="quantity"
                                type="number"
                                value={formData.quantity}
                                onChange={handleChange}
                                placeholder="Enter quantity"
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() => navigate("/products")}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : isEditMode
                                    ? "Update Product"
                                    : "Save Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProductForm;