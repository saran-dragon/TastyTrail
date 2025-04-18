import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/FoodList.css";
import ShimmerLoader from "../components/ShimmerLoader";

const FoodList = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, removeFromCart, cartItems } = useCart();

  const user = getUser();
  const token = localStorage.getItem("token");
  const isAdmin = user?.role === "admin";

  const searchQuery =
    new URLSearchParams(location.search).get("search")?.toLowerCase() || "";

  function getUser() {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const foodRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/food`);
        setFoodItems(foodRes.data);
      } catch (err) {
        console.error("Error fetching food items:", err);
      }

      if (token) {
        try {
          const favRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setFavorites(normalizeFavorites(favRes.data?.favorites));
        } catch (err) {
          console.error("Error fetching favorites:", err);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [token]);

  const normalizeFavorites = (favs) => {
    if (!favs) return [];
    return favs.map((f) => (typeof f === "string" ? f : f._id));
  };

  const handleAddToCart = (food) => {
    if (!token) return navigate("/login");
    addToCart(food);
  };

  const handleRemoveFromCart = (id) => {
    removeFromCart(id);
  };

  const handleEditRedirect = () => navigate("/admin/manage-foods");

  const isFavorite = (foodId) => favorites.includes(foodId);
  const isInCart = (id) => cartItems.some((item) => item._id === id);

  const toggleFavorite = async (foodId) => {
    if (!token) return navigate("/login");
    setLoadingFavorites(true);

    const isFav = isFavorite(foodId);
    const method = isFav ? "delete" : "put";
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/auth/favorites/${foodId}`;

    try {
      const res = await axios({
        method,
        url,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFavorites(normalizeFavorites(res.data?.favorites));
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      alert("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoadingFavorites(false);
    }
  };

  const filteredFoodItems = foodItems.filter((food) =>
    food.name.toLowerCase().includes(searchQuery) ||
    food.description.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="food-grid">
      {loading ? (
        <div className="loader-wrapper">
          <ShimmerLoader />
        </div>
      ) : filteredFoodItems.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          No results found for: <strong>{searchQuery}</strong>
        </p>
      ) : (
        filteredFoodItems.map((food) => (
          <div key={food._id} className="food-card">
            <img
              src={
                food.image?.startsWith("data:image") || food.image?.startsWith("http")
                  ? food.image
                  : "https://via.placeholder.com/150?text=No+Image"
              }
              alt={food.name}
              className="food-img"
            />

            <h2 className="food-name">{food.name}</h2>

            <div className="price-section">
              {food.discount > 0 && <span className="discount-badge">-{food.discount}%</span>}
              <div className="prices">
                {food.discount > 0 && <span className="old-price">₹{food.price}</span>}
                <span className="final-price">₹{food.finalPrice}</span>
              </div>
            </div>

            <p className="food-desc">{food.description}</p>

            {isAdmin ? (
              <button className="edit-btn" onClick={handleEditRedirect}>
                Edit
              </button>
            ) : (
              <div className="food-actions">
                {isInCart(food._id) ? (
                  <button className="remove-btn" onClick={() => handleRemoveFromCart(food._id)}>
                    Remove 🗑️
                  </button>
                ) : (
                  <button className="add-btn" onClick={() => handleAddToCart(food)}>
                    Add to Cart
                  </button>
                )}
                <button
                  className="fav-btn"
                  onClick={() => toggleFavorite(food._id)}
                  disabled={loadingFavorites}
                >
                  {isFavorite(food._id) ? "❤️" : "🤍"}
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default FoodList;
