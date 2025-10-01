import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Course from "./Course.js"; // A class belongs to a course
import User from "./User.js"; // Users can be lecturers

const ClassModel = sequelize.define(
  "Class",
  {
    name: { type: DataTypes.STRING, allowNull: false }, // e.g., "IT101-A"
    year: { type: DataTypes.INTEGER, allowNull: false }, // Academic year
    semester: { type: DataTypes.ENUM("1", "2"), allowNull: false }, // Semester number
    venue: { type: DataTypes.STRING, allowNull: true }, // e.g., "Room 101"
    scheduledTime: { type: DataTypes.STRING, allowNull: true }, // e.g., "08:00 - 10:00"
    totalRegisteredStudents: { type: DataTypes.INTEGER, allowNull: true }, // Optional
  },
  { timestamps: true }
);

// Associations
ClassModel.belongsTo(Course, { foreignKey: "courseId" }); // Each class belongs to a course
ClassModel.belongsTo(User, { as: "lecturer", foreignKey: "lecturerId" }); // Each class has a lecturer

export default ClassModel;
