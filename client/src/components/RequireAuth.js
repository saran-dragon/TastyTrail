// components/RequireAuth.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const RequireAuth = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); // assumes you're storing user info on login

  if (!token) return <Navigate to="/login" />;

  // If role is required (admin), check it
  if (role && user?.role !== role) return <Navigate to="/" />;

  return children;
};

export default RequireAuth;
