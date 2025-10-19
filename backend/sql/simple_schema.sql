-- CareConnect simplified schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  seeker_id INT NOT NULL,
  provider_id INT NOT NULL,
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
  total_amount DECIMAL(10,2) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_bookings_seeker FOREIGN KEY (seeker_id) REFERENCES users(user_id),
  CONSTRAINT fk_bookings_provider FOREIGN KEY (provider_id) REFERENCES careproviders(id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT NOT NULL,
  resource_id INT NOT NULL,
  seeker_id INT NOT NULL,
  rating INT NOT NULL,
  comment TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reviews_booking FOREIGN KEY (booking_id) REFERENCES bookings(id),
  CONSTRAINT fk_reviews_seeker FOREIGN KEY (seeker_id) REFERENCES users(user_id)
);
