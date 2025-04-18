import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/TrackOrders.css"; // Optional if you want separate styling

const TrackOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/order/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="track-orders">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Ordered At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <ul>
              {order.items.map(({ itemId, quantity }) => (
                <li key={itemId._id}>
                  <img
                    src={`data:image/jpeg;base64,${itemId.image}`}
                    alt={itemId.name}
                    className="order-img"
                  />
                  <span>{itemId.name} × {quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default TrackOrders;
