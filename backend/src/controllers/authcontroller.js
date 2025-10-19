import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ==============================
// Register
// ==============================
export async function register(req, res) {
  const conn = await pool.getConnection();
  try {
    const {
      name, email, password, role, phone,
      description, specialization, hourly_rate,
      experience_years, address, category,
      image, verification_doc_url
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const validRoles = ["seeker", "provider", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: `Invalid role. Must be one of: ${validRoles.join(", ")}` });
    }

    // Ensure email is unique
    const [existing] = await conn.query("SELECT user_id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await conn.beginTransaction();

    // 1️⃣ Insert into users
    const [userResult] = await conn.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
      [name, email, hashed, role]
    );

    const userId = userResult.insertId;

    // 2️⃣ If provider, insert into careproviders
    let careproviderId = null;
    if (role === "provider") {
      const [careResult] = await conn.query(
        `INSERT INTO careproviders 
          (name, description, specialization, hourly_rate, experience_years,
           address, phone, mail, category, image, verification_doc_url, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name,
          description || null,
          specialization || null,
          hourly_rate || null,
          experience_years || null,
          address || null,
          phone || null,
          email,
          category || null,
          image || null,
          verification_doc_url || null,
          userId
        ]
      );
      careproviderId = careResult.insertId;
    }

    await conn.commit();

    const payload = {
      userId,
      role,
      message: role === "provider"
        ? "Provider registered successfully (awaiting admin verification)"
        : "User registered successfully"
    };
    if (careproviderId) payload.careproviderId = careproviderId;

    res.status(201).json(payload);

  } catch (err) {
    await conn.rollback();
    console.error("❌ Registration error:", err);
    res.status(500).json({ error: "Registration failed", details: err.message });
  } finally {
    conn.release();
  }
}
// ==============================
// Login (updated)
// ==============================
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(400).json({ error: "Invalid credentials" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      process.env.JWT_SECRET || "devsecret",
      { expiresIn: "1d" } // ⏳ 1 day
    );

    // ✅ Return full user info for frontend to store
    return res.json({
      message: "Login successful",
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    return res.status(500).json({ error: "Login failed", details: err.message });
  }
}

// ==============================
// Current User Profile
// ==============================
export async function me(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT 
          u.user_id, u.name, u.email, u.role, u.created_at AS member_since,
          c.description AS bio, c.specialization, c.hourly_rate,
          c.experience_years, c.address, c.phone, c.category, c.image,
          c.verification_doc_url AS certificates, c.is_verified
       FROM users u
       LEFT JOIN careproviders c ON u.user_id = c.created_by
       WHERE u.user_id = ?`,
      [req.user.userId]
    );

    if (rows.length === 0) return res.status(404).json({ error: "User not found" });

    const profile = rows[0];

    // Convert certificates (comma-separated string) into array
    if (profile.certificates) {
      profile.certificates = profile.certificates.split(",").map(c => c.trim());
    }

    res.json(profile);
  } catch (err) {
    console.error("❌ Fetch user error:", err);
    res.status(500).json({ error: "Failed to fetch user", details: err.message });
  }
}
