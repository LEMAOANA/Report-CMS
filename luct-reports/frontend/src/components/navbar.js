import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h1>LUCT REPORTS</h1>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/student">Student</Link></li>
        <li><Link to="/lecturer">Lecturer</Link></li>
        <li><Link to="/principal">Principal</Link></li>
        <li><Link to="/leader"> Leader</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
