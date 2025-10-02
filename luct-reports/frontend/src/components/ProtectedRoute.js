import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthValid } from "../utils/auth";

function ProtectedRoute({ children, role }) {
  const userRole = localStorage.getItem("role");

  // Check if user is logged in and session is still active
  if (!isAuthValid()) {
    return <Navigate to="/login" />;
  }

  // Check if user's role matches the required role
  if (role && userRole !== role) {
    return <Navigate to="/login" />; // or redirect to "Not authorized" page
  }

  return children;
}

export default ProtectedRoute;
