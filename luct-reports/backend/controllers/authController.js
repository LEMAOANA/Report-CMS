// controllers/authController.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const signToken = (userId, role) =>
  jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// Signup
export const signup = async (req, res) => {
  try {
    const { username, email, password, passwordConfirm, role } = req.body;

    // Validate input
    if (!username || !email || !password || !passwordConfirm) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if passwords match
    if (password !== passwordConfirm) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password,
      role: role || "student",
    });

    // Generate JWT
    const token = signToken(newUser.id, newUser.role);

    res.status(201).json({
      status: "success",
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Username or email already exists" });
    }
    if (err.name === "SequelizeValidationError") {
      return res
        .status(400)
        .json({ message: err.errors.map(e => e.message).join(", ") });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isValid = await user.correctPassword(password);
    if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user.id, user.role);

    res.json({
      status: "success",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get current logged-in user
export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    res.json({ user: req.user });
  } catch (err) {
    console.error("GetCurrentUser error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
