import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ShimmerLoader from "../components/ShimmerLoader";
import "../styles/Favorites.css";

const Favorites = () => {
  const [favoriteFoods, setFavoriteFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { cartItems, addToCart, removeFromCart } = useCart();

  const isInCart = useCallback(
    (id) => cartItems.some((item) => item._id === id),
    [cartItems]
  );

  useEffect(() => {
    if (!token) return navigate("/login");

    const fetchFavorites = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/auth/favorites`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setFavoriteFoods(res.data || []);
      } catch (err) {
        console.error("Failed to load favorites", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [token, navigate]);

  const toggleFavorite = async (foodId) => {
    if (!token) return navigate("/login");
    setUpdating(true);

    const isFav = favoriteFoods.some((food) => food._id === foodId);
    const method = isFav ? "delete" : "put";
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/auth/favorites/${foodId}`;

    try {
      const res = await axios({
        method,
        url,
        headers: { Authorization: `Bearer ${token}` },
      });

      setFavoriteFoods(res.data.favorites || []);
    } catch (err) {
      console.error("Failed to update favorites:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleCartToggle = (food) => {
    if (isInCart(food._id)) {
      removeFromCart(food._id);
    } else {
      addToCart(food);
    }
  };

  if (loading) {
    return (
      <div className="favorites-container loader-wrapper">
        <ShimmerLoader />
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <h2>My Favorites ❤️</h2>
      {favoriteFoods.length === 0 ? (
        <p>You haven't added any favorites yet.</p>
      ) : (
        <div className="favorites-grid">
          {favoriteFoods.map((food) => (
            <div key={food._id} className="favorite-card">
              <img
                src={
                  food.image?.data
                    ? `data:${food.image.contentType};base64,${food.image.data}`
                    : "/placeholder.jpg"
                }
                alt={food.name}
                className="favorite-img"
                onError={(e) => (e.target.src = "/placeholder.jpg")}
              />

              <h3>{food.name}</h3>
              <p>{food.description}</p>
              <span>₹{food.finalPrice}</span>

              <div className="favorite-actions">
                <button
                  className="like-btn"
                  onClick={() => toggleFavorite(food._id)}
                  disabled={updating}
                  aria-label={
                    favoriteFoods.some((f) => f._id === food._id)
                      ? "Unfavorite"
                      : "Favorite"
                  }
                >
                  {favoriteFoods.some((f) => f._id === food._id) ? "💔" : "❤️"}
                </button>

                <button
                  className={`add-cart-btn ${
                    isInCart(food._id) ? "remove" : "add"
                  }`}
                  onClick={() => handleCartToggle(food)}
                >
                  {isInCart(food._id) ? "Remove 🗑️" : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
