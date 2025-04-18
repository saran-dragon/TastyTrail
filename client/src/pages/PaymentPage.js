import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../styles/PaymentPage.css"; // Create this CSS file for styling

const PaymentPage = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("card");

  const total = cartItems.reduce(
    (sum, item) => sum + item.finalPrice * item.quantity,
    0
  );

  const handlePayment = () => {
    if (cartItems.length === 0) {
      alert("Cart is empty!");
      return navigate("/");
    }

    alert(`✅ Payment successful via ${paymentMethod.toUpperCase()}!`);
    navigate("/"); // Go to home without clearing cart
  };

  // const handlePayment = async () => {
  //   if (cartItems.length === 0) {
  //     alert("Cart is empty!");
  //     return navigate("/");
  //   }
  
  //   try {
  //     const token = localStorage.getItem("token");
  
  //     const res = await axios.post(
  //       "/api/order/place",
  //       {}, // 🔒 Empty body; backend uses stored cart
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  
  //     alert(`✅ Payment successful via ${paymentMethod.toUpperCase()}!`);
  //     navigate("/track");
  //   } catch (error) {
  //     console.error("Order placement error:", error.response?.data || error.message);
  //     alert("❌ Failed to place order after payment. Try again.");
  //   }
  // };
  

  return (
    <div className="payment-container">
      <h2 className="payment-title">💳 Choose Payment Method</h2>
      <p className="payment-total">Total Amount: <strong>₹{total}</strong></p>

      <div className="payment-methods">
        <label>
          <input
            type="radio"
            value="card"
            checked={paymentMethod === "card"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Credit/Debit Card
        </label>
        <label>
          <input
            type="radio"
            value="upi"
            checked={paymentMethod === "upi"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          UPI
        </label>
        <label>
          <input
            type="radio"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Cash on Delivery
        </label>
      </div>

      {/* Show input fields based on selected method */}
      {paymentMethod === "card" && (
        <div className="payment-form">
          <input type="text" placeholder="Card Number" />
          <input type="text" placeholder="Expiry Date" />
          <input type="text" placeholder="CVV" />
        </div>
      )}

      {paymentMethod === "upi" && (
        <div className="payment-form">
          <input type="text" placeholder="Enter UPI ID (e.g. user@upi)" />
        </div>
      )}

      {paymentMethod === "cod" && (
        <div className="payment-note">
          <p>You will pay at the time of delivery.</p>
        </div>
      )}

      <button className="pay-button" onClick={handlePayment}>
        Pay Now
      </button>
    </div>
  );
};

export default PaymentPage;
