import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import {
  addCaregiver,
  listCaregivers,
  uploadVerificationDoc,
  verifyCaregiver,
  flagCaregiver
} from "../controllers/caregiverController.js";

const router = express.Router();

// Provider adds caregiver
router.post("/", authMiddleware, requireRole("provider"), addCaregiver);

// Public list caregivers
router.get("/", listCaregivers);

// Provider uploads certificate
router.patch("/:id/upload-doc", authMiddleware, requireRole("provider"), uploadVerificationDoc);

// Admin verifies caregiver
router.patch("/:id/verify", authMiddleware, requireRole("admin"), verifyCaregiver);

// Admin flags caregiver
router.patch("/:id/flag", authMiddleware, requireRole("admin"), flagCaregiver);

export default router;
