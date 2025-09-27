import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import {
  createBooking,
  getBookings,
  confirmBooking,
  cancelBooking
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", authMiddleware, requireRole("seeker"), createBooking);
router.get("/", authMiddleware, requireRole("seeker"), getBookings);
router.patch("/:id/confirm", authMiddleware, requireRole("provider"), confirmBooking);
router.patch("/:id/cancel", authMiddleware, requireRole("seeker"), cancelBooking);

export default router;
