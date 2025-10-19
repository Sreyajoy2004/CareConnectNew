import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import {
  addReview,
  getReviews,
  getAverageRating,
  getMyReviews
} from "../controllers/reviewController.js";

const router = express.Router();

// Seeker adds review (only after completed booking)
router.post("/", authMiddleware, requireRole("seeker"), addReview);

// Seeker gets their own reviews
router.get("/my", authMiddleware, requireRole("seeker"), getMyReviews);

// Public: get all reviews for a caregiver/resource
router.get("/:resourceId", getReviews);

// Public: get average rating for a caregiver/resource
router.get("/:resourceId/average", getAverageRating);

export default router;
