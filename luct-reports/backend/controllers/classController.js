// controllers/classController.js
import Class from "../models/Class.js";
import Course from "../models/Course.js";

// Create a new class
export const createClass = async (req, res) => {
  try {
    const { name, year, semester, venue, scheduledTime, totalRegisteredStudents, courseId } = req.body;

    // Validate required fields
    if (!name || !year || !semester || !courseId) {
      return res.status(400).json({ message: "Name, year, semester, and courseId are required" });
    }

    // Check if course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const newClass = await Class.create({
      name,
      year,
      semester,
      venue,
      scheduledTime,
      totalRegisteredStudents,
      courseId
    });

    res.status(201).json({ status: "success", class: newClass });
  } catch (err) {
    console.error("CreateClass error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all classes
export const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.findAll({ include: { model: Course } });
    res.json({ status: "success", classes });
  } catch (err) {
    console.error("GetAllClasses error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get class by ID
export const getClassById = async (req, res) => {
  try {
    const singleClass = await Class.findByPk(req.params.id, { include: { model: Course } });
    if (!singleClass) return res.status(404).json({ message: "Class not found" });
    res.json({ status: "success", class: singleClass });
  } catch (err) {
    console.error("GetClassById error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update class by ID
export const updateClass = async (req, res) => {
  try {
    const updated = await Class.update(req.body, { where: { id: req.params.id }, returning: true });
    if (!updated[1][0]) return res.status(404).json({ message: "Class not found" });
    res.json({ status: "success", class: updated[1][0] });
  } catch (err) {
    console.error("UpdateClass error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete class by ID
export const deleteClass = async (req, res) => {
  try {
    const deleted = await Class.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "Class not found" });
    res.json({ status: "success", message: "Class deleted successfully" });
  } catch (err) {
    console.error("DeleteClass error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
