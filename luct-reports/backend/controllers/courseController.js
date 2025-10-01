// controllers/courseController.js
import Course from "../models/Course.js";
import Faculty from "../models/Faculty.js";
import User from "../models/User.js";

// -------------------- Create Course --------------------
export const createCourse = async (req, res) => {
  try {
    const { name, code, description, facultyId, programLeaderId, principalLecturerId } = req.body;

    if (!name || !code || !facultyId) {
      return res.status(400).json({ message: "Name, code, and facultyId are required" });
    }

    const faculty = await Faculty.findByPk(facultyId);
    if (!faculty) return res.status(404).json({ message: "Faculty not found" });

    // Validate roles
    if (programLeaderId) {
      const leader = await User.findByPk(programLeaderId);
      if (!leader || leader.role !== "program_leader") {
        return res.status(404).json({ message: "Program Leader not found or invalid role" });
      }
    }

    if (principalLecturerId) {
      const principal = await User.findByPk(principalLecturerId);
      if (!principal || principal.role !== "principal_lecturer") {
        return res.status(404).json({ message: "Principal Lecturer not found or invalid role" });
      }
    }

    const course = await Course.create({
      name,
      code,
      description,
      facultyId,
      programLeaderId,
      principalLecturerId,
    });

    res.status(201).json({ status: "success", course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// -------------------- Get All Courses --------------------
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [
        { model: Faculty, attributes: ["id", "name"] },
        { model: User, as: "programLeader", attributes: ["id", "username", "email", "role"] },
        { model: User, as: "principalLecturer", attributes: ["id", "username", "email", "role"] },
      ],
    });
    res.json({ status: "success", courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// -------------------- Get Course by ID --------------------
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [
        { model: Faculty, attributes: ["id", "name"] },
        { model: User, as: "programLeader", attributes: ["id", "username", "email", "role"] },
        { model: User, as: "principalLecturer", attributes: ["id", "username", "email", "role"] },
      ],
    });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ status: "success", course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// -------------------- Update Course --------------------
export const updateCourse = async (req, res) => {
  try {
    const { name, code, description, facultyId, programLeaderId, principalLecturerId } = req.body;
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (facultyId) {
      const faculty = await Faculty.findByPk(facultyId);
      if (!faculty) return res.status(404).json({ message: "Faculty not found" });
    }

    if (programLeaderId) {
      const leader = await User.findByPk(programLeaderId);
      if (!leader || leader.role !== "program_leader") {
        return res.status(404).json({ message: "Program Leader not found or invalid role" });
      }
    }

    if (principalLecturerId) {
      const principal = await User.findByPk(principalLecturerId);
      if (!principal || principal.role !== "principal_lecturer") {
        return res.status(404).json({ message: "Principal Lecturer not found or invalid role" });
      }
    }

    await course.update({ name, code, description, facultyId, programLeaderId, principalLecturerId });
    res.json({ status: "success", course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// -------------------- Delete Course --------------------
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
