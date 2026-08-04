import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import "./app/config/passport.js";
import router from "./app/routes/index.js";
import expressSession from "express-session";
import { envVars } from "./app/config/env.js";
import notFound from "./app/middlewares/notFound.js";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler.js";
const app = express();

app.use(expressSession({
  secret: envVars.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.set("trust proxy", 1);

app.use(cors());

app.use(express.json());



app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Backend is running...");
});

app.use(notFound);
app.use(globalErrorHandler);

export default app;
