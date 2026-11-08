import mongoose from "mongoose";
import app from "./app.js";

let initializationPromise;

const initializeServices = async () => {
  if (mongoose.connection.readyState !== 1) {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.DB_URL);

    console.log("MongoDB Connected");
  }
};

export default async function handler(req, res) {
  try {
    if (!initializationPromise) {
      initializationPromise = initializeServices().catch((error) => {
        initializationPromise = null;
        throw error;
      });
    }

    await initializationPromise;

    return app(req, res);
  } catch (error) {
    console.error("BACKEND ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}