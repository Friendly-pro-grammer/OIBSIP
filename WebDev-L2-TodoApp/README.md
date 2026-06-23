# TaskFlow — Smart To-Do List ✅

A sleek, interactive to-do list application built with **HTML5**, **CSS3**, and **Vanilla JavaScript**. Manage your daily tasks with ease — add, edit, complete, and delete tasks, all organized into dedicated Pending and Completed lists.

> **Live Preview:** Open `index.html` in any modern browser — no build step required.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Add Tasks** | Type a task and click "Add Task" or press `Enter` |
| **Mark Complete** | Click the checkbox to move a task between Pending ↔ Completed |
| **Inline Editing** | Click the edit icon to modify task text in-place; save with `Enter` or cancel with `Esc` |
| **Delete Tasks** | Permanently remove any task with the trash icon |
| **Task Counts** | Real-time counters showing pending and completed task totals |
| **Timestamps** | Each task displays when it was added and (if completed) when it was finished |
| **Persistent Storage** | All tasks survive page refreshes via `localStorage` |
| **Empty States** | Friendly messages when either list is empty |
| **Character Limit** | 120-character limit with visual feedback |
| **Responsive Design** | Fully responsive from mobile to desktop |

---

## 🎨 Design Highlights

- **Dark glassmorphism** aesthetic with backdrop-blur cards
- **Animated gradient blobs** in the background for a dynamic, living feel
- **Smooth micro-animations** — slide-in for new tasks, fade-out on delete, pop on complete
- **Hover-reveal actions** — edit/delete buttons appear on task hover (always visible on mobile)
- **Google Fonts** — Inter for clean, modern typography
- **Custom scrollbar** styling for a polished look

---

## 🛠 Tech Stack

| Technology | Usage |
|---|---|
| **HTML5** | Semantic document structure |
| **CSS3** | Custom properties, glassmorphism, keyframe animations, flexbox |
| **JavaScript (ES6+)** | DOM manipulation, localStorage, event handling |

No frameworks, no build tools, no dependencies — just pure web standards.

---

## 📂 Project Structure

```
WebDev-L2-TodoApp/
├── index.html      → Main HTML structure
├── style.css       → Complete stylesheet with design system
├── script.js       → Application logic and state management
└── README.md       → Project documentation (this file)
```

---

## 🚀 Getting Started

1. **Clone or download** the project folder.
2. **Open** `index.html` in a browser (Chrome, Firefox, Edge, Safari).
3. Start adding tasks!

No installation, no `npm install`, no server setup needed.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `Enter` | Add a new task / Save an edit |
| `Escape` | Cancel an edit |

---

## 📱 Responsive Breakpoints

| Viewport | Behavior |
|---|---|
| **> 600px** | Side-by-side action reveal on hover |
| **≤ 600px** | Stacked input, always-visible actions |
| **≤ 380px** | Compact typography and layout |

---

## 💾 Data Persistence

Tasks are automatically saved to `localStorage` under the key `taskflow_tasks`. Data persists across:
- Page refreshes
- Browser restarts
- Tab closures

To reset all tasks, clear your browser's local storage for the page or run in the console:

```js
localStorage.removeItem('taskflow_tasks');
location.reload();
```

---

## 📄 License

This project is part of the **OIBSIP Web Development Level 2** internship tasks.  
Built with ♥ — © 2026
