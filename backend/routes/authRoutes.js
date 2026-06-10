import express from "express";
import passport from "passport";

import {
  registerStudent,
  loginUser,
  getCurrentUser,
  googleSuccess,
  logoutUser,
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();


// Student Registration
router.post(
  "/register",
  registerStudent
);


// Login
router.post(
  "/login",
  loginUser
);


// Get Logged In User
router.get(
  "/me",
  protect,
  getCurrentUser
);


// Google Login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);


// Google Callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect:
      process.env.CLIENT_URL + "/login",
    session: true,
  }),
  googleSuccess
);


// Logout
router.get(
  "/logout",
  logoutUser
);

export default router;