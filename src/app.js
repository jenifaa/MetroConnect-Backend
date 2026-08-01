import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import "./app/config/passport.js";
import router from "./app/routes/index.js";

const app = express();
app.use(passport.initialize());
app.set("trust proxy", 1);

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());



app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Backend is running...");
});

export default app;
