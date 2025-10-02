-- CareConnect required schema (idempotent-safe)

-- Users table
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Unique email index
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique ON users(email);

-- Careproviders table
CREATE TABLE IF NOT EXISTS careproviders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  created_by INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  specialization VARCHAR(255) NULL,
  hourly_rate DECIMAL(10,2) NULL,
  experience_years INT NULL,
  service_radius_km INT NULL,
  address VARCHAR(255) NULL,
  phone VARCHAR(50) NULL,
  mail VARCHAR(255) NULL,
  available_at VARCHAR(255) NULL,
  category VARCHAR(255) NULL,
  image VARCHAR(500) NULL,
  verification_doc_url VARCHAR(500) NULL,
  is_verified TINYINT(1) NOT NULL DEFAULT 0,
  verified_by INT NULL,
  verification_expiry DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_careproviders_user FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- Add/ensure columns (safe alterations)
ALTER TABLE careproviders 
  ADD COLUMN IF NOT EXISTS is_verified TINYINT(1) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS verification_doc_url VARCHAR(500) NULL,
  ADD COLUMN IF NOT EXISTS verified_by INT NULL,
  ADD COLUMN IF NOT EXISTS verification_expiry DATETIME NULL;

-- Optional: index for admin listings of unverified providers
CREATE INDEX IF NOT EXISTS idx_careproviders_is_verified ON careproviders(is_verified);


