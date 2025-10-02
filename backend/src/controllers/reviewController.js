import pool from "../config/db.js";

// ================================
// Seeker adds review (only for completed bookings)
// ================================
export async function addReview(req, res) {
  try {
    const { bookingId, resourceId, rating, comment } = req.body;

    // Check booking status
    const [bookings] = await pool.query(
      "SELECT * FROM bookings WHERE id = ? AND seeker_id = ? AND status = 'completed'",
      [bookingId, req.user.userId]
    );

    if (bookings.length === 0) {
      return res.status(400).json({ error: "You can only review completed bookings" });
    }

    const [result] = await pool.query(
      "INSERT INTO reviews (booking_id, resource_id, seeker_id, rating, comment) VALUES (?, ?, ?, ?, ?)",
      [bookingId, resourceId, req.user.userId, rating, comment]
    );

    res.status(201).json({ message: "Review added", reviewId: result.insertId });
  } catch (err) {
    console.error("❌ Add review error:", err.message);
    res.status(500).json({ error: "Failed to add review" });
  }
}

// ================================
// Public: get all reviews for a caregiver/resource
// ================================
export async function getReviews(req, res) {
  try {
    const { resourceId } = req.params;

    const [rows] = await pool.query(
      `SELECT r.id, r.rating, r.comment, r.created_at, u.name AS seeker_name
       FROM reviews r
       JOIN users u ON r.seeker_id = u.user_id
       WHERE r.resource_id = ?`,
      [resourceId]
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ Get reviews error:", err.message);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
}

// ================================
// Public: get average rating for a caregiver/resource
// ================================
export async function getAverageRating(req, res) {
  try {
    const { resourceId } = req.params;

    const [rows] = await pool.query(
      "SELECT AVG(rating) AS averageRating, COUNT(*) AS totalReviews FROM reviews WHERE resource_id = ?",
      [resourceId]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Get average rating error:", err.message);
    res.status(500).json({ error: "Failed to fetch average rating" });
  }
}
