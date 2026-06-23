# 🏰 Quest Auth — Login Authentication System

A full-stack login authentication system with a **gamified light-mode theme**. Built with Node.js, Express, and a JSON file store. Features user registration, login validation, password hashing with bcrypt, session management, and a protected dashboard with XP bars, achievements, and confetti celebrations.

> **OIBSIP Web Dev Level 2 — Task 4**

---

## ✨ Features

- ✅ **Registration Page** — Username, email, and password with a "Register" button
- ✅ **Password Validation** — Minimum 8 characters, at least 1 number (real-time feedback)
- ✅ **Duplicate Check** — Shows error if username or email already exists
- ✅ **Login Page** — Email and password with a "Login" button
- ✅ **Generic Error Handling** — "Invalid credentials" message (doesn't reveal which field is wrong)
- ✅ **Protected Dashboard** — Only accessible after login; redirects to login if accessed directly
- ✅ **Logout** — Clears server session and redirects to login page
- ✅ **Password Hashing** — Uses bcryptjs (10-round salt)
- ✅ **Form Validation** — Client-side and server-side (no empty submissions)
- ✅ **Gamified Theme** — XP bars, level badges, achievements, stats, confetti on login

---

## 🛠️ Tech Stack

| Layer            | Technology        |
| ---------------- | ----------------- |
| Runtime          | Node.js           |
| Framework        | Express.js        |
| Session          | express-session   |
| Password Hashing | bcryptjs          |
| Data Store       | JSON file         |
| Frontend         | HTML + CSS + JS   |
| Font             | Google Fonts (Outfit) |

---

## 📁 Folder Structure

```
WebDev-L2-LoginSystem/
├── server.js              # Express server & API routes
├── package.json           # Dependencies & scripts
├── data/
│   └── users.json         # JSON user store
├── public/
│   ├── css/
│   │   └── style.css      # Gamified light theme
│   ├── js/
│   │   ├── register.js    # Registration logic
│   │   ├── login.js       # Login logic
│   │   └── dashboard.js   # Dashboard logic + auth guard
│   ├── register.html      # Registration page
│   ├── login.html         # Login page
│   └── dashboard.html     # Protected dashboard
└── README.md              # This file
```

---

## 🚀 How to Run

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- npm (comes with Node.js)

### Steps

1. **Clone or navigate to the project directory:**

   ```bash
   cd WebDev-L2-LoginSystem
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the server:**

   ```bash
   npm start
   ```

4. **Open in your browser:**

   ```
   http://localhost:3000
   ```

   You'll be redirected to the **Login** page. Click "Create an account" to register first.

### Development Mode (auto-restart on file changes)

```bash
npm run dev
```

---

## 🎮 How It Works

1. **Register** → Create a new account with username, email, and password
2. **Login** → Enter your email and password to authenticate
3. **Dashboard** → View your gamified profile with XP, stats, and achievements
4. **Logout** → Click the logout button to end your session

### Security Notes

- Passwords are hashed using **bcryptjs** with a 10-round salt before storage
- Server-side sessions (express-session) manage authentication state
- Login errors use a **generic message** to prevent user enumeration
- Input is validated on both **client** and **server** side

---

## 📸 Pages

| Page       | Description                                      |
| ---------- | ------------------------------------------------ |
| `/login.html`     | Login form with email & password          |
| `/register.html`  | Registration form with live password rules|
| `/dashboard.html` | Protected gamified dashboard              |

---

## 📜 License

ISC
