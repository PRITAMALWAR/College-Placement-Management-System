import express from "express";

import {
  applyForDrive,
  getMyApplications,
  getDriveApplications,
  updateApplicationStatus,
} from "../controllers/applicationController.js";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();


// Test Route
router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Application Routes Working",
  });
});


// Student Routes

// Apply for a drive
router.post(
  "/apply",
  protect,
  authorize("student"),
  applyForDrive
);

// View own applications
router.get(
  "/my-applications",
  protect,
  authorize("student"),
  getMyApplications
);


// Company Routes

// View applications for a drive
router.get(
  "/drive/:driveId",
  protect,
  authorize("company"),
  getDriveApplications
);


// Company + Admin Routes

// Update application status
router.patch(
  "/:id/status",
  protect,
  authorize("company", "admin"),
  updateApplicationStatus
);

export default router;