# Inventory Management System

A simple full-stack Inventory Management System built as part of a Full Stack Developer assignment.

The application provides product management, inventory tracking, search and filtering, automatic stock-status calculation, and a dashboard with inventory statistics.

## Features

### Product Management
- Create products
- View all products
- View a single product
- Edit products
- Delete products
- Update product quantity

### Inventory Management
The products page displays:
- Product name
- Category
- Price
- Available quantity
- Stock status

Stock status is calculated automatically from quantity:

| Quantity | Stock Status |
|---|---|
| Greater than 10 | In Stock |
| 1 to 10 | Low Stock |
| 0 | Out of Stock |

Stock status is **not stored in the database**. It is calculated by the backend from the product quantity.

### Search and Filters
- Search products by name
- Filter by category
- Filter by stock status
- Combine search and filters

### Dashboard
The dashboard displays:
- Total Products
- Total Inventory Quantity
- Low Stock Products
- Out of Stock Products

Dashboard statistics are calculated from the backend/database.

### Validation and Error Handling
Validation is implemented on both frontend and backend:
- Product name is required
- Category is required
- Price must be greater than or equal to 0
- Quantity must be a non-negative integer

The backend uses appropriate HTTP status codes and centralized error handling.

---

## Technologies Used

### Frontend
- React.js
- JavaScript
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express.js
- JavaScript
- Axios-compatible REST API
- MySQL2

### Database
- MySQL

---

## Project Structure

```text
inventory-management-system/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── dashboardController.js
│   │   └── productController.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── dashboardRoutes.js
│   │   └── productRoutes.js
│   ├── utils/
│   │   └── productUtils.js
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ProductForm.jsx
│   │   │   └── Products.jsx
│   │   ├── services/
│   │   │   ├── dashboardService.js
│   │   │   └── productService.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
└── README.md
```

---

## Prerequisites

Make sure the following are installed:

- Node.js
- npm
- MySQL
- XAMPP (optional, used for running MySQL and phpMyAdmin)

---

# Backend Setup

## 1. Open the backend directory

```bash
cd backend
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment variables

Create a `.env` file inside the `backend` directory.

Example:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=inventory_management_db
DB_PORT=3306
```

Do not commit the real `.env` file to GitHub.

---

## 4. Create the database

Using MySQL/phpMyAdmin, create the database:

```sql
CREATE DATABASE inventory_management_db;
```

Select the database and create the `products` table:

```sql
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);
```

The database does not contain a `status` column because stock status is calculated automatically by the backend.

---

## 5. Start the backend

For development:

```bash
npm run dev
```

Or:

```bash
npm start
```

The backend runs by default at:

```text
http://localhost:5000
```

---

# Frontend Setup

## 1. Open the frontend directory

From the project root:

```bash
cd frontend
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment variables

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 4. Start the frontend

```bash
npm run dev
```

Vite will display the local development URL in the terminal, normally:

```text
http://localhost:5173
```

Make sure the backend is running before using the application.

---

# API Documentation

Base URL:

```text
http://localhost:5000/api
```

## Products

### Create Product

```http
POST /api/products
```

Request body:

```json
{
  "name": "Wireless Keyboard",
  "category": "Electronics",
  "price": 1499,
  "quantity": 25
}
```

Response:

```http
201 Created
```

---

### Get Products

```http
GET /api/products
```

Optional query parameters:

```text
search
category
status
```

Examples:

```text
GET /api/products?search=Laptop
```

```text
GET /api/products?category=Electronics
```

```text
GET /api/products?status=Low%20Stock
```

Multiple filters can be combined:

```text
GET /api/products?search=Laptop&category=Electronics&status=In%20Stock
```

---

### Get Product by ID

```http
GET /api/products/:id
```

Example:

```text
GET /api/products/14
```

---

### Update Product

```http
PUT /api/products/:id
```

Request body:

```json
{
  "name": "Wireless Keyboard Pro",
  "category": "Electronics",
  "price": 1799,
  "quantity": 20
}
```

---

### Delete Product

```http
DELETE /api/products/:id
```

Example:

```text
DELETE /api/products/14
```

---

### Update Product Quantity

```http
PATCH /api/products/:id/quantity
```

Request body:

```json
{
  "quantity": 15
}
```

This endpoint updates only the quantity. The stock status is then recalculated automatically.

---

### Get Categories

```http
GET /api/products/categories
```

Returns the distinct product categories used by the inventory.

---

## Dashboard

### Get Dashboard Statistics

```http
GET /api/dashboard
```

Example response:

```json
{
  "totalProducts": 10,
  "totalInventoryQuantity": 250,
  "lowStockProducts": 3,
  "outOfStockProducts": 2
}
```

---

# HTTP Status Codes

The API uses standard HTTP status codes, including:

| Status | Meaning |
|---|---|
| 200 | Request successful |
| 201 | Product created successfully |
| 400 | Invalid request or validation error |
| 404 | Product not found |
| 500 | Internal server error |

---

# Stock Status Logic

Stock status is derived from the product quantity.

```text
quantity > 10
    → In Stock

quantity 1–10
    → Low Stock

quantity = 0
    → Out of Stock
```

The status is calculated when products are returned by the backend and is never manually stored in the database.

---

# Running the Complete Application

Start MySQL through XAMPP or another MySQL installation.

Then open two terminals.

### Terminal 1 — Backend

```bash
cd backend
npm run dev
```

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

Open the frontend URL shown by Vite in your browser.

---

# Environment Variables

### Backend

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=inventory_management_db
DB_PORT=3306
```

### Frontend

```env
VITE_API_URL=http://localhost:5000/api
```

Real credentials should never be committed to the repository. Use `.env.example` files for sharing configuration structure.

---

# Code Quality

The project follows a simple and maintainable structure with:

- Separate frontend and backend applications
- Controllers for backend request handling
- Routes for API endpoints
- Centralized backend error handling
- Utility function for stock-status calculation
- Environment-based configuration
- Parameterized SQL queries
- Frontend service layer for API requests
- Reusable product form for creating and editing products

The implementation intentionally avoids unnecessary complexity and focuses on the core requirements of the assignment.

---

# Assignment Scope

This project was developed as a one-day scoped full-stack assignment. The primary focus is on:

- Functional frontend
- Functional backend
- MySQL database integration
- Correct inventory logic
- REST API design
- Validation and error handling
- Clean and maintainable code


