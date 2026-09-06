const db = require("../config/db");

const getDashboard = async (req, res, next) => {
    try {
        const [rows] = await db.execute(`
            SELECT
                COUNT(*) AS total_products,
                COALESCE(SUM(quantity), 0) AS total_inventory_quantity,
                SUM(CASE WHEN quantity BETWEEN 1 AND 10 THEN 1 ELSE 0 END) AS low_stock_products,
                SUM(CASE WHEN quantity = 0 THEN 1 ELSE 0 END) AS out_of_stock_products
            FROM products
        `);

        const dashboard = rows[0];

        return res.status(200).json({
            totalProducts: Number(dashboard.total_products),
            totalInventoryQuantity: Number(dashboard.total_inventory_quantity),
            lowStockProducts: Number(dashboard.low_stock_products),
            outOfStockProducts: Number(dashboard.out_of_stock_products)
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboard
};