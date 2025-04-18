import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import AdminUpload from "./pages/AdminUpload";
import CartPage from "./pages/CartPage";
import Login from "./pages/Login";
import { CartProvider } from "./context/CartContext";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import ManageFoods from "./pages/ManageFoods";
import PaymentPage from "./pages/PaymentPage";
import Favorites from "./pages/Favorites";
import TrackOrders from "./pages/TrackOrders";
import AdminOrders from "./pages/AdminOrders";
import ManageOrders from "./pages/ManageOrders";
import RequireAuth from "./components/RequireAuth"; // ✅ Import this

function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/cart"
            element={
              <RequireAuth>
                <CartPage />
              </RequireAuth>
            }
          />
          <Route
            path="/favorites"
            element={
              <RequireAuth>
                <Favorites />
              </RequireAuth>
            }
          />
          <Route
            path="/track"
            element={
              <RequireAuth>
                <TrackOrders />
              </RequireAuth>
            }
          />
          <Route
            path="/payment"
            element={
              <RequireAuth>
                <PaymentPage />
              </RequireAuth>
            }
          />
          <Route
            path="/admin-upload"
            element={
              <RequireAuth role="admin">
                <AdminUpload />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/manage-foods"
            element={
              <RequireAuth role="admin">
                <ManageFoods />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <RequireAuth role="admin">
                <AdminOrders />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/manage-orders"
            element={
              <RequireAuth role="admin">
                <ManageOrders />
              </RequireAuth>
            }
          />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
