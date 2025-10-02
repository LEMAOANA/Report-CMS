import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../services/api";
import { saveAuth } from "../utils/auth";
import "./signup.css";

function Signup() {
  const [formData, setFormData] = useState({
    username: "", email: "", password: "", passwordConfirm: "", role: "student"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const roles = ["student", "lecturer", "principal_lecturer", "program_leader"];

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleNavigation = (role) => {
    switch (role) {
      case "student": navigate("/student"); break;
      case "lecturer": navigate("/lecturer"); break;
      case "program_leader": navigate("/leader"); break;
      case "principal_lecturer": navigate("/principal"); break;
      default: navigate("/home");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await signup(formData);
      if (data.token && data.user) {
        saveAuth(data);
        handleNavigation(data.user.role);
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

  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <h2>Create an Account</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <input type="password" name="passwordConfirm" placeholder="Confirm Password" value={formData.passwordConfirm} onChange={handleChange} required />
          <select name="role" value={formData.role} onChange={handleChange} required>
            {roles.map(r => <option key={r} value={r}>{r.replace("_", " ").toUpperCase()}</option>)}
          </select>
          <button type="submit" disabled={loading}>{loading ? "Signing up..." : "Sign Up"}</button>
        </form>
        <p className="login-link">Already have an account? <Link to="/login">Login here</Link></p>
      </div>
    </div>
  );
}

export default Signup;
