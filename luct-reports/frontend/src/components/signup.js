import React, { useState } from "react";
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

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const navigate = useNavigate();

  // Regex for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      checkPasswordStrength(value);
    }

    if (name === "email") {
      setEmailValid(emailRegex.test(value));
    }
  };

  const checkPasswordStrength = (password) => {
    if (password.length < 6) {
      setPasswordStrength("Weak");
    } else if (/[A-Z]/.test(password) && /\d/.test(password) && /[@$!%*?&]/.test(password)) {
      setPasswordStrength("Strong");
    } else {
      setPasswordStrength("Medium");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Email validation before submit
    if (!emailRegex.test(formData.email)) {
      setError("❌ Please enter a valid email address.");
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      setError("❌ Passwords do not match.");
      return;
    }

    if (passwordStrength === "Weak") {
      setError("❌ Please choose a stronger password.");
      return;
    }

    try {
      setLoading(true);
      const data = await signup(formData);
      console.log("Signup response:", data);

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);

        // Redirect based on role
        switch (data.user.role) {
          case "student":
            navigate("/student");
            break;
          case "lecture":
            navigate("/lecturer");
            break;
          case "program_leader":
            navigate("/leader");
            break;
          case "principal_lecture":
            navigate("/principal");
            break;
          case "admin":
            navigate("/admin");
            break;
          default:
            navigate("/home");
        }
      } else {
        setError("Signup failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("⚠️ Signup failed. Server error.");
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
            placeholder="👤 Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="📧 Email"
            value={formData.email}
            onChange={handleChange}
            required
            className={!emailValid ? "invalid" : ""}
          />
          {!emailValid && <p className="error">⚠️ Please enter a valid email format.</p>}

          <input
            type="password"
            name="password"
            placeholder="🔑 Password"
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
            placeholder="✅ Confirm Password"
            value={formData.passwordConfirm}
            onChange={handleChange}
            required
          />

          <select name="role" value={formData.role} onChange={handleChange} required>
            <option value="student">🎓 Student</option>
            <option value="lecture">👨‍🏫 Lecturer</option>
            <option value="program_leader">📘 Leader</option>
            <option value="principal_lecture">🏛️ Principal</option>
            <option value="admin">⚙️ Admin</option>
          </select>

          <button type="submit" disabled={loading || !emailValid}>
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>

        <p className="login-link">
          Already have an account? <Link to="/">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
