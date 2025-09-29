// routes/facultyRoutes.js
import express from "express";
import {
  createFaculty,
  getAllFaculties,
  getFacultyById,
  updateFaculty,
  deleteFaculty
} from "../controllers/facultyController.js";

const router = express.Router();

// Faculty CRUD routes without authentication
router.post("/", createFaculty);
router.get("/", getAllFaculties);
router.get("/:id", getFacultyById);
router.put("/:id", updateFaculty);
router.delete("/:id", deleteFaculty);

export default router;
