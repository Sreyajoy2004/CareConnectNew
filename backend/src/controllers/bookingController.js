import pool from "../config/db.js";

// ================================
// Create booking (Seeker only)
// ================================
export async function createBooking(req, res) {
  try {
    const { providerId, resourceId, bookingDate } = req.body;

    const [result] = await pool.query(
      "INSERT INTO bookings (seeker_id, provider_id, resource_id, booking_date) VALUES (?, ?, ?, ?)",
      [req.user.userId, providerId, resourceId, bookingDate]
    );

    res.status(201).json({
      message: "Booking created (pending confirmation)",
      bookingId: result.insertId
    });
  } catch (err) {
    console.error("❌ Create booking error:", err.message);
    res.status(500).json({ error: "Failed to create booking" });
  }
}

// ================================
// Get all bookings for a Seeker
// ================================
export async function getSeekerBookings(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT b.id, b.status, b.booking_date,
              cp.name AS careprovider_name,
              u.name  AS provider_name
       FROM bookings b
       JOIN careproviders cp ON b.resource_id = cp.id
       JOIN users u ON b.provider_id = u.user_id
       WHERE b.seeker_id = ?`,
      [req.user.userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ Get seeker bookings error:", err.message);
    res.status(500).json({ error: "Failed to fetch seeker bookings" });
  }
}

// ================================
// Get all bookings for a Provider
// ================================
export async function getProviderBookings(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT b.id, b.status, b.booking_date,
              u.name AS seeker_name,
              cp.name AS careprovider_name
       FROM bookings b
       JOIN users u ON b.seeker_id = u.user_id
       JOIN careproviders cp ON b.resource_id = cp.id
       WHERE b.provider_id = ?`,
      [req.user.userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ Get provider bookings error:", err.message);
    res.status(500).json({ error: "Failed to fetch provider bookings" });
  }
}

// ================================
// Confirm booking (Provider only)
// ================================
export async function confirmBooking(req, res) {
  try {
    const [result] = await pool.query(
      "UPDATE bookings SET status = 'confirmed' WHERE id = ? AND provider_id = ?",
      [req.params.id, req.user.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Booking not found or not owned by you" });
    }

    res.json({ message: "Booking confirmed" });
  } catch (err) {
    console.error("❌ Confirm booking error:", err.message);
    res.status(500).json({ error: "Failed to confirm booking" });
  }
}

// ================================
// Cancel booking (Seeker only)
// ================================
export async function cancelBooking(req, res) {
  try {
    const [result] = await pool.query(
      "UPDATE bookings SET status = 'cancelled' WHERE id = ? AND seeker_id = ?",
      [req.params.id, req.user.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Booking not found or not owned by you" });
    }

    res.json({ message: "Booking cancelled" });
  } catch (err) {
    console.error("❌ Cancel booking error:", err.message);
    res.status(500).json({ error: "Failed to cancel booking" });
  }
}

// ================================
// Complete booking (Provider only)
// ================================
export async function completeBooking(req, res) {
  try {
    const [result] = await pool.query(
      "UPDATE bookings SET status = 'completed' WHERE id = ? AND provider_id = ?",
      [req.params.id, req.user.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Booking not found or not owned by you" });
    }

    res.json({ message: "Booking marked as completed" });
  } catch (err) {
    console.error("❌ Complete booking error:", err.message);
    res.status(500).json({ error: "Failed to complete booking" });
  }
}
