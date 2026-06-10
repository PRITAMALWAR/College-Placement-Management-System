import express from "express";

import {
  createDrive,
  getAllDrives,
  getDriveById,
  updateDrive,
  deleteDrive,
  getMyDrives,
} from "../controllers/driveController.js";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();


// Student / Company / Admin
router.get(
  "/",
  protect,
  authorize("student", "company", "admin"),
  getAllDrives
);

router.get(
  "/:id",
  protect,
  authorize("student", "company", "admin"),
  getDriveById
);


// Company Only
router.post(
  "/",
  protect,
  authorize("company"),
  createDrive
);

router.get(
  "/my-drives",
  protect,
  authorize("company"),
  getMyDrives
);

router.put(
  "/:id",
  protect,
  authorize("company"),
  updateDrive
);

router.delete(
  "/:id",
  protect,
  authorize("company"),
  deleteDrive
);

export default router;