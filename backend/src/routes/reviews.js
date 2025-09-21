import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import {
  addReview,
  getReviews,
  getAverageRating
} from "../controllers/reviewController.js";

const router = express.Router();

// Seeker adds review (only after completed booking)
router.post("/", authMiddleware, requireRole("seeker"), addReview);

// Public: get all reviews for a caregiver/resource
router.get("/:resourceId", getReviews);

// Public: get average rating for a caregiver/resource
router.get("/:resourceId/average", getAverageRating);

export default router;
