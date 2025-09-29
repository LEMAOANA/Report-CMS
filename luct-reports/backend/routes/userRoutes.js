import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from "../controllers/userController.js";

const router = express.Router();

// CRUD routes
router.get("/", getAllUsers);        // Get all users
router.get("/:id", getUserById);     // Get user by ID
router.post("/", createUser);        // Create new user
router.put("/:id", updateUser);      // Update user
router.delete("/:id", deleteUser);   // Delete user

export default router;
