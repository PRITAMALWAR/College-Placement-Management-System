import express from "express";

import {
  dashboardStats,
  getAllStudents,
  getAllCompanies,
  getAllDrives,
  getAllApplications,
  updateStudentPlacementStatus,
  deleteDriveByAdmin,
} from "../controllers/adminController.js";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();


// Protect all admin routes
router.use(
  protect,
  authorize("admin")
);


// Dashboard
router.get(
  "/dashboard",
  dashboardStats
);


// Students
router.get(
  "/students",
  getAllStudents
);

router.patch(
  "/students/:id/placement-status",
  updateStudentPlacementStatus
);


// Companies
router.get(
  "/companies",
  getAllCompanies
);


// Drives
router.get(
  "/drives",
  getAllDrives
);

router.delete(
  "/drives/:id",
  deleteDriveByAdmin
);


// Applications
router.get(
  "/applications",
  getAllApplications
);

export default router;