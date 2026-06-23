/**
 * Calculator – Vanilla JavaScript
 * All event listeners are attached via JS (no inline onclick).
 */

;(function () {
  'use strict';

  /* ── State ────────────────────────────── */
  let currentOperand  = '0';
  let previousOperand = '';
  let operator        = null;
  let shouldReset     = false;

  /* ── DOM refs ─────────────────────────── */
  const displayCurrent    = document.getElementById('display-current');
  const displayExpression = document.getElementById('display-expression');
  const btnGrid           = document.getElementById('btn-grid');

  /* ── Helpers ──────────────────────────── */
  function updateDisplay() {
    displayCurrent.textContent = currentOperand;
    pop(displayCurrent);
  }

  function updateExpression(text) {
    displayExpression.textContent = text;
  }

  function pop(el) {
    el.classList.remove('pop');
    // Force reflow so the animation restarts
    void el.offsetWidth;
    el.classList.add('pop');
  }

  function showError(msg) {
    currentOperand = msg;
    displayCurrent.textContent = msg;
    displayCurrent.classList.add('error');
    setTimeout(() => displayCurrent.classList.remove('error'), 600);
    shouldReset = true;
  }

  function formatNumber(num) {
    if (!isFinite(num)) return String(num);
    // Show up to 10 significant digits, strip trailing zeros
    const str = parseFloat(num.toPrecision(12)).toString();
    return str.length > 14 ? parseFloat(num.toPrecision(8)).toString() : str;
  }

  /* ── Core operations ──────────────────── */
  function compute(a, op, b) {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    if (isNaN(numA) || isNaN(numB)) return null;

    switch (op) {
      case '+': return numA + numB;
      case '−': return numA - numB;
      case '×': return numA * numB;
      case '÷':
        if (numB === 0) return 'DIV_ZERO';
        return numA / numB;
      default:  return null;
    }
  }

  /* ── Actions ──────────────────────────── */
  function inputNumber(value) {
    if (shouldReset) {
      currentOperand = '';
      shouldReset = false;
    }
    // Limit length
    if (currentOperand.replace('.', '').length >= 15) return;

    if (currentOperand === '0' && value !== '.') {
      currentOperand = value;
    } else {
      currentOperand += value;
    }
    updateDisplay();
  }

  function inputDecimal() {
    if (shouldReset) {
      currentOperand = '0';
      shouldReset = false;
    }
    if (currentOperand.includes('.')) return;
    currentOperand += '.';
    updateDisplay();
  }

  function inputOperator(op) {
    // Remove active class from all operator buttons
    document.querySelectorAll('.btn--operator').forEach(b => b.classList.remove('active'));

    // If user is chaining operators
    if (operator && !shouldReset) {
      const result = compute(previousOperand, operator, currentOperand);
      if (result === 'DIV_ZERO') {
        showError('Cannot ÷ by 0');
        operator = null;
        previousOperand = '';
        updateExpression('');
        return;
      }
      if (result === null) return;
      previousOperand = formatNumber(result);
      currentOperand  = previousOperand;
      updateDisplay();
    } else {
      previousOperand = currentOperand;
    }

    operator    = op;
    shouldReset = true;
    updateExpression(`${previousOperand} ${op}`);

    // Highlight active operator
    const activeBtn = document.querySelector(`.btn--operator[data-value="${op}"]`);
    if (activeBtn) activeBtn.classList.add('active');
  }

  function inputEquals() {
    document.querySelectorAll('.btn--operator').forEach(b => b.classList.remove('active'));

    if (!operator || shouldReset && previousOperand === '') return;

    const result = compute(previousOperand, operator, currentOperand);
    if (result === 'DIV_ZERO') {
      showError('Cannot ÷ by 0');
      updateExpression('');
      operator = null;
      previousOperand = '';
      return;
    }
    if (result === null) return;

    updateExpression(`${previousOperand} ${operator} ${currentOperand} =`);
    currentOperand  = formatNumber(result);
    operator        = null;
    previousOperand = '';
    shouldReset     = true;
    updateDisplay();
  }

  function inputClear() {
    currentOperand  = '0';
    previousOperand = '';
    operator        = null;
    shouldReset     = false;
    displayCurrent.classList.remove('error');
    document.querySelectorAll('.btn--operator').forEach(b => b.classList.remove('active'));
    updateDisplay();
    updateExpression('');
  }

  function inputBackspace() {
    if (shouldReset) return;
    if (currentOperand.length <= 1 || (currentOperand.length === 2 && currentOperand[0] === '-')) {
      currentOperand = '0';
    } else {
      currentOperand = currentOperand.slice(0, -1);
    }
    updateDisplay();
  }

  function inputPercent() {
    if (currentOperand === '0') return;
    const num = parseFloat(currentOperand);
    if (isNaN(num)) return;
    currentOperand = formatNumber(num / 100);
    shouldReset = true;
    updateDisplay();
  }

  /* ── Event Delegation ─────────────────── */
  btnGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;

    // Set ripple position
    const rect = btn.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(0);
    const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(0);
    btn.style.setProperty('--ripple-x', x + '%');
    btn.style.setProperty('--ripple-y', y + '%');

    const action = btn.dataset.action;
    const value  = btn.dataset.value;

    switch (action) {
      case 'number':    inputNumber(value);   break;
      case 'decimal':   inputDecimal();       break;
      case 'operator':  inputOperator(value); break;
      case 'equals':    inputEquals();        break;
      case 'clear':     inputClear();         break;
      case 'backspace': inputBackspace();     break;
      case 'percent':   inputPercent();       break;
    }
  });

  /* ── Keyboard Support ─────────────────── */
  document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') inputNumber(e.key);
    else if (e.key === '.')            inputDecimal();
    else if (e.key === '+')            inputOperator('+');
    else if (e.key === '-')            inputOperator('−');
    else if (e.key === '*')            inputOperator('×');
    else if (e.key === '/')          { e.preventDefault(); inputOperator('÷'); }
    else if (e.key === 'Enter' || e.key === '=') inputEquals();
    else if (e.key === 'Backspace')    inputBackspace();
    else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') inputClear();
    else if (e.key === '%')            inputPercent();
  });
})();
