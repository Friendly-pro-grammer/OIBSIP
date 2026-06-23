/* ========================================
   TaskFlow — Smart To-Do List
   Vanilla JavaScript Application
   ======================================== */

(function () {
  'use strict';

  // ─── Storage Key ───────────────────────────
  const STORAGE_KEY = 'taskflow_tasks';

  // ─── DOM References ────────────────────────
  const taskInput     = document.getElementById('task-input');
  const addBtn        = document.getElementById('add-task-btn');
  const charCount     = document.getElementById('char-count');
  const pendingList   = document.getElementById('pending-list');
  const completedList = document.getElementById('completed-list');
  const pendingEmpty  = document.getElementById('pending-empty');
  const completedEmpty= document.getElementById('completed-empty');
  const pendingCount  = document.getElementById('pending-count');
  const completedCount= document.getElementById('completed-count');

  // ─── State ─────────────────────────────────
  let tasks = loadTasks();

  // ─── Helpers ───────────────────────────────
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function formatTimestamp(iso) {
    const date = new Date(iso);
    const now = new Date();
    const diff = now - date;

    // Less than 1 minute
    if (diff < 60_000) return 'Just now';

    // Less than 1 hour
    if (diff < 3_600_000) {
      const mins = Math.floor(diff / 60_000);
      return `${mins}m ago`;
    }

    // Less than 24 hours
    if (diff < 86_400_000) {
      const hrs = Math.floor(diff / 3_600_000);
      return `${hrs}h ago`;
    }

    // Same year
    const options = { month: 'short', day: 'numeric' };
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString('en-US', options) + ', ' +
             date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    // Different year
    options.year = 'numeric';
    return date.toLocaleDateString('en-US', options);
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ─── Persistence ───────────────────────────
  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // Silently fail on quota exceeded
    }
  }

  // ─── Create Task Element ───────────────────
  function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed-item' : '');
    li.dataset.id = task.id;

    // Checkbox
    const checkbox = document.createElement('button');
    checkbox.className = 'task-checkbox' + (task.completed ? ' checked' : '');
    checkbox.setAttribute('aria-label', task.completed ? 'Mark as pending' : 'Mark as complete');
    checkbox.innerHTML = `
      <svg viewBox="0 0 14 14" fill="none">
        <path d="M3 7L6 10L11 4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    checkbox.addEventListener('click', () => toggleComplete(task.id));

    // Content
    const content = document.createElement('div');
    content.className = 'task-content';

    const textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    textSpan.textContent = task.text;

    const meta = document.createElement('div');
    meta.className = 'task-meta';

    // Added timestamp
    const addedSpan = document.createElement('span');
    addedSpan.innerHTML = `
      <svg viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.2"/>
        <path d="M6 3.5V6.5L8 7.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
      </svg>
      Added ${formatTimestamp(task.createdAt)}
    `;
    meta.appendChild(addedSpan);

    // Completed timestamp
    if (task.completed && task.completedAt) {
      const completedSpan = document.createElement('span');
      completedSpan.innerHTML = `
        <svg viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.2"/>
          <path d="M4 6L5.5 7.5L8.5 4.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
        Done ${formatTimestamp(task.completedAt)}
      `;
      meta.appendChild(completedSpan);
    }

    content.appendChild(textSpan);
    content.appendChild(meta);

    // Actions
    const actions = document.createElement('div');
    actions.className = 'task-actions';

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.className = 'action-btn btn-edit';
    editBtn.setAttribute('aria-label', 'Edit task');
    editBtn.innerHTML = `
      <svg viewBox="0 0 16 16" fill="none">
        <path d="M11.5 2.5L13.5 4.5L5 13H3V11L11.5 2.5Z" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    editBtn.addEventListener('click', () => startEdit(task.id, li));

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'action-btn btn-delete';
    deleteBtn.setAttribute('aria-label', 'Delete task');
    deleteBtn.innerHTML = `
      <svg viewBox="0 0 16 16" fill="none">
        <path d="M3 4.5H13M6.5 7V11.5M9.5 7V11.5M4 4.5L4.75 13C4.75 13.5523 5.19772 14 5.75 14H10.25C10.8023 14 11.25 13.5523 11.25 13L12 4.5M6 4.5V2.5C6 2.22386 6.22386 2 6.5 2H9.5C9.77614 2 10 2.22386 10 2.5V4.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    // Assemble
    li.appendChild(checkbox);
    li.appendChild(content);
    li.appendChild(actions);

    return li;
  }

  // ─── Render ────────────────────────────────
  function render() {
    const pending = tasks.filter(t => !t.completed);
    const completed = tasks.filter(t => t.completed);

    // Clear lists
    pendingList.innerHTML = '';
    completedList.innerHTML = '';

    // Render pending
    pending.forEach((task, i) => {
      const el = createTaskElement(task);
      el.style.animationDelay = `${i * 0.04}s`;
      pendingList.appendChild(el);
    });

    // Render completed (newest first)
    completed
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .forEach((task, i) => {
        const el = createTaskElement(task);
        el.style.animationDelay = `${i * 0.04}s`;
        completedList.appendChild(el);
      });

    // Update counts
    pendingCount.textContent = pending.length;
    completedCount.textContent = completed.length;

    // Toggle empty states
    pendingEmpty.classList.toggle('visible', pending.length === 0);
    completedEmpty.classList.toggle('visible', completed.length === 0);

    saveTasks();
  }

  // ─── Add Task ──────────────────────────────
  function addTask() {
    const text = taskInput.value.trim();
    if (!text) {
      taskInput.focus();
      // Quick shake animation
      taskInput.parentElement.style.animation = 'none';
      taskInput.parentElement.offsetHeight; // reflow
      taskInput.parentElement.style.animation = '';
      return;
    }

    const task = {
      id: generateId(),
      text: text,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    };

    tasks.unshift(task);
    taskInput.value = '';
    updateCharCount();
    render();
    taskInput.focus();
  }

  // ─── Toggle Complete ───────────────────────
  function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    // Find the DOM element for animation
    const li = document.querySelector(`[data-id="${id}"]`);
    if (li) {
      li.classList.add('task-completing');
    }

    setTimeout(() => {
      task.completed = !task.completed;
      task.completedAt = task.completed ? new Date().toISOString() : null;
      render();
    }, 200);
  }

  // ─── Delete Task ───────────────────────────
  function deleteTask(id) {
    const li = document.querySelector(`[data-id="${id}"]`);
    if (li) {
      li.classList.add('task-removing');
      setTimeout(() => {
        tasks = tasks.filter(t => t.id !== id);
        render();
      }, 350);
    } else {
      tasks = tasks.filter(t => t.id !== id);
      render();
    }
  }

  // ─── Inline Edit ───────────────────────────
  function startEdit(id, li) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const content = li.querySelector('.task-content');
    const actions = li.querySelector('.task-actions');
    const originalText = task.text;

    // Replace content with input
    content.innerHTML = '';
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'edit-input';
    input.value = task.text;
    input.maxLength = 120;
    content.appendChild(input);

    // Replace actions with save/cancel
    actions.innerHTML = '';
    actions.className = 'task-actions edit-actions';
    actions.style.opacity = '1';

    const saveBtn = document.createElement('button');
    saveBtn.className = 'action-btn btn-save';
    saveBtn.setAttribute('aria-label', 'Save edit');
    saveBtn.innerHTML = `
      <svg viewBox="0 0 16 16" fill="none">
        <path d="M3 8L6.5 11.5L13 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'action-btn btn-cancel';
    cancelBtn.setAttribute('aria-label', 'Cancel edit');
    cancelBtn.innerHTML = `
      <svg viewBox="0 0 16 16" fill="none">
        <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      </svg>
    `;

    function saveEdit() {
      const newText = input.value.trim();
      if (newText && newText !== originalText) {
        task.text = newText;
      }
      render();
    }

    function cancelEdit() {
      render();
    }

    saveBtn.addEventListener('click', saveEdit);
    cancelBtn.addEventListener('click', cancelEdit);

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') saveEdit();
      if (e.key === 'Escape') cancelEdit();
    });

    actions.appendChild(saveBtn);
    actions.appendChild(cancelBtn);

    // Focus input and select text
    requestAnimationFrame(() => {
      input.focus();
      input.select();
    });
  }

  // ─── Character Count ──────────────────────
  function updateCharCount() {
    const len = taskInput.value.length;
    charCount.textContent = `${len} / 120`;
    charCount.classList.toggle('warning', len >= 100 && len < 120);
    charCount.classList.toggle('limit', len >= 120);
  }

  // ─── Event Listeners ──────────────────────
  addBtn.addEventListener('click', addTask);

  taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTask();
  });

  taskInput.addEventListener('input', updateCharCount);

  // ─── Init ──────────────────────────────────
  render();
  taskInput.focus();

  // Refresh relative timestamps every minute
  setInterval(() => {
    document.querySelectorAll('.task-meta').forEach((meta) => {
      // Re-render would be heavy; this lightweight interval is fine for a small app
    });
    render();
  }, 60_000);

})();
