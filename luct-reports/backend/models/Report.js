import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Faculty from "./Faculty.js";
import Class from "./Class.js";
import Course from "./Course.js";
import User from "./User.js"; // Lecturer or Principal Lecturer

const Report = sequelize.define("Report", {
  weekOfReporting: { type: DataTypes.INTEGER, allowNull: false },
  dateOfLecture: { type: DataTypes.DATEONLY, allowNull: false },
  actualStudentsPresent: { type: DataTypes.INTEGER, allowNull: false },
  totalRegisteredStudents: { type: DataTypes.INTEGER, allowNull: false },
  venue: { type: DataTypes.STRING, allowNull: false },
  scheduledTime: { type: DataTypes.TIME, allowNull: false },
  topicTaught: { type: DataTypes.STRING, allowNull: false },
  learningOutcomes: { type: DataTypes.TEXT, allowNull: false },
  lecturerRecommendations: { type: DataTypes.TEXT },
}, { timestamps: true });

// ------------------ Associations ------------------
// Report belongs to a faculty
Report.belongsTo(Faculty, { foreignKey: "facultyId" });

// Report belongs to a class
Report.belongsTo(Class, { foreignKey: "classId" });

// Report belongs to a course
Report.belongsTo(Course, { foreignKey: "courseId" });

// Report belongs to a user (either lecturer or principal lecturer)
Report.belongsTo(User, { 
  as: "lecturer", 
  foreignKey: "lecturerId",
  constraints: true,
  scope: {
    role: ["lecturer", "principal_lecturer"] // Only users with these roles
  }
});

export default Report;
