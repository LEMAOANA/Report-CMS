import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./navbar.css";
import Logo from "./assets/LOGO2.png"; // ✅ import logo

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || null;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleProfile = () => setProfileOpen(!profileOpen);

  const dashboardLinks = [
    { role: "all", path: "/", label: "Home" },
    { role: "student", path: "/student", label: "Student" },
    { role: "lecturer", path: "/lecturer", label: "Lecturer" },
    { role: "principal_lecturer", path: "/principal", label: "Principal Lecturer" },
    { role: "program_leader", path: "/leader", label: "Program Leader" },
    { role: "admin", path: "/admin", label: "Admin" },
  ];

  const availableLinks = dashboardLinks.filter(link => {
    if (link.role === "admin") return user?.role === "admin";
    return true;
  });

  return (
    <nav className="navbar-modern">
      {/* ✅ Logo + Text */}
      <div className="navbar-left" onClick={() => navigate("/")}>
        <img src={Logo} alt="Logo" className="navbar-logo" />
        <span className="brand-text">LUCT REPORTS</span>
      </div>

      <div className={`navbar-center ${menuOpen ? "open" : ""}`}>
        {availableLinks.map(link => (
          <button
            key={link.path}
            className="nav-link"
            onClick={() => navigate(link.path)}
          >
            {link.label}
          </button>
        ))}
      </div>

      {user && (
        <div className="navbar-right">
          <div className="profile-container" onClick={toggleProfile}>
            <div className="avatar">{user?.username?.charAt(0)?.toUpperCase() || "U"}</div>
            <div className="user-info">
              <span className="user-name">{user?.username || "User"}</span>
              <span className={`user-role role-${user?.role?.replace("_", "-") || ""}`}>
                {user?.role?.replace("_", " ") || ""}
              </span>
            </div>
          </div>

          {profileOpen && (
            <div className="profile-dropdown">
              <button onClick={() => navigate("#")}>Profile</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}

          <button className="menu-toggle" onClick={toggleMenu}>
            ☰
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
