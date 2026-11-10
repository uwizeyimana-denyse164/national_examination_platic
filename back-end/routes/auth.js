const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM Users WHERE UserName = ?', [username]);
    if (!rows.length) return res.status(401).json({ message: 'Invalid credentials' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.Password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    req.session.user = {
      id: user.id,
      username: user.UserName,
      role: user.Role,
    };
    res.json({ message: 'Login successful', user: req.session.user });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body || {};
  const normalizedUsername = typeof username === 'string' ? username.trim() : '';

  if (!/^[A-Za-z0-9_]{3,100}$/.test(normalizedUsername)) {
    return res.status(400).json({ message: 'Username must be 3-100 characters using letters, digits, or _' });
  }
  if (typeof password !== 'string' || Buffer.byteLength(password, 'utf8') < 8 || Buffer.byteLength(password, 'utf8') > 72) {
    return res.status(400).json({ message: 'Password must be 8-72 bytes' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO Users (UserName, Password, Role) VALUES (?, ?, ?)',
      [normalizedUsername, hash, 'staff']
    );
    req.session.user = {
      id: result.insertId,
      username: normalizedUsername,
      role: 'staff',
    };
    res.status(201).json({ message: 'Account created successfully', user: req.session.user });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'That username is already taken' });
    }
    console.error('Registration error:', err.message);
    res.status(500).json({ message: 'Unable to create account' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ message: 'Logged out' }));
});

router.get('/me', (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: 'Not authenticated' });
  res.json(req.session.user);
});

module.exports = router;
