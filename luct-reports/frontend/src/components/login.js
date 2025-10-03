import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/api";
import { saveAuth } from "../utils/auth";
import "./login.css";
import Logo from "./assets/LOGO2.png";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleNavigation = (role) => {
    switch (role) {
      case "student":
        navigate("/student");
        break;
      case "lecturer":
        navigate("/lecturer");
        break;
      case "program_leader":
        navigate("/leader");
        break;
      case "principal_lecturer":
        navigate("/principal");
        break;
      case "admin":
        navigate("/admin");
        break;
      default:
        navigate("/home");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(formData);
      if (data.token && data.user) {
        saveAuth(data);
        handleNavigation(data.user.role);
      } else {
        setError("Login failed. Check your credentials.");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* Logo at the top */}
        <div className="login-logo">
          <img src={Logo} alt="App Logo" />
        </div>

        <h2>Login</h2>
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
