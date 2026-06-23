// ===========================================================================
//  Dashboard Page — Auth guard + UI population
// ===========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const dashboardContent = document.getElementById('dashboard-content');
  const topbar = document.getElementById('topbar');
  const btnLogout = document.getElementById('btn-logout');

  // ---- Auth guard — redirect if not logged in ----
  initDashboard();

  // ---- Logout ----
  btnLogout.addEventListener('click', async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch {
      // Even if server logout fails, clear client state
    }
    window.location.href = 'login.html';
  });

  // ---- Init ----
  async function initDashboard() {
    try {
      const res = await fetch('/api/me');

      if (!res.ok) {
        // Not authenticated — redirect to login
        window.location.href = 'login.html';
        return;
      }

      const data = await res.json();
      const user = data.user;

      // Populate UI
      populateUser(user);

      // Show dashboard
      dashboardContent.style.display = 'block';

      // Animate XP bar after a short delay
      setTimeout(() => {
        animateXP();
      }, 500);

      // Show confetti if coming from login (first visit this session)
      if (!sessionStorage.getItem('confettiShown')) {
        sessionStorage.setItem('confettiShown', 'true');
        setTimeout(() => launchConfetti(), 300);
      }

    } catch {
      window.location.href = 'login.html';
    }
  }

  function populateUser(user) {
    // Avatar (first letter)
    const initial = user.username.charAt(0).toUpperCase();
    document.getElementById('user-avatar').textContent = initial;
    document.getElementById('user-chip-name').textContent = user.username;
    document.getElementById('hero-username').textContent = user.username;

    // Calculate days since account creation
    const createdDate = new Date(user.createdAt);
    const now = new Date();
    const diffDays = Math.max(1, Math.ceil((now - createdDate) / (1000 * 60 * 60 * 24)));
    document.getElementById('stat-days').textContent = diffDays;

    // Gamified stats (simulated based on days active)
    const quests = Math.min(diffDays * 2 + 1, 50);
    const badges = Math.min(2 + Math.floor(diffDays / 3), 15);
    const streak = Math.min(diffDays, 30);
    const level = Math.min(1 + Math.floor(quests / 5), 20);

    document.getElementById('stat-quests').textContent = quests;
    document.getElementById('stat-badges').textContent = badges;
    document.getElementById('stat-streak').textContent = streak;
    document.getElementById('user-level').textContent = level;

    // XP
    const xpMax = level * 500;
    const xpCurrent = Math.floor(Math.random() * xpMax * 0.7 + xpMax * 0.2);
    document.getElementById('xp-text').textContent = `${xpCurrent} / ${xpMax}`;
    document.getElementById('xp-bar-fill').dataset.percent = Math.floor((xpCurrent / xpMax) * 100);

    // Activity timestamps
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const dateStr = createdDate.toLocaleDateString('en-US', options);
    document.getElementById('activity-created').textContent = dateStr;
    document.getElementById('activity-joined').textContent = dateStr;
  }

  function animateXP() {
    const fill = document.getElementById('xp-bar-fill');
    const percent = fill.dataset.percent || 50;
    fill.style.width = percent + '%';
  }

  // ---- Confetti launcher ----
  function launchConfetti() {
    const container = document.getElementById('confetti-container');
    const colors = ['#7c3aed', '#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#ec4899', '#f97316'];
    const shapes = ['circle', 'square'];

    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.classList.add('confetti-piece');

      const color = colors[Math.floor(Math.random() * colors.length)];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const size = Math.random() * 8 + 6;
      const left = Math.random() * 100;
      const delay = Math.random() * 1.5;
      const duration = Math.random() * 2 + 2;

      piece.style.left = left + '%';
      piece.style.width = size + 'px';
      piece.style.height = size + 'px';
      piece.style.backgroundColor = color;
      piece.style.borderRadius = shape === 'circle' ? '50%' : '2px';
      piece.style.animationDelay = delay + 's';
      piece.style.animationDuration = duration + 's';

      container.appendChild(piece);
    }

    // Clean up after animation
    setTimeout(() => {
      container.innerHTML = '';
    }, 5000);
  }
});
