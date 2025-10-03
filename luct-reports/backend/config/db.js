// db.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

// Debug log to verify DATABASE_URL
console.log("🔎 DATABASE_URL:", process.env.DATABASE_URL || "Not found");

// Check if DATABASE_URL exists
if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL is not defined in .env file");
}

// Initialize Sequelize
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // required for Neon Postgres
    },
  },
  logging: false, // disable SQL query logging
});

// Test database connection immediately
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");
  } catch (err) {
    console.error("❌ Database connection failed:", err); // full error object
  }
})();

export default sequelize;
