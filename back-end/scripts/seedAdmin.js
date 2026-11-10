require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('../db');

async function seedAdmin() {
  const passwordHash = await bcrypt.hash('admin12345', 10);
  await db.query(
    `INSERT INTO Users (UserName, Password, Role) VALUES (?, ?, 'admin')
     ON DUPLICATE KEY UPDATE Password = ?, Role = 'admin'`,
    ['admin', passwordHash, passwordHash]
  );
  console.log('Admin account is ready (username: admin).');
}

seedAdmin()
  .catch((err) => {
    console.error('Admin setup failed:', err.message);
    process.exitCode = 1;
  })
  .finally(() => db.end());
