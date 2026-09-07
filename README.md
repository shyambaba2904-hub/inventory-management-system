# Inventory Management System

A full-stack inventory management application built for a Full Stack Developer assignment.

The application allows users to add, edit, delete and manage products. It also provides search and filters, automatic stock status, and a dashboard showing inventory information.

## Features

### Products
- Add a new product
- View all products
- Edit product
- Delete product
- Update product quantity

### Search and Filters
- Search products by name
- Filter products by category
- Filter products by stock status
- Use multiple filters together

### Stock Status

Stock status is calculated from the product quantity:

| Quantity | Status |
|----------|--------|
| More than 10 | In Stock |
| 1 - 10 | Low Stock |
| 0 | Out of Stock |

Stock status is not stored in the database. It is calculated by the backend whenever product data is returned.

### Dashboard

The dashboard shows:

- Total Products
- Total Inventory Quantity
- Low Stock Products
- Out of Stock Products

The dashboard values are calculated from the database.

### Validation

Product validation is handled on both frontend and backend.

- Product name is required
- Category is required
- Price must be 0 or more
- Quantity must be a non-negative integer

The API also returns appropriate HTTP status codes for validation errors, missing products and server errors.

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
- MySQL2

### Database
- MySQL

---

## Requirements

Before running the project, install:

- Node.js
- npm
- MySQL

You can use XAMPP to run MySQL and phpMyAdmin if needed.

---

# Setup

## 1. Clone the repository

```bash
git clone https://github.com/shyambaba2904-hub/inventory-management-system.git
cd inventory-management-system
```

# Database Setup

Create a MySQL database:

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

There is no `status` column because stock status is calculated from `quantity`.

# Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=inventory_management_db
DB_PORT=3306
```

Update the database values if your MySQL setup is different.

Start the backend:

```bash
npm run dev
```

The API will run on:

```text
http://localhost:5000
```

# Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Vite will show the frontend URL in the terminal, normally:

```text
http://localhost:5173
```

Make sure the backend and MySQL are running before using the application.

# API Endpoints

Base URL:

```text
http://localhost:5000/api
```

## Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/products` | Create a product |
| GET | `/products` | Get all products |
| GET | `/products/:id` | Get one product |
| PUT | `/products/:id` | Update a product |
| DELETE | `/products/:id` | Delete a product |
| PATCH | `/products/:id/quantity` | Update product quantity |
| GET | `/products/categories` | Get product categories |

### Search and Filters

```text
GET /api/products?search=Laptop
```

```text
GET /api/products?category=Electronics
```

```text
GET /api/products?status=Low%20Stock
```

Multiple filters can be used together:

```text
GET /api/products?search=Laptop&category=Electronics&status=In%20Stock
```

## Dashboard

```text
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

# HTTP Status Codes

| Status | Description |
|--------|-------------|
| 200 | Request successful |
| 201 | Product created |
| 400 | Invalid input |
| 404 | Product not found |
| 500 | Server error |

# Environment Variables

## Backend

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=inventory_management_db
DB_PORT=3306
```

## Frontend

```env
VITE_API_URL=http://localhost:5000/api
```

Actual `.env` files are not committed to GitHub. `.env.example` files are included so the required variables are clear.

# Running the Project

Start MySQL using XAMPP or your local MySQL installation.

### Backend

```bash
cd backend
npm run dev
```

### Frontend

In another terminal:

```bash
cd frontend
npm run dev
```

Then open the frontend URL shown by Vite.

## Notes

- Stock status is calculated from quantity and is not stored in the database.
- Dashboard statistics come from the database through the backend API.
- SQL queries use parameters instead of directly adding user input to queries.
- Backend errors are handled through a common error-handling middleware.
