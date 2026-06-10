import express from "express";

import {
  createCompanyProfile,
  getCompanyProfile,
  updateCompanyProfile,
} from "../controllers/companyController.js";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();


// Create Company Profile
router.post(
  "/profile",
  protect,
  authorize("company"),
  createCompanyProfile
);


// Get Company Profile
router.get(
  "/profile",
  protect,
  authorize("company"),
  getCompanyProfile
);


// Update Company Profile
router.put(
  "/profile",
  protect,
  authorize("company"),
  updateCompanyProfile
);

export default router;