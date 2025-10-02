import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import {
  listUsers,
  listBookings,
  listUnverifiedCareproviders,
  deleteUser
} from "../controllers/adminController.js";

const router = express.Router();

// Protect all admin routes
router.use(authMiddleware, requireRole("admin"));

// Admin actions
router.get("/users", listUsers);
router.get("/bookings", listBookings);
router.get("/careproviders/unverified", listUnverifiedCareproviders);
router.delete("/users/:id", deleteUser);

export default router;

