import Course from "../models/Course.js";
import Faculty from "../models/Faculty.js";
import User from "../models/User.js";

// Create a new course
export const createCourse = async (req, res) => {
  try {
    const { name, code, description, facultyId, programLeaderId } = req.body;

    // Check required fields
    if (!name || !code || !facultyId) {
      return res.status(400).json({ message: "Name, code, and facultyId are required" });
    }

    // Ensure faculty exists
    const faculty = await Faculty.findByPk(facultyId);
    if (!faculty) return res.status(404).json({ message: "Faculty not found" });

    // Optional: Check program leader exists
    let programLeader = null;
    if (programLeaderId) {
      programLeader = await User.findByPk(programLeaderId);
      if (!programLeader) return res.status(404).json({ message: "Program Leader not found" });
    }

    const course = await Course.create({ name, code, description, facultyId, programLeaderId });
    res.status(201).json({ status: "success", course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [
        { model: Faculty, attributes: ["id", "name"] },
        { model: User, as: "programLeader", attributes: ["id", "username", "email"] },
      ],
    });
    res.json({ status: "success", courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get course by ID
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [
        { model: Faculty, attributes: ["id", "name"] },
        { model: User, as: "programLeader", attributes: ["id", "username", "email"] },
      ],
    });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ status: "success", course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update course
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const { name, code, description, facultyId, programLeaderId } = req.body;
    if (facultyId) {
      const faculty = await Faculty.findByPk(facultyId);
      if (!faculty) return res.status(404).json({ message: "Faculty not found" });
    }
    if (programLeaderId) {
      const programLeader = await User.findByPk(programLeaderId);
      if (!programLeader) return res.status(404).json({ message: "Program Leader not found" });
    }

    await course.update({ name, code, description, facultyId, programLeaderId });
    res.json({ status: "success", course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete course
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    await course.destroy();
    res.json({ status: "success", message: "Course deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
