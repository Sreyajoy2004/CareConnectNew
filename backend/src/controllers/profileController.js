import pool from "../config/db.js";

// ✅ Get profile (works for both seeker & provider)
export async function getProfile(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT 
          u.user_id, u.name, u.email, u.role, u.created_at AS member_since,
          c.address, c.description AS bio, c.category AS specialties,
          c.experience_years, c.available_at AS availability,
          c.verification_doc_url AS certificates,
          c.is_verified
       FROM users u
       LEFT JOIN careproviders c ON u.user_id = c.created_by
       WHERE u.user_id = ?`,
      [req.user.userId]
    );

    if (rows.length === 0) return res.status(404).json({ error: "Profile not found" });

    const profile = rows[0];

    // Convert specialties string → array (if stored as comma-separated)
    if (profile.specialties) {
      profile.specialties = profile.specialties.split(",").map(s => s.trim());
    }

    // Convert certificates string → array (future: could use separate table)
    if (profile.certificates) {
      profile.certificates = profile.certificates.split(",").map(c => c.trim());
    }

    res.json(profile);
  } catch (err) {
    console.error("❌ Get profile error:", err.message);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
}

// ✅ Update profile (role-based)
export async function updateProfile(req, res) {
  try {
    const { name, email, address, bio, specialties, experience_years, availability, certificates } = req.body;

    // Update basic user fields
    await pool.query(
      "UPDATE users SET name = ?, email = ? WHERE user_id = ?",
      [name, email, req.user.userId]
    );

    // If provider, update extra details in careproviders
    if (req.user.role === "provider") {
      await pool.query(
        `UPDATE careproviders 
         SET address = ?, description = ?, category = ?, experience_years = ?, available_at = ?, verification_doc_url = ?
         WHERE created_by = ?`,
        [
          address,
          bio,
          Array.isArray(specialties) ? specialties.join(",") : specialties,
          experience_years,
          availability,
          Array.isArray(certificates) ? certificates.join(",") : certificates,
          req.user.userId
        ]
      );
    }

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("❌ Update profile error:", err.message);
    res.status(500).json({ error: "Failed to update profile" });
  }
}
