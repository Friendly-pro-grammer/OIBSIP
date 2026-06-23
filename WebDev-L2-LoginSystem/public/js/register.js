// ===========================================================================
//  Register Page — Client-side logic
// ===========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('register-form');
  const btn = document.getElementById('btn-register');
  const alertError = document.getElementById('alert-error');
  const alertErrorText = document.getElementById('alert-error-text');
  const alertSuccess = document.getElementById('alert-success');
  const alertSuccessText = document.getElementById('alert-success-text');

  const usernameInput = document.getElementById('username');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  const usernameError = document.getElementById('username-error');
  const emailError = document.getElementById('email-error');

  const ruleLength = document.getElementById('rule-length');
  const ruleNumber = document.getElementById('rule-number');
  const togglePassword = document.getElementById('toggle-password');

  // ---- Check if already logged in ----
  checkAuth();

  // ---- Toggle password visibility ----
  togglePassword.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
  });

  // ---- Real-time password validation ----
  passwordInput.addEventListener('input', () => {
    const val = passwordInput.value;
    updateRule(ruleLength, val.length >= 8);
    updateRule(ruleNumber, /\d/.test(val));
  });

  // ---- Form submit ----
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlerts();
    clearFieldErrors();

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Client-side validation
    let valid = true;

    if (!username || username.length < 3) {
      showFieldError(usernameInput, usernameError);
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showFieldError(emailInput, emailError);
      valid = false;
    }

    if (password.length < 8 || !/\d/.test(password)) {
      passwordInput.classList.add('input-error');
      valid = false;
    }

    if (!valid) return;

    // Submit to server
    btn.classList.add('loading');
    btn.disabled = true;

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        showAlert('error', data.error || 'Registration failed.');
      } else {
        showAlert('success', data.message || 'Account created! Redirecting...');
        form.reset();
        resetPasswordRules();

        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1500);
      }
    } catch (err) {
      showAlert('error', 'Network error. Please try again.');
    } finally {
      btn.classList.remove('loading');
      btn.disabled = false;
    }
  });

  // ---- Helpers ----

  function updateRule(el, isValid) {
    if (isValid) {
      el.classList.add('valid');
      el.querySelector('.rule-icon').textContent = '✅';
    } else {
      el.classList.remove('valid');
      el.querySelector('.rule-icon').textContent = '⭕';
    }
  }

  function resetPasswordRules() {
    updateRule(ruleLength, false);
    updateRule(ruleNumber, false);
  }

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
      // Not authenticated — stay on register
    }
  }
});
