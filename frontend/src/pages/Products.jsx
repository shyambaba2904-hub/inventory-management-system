import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getProducts,
    deleteProduct,
    updateProductQuantity,
    getCategories

} from "../services/productService";

function Products() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);


    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const params = {};

            if (search.trim()) {
                params.search = search.trim();
            }

            if (category) {
                params.category = category;
            }

            if (status) {
                params.status = status;
            }

            const data = await getProducts(params);

            setProducts(data.products);
        } catch (error) {
            console.error("Products API error:", error);

            setError("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [search, category, status]);


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data.categories);
            } catch (error) {
                console.error("Categories API error:", error);
            }
        };

        fetchCategories();
    }, []);

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteProduct(id);

            await fetchProducts();
        } catch (error) {
            console.error("Delete product error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to delete product"
            );
        }
    };

    const handleUpdateQuantity = async (
        id,
        currentQuantity
    ) => {
        const newQuantity = window.prompt(
            "Enter new quantity:",
            currentQuantity
        );

        if (newQuantity === null) {
            return;
        }

        const numericQuantity = Number(newQuantity);

        if (
            !Number.isInteger(numericQuantity) ||
            numericQuantity < 0
        ) {
            alert(
                "Quantity must be a non-negative integer"
            );
            return;
        }

        try {
            await updateProductQuantity(
                id,
                numericQuantity
            );

            await fetchProducts();
        } catch (error) {
            console.error(
                "Update quantity error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update quantity"
            );
        }
    };

    const handleAddProduct = () => {
        navigate("/products/new");
    };

    const handleEditProduct = (id) => {
        navigate(`/products/edit/${id}`);
    };

    return (
        <div className="products-page">

            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1>Products</h1>
                    <p>
                        Manage your inventory and stock levels.
                    </p>
                </div>

                <button
                    className="primary-button"
                    onClick={handleAddProduct}
                >
                    + Add Product
                </button>
            </div>

            {/* Filters */}
            <div className="filters-card">

                <div className="filter-group search-group">
                    <label htmlFor="search">
                        Search
                    </label>

                    <input
                        id="search"
                        type="text"
                        placeholder="Search by product name..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />
                </div>

                <div className="filter-group">
                    <label htmlFor="category">
                        Category
                    </label>

                    <select
                        id="category"
                        value={category}
                        onChange={(e) =>
                            setCategory(e.target.value)
                        }
                    >
                        <option value="">
                            All Categories
                        </option>

                        {categories.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="status">
                        Stock Status
                    </label>

                    <select
                        id="status"
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value)
                        }
                    >
                        <option value="">
                            All Status
                        </option>

                        <option value="In Stock">
                            In Stock
                        </option>

                        <option value="Low Stock">
                            Low Stock
                        </option>

                        <option value="Out of Stock">
                            Out of Stock
                        </option>
                    </select>
                </div>

            </div>

            {/* Loading */}
            {loading && (
                <div className="message-card">
                    <p>Loading products...</p>
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="message-card error-card">
                    <p>{error}</p>
                </div>
            )}

            {/* Products Table */}
            {!loading && !error && (
                <div className="table-card">

                    <div className="table-wrapper">
                        <table className="products-table">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {products.length > 0 ? (
                                    products.map(
                                        (product) => (
                                            <tr
                                                key={
                                                    product.id
                                                }
                                            >
                                                <td>
                                                    {
                                                        product.id
                                                    }
                                                </td>

                                                <td className="product-name">
                                                    {
                                                        product.name
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        product.category
                                                    }
                                                </td>

                                                <td>
                                                    ₹
                                                    {Number(
                                                        product.price
                                                    ).toLocaleString(
                                                        "en-IN",
                                                        {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2
                                                        }
                                                    )}
                                                </td>

                                                <td>
                                                    {
                                                        product.quantity
                                                    }
                                                </td>

                                                <td>
                                                    <span
                                                        className={`status-badge ${product.status
                                                            .toLowerCase()
                                                            .replace(
                                                                /\s+/g,
                                                                "-"
                                                            )}`}
                                                    >
                                                        {
                                                            product.status
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="action-buttons">

                                                        <button
                                                            className="edit-button"
                                                            onClick={() =>
                                                                handleEditProduct(
                                                                    product.id
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            className="quantity-button"
                                                            onClick={() =>
                                                                handleUpdateQuantity(
                                                                    product.id,
                                                                    product.quantity
                                                                )
                                                            }
                                                        >
                                                            Quantity
                                                        </button>

                                                        <button
                                                            className="delete-button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    product.id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    )
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="no-products"
                                        >
                                            No products found
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                        </table>
                    </div>

                </div>
            )}
        </div>
    );
}

export default Products;