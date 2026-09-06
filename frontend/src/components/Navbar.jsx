import { NavLink } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <NavLink
                    to="/"
                    className="navbar-brand"
                >
                    Inventory Management System
                </NavLink>

                <div className="navbar-links">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive
                                ? "nav-link active"
                                : "nav-link"
                        }
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/products"
                        className={({ isActive }) =>
                            isActive
                                ? "nav-link active"
                                : "nav-link"
                        }
                    >
                        Products
                    </NavLink>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;