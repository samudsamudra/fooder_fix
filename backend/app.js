const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

// Add cookie parser middleware
app.use(cookieParser());

// Add CORS middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Adjust the origin as needed
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

module.exports = app;
