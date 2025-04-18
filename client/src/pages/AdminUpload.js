import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AdminUpload.css";

const AdminUpload = () => {
  const navigate = useNavigate();
  const [foodData, setFoodData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    discount: "",
    finalPrice: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      alert("Access denied. Admins only.");
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...foodData, [name]: value };

    const price = parseFloat(updatedData.price);
    const discount = parseFloat(updatedData.discount);
    const final = parseFloat(updatedData.finalPrice);

    if ((name === "price" || name === "discount") && !isNaN(price) && !isNaN(discount)) {
      updatedData.finalPrice = Math.round(price - (price * discount) / 100).toString();
    } else if ((name === "finalPrice" || name === "discount") && !isNaN(final) && !isNaN(discount)) {
      updatedData.price = Math.round(final / (1 - discount / 100)).toString();
    }

    setFoodData(updatedData);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return alert("Please select an image file.");

    const formData = new FormData();
    Object.entries(foodData).forEach(([key, value]) => formData.append(key, value));
    formData.append("image", imageFile);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/food/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("✅ Food item uploaded!");
      setFoodData({
        name: "",
        price: "",
        category: "",
        description: "",
        discount: "",
        finalPrice: "",
      });
      setImageFile(null);
      setImagePreview(null);
      document.getElementById("image-input").value = ""; // Reset file input
    } catch (err) {
      console.error(err);
      alert("❌ Failed to upload food item.");
    }
  };

  return (
    <div className="admin-upload-container">
      <h2>🍱 Admin: Upload Food Item</h2>
      <form onSubmit={handleSubmit} className="admin-upload-form">
        <input type="text" name="name" placeholder="Food Name" value={foodData.name} onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price" value={foodData.price} onChange={handleChange} step="1" required />
        <input type="number" name="discount" placeholder="Discount (%)" value={foodData.discount} onChange={handleChange} step="1" />
        <input type="number" name="finalPrice" placeholder="Final Price" value={foodData.finalPrice} onChange={handleChange} step="1" />
        <input type="text" name="category" placeholder="Category" value={foodData.category} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={foodData.description} onChange={handleChange} required />

        <input
          id="image-input"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
        />

        {imagePreview && (
          <img
            src={imagePreview}
            alt="preview"
            style={{ width: 150, marginTop: 10, borderRadius: 8 }}
          />
        )}

        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default AdminUpload;
