import pool from "../config/db.js";

// Add a review (seeker only, after completed booking)
export async function addReview(req, res) {
  try {
    const { bookingId, rating, comment } = req.body;

    // 1. Validate booking ownership & status
    const [rows] = await pool.query(
      "SELECT * FROM bookings WHERE id = ? AND seeker_id = ? AND status = 'completed'",
      [bookingId, req.user.userId]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: "Invalid booking or booking not completed" });
    }

    const booking = rows[0];

    // 2. Insert review
    const [result] = await pool.query(
      "INSERT INTO reviews (booking_id, reviewer_id, resource_id, rating, comment) VALUES (?, ?, ?, ?, ?)",
      [bookingId, req.user.userId, booking.resource_id, rating, comment]
    );

    res.status(201).json({ message: "Review added", reviewId: result.insertId });
  } catch (err) {
    console.error("❌ Add review error:", err.message);
    res.status(500).json({ error: "Failed to add review" });
  }
}

// Get all reviews for a caregiver/resource
export async function getReviews(req, res) {
  try {
    const resourceId = req.params.resourceId;

    const [rows] = await pool.query(
      `SELECT r.*, u.name AS reviewer_name
       FROM reviews r
       JOIN users u ON r.reviewer_id = u.user_id
       WHERE r.resource_id = ?`,
      [resourceId]
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ Get reviews error:", err.message);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
}

// Get average rating for a caregiver/resource
export async function getAverageRating(req, res) {
  try {
    const resourceId = req.params.resourceId;

    const [rows] = await pool.query(
      "SELECT AVG(rating) AS averageRating, COUNT(*) AS totalReviews FROM reviews WHERE resource_id = ?",
      [resourceId]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Get average rating error:", err.message);
    res.status(500).json({ error: "Failed to calculate average rating" });
  }
}
