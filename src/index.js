import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";
import { connectRedis } from "./app/config/redis.config.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);

    console.log("MongoDB Connected");

    await connectRedis();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

startServer();

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down...");
  process.exit(0);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});
