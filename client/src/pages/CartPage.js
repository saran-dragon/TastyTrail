import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import ShimmerLoader from "../components/ShimmerLoader";
import axios from "axios";
import "../styles/CartPage.css";

const CartPage = () => {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading delay or wait for actual cart fetch if needed
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 800); // customize timing if needed

    return () => clearTimeout(timeout);
  }, [cartItems]);

  const total = cartItems.reduce(
    (sum, item) => sum + item.finalPrice * item.quantity,
    0
  );

  const handleOrderNow = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/payment");
  };

  return (
    <div className="cart-container">
      <h1 className="cart-title">🛒 Your Cart</h1>

      {loading ? (
  <div className="loader-wrapper">
    <ShimmerLoader/>
  </div>
) : cartItems.length === 0 ? (
        <p className="cart-empty">Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <div className="item-details">
                <h2>{item.name}</h2>
                <div className="qty-controls">
                  <button onClick={() => decreaseQuantity(item._id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item._id)}>+</button>
                </div>
                <p className="item-price">
                  ₹{item.finalPrice * item.quantity}
                </p>
              </div>
              <button
                onClick={() => removeFromCart(item._id)}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="cart-summary">
            <p>Total: ₹{total}</p>
            <button className="order-btn" onClick={handleOrderNow}>
              Order Now
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
