import mongoose from "mongoose";
import app from "./app.js";
import { envVars } from "./app/config/env.js";

const PORT = envVars.PORT || 5000;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);

    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();