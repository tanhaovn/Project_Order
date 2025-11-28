import React, { useState, useEffect } from "react";
import axios from "axios";

const ChooseOrder = ({ orders = [], onAddOrder, onUpdate, onDelete }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [products, setProducts] = useState([]);
  const [tables, setTables] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [newOrder, setNewOrder] = useState({
    table_id: "",
    items: [],
  });

  const [editOrder, setEditOrder] = useState({});

  // Fetch products and tables
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, tablesRes] = await Promise.all([
          axios.get("http://localhost:8080/api/products"),
          axios.get("http://localhost:8080/api/table"),
        ]);
        setProducts(productsRes.data.data || []);
        setTables(tablesRes.data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    return (
      order.id?.toString().includes(searchLower) ||
      order.table?.id?.toString().includes(searchLower) ||
      order.status?.toLowerCase().includes(searchLower) ||
      order.total_amount?.toString().includes(searchLower)
    );
  });

  // Add
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newOrder.table_id) {
      alert("Please select a table");
      return;
    }
    if (newOrder.items.length === 0) {
      alert("Please add at least 1 item");
      return;
    }
    
    const orderData = {
      table_id: newOrder.table_id,
      totalAmount: newOrder.items.reduce((sum, item) => sum + calculateSubtotal(item), 0),
      items: newOrder.items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        subtotal: calculateSubtotal(item),
        notes: item.notes || "",
      })),
    };
    
    onAddOrder(orderData);
    setShowAddForm(false);

    setNewOrder({
      table_id: "",
      items: [],
    });
  };

  const addItemToNewOrder = () => {
    const newItem = {
      id: Date.now(),
      product_id: "",
      quantity: 1,
      notes: "",
    };
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, newItem],
    });
  };

  const removeItemFromNewOrder = (itemId) => {
    setNewOrder({
      ...newOrder,
      items: newOrder.items.filter((item) => item.id !== itemId),
    });
  };

  const updateItemInNewOrder = (itemId, field, value) => {
    setNewOrder({
      ...newOrder,
      items: newOrder.items.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      ),
    });
  };

  const calculateSubtotal = (item) => {
    if (!item.product_id || !item.quantity) return 0;
    const product = products.find((p) => p.id === parseInt(item.product_id));
    return product ? product.price * item.quantity : 0;
  };

  // Update
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    
    const orderData = {
      id: editOrder.id,
      table_id: editOrder.table_id,
      status: editOrder.status,
      totalAmount: editOrder.items.reduce((sum, item) => sum + calculateEditSubtotal(item), 0),
      items: editOrder.items.map(item => ({
        product_id: item.product_id || item.product?.id,
        quantity: item.quantity,
        subtotal: calculateEditSubtotal(item),
        notes: item.notes || "",
      })),
    };
    
    console.log("Update Order Data:", orderData);
    onUpdate(orderData);
    setShowEditForm(false);
  };

  const addItemToEditOrder = () => {
    const newItem = {
      id: Date.now(),
      product_id: "",
      quantity: 1,
      notes: "",
    };
    setEditOrder({
      ...editOrder,
      items: [...(editOrder.items || []), newItem],
    });
  };

  const removeItemFromEditOrder = (itemId) => {
    setEditOrder({
      ...editOrder,
      items: editOrder.items.filter((item) => item.id !== itemId),
    });
  };

  const updateItemInEditOrder = (itemId, field, value) => {
    setEditOrder({
      ...editOrder,
      items: editOrder.items.map((item) => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'product_id') {
            delete updatedItem.product;
          }
          return updatedItem;
        }
        return item;
      }),
    });
  };

  const calculateEditSubtotal = (item) => {
    if (!item.product_id && !item.product) return 0;
    if (!item.quantity) return 0;
    
    const product = products.find((p) => p.id === parseInt(item.product_id || item.product?.id));
    if (product) return product.price * item.quantity;
    
    if (item.product) return item.product.price * item.quantity;
    
    return 0;
  };

  const fetchOrderDetails = (order) => {
    setOrderItems(order.items || []);
    setEditOrder(order);
    setShowDetailsDialog(true);
  };

  return (
    <>
      <h1 className="title">Orders</h1>
      <p className="breadcrumb">Home / Order Management</p>

      <div className="actions">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search by ID, table, status..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn filter-btn">Filter</button>
        <button className="btn add-btn" onClick={() => setShowAddForm(true)}>
          + Add Order
        </button>
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Table</th>
            <th>Status</th>
            <th>Items</th>
            <th>Total Amount</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((value) => (
              <tr key={value.id}>
                <td>#{value.id}</td>
                <td>Table {value.table?.id || value.table_id}</td>
                <td>
                  <span className={`status-badge status-${value.status?.toLowerCase()}`}>
                    {value.status}
                  </span>
                </td>
                <td>
                  <span style={{ 
                    background: 'var(--primary-light)', 
                    color: 'var(--primary-color)',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '13px'
                  }}>
                    {value.items?.length || 0} items
                  </span>
                </td>
                <td style={{ fontWeight: 600, color: 'var(--primary-color)' }}>
                  {value.total_amount?.toLocaleString("en-US")}
                </td>
                <td>
                  {value.createdAt
                    ? new Date(value.createdAt).toLocaleString('en-US', {
                        day: '2-digit',
                        month: '2-digit', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
"}                    : "
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn-detail"
                      onClick={() => fetchOrderDetails(value)}
                    >
                      Details
                    </button>
                    <div className="dropdown">
                      <button
                        className="action-btn"
                        onClick={() =>
                          setSelected(selected === value.id ? null : value.id)
                        }
                      >
'EOFORDER'                        
                      </button>

                      {selected === value.id && (
                        <div className="dropdown-menu">
                          {value.status !== 'Canceled' && value.status !== 'Delivered' && (
                            <button
                              onClick={() => {
                                setEditOrder({
                                  ...value,
                                  items: value.items || [],
                                });
                                setShowEditForm(true);
                                setSelected(null);
                              }}
                            >
                              Edit
                            </button>
                          )}
                          <button
                            onClick={() => {
                              onDelete(value.id);
                              setSelected(null);
                            }}
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No orders yet</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add Modal */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: "700px" }}>
            <h2>Add Order</h2>
            <form onSubmit={handleAddSubmit}>
              <div>
                <label>Table</label>
                <select
                  value={newOrder.table_id}
                  onChange={(e) =>
                    setNewOrder({
                      ...newOrder,
                      table_id: parseInt(e.target.value),
                    })
                  }
                  required
                >
                  <option value="">-- Select Table --</option>
                  {tables.map((table) => (
                    <option key={table.id} value={table.id}>
                      Table {table.id} - {table.status}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginTop: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <label style={{ margin: 0 }}>Items List</label>
                  <button
                    type="button"
                    className="btn add-btn"
                    style={{ padding: "8px 16px", fontSize: "13px" }}
                    onClick={addItemToNewOrder}
                  >
                    + Add Item
                  </button>
                </div>

                {newOrder.items.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {newOrder.items.map((item, index) => (
                      <div
                        key={item.id}
                        style={{
                          border: "1px solid var(--border-color)",
                          borderRadius: "8px",
                          padding: "12px",
                          background: "var(--bg-secondary)",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <strong>Item #{index + 1}</strong>
                          <button
                            type="button"
                            onClick={() => removeItemFromNewOrder(item.id)}
                            style={{
                              background: "var(--danger-color)",
                              color: "white",
                              border: "none",
                              borderRadius: "6px",
                              padding: "4px 12px",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                          >
                            Remove
                          </button>
                        </div>

                        <div style={{ display: "grid", gap: "8px" }}>
                          <div>
                            <label style={{ fontSize: "13px", display: "block", marginBottom: "4px" }}>
                              Product *
                            </label>
                            <select
                              value={item.product_id}
                              onChange={(e) =>
                                updateItemInNewOrder(
                                  item.id,
                                  "product_id",
                                  parseInt(e.target.value)
                                )
                              }
                              required
                              style={{ width: "100%" }}
                            >
                              <option value="">-- Select Product --</option>
                              {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.name} - {p.price?.toLocaleString("en-US")}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                            <div>
                              <label style={{ fontSize: "13px", display: "block", marginBottom: "4px" }}>
                                Quantity
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  updateItemInNewOrder(
                                    item.id,
                                    "quantity",
                                    parseInt(e.target.value)
                                  )
                                }
                                required
                              />
                            </div>

                            <div>
                              <label style={{ fontSize: "13px", display: "block", marginBottom: "4px" }}>
                                Subtotal
                              </label>
                              <input
                                type="text"
                                value={calculateSubtotal(item).toLocaleString("en-"}US") + "
                                disabled
                                style={{ background: "#f0f0f0", cursor: "not-allowed" }}
                              />
                            </div>

                            <div>
                              <label style={{ fontSize: "13px", display: "block", marginBottom: "4px" }}>
                                Notes
                              </label>
                              <input
                                type="text"
                                value={item.notes}
                                onChange={(e) =>
                                  updateItemInNewOrder(item.id, "notes", e.target.value)
                                }
                                placeholder="Notes"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ textAlign: "center", color: "var(--text-secondary)", padding: "20px" }}>
                    No items yet. Click "Add Item" to add.
                  </p>
                )}
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn save-btn">
                  Create Order
                </button>
                <button
                  type="button"
                  className="btn cancel-btn"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewOrder({ table_id: "", items: [] });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditForm && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: "700px" }}>
            <h2>Edit Order #{editOrder.id}</h2>
            <form onSubmit={handleUpdateSubmit}>
              <div>
                <label>Table</label>
                <select
                  value={editOrder.table_id || editOrder.table?.id || ""}
                  onChange={(e) =>
                    setEditOrder({
                      ...editOrder,
                      table_id: parseInt(e.target.value),
                    })
                  }
                  required
                >
                  <option value="">-- Select Table --</option>
                  {tables.map((table) => (
                    <option key={table.id} value={table.id}>
                      Table {table.id} - {table.status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Status</label>
                <select
                  value={editOrder.status || ""}
                  onChange={(e) =>
                    setEditOrder({ ...editOrder, status: e.target.value })
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Processed">Processed</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Canceled">Canceled</option>
                </select>
              </div>

              <div style={{ marginTop: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <label style={{ margin: 0 }}>Items List</label>
                  <button
                    type="button"
                    className="btn add-btn"
                    style={{ padding: "8px 16px", fontSize: "13px" }}
                    onClick={addItemToEditOrder}
                  >
                    + Add Item
                  </button>
                </div>

                {editOrder.items && editOrder.items.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {editOrder.items.map((item, index) => (
                      <div
                        key={item.id}
                        style={{
                          border: "1px solid var(--border-color)",
                          borderRadius: "8px",
                          padding: "12px",
                          background: "var(--bg-secondary)",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <strong>Item #{index + 1}</strong>
                          <button
                            type="button"
                            onClick={() => removeItemFromEditOrder(item.id)}
                            style={{
                              background: "var(--danger-color)",
                              color: "white",
                              border: "none",
                              borderRadius: "6px",
                              padding: "4px 12px",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                          >
                            Remove
                          </button>
                        </div>

                        <div style={{ display: "grid", gap: "8px" }}>
                          <div>
                            <label style={{ fontSize: "13px", display: "block", marginBottom: "4px" }}>
                              Product *
                            </label>
                            <select
                              value={item.product_id || item.product?.id || ""}
                              onChange={(e) =>
                                updateItemInEditOrder(
                                  item.id,
                                  "product_id",
                                  parseInt(e.target.value)
                                )
                              }
                              required
                              style={{ width: "100%" }}
                            >
                              <option value="">-- Select Product --</option>
                              {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.name} - {p.price?.toLocaleString("en-US")}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                            <div>
                              <label style={{ fontSize: "13px", display: "block", marginBottom: "4px" }}>
                                Quantity
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  updateItemInEditOrder(
                                    item.id,
                                    "quantity",
                                    parseInt(e.target.value)
                                  )
                                }
                                required
                              />
                            </div>

                            <div>
                              <label style={{ fontSize: "13px", display: "block", marginBottom: "4px" }}>
                                Subtotal
                              </label>
                              <input
                                type="text"
                                value={calculateEditSubtotal(item).toLocaleString("en-"}US") + "
                                disabled
                                style={{ background: "#f0f0f0", cursor: "not-allowed" }}
                              />
                            </div>

                            <div>
                              <label style={{ fontSize: "13px", display: "block", marginBottom: "4px" }}>
                                Notes
                              </label>
                              <input
                                type="text"
                                value={item.notes || ""}
                                onChange={(e) =>
                                  updateItemInEditOrder(item.id, "notes", e.target.value)
                                }
                                placeholder="Notes"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ textAlign: "center", color: "var(--text-secondary)", padding: "20px" }}>
                    No items yet. Click "Add Item" to add.
                  </p>
                )}
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn save-btn">
                  Update
                </button>
                <button
                  type="button"
                  className="btn cancel-btn"
                  onClick={() => setShowEditForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Dialog */}
      {showDetailsDialog && (
        <div 
          className="modal-overlay" 
          style={{ justifyContent: 'flex-end', alignItems: 'stretch' }}
        >
          <div className="order-details-sidebar">
            <div className="order-details-header">
              <div>
                <h2>Order Details</h2>
                <p className="order-id">#{editOrder.id}</p>
              </div>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowDetailsDialog(false);
                  setOrderItems([]);
                }}
              >
                
              </button>
            </div>

            <div className="order-info-section">
              <div className="info-row">
                <span className="info-label">Table</span>
                <span className="info-value">Table {editOrder.table?.'}</span>id || '
              </div>
              <div className="info-row">
                <span className="info-label">Status</span>
                <span className={`status-badge status-${editOrder.status?.toLowerCase()}`}>
                  {editOrder.status}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Created At</span>
                <span className="info-value">
                  {editOrder.createdAt ? new Date(editOrder.createdAt).toLocaleString('en-'}US') : '
                </span>
              </div>
            </div>

            <div className="order-items-section">
              <h3 className="section-title">
              </h3>                
              <div className="items-list">
                {orderItems.length > 0 ? (
                  orderItems.map((item) => (
                    <div key={item.id} className="order-item-card">
                      <div className="item-header">
                        <div className="item-info">
                          <h4 className="item-name">{item.product?.'}</h4>name || '
                          <p className="item-quantity">Quantity: {item.quantity}</p>
                        </div>
                        <div className="item-price">
                          <p className="item-unit-price">
                            {item.product?.price?.toLocaleString("en-/itemUS")}
                          </p>
                          <p className="item-total-price">
                            {item.subtotal?.toLocaleString("en-US")}
                          </p>
                        </div>
                      </div>
                      {item.notes && (
                        <p className="item-notes">
                          {item.notes}                          <span className="notes-icon">
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>No items</p>                    <span className="empty-icon">
                  </div>
                )}
              </div>
            </div>

            <div className="order-details-footer">
              <div className="total-section">
                <div className="total-row">
                  <span className="total-label">Total</span>
                  <span className="total-amount">
                    {editOrder.total_amount?.toLocaleString("en-US")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChooseOrder;
