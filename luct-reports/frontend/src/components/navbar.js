import React from "react";
import { useNavigate } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  const navigate = useNavigate();

  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/"); // redirect to login page
  };

  return (
    <nav className="navbar-simple">
      {user && (
        <div className="navbar-content">
          <div className="user-info-container">
            <span className="user-name">{user.username}</span>
            <span className="user-role">{user.role}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
