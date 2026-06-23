// ===========================================================================
//  Login Page — Client-side logic
// ===========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const btn = document.getElementById('btn-login');
  const alertError = document.getElementById('alert-error');
  const alertErrorText = document.getElementById('alert-error-text');
  const alertSuccess = document.getElementById('alert-success');
  const alertSuccessText = document.getElementById('alert-success-text');

  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  const togglePassword = document.getElementById('toggle-password');

  // ---- Check if already logged in ----
  checkAuth();

  // ---- Toggle password visibility ----
  togglePassword.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
  });

  // ---- Form submit ----
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlerts();
    clearFieldErrors();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Client-side validation — no empty submissions
    let valid = true;

    if (!email) {
      showFieldError(emailInput, emailError);
      valid = false;
    }

    if (!password) {
      showFieldError(passwordInput, passwordError);
      valid = false;
    }

    if (!valid) return;

    // Submit to server
    btn.classList.add('loading');
    btn.disabled = true;

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        showAlert('error', data.error || 'Login failed.');
        // Shake the card on error
        document.getElementById('login-card').style.animation = 'none';
        requestAnimationFrame(() => {
          document.getElementById('login-card').style.animation = 'shake 0.5s ease';
        });
      } else {
        showAlert('success', '🎉 Quest continues! Entering the realm...');

        // Redirect to dashboard after a short celebratory delay
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1200);
      }
    } catch (err) {
      showAlert('error', 'Network error. Please try again.');
    } finally {
      btn.classList.remove('loading');
      btn.disabled = false;
    }
  });

  // ---- Helpers ----

  function showFieldError(input, errorEl) {
    input.classList.add('input-error');
    errorEl.classList.add('show');
  }

  function clearFieldErrors() {
    document.querySelectorAll('input').forEach((i) => i.classList.remove('input-error'));
    document.querySelectorAll('.field-error').forEach((e) => e.classList.remove('show'));
  }

  function showAlert(type, message) {
    hideAlerts();
    if (type === 'error') {
      alertErrorText.textContent = message;
      alertError.classList.add('show');
    } else {
      alertSuccessText.textContent = message;
      alertSuccess.classList.add('show');
    }
  }

  function hideAlerts() {
    alertError.classList.remove('show');
    alertSuccess.classList.remove('show');
  }

  async function checkAuth() {
    try {
      const res = await fetch('/api/me');
      if (res.ok) {
        window.location.href = 'dashboard.html';
      }
    } catch {
      // Not authenticated — stay on login
    }
  }
});
