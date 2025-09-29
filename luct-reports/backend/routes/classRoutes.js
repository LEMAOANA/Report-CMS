// routes/classRoutes.js
import express from "express";
import { createClass, getAllClasses, getClassById, updateClass, deleteClass } from "../controllers/classController.js";
// import { protect } from "../middleware/authMiddleware.js"; // optional if you want auth

const router = express.Router();

// CRUD routes
router.post("/", createClass);           // Create class
router.get("/", getAllClasses);         // Get all classes
router.get("/:id", getClassById);       // Get class by ID
router.put("/:id", updateClass);        // Update class
router.delete("/:id", deleteClass);     // Delete class

export default router;
