import express from "express";

import {
  getStudentProfile,
  updateStudentProfile,
  uploadResume,
} from "../controllers/studentController.js";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();


// Get Student Profile
router.get(
  "/profile",
  protect,
  authorize("student"),
  getStudentProfile
);


// Update Student Profile
router.put(
  "/profile",
  protect,
  authorize("student"),
  updateStudentProfile
);


// Upload Resume
router.post(
  "/upload-resume",
  protect,
  authorize("student"),
  upload.single("resume"),
  uploadResume
);

export default router;