import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");
  const [user, setUser] = useState(getSafeUser());
  const [hasMounted, setHasMounted] = useState(false);

  const token = localStorage.getItem("token");
  const isAdmin = user?.role === "admin";

  function getSafeUser() {
    try {
      const stored = localStorage.getItem("user");
      if (!stored || stored === "undefined" || stored === "null") return null;
      return JSON.parse(stored);
    } catch (err) {
      return null;
    }
  }

  useEffect(() => {
    setHasMounted(true);
    const syncUser = () => setUser(getSafeUser());
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("search");
    setSearch(query || "");
  }, [location.search]);

  useEffect(() => {
    if (!hasMounted || location.pathname !== "/") return;

    const delay = setTimeout(() => {
      const params = new URLSearchParams(location.search);
      if (search.trim()) {
        params.set("search", search.trim());
      } else {
        params.delete("search");
      }
      navigate(`/?${params.toString()}`, { replace: true });
    }, 400);

    return () => clearTimeout(delay);
  }, [search, location.pathname, location.search, hasMounted, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    clearCart();
    setUser(null);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Top Navbar */}
      <div className="navbar-top">
        <Link to="/" className="logo">
          {/* <span role="img" aria-label="logo">🍴</span> */}
          <span role="img" aria-label="logo">
            <img src="./images/logo.png" alt="logo" className="logo-img" />
          </span>
          {/* <span className="logo-text">Foodie</span> */}
        </Link>

        {!isAdmin && (
          <div className="search-container">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search food..."
              className="search-input"
            />
            {search && <button className="clear-btn" onClick={() => setSearch("")}>❌</button>}
            <span className="search-icon">🔍</span>
          </div>
        )}

        <div className="auth-section">
          {!token ? (
            <Link to="/login" className="auth-btn">Login</Link>
          ) : (
            <button onClick={handleLogout} className="auth-btn">Logout</button>
          )}
        </div>
      </div>

      {/* Bottom Navbar */}
      <div className="navbar-bottom">
        {!isAdmin ? (
          <>
            <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`} title="Home">🏠</Link>
            <Link to="/favorites" className={`nav-link ${isActive("/favorites") ? "active" : ""}`} title="Favorites">❤️</Link>
            <Link to="/cart" className={`nav-link ${isActive("/cart") ? "active" : ""}`} title="Cart">
              🛒
              {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
            </Link>
            <Link to="/track" className={`nav-link ${isActive("/track") ? "active" : ""}`} title="Track Order">📦</Link>
          </>
        ) : (
          <>
            <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`} title="Home">🏠</Link>
            <Link to="/admin-upload" className={`nav-link ${isActive("/admin-upload") ? "active" : ""}`} title="Upload">📝</Link>
            <Link to="/admin/manage-foods" className={`nav-link ${isActive("/admin/manage-foods") ? "active" : ""}`} title="Manage">🧾</Link>
            <Link to="/admin-orders" className={`nav-link ${isActive("/admin-orders") ? "active" : ""}`} title="Orders">📦</Link>
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;
