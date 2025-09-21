import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import {
  addCaregiver,
  listCaregivers,
  verifyCaregiver,
  flagCaregiver
} from "../controllers/caregiverController.js";

const router = express.Router();

router.post("/", authMiddleware, requireRole("provider"), addCaregiver);
router.get("/", listCaregivers);
router.patch("/:id/verify", authMiddleware, requireRole("admin"), verifyCaregiver);
router.patch("/:id/flag", authMiddleware, requireRole("admin"), flagCaregiver);

export default router;
