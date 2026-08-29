import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";
import { connectRedis } from "./app/config/redis.config.js";

dotenv.config();

let isMongoConnected = false;
let isRedisConnected = false;

const connectDatabase = async () => {
  if (isMongoConnected) return;

  if (mongoose.connection.readyState === 1) {
    isMongoConnected = true;
    return;
  }

  await mongoose.connect(process.env.DB_URL);
  isMongoConnected = true;

  console.log("MongoDB Connected");
};

const initializeServer = async () => {
  try {
    await connectDatabase();

    if (!isRedisConnected) {
      await connectRedis();
      isRedisConnected = true;
      console.log("Redis Connected");
    }
  } catch (error) {
    console.error("Server initialization failed:", error);
    throw error;
  }
};

const handler = async (req, res) => {
  try {
    await initializeServer();

    return app(req, res);
  } catch (error) {
    console.error("Server Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server initialization failed",
      error: error.message,
    });
  }
};

export default handler;