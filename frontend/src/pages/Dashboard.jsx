import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboardService";

function Dashboard() {
    const [dashboard, setDashboard] = useState({
        totalProducts: 0,
        totalInventoryQuantity: 0,
        lowStockProducts: 0,
        outOfStockProducts: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getDashboard();

                setDashboard(data);
            } catch (error) {
                console.error("Dashboard API error:", error);
                setError("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="page-header">
                    <div>
                        <h1>Dashboard</h1>
                        <p>Overview of your inventory.</p>
                    </div>
                </div>

                <div className="message-card">
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-page">
                <div className="page-header">
                    <div>
                        <h1>Dashboard</h1>
                        <p>Overview of your inventory.</p>
                    </div>
                </div>

                <div className="message-card error-card">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Overview of your inventory.</p>
                </div>
            </div>

            <div className="dashboard-grid">

                <div className="dashboard-card">
                    <span className="dashboard-card-title">
                        Total Products
                    </span>

                    <div className="dashboard-card-value">
                        {dashboard.totalProducts}
                    </div>

                    <p className="dashboard-card-description">
                        Products in your inventory
                    </p>
                </div>

                <div className="dashboard-card">
                    <span className="dashboard-card-title">
                        Total Quantity
                    </span>

                    <div className="dashboard-card-value">
                        {dashboard.totalInventoryQuantity}
                    </div>

                    <p className="dashboard-card-description">
                        Total available units
                    </p>
                </div>

                <div className="dashboard-card">
                    <span className="dashboard-card-title">
                        Low Stock
                    </span>

                    <div className="dashboard-card-value">
                        {dashboard.lowStockProducts}
                    </div>

                    <p className="dashboard-card-description">
                        Products needing attention
                    </p>
                </div>

                <div className="dashboard-card">
                    <span className="dashboard-card-title">
                        Out of Stock
                    </span>

                    <div className="dashboard-card-value">
                        {dashboard.outOfStockProducts}
                    </div>

                    <p className="dashboard-card-description">
                        Products currently unavailable
                    </p>
                </div>

            </div>
        </div>
    );
}

export default Dashboard;