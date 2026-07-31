import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";

import router from "./app/routes/index.js";

const app = express();

app.set("trust proxy", 1);

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(passport.initialize());


app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Backend is running...");
});

export default app;
