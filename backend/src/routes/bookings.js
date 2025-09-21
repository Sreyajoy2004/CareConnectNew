import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createBooking, getBookings } from "../controllers/bookingController.js";

const router = express.Router();

// Routes
router.post("/", authMiddleware, createBooking);
router.get("/", authMiddleware, getBookings);

export default router;
