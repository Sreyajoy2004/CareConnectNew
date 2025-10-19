import bcrypt from 'bcrypt';

// Generate password hashes
const password1 = 'demo123';
const password2 = 'admin123';

const hash1 = await bcrypt.hash(password1, 10);
const hash2 = await bcrypt.hash(password2, 10);

console.log('Password hashes:');
console.log('demo123:', hash1);
console.log('admin123:', hash2);

// SQL insert statements
console.log('\nSQL to insert users:');
console.log(`INSERT INTO users (name, email, password_hash, role) VALUES 
('Test User', 'test@example.com', '${hash1}', 'seeker'),
('Maria Caregiver', 'maria@example.com', '${hash1}', 'provider'),
('Admin User', 'admin@example.com', '${hash2}', 'admin');`);
