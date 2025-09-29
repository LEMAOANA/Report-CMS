import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Faculty = sequelize.define("Faculty", {
  name: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true 
  }
}, { timestamps: true });

export default Faculty;
