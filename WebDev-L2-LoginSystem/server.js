const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const USERS_FILE = path.join(__dirname, 'data', 'users.json');

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'gamified-auth-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 2, // 2 hours
      httpOnly: true,
    },
  })
);

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// ---------------------------------------------------------------------------
// Helpers — JSON user store
// ---------------------------------------------------------------------------

function readUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

// ---------------------------------------------------------------------------
// API Routes
// ---------------------------------------------------------------------------

// -------- Register --------------------------------------------------------
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // --- Basic validation ---
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedUsername.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters.' });
    }

    // --- Email format check ---
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    // --- Password validation: min 8 chars, at least 1 number ---
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }
    if (!/\d/.test(password)) {
      return res.status(400).json({ error: 'Password must contain at least 1 number.' });
    }

    // --- Duplicate check ---
    const users = readUsers();
    const duplicate = users.find(
      (u) => u.username.toLowerCase() === trimmedUsername.toLowerCase() || u.email === trimmedEmail
    );
    if (duplicate) {
      return res.status(409).json({ error: 'A user with that username or email already exists.' });
    }

    // --- Hash password ---
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // --- Save user ---
    const newUser = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      username: trimmedUsername,
      email: trimmedEmail,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    writeUsers(users);

    return res.status(201).json({ message: 'Registration successful! You can now log in.' });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// -------- Login -----------------------------------------------------------
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const users = readUsers();
    const user = users.find((u) => u.email === trimmedEmail);

    // Generic error — don't reveal which field is wrong
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. Please try again.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials. Please try again.' });
    }

    // --- Set session ---
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.email = user.email;
    req.session.createdAt = user.createdAt;

    return res.status(200).json({
      message: 'Login successful!',
      user: {
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// -------- Logout ----------------------------------------------------------
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed.' });
    }
    res.clearCookie('connect.sid');
    return res.status(200).json({ message: 'Logged out successfully.' });
  });
});

// -------- Current user (auth check) --------------------------------------
app.get('/api/me', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  return res.status(200).json({
    user: {
      id: req.session.userId,
      username: req.session.username,
      email: req.session.email,
      createdAt: req.session.createdAt,
    },
  });
});

// -------- Default route — redirect to login ------------------------------
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`\n🎮  Auth Server running at  http://localhost:${PORT}`);
  console.log(`    → Login:      http://localhost:${PORT}/login.html`);
  console.log(`    → Register:   http://localhost:${PORT}/register.html`);
  console.log(`    → Dashboard:  http://localhost:${PORT}/dashboard.html\n`);
});
