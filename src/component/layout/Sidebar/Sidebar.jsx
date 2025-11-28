import React from "react";
import { NavLink } from "react-router-dom";
import { useUser, UserButton } from "@clerk/clerk-react";
import "./Sidebar.css";

const Sidebar = () => {
  const { user } = useUser();

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <div className="logo">
          <span className="logo-icon">🍔</span>
          <span className="logo-text">MyRestaurant</span>
        </div>

        <nav className="navigation">
          <ul className="nav-list">
            <li className="nav-item">
              <NavLink
                to="dashboard"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span className="menu-icon">📊</span> Dashboard
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="product-categorie"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span className="menu-icon">📂</span> Categories
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="product-list"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span className="menu-icon">📋</span> List Product
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="table"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span className="menu-icon">🪑</span> Tables
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="order-product"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span className="menu-icon">📦</span> Order Product
              </NavLink>
            </li>

            <li className="nav-item">
              {/* <NavLink
                to="order-item"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span className="menu-icon">🍽️</span> Order Item
              </NavLink> */}
            </li>
          </ul>
        </nav>

        <div className="profile-section">
          <div className="profile">
            <div className="profile-avatar">
              <UserButton afterSignOutUrl="/login" />
            </div>
            
            <div className="profile-info">
              <span className="profile-name">
                {user?.fullName || user?.firstName || 'User'}
              </span>
              <span className="profile-role">
                {user?.primaryEmailAddress?.emailAddress || 'Admin'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;