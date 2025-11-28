import React, { useState, useEffect } from "react";
import {
  getProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./api/productsApi";
import ReadProducts from "./components/ReadProducts";
import CreateProduct from "./components/CreateProduct";
import UpdateProduct from "./components/UpdateProduct";
import DeleteProduct from "./components/DeleteProduct";
import "./Products.css";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = () => {
    getProducts().then((res) => setProducts(res.data?.data || []));
    getCategories().then((res) => setCategories(res.data?.data || []));
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter products based on search term
  const filteredProducts = products.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.id?.toString().includes(searchLower) ||
      product.name?.toLowerCase().includes(searchLower) ||
      product.description?.toLowerCase().includes(searchLower) ||
      product.category?.name?.toLowerCase().includes(searchLower) ||
      product.price?.toString().includes(searchLower)
    );
  });

  const handleCreate = (product) => {
    createProduct(product).then(() => {
      loadData();
      setShowCreate(false);
    });
  };

  const handleUpdate = (product) => {
    updateProduct(product.id, product).then(() => {
      loadData();
      setEditing(null);
    });
  };

  const handleDelete = (id) => {
    deleteProduct(id).then(() => {
      loadData();
      setDeleting(null);
    });
  };

  return (
    <div className="container">
      <h1>Products</h1>
      <div className="actions">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search by name, category, price..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn add-btn" onClick={() => setShowCreate(true)}>+ Add Product</button>
      </div>

      <ReadProducts
        products={filteredProducts}
        onEdit={setEditing}
        onDelete={setDeleting}
      />

      {showCreate && (
        <CreateProduct
          categories={categories}
          onCreate={handleCreate}
          onClose={() => setShowCreate(false)}
        />
      )}

      {editing && (
        <UpdateProduct
          product={editing}
          categories={categories}
          onUpdate={handleUpdate}
          onClose={() => setEditing(null)}
        />
      )}

      {deleting && (
        <DeleteProduct
          id={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
};

export default ProductsPage;
