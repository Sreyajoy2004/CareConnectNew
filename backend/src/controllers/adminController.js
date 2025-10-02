import pool from "../config/db.js";

// ================================
// Get all users
// ================================
export async function listUsers(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT user_id, name, email, role, created_at FROM users"
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ List users error:", err.message);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}

// ================================
// Get all bookings
// ================================
export async function listBookings(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT b.id, b.status, b.booking_date,
              s.name AS seeker_name,
              p.name AS provider_name,
              cp.name AS careprovider_name
       FROM bookings b
       JOIN users s ON b.seeker_id = s.user_id
       JOIN users p ON b.provider_id = p.user_id
       JOIN careproviders cp ON b.resource_id = cp.id
       ORDER BY b.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ List bookings error:", err.message);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
}

// ================================
// Get unverified careproviders
// ================================
export async function listUnverifiedCareproviders(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, specialization, hourly_rate, verification_doc_url, created_at
       FROM careproviders
       WHERE is_verified = 0`
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ List unverified caregivers error:", err.message);
    res.status(500).json({ error: "Failed to fetch unverified caregivers" });
  }
}

// ================================
// Delete a user (optional admin action)
// ================================
export async function deleteUser(req, res) {
  try {
    const [result] = await pool.query(
      "DELETE FROM users WHERE user_id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("❌ Delete user error:", err.message);
    res.status(500).json({ error: "Failed to delete user" });
  }
}
