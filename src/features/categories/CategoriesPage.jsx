import React, { useEffect, useState } from "react";
import categoriesApi from "./api/categoriesApi";
import CreateCategory from "./components/CreateCategory";
import ReadCategories from "./components/ReadCategories";
import UpdateCategory from "./components/UpdateCategory";
import DeleteCategory from "./components/DeleteCategory";
import "./Categories.css";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    categoriesApi
      .read()
      .then((res) => setCategories(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  // Filter categories based on search term
  const filteredCategories = categories.filter(category => {
    const searchLower = searchTerm.toLowerCase();
    return (
      category.id?.toString().includes(searchLower) ||
      category.name?.toLowerCase().includes(searchLower)
    );
  });

  const handleCreate = (newCat) => {
    categoriesApi
      .create(newCat)
      .then((res) => setCategories([...categories, res.data.data]))
      .catch((err) => console.error(err));
  };

  const handleUpdate = (cat) => {
    categoriesApi
      .update(cat.id, cat)
      .then((res) => {
        setCategories(
          categories.map((c) => (c.id === cat.id ? res.data.data : c))
        );
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = (id) => {
    categoriesApi
      .delete(id)
      .then(() => {
        setCategories(categories.filter((c) => c.id !== id));
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <div className="container">
        <h1 className="title">Product Categories</h1>
        <p className="breadcrumb">Home / Products / Category List</p>
        <div className="actions">
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Search by ID or name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn filter-btn">Filter</button>
          <button className="btn add-btn" onClick={() => setShowAdd(true)}>
            + Add New Category
          </button>
        </div>

        <ReadCategories
          categories={filteredCategories}
          onEdit={setEditing}
          onDelete={(id) =>
            setDeleting(categories.find((cat) => cat.id === id))
          }
        />

        {showAdd && (
          <CreateCategory
            onCreate={handleCreate}
            onClose={() => setShowAdd(false)}
          />
        )}

        {editing && (
          <UpdateCategory
            category={editing}
            onUpdate={handleUpdate}
            onClose={() => setEditing(null)}
          />
        )}

        {deleting && (
          <DeleteCategory
            category={deleting}
            onDelete={handleDelete}
            onClose={() => setDeleting(null)}
          />
        )}
      </div>
    </>
  );
};

export default CategoriesPage;
