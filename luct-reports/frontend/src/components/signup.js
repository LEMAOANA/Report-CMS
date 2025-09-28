import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // added Link
import { signup } from "../services/api";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.passwordConfirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const data = await signup(formData);
      console.log("Signup response:", data);

      if (data.token) {
        // Save token and role
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
            navigate("/admin"); // if you have an admin page
            break;
          default:
            navigate("/home");
        }
      } else {
        setError("Signup failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Signup</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            name="passwordConfirm"
            placeholder="Confirm Password"
            value={formData.passwordConfirm}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="student">Student</option>
            <option value="lecture">Lecturer</option>
            <option value="program_leader">Leader</option>
            <option value="principal_lecture">Principal</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" style={{ marginTop: "10px" }}>Signup</button>
      </form>

      {/* Link to Login */}
      <p style={{ marginTop: "15px" }}>
        Already have an account? <Link to="/">Login here</Link>
      </p>
    </div>
  );
}

export default Signup;
