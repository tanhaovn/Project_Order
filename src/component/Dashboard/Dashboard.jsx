import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalTables: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [ordersRes, productsRes, tablesRes] = await Promise.all([
        axios.get("http://localhost:8080/api/order"),
        axios.get("http://localhost:8080/api/products"),
        axios.get("http://localhost:8080/api/table"),
      ]);

      const orders = ordersRes.data.data || [];
      const products = productsRes.data.data || [];
      const tables = tablesRes.data.data || [];

      // Tính tổng doanh thu
      const totalRevenue = orders.reduce(
        (sum, order) => sum + (order.total_amount || 0),
        0
      );

      // Đếm đơn hàng theo trạng thái
      const pendingOrders = orders.filter(
        (o) => o.status === "Pending"
      ).length;
      const deliveredOrders = orders.filter(
        (o) => o.status === "Delivered"
      ).length;

      setStats({
        totalOrders: orders.length,
        totalRevenue: totalRevenue,
        totalProducts: products.length,
        totalTables: tables.length,
        pendingOrders: pendingOrders,
        deliveredOrders: deliveredOrders,
      });

      // Lấy 5 đơn hàng gần nhất
      const recent = orders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentOrders(recent);

      // Tính sản phẩm bán chạy (từ order items)
      const productSales = {};
      orders.forEach((order) => {
        order.items?.forEach((item) => {
          const productId = item.product?.id;
          if (productId) {
            if (!productSales[productId]) {
              productSales[productId] = {
                product: item.product,
                quantity: 0,
                revenue: 0,
              };
            }
            productSales[productId].quantity += item.quantity;
            productSales[productId].revenue += item.subtotal || 0;
          }
        });
      });

      // Sắp xếp và lấy top 5
      const topProductsList = Object.values(productSales)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);
      setTopProducts(topProductsList);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>📊 Dashboard</h1>
        <p className="dashboard-subtitle">Tổng quan hệ thống quản lý</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Tổng doanh thu</h3>
            <p className="stat-value">
              {stats.totalRevenue.toLocaleString("vi-VN")}₫
            </p>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Tổng đơn hàng</h3>
            <p className="stat-value">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Đơn chờ xử lý</h3>
            <p className="stat-value">{stats.pendingOrders}</p>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Đơn hoàn thành</h3>
            <p className="stat-value">{stats.deliveredOrders}</p>
          </div>
        </div>

        <div className="stat-card secondary">
          <div className="stat-icon">🍽️</div>
          <div className="stat-content">
            <h3>Sản phẩm</h3>
            <p className="stat-value">{stats.totalProducts}</p>
          </div>
        </div>

        <div className="stat-card accent">
          <div className="stat-icon">🪑</div>
          <div className="stat-content">
            <h3>Số bàn</h3>
            <p className="stat-value">{stats.totalTables}</p>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="dashboard-content">
        {/* Recent Orders */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>📋 Đơn hàng gần đây</h2>
          </div>
          <div className="card-body">
            {recentOrders.length > 0 ? (
              <div className="orders-list">
                {recentOrders.map((order) => (
                  <div key={order.id} className="order-item">
                    <div className="order-info">
                      <span className="order-id">#{order.id}</span>
                      <span className="order-table">Bàn {order.table?.id}</span>
                      <span
                        className={`order-status status-${order.status?.toLowerCase()}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="order-details">
                      <span className="order-amount">
                        {order.total_amount?.toLocaleString("vi-VN")}₫
                      </span>
                      <span className="order-time">
                        {new Date(order.createdAt).toLocaleString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>Chưa có đơn hàng nào</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>🔥 Sản phẩm bán chạy</h2>
          </div>
          <div className="card-body">
            {topProducts.length > 0 ? (
              <div className="products-list">
                {topProducts.map((item, index) => (
                  <div key={item.product.id} className="product-item">
                    <div className="product-rank">#{index + 1}</div>
                    <div className="product-info">
                      <h4>{item.product.name}</h4>
                      <p className="product-stats">
                        <span className="stat-quantity">
                          Đã bán: {item.quantity}
                        </span>
                        <span className="stat-revenue">
                          Doanh thu: {item.revenue.toLocaleString("vi-VN")}₫
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>Chưa có dữ liệu bán hàng</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

