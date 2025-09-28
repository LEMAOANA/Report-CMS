import { DataTypes } from "sequelize";
import sequelize from "../config/db.js"; // Sequelize instance
import bcrypt from "bcryptjs";

const User = sequelize.define("User", {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { 
    type: DataTypes.ENUM("student", "lecture", "program_leader", "principal_lecture", "admin"),
    defaultValue: "student",
  },
}, { timestamps: true });

// Hash password before saving
User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 12);
});

// Method for password comparison
User.prototype.correctPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default User;
