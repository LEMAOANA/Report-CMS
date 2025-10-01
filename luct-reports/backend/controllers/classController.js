// controllers/classController.js
import ClassModel from "../models/Class.js";
import Course from "../models/Course.js";
import User from "../models/User.js";

// -------------------- Create a new class --------------------
export const createClass = async (req, res) => {
  try {
    const { name, year, semester, venue, scheduledTime, courseId, lecturerId } = req.body;

    if (!name || !year || !semester || !courseId || !lecturerId) {
      return res.status(400).json({ message: "Name, year, semester, courseId, and lecturerId are required" });
    }

    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const lecturer = await User.findByPk(lecturerId);
    if (!lecturer || lecturer.role !== "lecturer") {
      return res.status(404).json({ message: "Lecturer not found or invalid role" });
    }

    const totalStudents = await User.count({ where: { role: "student" } });

    const newClass = await ClassModel.create({
      name,
      year,
      semester,
      venue,
      scheduledTime,
      courseId,
      lecturerId,
      totalRegisteredStudents: totalStudents,
    });

    res.status(201).json({ status: "success", class: newClass });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// -------------------- Get all classes --------------------
export const getAllClasses = async (req, res) => {
  try {
    const classes = await ClassModel.findAll({
      include: [
        { model: Course, attributes: ["id", "name"] },
        { model: User, as: "lecturer", attributes: ["id", "username", "email", "role"] },
      ],
    });
    res.json({ status: "success", classes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// -------------------- Get class by ID --------------------
export const getClassById = async (req, res) => {
  try {
    const cls = await ClassModel.findByPk(req.params.id, {
      include: [
        { model: Course, attributes: ["id", "name"] },
        { model: User, as: "lecturer", attributes: ["id", "username", "email", "role"] },
      ],
    });
    if (!cls) return res.status(404).json({ message: "Class not found" });
    res.json({ status: "success", class: cls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// -------------------- Update class --------------------
export const updateClass = async (req, res) => {
  try {
    const cls = await ClassModel.findByPk(req.params.id);
    if (!cls) return res.status(404).json({ message: "Class not found" });

    const { name, year, semester, venue, scheduledTime, courseId, lecturerId } = req.body;

    if (courseId) {
      const course = await Course.findByPk(courseId);
      if (!course) return res.status(404).json({ message: "Course not found" });
    }

    if (lecturerId) {
      const lecturer = await User.findByPk(lecturerId);
      if (!lecturer || lecturer.role !== "lecturer") {
        return res.status(404).json({ message: "Lecturer not found or invalid role" });
      }
    }

    const totalStudents = await User.count({ where: { role: "student" } });

    await cls.update({
      name,
      year,
      semester,
      venue,
      scheduledTime,
      courseId,
      lecturerId,
      totalRegisteredStudents: totalStudents,
    });

    await cls.reload({
      include: [
        { model: Course, attributes: ["id", "name"] },
        { model: User, as: "lecturer", attributes: ["id", "username", "email", "role"] },
      ],
    });

    res.json({ status: "success", class: cls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// -------------------- Delete class --------------------
export const deleteClass = async (req, res) => {
  try {
    const cls = await ClassModel.findByPk(req.params.id);
    if (!cls) return res.status(404).json({ message: "Class not found" });

    await cls.destroy();
    res.json({ status: "success", message: "Class deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
