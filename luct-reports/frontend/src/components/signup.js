import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../services/api";
import "./signup.css";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    role: "student",
  });

  const [roles, setRoles] = useState([
    "student",
    "lecturer",
    "program_leader",
    "principal_lecturer"
  ]); // Admin removed

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Optional: Check if admin exists on load (so you could later show admin-only role)
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/users");
        const data = await res.json();
        if (data.users.some(u => u.role === "admin")) {
          console.log("Admin exists, signup will not allow admin role");
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkAdmin();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") checkPasswordStrength(value);
    if (name === "email") setEmailValid(emailRegex.test(value));
  };

  const checkPasswordStrength = (password) => {
    if (password.length < 6) setPasswordStrength("Weak");
    else if (/[A-Z]/.test(password) && /\d/.test(password) && /[@$!%*?&]/.test(password))
      setPasswordStrength("Strong");
    else setPasswordStrength("Medium");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      setError("Passwords do not match.");
      return;
    }

    if (passwordStrength === "Weak") {
      setError("Please choose a stronger password.");
      return;
    }

    try {
      setLoading(true);
      const data = await signup(formData);

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
        setError("Signup failed. Please try again.");
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
            className={!emailValid ? "invalid" : ""}
          />
          {!emailValid && <p className="error">Invalid email format.</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {formData.password && (
            <p className={`strength ${passwordStrength.toLowerCase()}`}>
              Password Strength: {passwordStrength}
            </p>
          )}

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
            {roles.map(role => (
              <option key={role} value={role}>
                {role.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </select>

          <button type="submit" disabled={loading || !emailValid}>
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
