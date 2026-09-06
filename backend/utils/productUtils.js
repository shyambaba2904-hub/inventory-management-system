const getStockStatus = (quantity) => {
    if (quantity > 10) {
        return "In Stock";
    }

    if (quantity >= 1) {
        return "Low Stock";
    }

    return "Out of Stock";
};

module.exports = {
    getStockStatus
};