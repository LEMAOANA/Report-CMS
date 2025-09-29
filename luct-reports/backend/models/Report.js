import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Faculty from "./Faculty.js";
import Class from "./Class.js";
import Course from "./Course.js";
import User from "./User.js"; // Lecturer

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

// Associations
Report.belongsTo(Faculty, { foreignKey: "facultyId" });
Report.belongsTo(Class, { foreignKey: "classId" });
Report.belongsTo(Course, { foreignKey: "courseId" });
Report.belongsTo(User, { as: "lecturer", foreignKey: "lecturerId" });

export default Report;
