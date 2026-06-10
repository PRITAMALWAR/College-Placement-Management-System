import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import passport from "passport";

import connectDB from "./config/db.js";
import "./config/passport.js";

import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// Database Connection
connectDB();

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Static Files
app.use("/uploads", express.static("uploads"));

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Placement Management API Running",
  });
});

// Routes
app.use("/api/auth", authRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});