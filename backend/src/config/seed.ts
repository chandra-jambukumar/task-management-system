import initSqlJs from 'sql.js';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const dbPath = path.join(__dirname, '../../data/database.sqlite');

async function seedDatabase() {
  console.log('Seeding database with demo user...');

  const SQL = await initSqlJs();
  
  if (!fs.existsSync(dbPath)) {
    console.error('Database not found! Run migrations first.');
    process.exit(1);
  }

  const buffer = fs.readFileSync(dbPath);
  const db = new SQL.Database(buffer);

  // Create a demo user
  const demoEmail = 'demo@example.com';
  const demoPassword = 'demo123';
  const demoName = 'Demo User';

  // Check if demo user already exists
  const stmt = db.prepare('SELECT id FROM users WHERE email = ?');
  stmt.bind([demoEmail]);
  const existingUser = stmt.step() ? stmt.getAsObject() : null;
  stmt.free();

  if (existingUser) {
    console.log('✓ Demo user already exists');
    console.log(`  Email: ${demoEmail}`);
    console.log(`  Password: ${demoPassword}`);
  } else {
    // Hash password
    const passwordHash = bcrypt.hashSync(demoPassword, 10);
    const id = Array.from({ length: 32 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    // Insert demo user
    db.run(
      'INSERT INTO users (id, email, password_hash, name) VALUES (?, ?, ?, ?)',
      [id, demoEmail, passwordHash, demoName]
    );

    // Save database
    const data = db.export();
    const outputBuffer = Buffer.from(data);
    fs.writeFileSync(dbPath, outputBuffer);

    console.log('✓ Demo user created successfully!');
    console.log('');
    console.log('Login credentials:');
    console.log(`  Email: ${demoEmail}`);
    console.log(`  Password: ${demoPassword}`);
    console.log('');
  }

  db.close();
}

seedDatabase().catch(console.error);
