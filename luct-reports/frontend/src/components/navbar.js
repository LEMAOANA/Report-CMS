import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleProfile = () => setProfileOpen(!profileOpen);

  // List of all dashboards + home
  const dashboardLinks = [
    { role: "all", path: "/", label: "Home" }, // always visible
    { role: "student", path: "/student", label: "Student" },
    { role: "lecturer", path: "/lecturer", label: "Lecturer" },
    { role: "principal_lecturer", path: "/principal", label: "Principal Lecturer" },
    { role: "program_leader", path: "/leader", label: "Program Leader" },
    { role: "admin", path: "/admin", label: "Admin" },
  ];

  // Filter links: admin only sees admin, everyone sees others + home
  const availableLinks = dashboardLinks.filter(link => {
    if (link.role === "admin") return user?.role === "admin";
    return true; // home and other dashboards are always visible
  });

  return (
    <nav className="navbar-modern">
      <div className="navbar-left" onClick={() => navigate("/")}>
        <span className="logo">LUCT REPORTS</span>
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
            <div className="avatar">{user.username.charAt(0).toUpperCase()}</div>
            <div className="user-info">
              <span className="user-name">{user.username}</span>
              <span className={`user-role role-${user.role.replace("_", "-")}`}>
                {user.role.replace("_", " ")}
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
