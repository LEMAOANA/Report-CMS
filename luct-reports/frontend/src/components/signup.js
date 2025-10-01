// src/components/Signup.js

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../services/api"; // service uses REACT_APP_BASE_URL
import "./signup.css";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    role: "student",
  });

  const [roles] = useState([
    "student",
    "lecturer",
    "principal_lecturer",
    "program_leader",
  ]); // Admin removed

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await signup(formData); // Hits deployed backend automatically

      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("user", JSON.stringify(data.user));

        switch (data.user.role) {
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
          default:
            navigate("/home");
        }
      } else {
        setError("Signup failed. Please check your details.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  // Optional: log which backend is being used
  console.log("Signup backend:", process.env.REACT_APP_BASE_URL);

  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <h2>Create an Account</h2>
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

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

          <input
            type="password"
            name="passwordConfirm"
            placeholder="Confirm Password"
            value={formData.passwordConfirm}
            onChange={handleChange}
            required
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role.replace("_", " ").toUpperCase()}
              </option>
            ))}
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="login-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
