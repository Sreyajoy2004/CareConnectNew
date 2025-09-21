import pool from "../config/db.js";

export async function createBooking(req, res) {
  try {
    const { providerId, resourceId, bookingDate } = req.body;

    const [result] = await pool.query(
      "INSERT INTO bookings (seeker_id, provider_id, resource_id, booking_date) VALUES (?, ?, ?, ?)",
      [req.user.userId, providerId, resourceId, bookingDate]
    );

    res.status(201).json({ message: "Booking created", bookingId: result.insertId });
  } catch (err) {
    console.error("❌ Create booking error:", err.message);
    res.status(500).json({ error: "Failed to create booking" });
  }
}

export async function getBookings(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM bookings WHERE seeker_id = ?",
      [req.user.userId]
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Get bookings error:", err.message);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
}

export async function confirmBooking(req, res) {
  try {
    await pool.query(
      "UPDATE bookings SET status = 'confirmed' WHERE id = ? AND provider_id = ?",
      [req.params.id, req.user.userId]
    );
    res.json({ message: "Booking confirmed" });
  } catch (err) {
    console.error("❌ Confirm booking error:", err.message);
    res.status(500).json({ error: "Failed to confirm booking" });
  }
}

export async function cancelBooking(req, res) {
  try {
    await pool.query(
      "UPDATE bookings SET status = 'cancelled' WHERE id = ? AND seeker_id = ?",
      [req.params.id, req.user.userId]
    );
    res.json({ message: "Booking cancelled" });
  } catch (err) {
    console.error("❌ Cancel booking error:", err.message);
    res.status(500).json({ error: "Failed to cancel booking" });
  }
}
