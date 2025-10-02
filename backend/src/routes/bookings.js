import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import {
  createBooking,
  getSeekerBookings,
  getProviderBookings,
  confirmBooking,
  cancelBooking,
  completeBooking
} from "../controllers/bookingController.js";

const router = express.Router();

// Seeker routes
router.post("/", authMiddleware, requireRole("seeker"), createBooking);
router.get("/my", authMiddleware, requireRole("seeker"), getSeekerBookings);
router.patch("/:id/cancel", authMiddleware, requireRole("seeker"), cancelBooking);

// Provider routes
router.get("/provider", authMiddleware, requireRole("provider"), getProviderBookings);
router.patch("/:id/confirm", authMiddleware, requireRole("provider"), confirmBooking);
router.patch("/:id/complete", authMiddleware, requireRole("provider"), completeBooking);

export default router;
