// controllers/reportFeedbackController.js
import ReportFeedback from "../models/ReportFeedback.js";
import User from "../models/User.js";
import Report from "../models/Report.js";

// Create feedback for a specific report
export const createFeedback = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { rating, comment, userId } = req.body;

    if (!rating || !userId) {
      return res.status(400).json({ message: "Rating and userId are required" });
    }

    const feedback = await ReportFeedback.create({ reportId, rating, comment, userId });
    res.status(201).json({ status: "success", feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all feedbacks
export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await ReportFeedback.findAll({
      include: [
        { model: User, attributes: ["id", "username", "role"] },
        { model: Report }
      ]
    });
    res.json({ status: "success", feedbacks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get feedback by ID
export const getFeedbackById = async (req, res) => {
  try {
    const feedback = await ReportFeedback.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ["id", "username", "role"] },
        { model: Report }
      ]
    });
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });
    res.json({ status: "success", feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all feedbacks for a specific report
export const getFeedbacksByReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const feedbacks = await ReportFeedback.findAll({
      where: { reportId },
      include: [{ model: User, attributes: ["id", "username", "role"] }]
    });
    res.json({ status: "success", feedbacks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update feedback
export const updateFeedback = async (req, res) => {
  try {
    const feedback = await ReportFeedback.findByPk(req.params.id);
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });

    const { rating, comment } = req.body;
    await feedback.update({ rating, comment });

    res.json({ status: "success", feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete feedback
export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await ReportFeedback.findByPk(req.params.id);
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });

    await feedback.destroy();
    res.json({ status: "success", message: "Feedback deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
