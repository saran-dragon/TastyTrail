import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ManageFoods.css";

const ManageFoods = () => {
  const [foods, setFoods] = useState([]);
  const [editingFoodId, setEditingFoodId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/food`);
      setFoods(res.data);
    } catch (err) {
      console.error("Failed to fetch foods", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/food/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFoods();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleEditClick = (food) => {
    setEditingFoodId(food._id);
    setEditForm({
      name: food.name,
      price: food.price,
      discount: food.discount,
      finalPrice: food.finalPrice,
      category: food.category,
      description: food.description,
      image: null, // New image will be uploaded if selected
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleUpdate = async (id) => {
    try {
      const formData = new FormData();
      Object.entries(editForm).forEach(([key, value]) => {
        if (value !== null) formData.append(key, value);
      });

      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/food/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setEditingFoodId(null);
      fetchFoods();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <div className="manage-container">
      <h1>Manage Foods</h1>
      {foods.length === 0 ? (
        <p>Loading foods...</p>
      ) : (
        <div className="manage-grid">
          {foods.map((food) => (
            <div key={food._id} className="manage-card">
              <img
                src={food.image || "https://via.placeholder.com/150"}
                alt={food.name}
                className="manage-img"
              />

              {editingFoodId === food._id ? (
                <>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleChange}
                    placeholder="Name"
                  />
                  <input
                    type="number"
                    name="price"
                    value={editForm.price}
                    onChange={handleChange}
                    placeholder="Price"
                  />
                  <input
                    type="number"
                    name="discount"
                    value={editForm.discount}
                    onChange={(e) => {
                      const discount = e.target.value;
                      const finalPrice =
                        editForm.price - (editForm.price * discount) / 100;
                      setEditForm((prev) => ({
                        ...prev,
                        discount,
                        finalPrice: Math.round(finalPrice),
                      }));
                    }}
                    placeholder="Discount %"
                  />
                  <input
                    type="number"
                    name="finalPrice"
                    value={editForm.finalPrice}
                    onChange={handleChange}
                    placeholder="Final Price"
                  />
                  <input
                    type="text"
                    name="category"
                    value={editForm.category}
                    onChange={handleChange}
                    placeholder="Category"
                  />
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleChange}
                    placeholder="Description"
                  />
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                  />
                  <button
                    onClick={() => handleUpdate(food._id)}
                    className="update-btn"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <h3>{food.name}</h3>
                  <p>
                    ₹{food.finalPrice}{" "}
                    {food.discount > 0 && (
                      <span className="strike">₹{food.price}</span>
                    )}
                  </p>
                  <p>{food.description}</p>
                  <div className="btn-group">
                    <button
                      onClick={() => handleEditClick(food)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(food._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageFoods;
