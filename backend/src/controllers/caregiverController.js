import pool from "../config/db.js";

export async function addCaregiver(req, res) {
  try {
    const { name, description, mail, phone, address, availableAt, category, image } = req.body;
    if (!name || !category) {
      return res.status(400).json({ error: "Name and category required" });
    }

    const [result] = await pool.query(
      "INSERT INTO resources (name, description, mail, phone, address, available_at, category, image, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [name, description, mail, phone, address, availableAt, category, image, req.user.userId]
    );

    res.status(201).json({ message: "Caregiver added", id: result.insertId });
  } catch (err) {
    console.error("❌ Add caregiver error:", err.message);
    res.status(500).json({ error: "Failed to add caregiver" });
  }
}

export async function listCaregivers(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM resources WHERE flagged = 0");
    res.json(rows);
  } catch (err) {
    console.error("❌ List caregivers error:", err.message);
    res.status(500).json({ error: "Failed to fetch caregivers" });
  }
}

export async function verifyCaregiver(req, res) {
  try {
    await pool.query("UPDATE resources SET verified = 1 WHERE id = ?", [req.params.id]);
    res.json({ message: "Caregiver verified" });
  } catch (err) {
    console.error("❌ Verify caregiver error:", err.message);
    res.status(500).json({ error: "Failed to verify caregiver" });
  }
}

export async function flagCaregiver(req, res) {
  try {
    await pool.query("UPDATE resources SET flagged = 1 WHERE id = ?", [req.params.id]);
    res.json({ message: "Caregiver flagged" });
  } catch (err) {
    console.error("❌ Flag caregiver error:", err.message);
    res.status(500).json({ error: "Failed to flag caregiver" });
  }
}
