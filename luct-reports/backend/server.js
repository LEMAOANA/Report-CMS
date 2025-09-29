import express from "express";
import dotenv from "dotenv";
import cors from "cors"; 
import sequelize from "./config/db.js"; 
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import facultyRoutes from "./routes/facultyRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import classRoutes from "./routes/classRoutes.js"; 
import reportRoutes from "./routes/reportRoutes.js";
import reportFeedbackRoutes from "./routes/reportFeedbackRoutes.js";


dotenv.config();

const app = express();
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: "http://localhost:3001", // your frontend URL
  credentials: true
}));

// Health check
app.get("/health", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: "ok", db: true });
  } catch (err) {
    res.status(500).json({ status: "error", db: false, message: err.message });
  }
});

// Mount auth routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/faculties", facultyRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/classes", classRoutes); 
app.use("/api/reports", reportRoutes);
app.use("/api/reportFeedback", reportFeedbackRoutes);


// Test Sequelize connection and sync models
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Sequelize connected to Neon Postgres successfully");

    // Sync all models (for development/testing)
    await sequelize.sync({ alter: true });
    console.log("✅ All models were synchronized successfully");
  } catch (err) {
    console.error("❌ Sequelize connection or sync failed:", err.message);
    process.exit(1); // stop server if DB fails
  }
})();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
