import React, { useState } from "react";
import "./login.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");

  function validatePassword(role, password) {
    if (role === "student" && !password.startsWith("90")) {
      return "Student password must start with 90";
    }
    if (role === "lecturer" && !password.startsWith("LEC")) {
      return "Lecturer password must start with LEC-";
    }
    if (role === "principal" && !password.startsWith("PRL")) {
      return "Principal Lecturer password must start with PRL-";
    }
    if (role === "leader" && !password.startsWith("PL")) {
      return "Program Leader password must start with PL-";
    }
    return "";
  }

  function handleLogin(e) {
    e.preventDefault();

    const validationError = validatePassword(role, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    alert(`Login Success!\nEmail: ${email}\nRole: ${role}`);
    // Later: send to backend for real authentication
  }

  return React.createElement(
    "div",
    { className: "login-container" },
    React.createElement(
      "div",
      { className: "login-card" },
      React.createElement("div", { className: "login-left" }, React.createElement("div", { className: "graphic" })),
      React.createElement(
        "div",
        { className: "login-right" },
        React.createElement("h2", null, "User Login"),
        React.createElement(
          "form",
          { onSubmit: handleLogin },
          React.createElement("input", {
            type: "email",
            placeholder: "Enter your email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            required: true,
          }),
          React.createElement("input", {
            type: "password",
            placeholder: "Enter password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            required: true,
          }),
          React.createElement(
            "select",
            {
              value: role,
              onChange: (e) => setRole(e.target.value),
              required: true,
              className: "role-select",
            },
            React.createElement("option", { value: "student" }, "Student"),
            React.createElement("option", { value: "lecturer" }, "Lecturer"),
            React.createElement("option", { value: "principal" }, "Principal Lecturer"),
            React.createElement("option", { value: "leader" }, "Program Leader")
          ),
          error &&
            React.createElement("p", { className: "error" }, error),
          React.createElement("button", { type: "submit" }, "Login")
        )
      )
    )
  );
}

export default LoginPage;
