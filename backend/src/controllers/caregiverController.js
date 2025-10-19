import pool from "../config/db.js";

// ================================
// Add caregiver (Provider only)
// ================================
export async function addCaregiver(req, res) {
  try {
    const {
      name,
      description,
      specialization,
      hourly_rate,
      experience_years,
      service_radius_km,
      address,
      phone,
      mail,
      available_at,
      category,
      image
    } = req.body;

    if (!name || !category) {
      return res.status(400).json({ error: "Name and category are required" });
    }

    const [result] = await pool.query(
      `INSERT INTO careproviders 
       (name, description, specialization, hourly_rate, experience_years, service_radius_km, address, phone, mail, available_at, category, image, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, description, specialization, hourly_rate, experience_years,
        service_radius_km, address, phone, mail, available_at, category, image,
        req.user.userId
      ]
    );

    res.status(201).json({ message: "Careprovider added", id: result.insertId });
  } catch (err) {
    console.error("❌ Add caregiver error:", err.message);
    res.status(500).json({ error: "Failed to add caregiver" });
  }
}

// ================================
// List caregivers (public)
// ================================
export async function listCaregivers(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, specialization, hourly_rate, experience_years,
              service_radius_km, address, phone, mail, category, image,
              is_verified
       FROM careproviders
       WHERE is_verified = 1`
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ List caregivers error:", err.message);
    res.status(500).json({ error: "Failed to fetch caregivers" });
  }
}

// ================================
// Provider uploads verification document
// ================================
export async function uploadVerificationDoc(req, res) {
  try {
    const { docUrl } = req.body;
    if (!docUrl) return res.status(400).json({ error: "Document URL is required" });

    const [result] = await pool.query(
      "UPDATE careproviders SET verification_doc_url = ? WHERE id = ? AND created_by = ?",
      [docUrl, req.params.id, req.user.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Careprovider not found or not owned by you" });
    }

    res.json({ message: "Certificate uploaded, pending admin verification" });
  } catch (err) {
    console.error("❌ Upload doc error:", err.message);
    res.status(500).json({ error: "Failed to upload certificate" });
  }
}

// ================================
// Admin verifies caregiver
// ================================
export async function verifyCaregiver(req, res) {
  try {
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1); // 1-year validity

    const [result] = await pool.query(
      "UPDATE careproviders SET is_verified = 1, verified_by = ?, verification_expiry = ? WHERE id = ?",
      [req.user.userId, expiry, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Careprovider not found" });
    }

    res.json({ message: "Careprovider verified by admin" });
  } catch (err) {
    console.error("❌ Verify caregiver error:", err.message);
    res.status(500).json({ error: "Failed to verify caregiver" });
  }
}

// ================================
// Admin flags caregiver
// ================================
export async function flagCaregiver(req, res) {
  try {
    const [result] = await pool.query(
      "UPDATE careproviders SET is_verified = 0 WHERE id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Careprovider not found" });
    }

    res.json({ message: "Careprovider flagged (unverified)" });
  } catch (err) {
    console.error("❌ Flag caregiver error:", err.message);
    res.status(500).json({ error: "Failed to flag caregiver" });
  }
}

// ================================
// Get individual caregiver by ID
// ================================
export async function getCaregiver(req, res) {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT id, name, specialization, hourly_rate, experience_years,
              service_radius_km, address, phone, mail, category, image,
              is_verified, description, available_at
       FROM careproviders
       WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Careprovider not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Get caregiver error:", err.message);
    res.status(500).json({ error: "Failed to fetch caregiver" });
  }
}