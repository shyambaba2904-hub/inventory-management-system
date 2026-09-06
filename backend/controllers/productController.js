const db = require("../config/db");
const { getStockStatus } = require("../utils/productUtils");

const PRODUCT_FIELDS =
    "id, name, category, price, quantity, created_at, updated_at";

const validateProduct = ({ name, category, price, quantity }) => {
    if (typeof name !== "string" || !name.trim()) {
        return "Product name is required";
    }

    if (typeof category !== "string" || !category.trim()) {
        return "Category is required";
    }

    if (price === undefined || price === null || price === "") {
        return "Price is required";
    }

    if (quantity === undefined || quantity === null || quantity === "") {
        return "Quantity is required";
    }

    const numericPrice = Number(price);
    const numericQuantity = Number(quantity);

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
        return "Price must be a valid number greater than or equal to 0";
    }

    if (!Number.isInteger(numericQuantity) || numericQuantity < 0) {
        return "Quantity must be a valid non-negative integer";
    }

    return null;
};

const validateProductId = (id) => {
    const numericId = Number(id);

    if (!Number.isInteger(numericId) || numericId <= 0) {
        return null;
    }

    return numericId;
};

const getProduct = async (id) => {
    const [products] = await db.execute(
        `SELECT ${PRODUCT_FIELDS}
         FROM products
         WHERE id = ?`,
        [id]
    );

    return products[0] || null;
};


const createProduct = async (req, res, next) => {
    try {
        const { name, category, price, quantity } = req.body;

        const validationError = validateProduct({
            name,
            category,
            price,
            quantity
        });

        if (validationError) {
            return res.status(400).json({
                message: validationError
            });
        }

        const numericPrice = Number(price);
        const numericQuantity = Number(quantity);

        const [result] = await db.execute(
            `INSERT INTO products (name, category, price, quantity)
             VALUES (?, ?, ?, ?)`,
            [
                name.trim(),
                category.trim(),
                numericPrice,
                numericQuantity
            ]
        );

        const product = await getProduct(result.insertId);

        return res.status(201).json({
            message: "Product created successfully",
            product: {
                ...product,
                status: getStockStatus(product.quantity)
            }
        });
    } catch (error) {
        next(error);
    }
};


const getProducts = async (req, res, next) => {
    try {
        const search = req.query.search?.trim();
        const category = req.query.category?.trim();
        const status = req.query.status?.trim();

        const conditions = [];
        const values = [];

        if (search) {
            conditions.push("name LIKE ?");
            values.push(`%${search}%`);
        }

        if (category) {
            conditions.push("category = ?");
            values.push(category);
        }

        if (status) {
            if (status === "In Stock") {
                conditions.push("quantity > 10");
            } else if (status === "Low Stock") {
                conditions.push("quantity BETWEEN 1 AND 10");
            } else if (status === "Out of Stock") {
                conditions.push("quantity = 0");
            } else {
                return res.status(400).json({
                    message: "Invalid stock status"
                });
            }
        }

        let query = `
            SELECT ${PRODUCT_FIELDS}
            FROM products
        `;

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(" AND ")}`;
        }

        query += " ORDER BY id DESC";

        const [products] = await db.execute(query, values);

        const formattedProducts = products.map((product) => ({
            ...product,
            status: getStockStatus(product.quantity)
        }));

        return res.status(200).json({
            products: formattedProducts
        });
    } catch (error) {
        next(error);
    }
};


const getProductById = async (req, res, next) => {
    try {
        const id = validateProductId(req.params.id);

        if (!id) {
            return res.status(400).json({
                message: "Product ID must be a positive integer"
            });
        }

        const product = await getProduct(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        return res.status(200).json({
            product: {
                ...product,
                status: getStockStatus(product.quantity)
            }
        });
    } catch (error) {
        next(error);
    }
};


const updateProduct = async (req, res, next) => {
    try {
        const id = validateProductId(req.params.id);

        if (!id) {
            return res.status(400).json({
                message: "Product ID must be a positive integer"
            });
        }

        const product = await getProduct(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const { name, category, price, quantity } = req.body;

        const validationError = validateProduct({
            name,
            category,
            price,
            quantity
        });

        if (validationError) {
            return res.status(400).json({
                message: validationError
            });
        }

        const numericPrice = Number(price);
        const numericQuantity = Number(quantity);

        await db.execute(
            `UPDATE products
             SET name = ?,
                 category = ?,
                 price = ?,
                 quantity = ?
             WHERE id = ?`,
            [
                name.trim(),
                category.trim(),
                numericPrice,
                numericQuantity,
                id
            ]
        );

        const updatedProduct = await getProduct(id);

        return res.status(200).json({
            message: "Product updated successfully",
            product: {
                ...updatedProduct,
                status: getStockStatus(updatedProduct.quantity)
            }
        });
    } catch (error) {
        next(error);
    }
};


const deleteProduct = async (req, res, next) => {
    try {
        const id = validateProductId(req.params.id);

        if (!id) {
            return res.status(400).json({
                message: "Product ID must be a positive integer"
            });
        }

        const [result] = await db.execute(
            `DELETE FROM products
             WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        return res.status(200).json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};


const updateProductQuantity = async (req, res, next) => {
    try {
        const id = validateProductId(req.params.id);

        if (!id) {
            return res.status(400).json({
                message: "Product ID must be a positive integer"
            });
        }

        const { quantity } = req.body;

        if (quantity === undefined || quantity === null || quantity === "") {
            return res.status(400).json({
                message: "Quantity is required"
            });
        }

        const numericQuantity = Number(quantity);

        if (!Number.isInteger(numericQuantity) || numericQuantity < 0) {
            return res.status(400).json({
                message: "Quantity must be a valid non-negative integer"
            });
        }

        const product = await getProduct(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        await db.execute(
            `UPDATE products
             SET quantity = ?
             WHERE id = ?`,
            [numericQuantity, id]
        );

        const updatedProduct = await getProduct(id);

        return res.status(200).json({
            message: "Product quantity updated successfully",
            product: {
                ...updatedProduct,
                status: getStockStatus(updatedProduct.quantity)
            }
        });
    } catch (error) {
        next(error);
    }
};


const getCategories = async (req, res, next) => {
    try {
        const [categories] = await db.execute(`
            SELECT DISTINCT category
            FROM products
            ORDER BY category ASC
        `);

        return res.status(200).json({
            categories: categories.map((item) => item.category)
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    updateProductQuantity,
    getCategories
};