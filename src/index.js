const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { app } = require("./app");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.get("/", (req, res) => {
  res.send("Backend is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
