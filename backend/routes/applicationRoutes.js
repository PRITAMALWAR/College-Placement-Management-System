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


// Student Routes
router.post(
  "/apply",
  protect,
  authorize("student"),
  applyForDrive
);

router.get(
  "/my-applications",
  protect,
  authorize("student"),
  getMyApplications
);


// Company Route
router.get(
  "/drive/:driveId",
  protect,
  authorize("company"),
  getDriveApplications
);


// Company + Admin Route
router.patch(
  "/:id/status",
  protect,
  authorize("company", "admin"),
  updateApplicationStatus
);

export default router;