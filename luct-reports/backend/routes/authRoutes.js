// routes/authRoutes.js
import express from "express";
import { signup, login, getCurrentUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to create a new user
router.post("/signup", signup);

// Route to login a user
router.post("/login", login);

// Protected route to get current logged-in user info
router.get("/me", protect, getCurrentUser);

export default router;
