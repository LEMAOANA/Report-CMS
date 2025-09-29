import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Class from "./Class.js";
import Course from "./Course.js";
import User from "./User.js";

const LectureReport = sequelize.define("LectureReport", {
  week: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  topicTaught: { type: DataTypes.STRING, allowNull: false },
  learningOutcomes: { type: DataTypes.TEXT, allowNull: true },
  recommendations: { type: DataTypes.TEXT, allowNull: true },
  actualStudentsPresent: { type: DataTypes.INTEGER, allowNull: false },
  totalRegisteredStudents: { type: DataTypes.INTEGER, allowNull: false }
}, { timestamps: true });

// Associations
LectureReport.belongsTo(Class, { foreignKey: "classId" });
LectureReport.belongsTo(Course, { foreignKey: "courseId" });
LectureReport.belongsTo(User, { as: "lecturer", foreignKey: "lecturerId" });

export default LectureReport;
