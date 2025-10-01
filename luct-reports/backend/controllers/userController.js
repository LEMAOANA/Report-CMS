// controllers/userController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// -------------------- Get all users --------------------
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    res.json({ status: "success", users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------- Get user by ID --------------------
export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: { exclude: ["password"] } });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ status: "success", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------- Create user --------------------
export const createUser = async (req, res) => {
  try {
    const { username, email, password, passwordConfirm, role } = req.body;

    if (!username || !email || !password || !passwordConfirm || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Prevent creating admin via signup
    if (role === "admin") {
      // Check if an admin already exists
      const existingAdmin = await User.findOne({ where: { role: "admin" } });
      if (existingAdmin) {
        return res.status(403).json({ message: "Admin accounts are limited to (1)" });
      }
    }

    const user = await User.create({ username, email, password, role });
    const safeUser = user.toJSON();
    delete safeUser.password;

    res.status(201).json({ status: "success", user: safeUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------- Update user --------------------
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { username, email, password, passwordConfirm, role } = req.body;

    // Handle password updates
    if (password || passwordConfirm) {
      if (password !== passwordConfirm) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
      user.password = password; // model hook will hash it
    }

    if (username) user.username = username;
    if (email) user.email = email;

    if (role) {
      if (role === "admin") {
        const existingAdmin = await User.findOne({ where: { role: "admin" } });
        if (existingAdmin && existingAdmin.id !== user.id) {
          return res.status(403).json({ message: "Admin account already exists" });
        }
      }
      user.role = role;
    }

    await user.save();
    const safeUser = user.toJSON();
    delete safeUser.password;

    res.json({ status: "success", user: safeUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------- Delete user --------------------
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    res.json({ status: "success", message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
