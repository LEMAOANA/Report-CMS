// routes/reportFeedbackRoutes.js
import express from "express";
import {
  createFeedback,
  getAllFeedbacks,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
  getFeedbacksByReport
} from "../controllers/reportFeedbackController.js";

const router = express.Router();

// Create feedback for a report
router.post("/:reportId", createFeedback);

// Get all feedbacks
router.get("/", getAllFeedbacks);

// Get feedback by ID
router.get("/:id", getFeedbackById);

// Get all feedbacks for a specific report
router.get("/report/:reportId", getFeedbacksByReport);

// Update feedback by ID
router.put("/:id", updateFeedback);

// Delete feedback by ID
router.delete("/:id", deleteFeedback);

export default router;