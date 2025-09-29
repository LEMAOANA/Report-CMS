import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse
} from "../controllers/courseController.js";
// import { protect } from "../middleware/authMiddleware.js"; // optional

const router = express.Router();

// CRUD routes
router.post("/", createCourse);       // Create
router.get("/", getAllCourses);       // Read all
router.get("/:id", getCourseById);    // Read one
router.put("/:id", updateCourse);     // Update
router.delete("/:id", deleteCourse);  // Delete

export default router;
