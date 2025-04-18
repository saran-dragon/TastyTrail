import React, { useEffect, useState } from "react";
import axios from "axios";
// import "../styles/ManageOrders.css"; // Optional if you want to style it

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [statusOptions] = useState(["Placed", "Preparing", "Delivered"]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/admin/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, [token]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        "/api/order/status",
        { orderId, status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  return (
    <div className="manage-orders">
      <h2>All Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <p><strong>User:</strong> {order.userId.username || order.userId.email}</p>
            <p><strong>Ordered At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <label>Status: </label>
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(order._id, e.target.value)}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ul>
              {order.items.map(({ itemId, quantity }) => (
                <li key={itemId._id}>
                  <img
                    src={`data:image/jpeg;base64,${itemId.image}`}
                    alt={itemId.name}
                    className="order-img"
                  />
                  {itemId.name} × {quantity}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default ManageOrders;
