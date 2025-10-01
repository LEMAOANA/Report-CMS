// models/Course.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Faculty from "./Faculty.js";
import User from "./User.js"; // will represent both program leaders and principal lecturers

const Course = sequelize.define(
  "Course",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true },
  },
  { timestamps: true }
);

// Associations
Course.belongsTo(Faculty, { foreignKey: "facultyId", onDelete: "CASCADE" });

// Assign Program Leader (one user)
Course.belongsTo(User, { as: "programLeader", foreignKey: "programLeaderId" });

// Assign Principal Lecturer (one user)
Course.belongsTo(User, { as: "principalLecturer", foreignKey: "principalLecturerId" });

export default Course;
