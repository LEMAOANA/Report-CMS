import Report from "../models/Report.js";
import Faculty from "../models/Faculty.js";
import Class from "../models/Class.js";
import Course from "../models/Course.js";
import User from "../models/User.js";

// Create Report
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
      lecturerRecommendations
    } = req.body;

    if (!facultyId || !classId || !courseId || !lecturerId || !weekOfReporting || !dateOfLecture || !actualStudentsPresent || !totalRegisteredStudents || !venue || !scheduledTime || !topicTaught || !learningOutcomes) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

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
      lecturerRecommendations
    });

    res.status(201).json({ status: "success", report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Reports
export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      include: [
        { model: Faculty },
        { model: Class },
        { model: Course },
        { model: User, as: "lecturer" }
      ]
    });
    res.json({ status: "success", reports });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get Report By ID
export const getReportById = async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id, {
      include: [
        { model: Faculty },
        { model: Class },
        { model: Course },
        { model: User, as: "lecturer" }
      ]
    });
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json({ status: "success", report });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Report
export const updateReport = async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    await report.update(req.body);
    res.json({ status: "success", report });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Report
export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    await report.destroy();
    res.json({ status: "success", message: "Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
