import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminOrders.css"; // Optional styling

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/order/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      setUpdating(true);
      const token = localStorage.getItem("token");
      await axios.put(
        "/api/order/status",
        { orderId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchOrders();
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdating(false);
    }
  };

  const getNextStatus = (status) => {
    if (status === "Placed") return "Preparing";
    if (status === "Preparing") return "Delivered";
    return null;
  };

  return (
    <div className="admin-orders">
      <h2>All Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="admin-order-card">
            <p><strong>User:</strong> {order.userId?.username || "Unknown"}</p>
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
            {getNextStatus(order.status) && (
              <button
                onClick={() => updateStatus(order._id, getNextStatus(order.status))}
                disabled={updating}
              >
                Mark as {getNextStatus(order.status)}
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AdminOrders;
