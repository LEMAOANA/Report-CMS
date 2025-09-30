import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleProfile = () => setProfileOpen(!profileOpen);

  const dashboardLinks = [
    { role: "student", path: "/student", label: "Student Dashboard" },
    { role: "lecture", path: "/lecturer", label: "Lecturer Dashboard" },
    { role: "principal_lecture", path: "/principal", label: "Principal Dashboard" },
    { role: "program_leader", path: "/leader", label: "Leader Dashboard" },
    { role: "admin", path: "/admin", label: "Admin Dashboard" },
  ];

  const availableLinks = dashboardLinks.filter(link => link.role === user?.role);

  return (
    <nav className="navbar-modern">
      <div className="navbar-left" onClick={() => navigate("/")}>
        <span className="logo">LUCT Reports</span>
      </div>

      <div className={`navbar-center ${menuOpen ? "open" : ""}`}>
        {user
          ? availableLinks.map(link => (
              <button
                key={link.path}
                className="nav-link"
                onClick={() => navigate(link.path)}
              >
                {link.label}
              </button>
            ))
          : (
            <>
              <button className="nav-link" onClick={() => navigate("/login")}>Login</button>
            </>
          )
        }
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
