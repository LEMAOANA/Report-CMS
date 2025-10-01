// controllers/reportController.js
import Report from "../models/Report.js";
import Faculty from "../models/Faculty.js";
import Class from "../models/Class.js";
import Course from "../models/Course.js";
import User from "../models/User.js";

// -------------------- Create Report --------------------
export const createReport = async (req, res) => {
  try {
    const {
      facultyId,
      classId,
      courseId,
      lecturerId,
      weekOfReporting,
      dateOfLecture,
      actualStudentsPresent,
      totalRegisteredStudents,
      venue,
      scheduledTime,
      topicTaught,
      learningOutcomes,
      lecturerRecommendations,
    } = req.body;

    // Validate required fields
    if (
      !facultyId ||
      !classId ||
      !courseId ||
      !lecturerId ||
      !weekOfReporting ||
      !dateOfLecture ||
      !actualStudentsPresent ||
      !totalRegisteredStudents ||
      !venue ||
      !scheduledTime ||
      !topicTaught ||
      !learningOutcomes
    ) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // Validate associations
    const faculty = await Faculty.findByPk(facultyId);
    if (!faculty) return res.status(404).json({ message: "Faculty not found" });

    const cls = await Class.findByPk(classId);
    if (!cls) return res.status(404).json({ message: "Class not found" });

    const course = await Course.findByPk(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const lecturer = await User.findByPk(lecturerId);
    if (!lecturer || lecturer.role !== "lecturer") {
      return res.status(404).json({ message: "Lecturer not found or invalid role" });
    }

    // Create report
    const report = await Report.create({
      facultyId,
      classId,
      courseId,
      lecturerId,
      weekOfReporting,
      dateOfLecture,
      actualStudentsPresent,
      totalRegisteredStudents,
      venue,
      scheduledTime,
      topicTaught,
      learningOutcomes,
      lecturerRecommendations,
    });

    res.status(201).json({ status: "success", report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------- Get All Reports --------------------
export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      include: [
        { model: Faculty },
        { model: Class },
        { model: Course },
        { model: User, as: "lecturer", attributes: ["id", "username", "email", "role"] },
      ],
    });
    res.json({ status: "success", reports });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------- Get Report By ID --------------------
export const getReportById = async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id, {
      include: [
        { model: Faculty },
        { model: Class },
        { model: Course },
        { model: User, as: "lecturer", attributes: ["id", "username", "email", "role"] },
      ],
    });
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json({ status: "success", report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------- Update Report --------------------
export const updateReport = async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    // Optional: validate associations if being updated
    if (req.body.lecturerId) {
      const lecturer = await User.findByPk(req.body.lecturerId);
      if (!lecturer || lecturer.role !== "lecturer") {
        return res.status(404).json({ message: "Lecturer not found or invalid role" });
      }
    }

    if (req.body.classId) {
      const cls = await Class.findByPk(req.body.classId);
      if (!cls) return res.status(404).json({ message: "Class not found" });
    }

    if (req.body.courseId) {
      const course = await Course.findByPk(req.body.courseId);
      if (!course) return res.status(404).json({ message: "Course not found" });
    }

    if (req.body.facultyId) {
      const faculty = await Faculty.findByPk(req.body.facultyId);
      if (!faculty) return res.status(404).json({ message: "Faculty not found" });
    }

    await report.update(req.body);
    res.json({ status: "success", report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------- Delete Report --------------------
export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    await report.destroy();
    res.json({ status: "success", message: "Report deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
