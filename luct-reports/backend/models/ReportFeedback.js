// models/ReportFeedback.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Report from "./Report.js";
import User from "./User.js";

const ReportFeedback = sequelize.define(
  "ReportFeedback",
  {
    rating: { type: DataTypes.INTEGER, allowNull: false },
    comment: { type: DataTypes.TEXT, allowNull: true },
  },
  { timestamps: true }
);

// Associations
ReportFeedback.belongsTo(Report, { foreignKey: "reportId" });
ReportFeedback.belongsTo(User, { foreignKey: "userId" });
Report.hasMany(ReportFeedback);
User.hasMany(ReportFeedback);

export default ReportFeedback;
