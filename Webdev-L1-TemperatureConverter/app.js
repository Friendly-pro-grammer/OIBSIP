/* ==========================================================================
   TempFlux - Main Application Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const tempInput = document.getElementById('temp-input');
  const clearBtn = document.getElementById('clear-btn');
  const errorMessage = document.getElementById('error-message');
  const errorText = errorMessage.querySelector('.error-text');
  const sourceRadios = document.querySelectorAll('input[name="source-unit"]');
  const convertBtn = document.getElementById('convert-btn');
  const converterCard = document.getElementById('converter-card');
  const themeToggle = document.getElementById('theme-toggle');

  // Gauge Visualizer Elements
  const gaugeFill = document.getElementById('gauge-fill');
  const gaugeGlow = document.getElementById('gauge-glow');
  const gaugeValueDisplay = document.getElementById('gauge-value-display');

  // Output Elements
  const outputTitle1 = document.getElementById('output-title-1');
  const outputBadge1 = document.getElementById('output-badge-1');
  const outputVal1 = document.getElementById('output-val-1');
  const outputFormula1 = document.getElementById('output-formula-1');

  const outputTitle2 = document.getElementById('output-title-2');
  const outputBadge2 = document.getElementById('output-badge-2');
  const outputVal2 = document.getElementById('output-val-2');
  const outputFormula2 = document.getElementById('output-formula-2');

  // Absolute Zero constants
  const ABSOLUTE_ZERO = {
    C: -273.15,
    F: -459.67,
    K: 0
  };

  // State
  let currentSourceUnit = 'C';

  // ==========================================================================
  // Theme Switching Logic
  // ==========================================================================
  const initTheme = () => {
    const savedTheme = localStorage.getItem('tempflux-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  };

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('tempflux-theme', newTheme);
  };

  themeToggle.addEventListener('click', toggleTheme);
  initTheme();

  // ==========================================================================
  // Validation and Input Helpers
  // ==========================================================================
  
  // Validate if string is a valid floating point representation
  // Allows signs (-), decimal points (.) while typing
  const isValidFloatInput = (val) => {
    if (val === '' || val === '-' || val === '.' || val === '-.') {
      return true;
    }
    // Match optional negative sign, followed by digits, optional decimal, and optional digits
    const floatRegex = /^-?\d*\.?\d*$/;
    return floatRegex.test(val) && !isNaN(parseFloat(val));
  };

  const isNumeric = (val) => {
    return !isNaN(parseFloat(val)) && isFinite(val);
  };

  const showError = (message) => {
    errorText.textContent = message;
    errorMessage.classList.add('visible');
    converterCard.classList.add('has-error');
  };

  const clearError = () => {
    errorMessage.classList.remove('visible');
    converterCard.classList.remove('has-error');
  };

  const resetOutputs = () => {
    outputVal1.textContent = '--';
    outputVal2.textContent = '--';
    
    // Reset Gauge to 0% neutral
    document.documentElement.style.setProperty('--gauge-percent', '0%');
    document.documentElement.style.setProperty('--gauge-color', 'var(--text-tertiary)');
    gaugeValueDisplay.textContent = '0% Heat';
  };

  // Format output value for display
  const formatValue = (val) => {
    return val.toFixed(2);
  };

  // ==========================================================================
  // Visualizer Color and Percent Interpolator
  // ==========================================================================
  const updateVisualizer = (celsiusValue) => {
    // We map Celsius scale from 0°C (freezing) to 100°C (boiling) for heat percentage
    // Sub-zero is 0%, above boiling is 100%
    let percentage = 0;
    if (celsiusValue > 0) {
      percentage = Math.min((celsiusValue / 100) * 100, 100);
    }

    // Interpolate hue from 220 (cool blue) to 0 (hot red)
    // 0% heat = 220 hue (blue)
    // 50% heat = 110 hue (green)
    // 100% heat = 0 hue (red)
    const hue = Math.max(0, 220 - (2.2 * percentage));
    const saturation = 85; // Vibrant color
    const lightness = 55; // Highly readable

    // Apply properties
    document.documentElement.style.setProperty('--gauge-percent', `${percentage}%`);
    document.documentElement.style.setProperty('--gauge-color', `hsl(${hue}, ${saturation}%, ${lightness}%)`);
    gaugeValueDisplay.textContent = `${Math.round(percentage)}% Heat`;
  };

  // ==========================================================================
  // Calculation & Output Handling
  // ==========================================================================
  const calculateConversion = () => {
    const inputVal = tempInput.value.trim();

    // Handle empty state
    if (inputVal === '') {
      clearError();
      resetOutputs();
      return;
    }

    // Validate overall number format
    if (!isNumeric(inputVal)) {
      showError('Please enter a valid number (e.g., 25, -10.5).');
      resetOutputs();
      return;
    }

    const temp = parseFloat(inputVal);

    // Validate Absolute Zero limit
    if (temp < ABSOLUTE_ZERO[currentSourceUnit]) {
      const limitString = `${ABSOLUTE_ZERO[currentSourceUnit]}°${currentSourceUnit}`;
      showError(`Temperature cannot be below absolute zero (${limitString}).`);
      resetOutputs();
      return;
    }

    // Clear any previous error if all is valid
    clearError();

    // Conduct calculations and update output displays
    let c, f, k;

    if (currentSourceUnit === 'C') {
      c = temp;
      f = (temp * 9/5) + 32;
      k = temp + 273.15;

      // Update Outputs
      outputVal1.textContent = formatValue(f);
      outputVal2.textContent = formatValue(k);
    } 
    else if (currentSourceUnit === 'F') {
      c = (temp - 32) * 5/9;
      f = temp;
      k = (temp - 32) * 5/9 + 273.15;

      // Update Outputs
      outputVal1.textContent = formatValue(c);
      outputVal2.textContent = formatValue(k);
    } 
    else if (currentSourceUnit === 'K') {
      c = temp - 273.15;
      f = (temp - 273.15) * 9/5 + 32;
      k = temp;

      // Update Outputs
      outputVal1.textContent = formatValue(c);
      outputVal2.textContent = formatValue(f);
    }

    // Update gauge visualizer using Celsius equivalent
    updateVisualizer(c);
  };

  // Update Output Card labels based on chosen input unit
  const updateOutputLabels = () => {
    if (currentSourceUnit === 'C') {
      // Card 1 = Fahrenheit
      outputTitle1.textContent = 'Fahrenheit';
      outputBadge1.textContent = '°F';
      outputFormula1.textContent = 'Formula: (C × 9/5) + 32';

      // Card 2 = Kelvin
      outputTitle2.textContent = 'Kelvin';
      outputBadge2.textContent = 'K';
      outputFormula2.textContent = 'Formula: C + 273.15';
    } 
    else if (currentSourceUnit === 'F') {
      // Card 1 = Celsius
      outputTitle1.textContent = 'Celsius';
      outputBadge1.textContent = '°C';
      outputFormula1.textContent = 'Formula: (F - 32) × 5/9';

      // Card 2 = Kelvin
      outputTitle2.textContent = 'Kelvin';
      outputBadge2.textContent = 'K';
      outputFormula2.textContent = 'Formula: (F - 32) × 5/9 + 273.15';
    } 
    else if (currentSourceUnit === 'K') {
      // Card 1 = Celsius
      outputTitle1.textContent = 'Celsius';
      outputBadge1.textContent = '°C';
      outputFormula1.textContent = 'Formula: K - 273.15';

      // Card 2 = Fahrenheit
      outputTitle2.textContent = 'Fahrenheit';
      outputBadge2.textContent = '°F';
      outputFormula2.textContent = 'Formula: (K - 273.15) × 9/5 + 32';
    }
  };

  // ==========================================================================
  // Event Listeners
  // ==========================================================================

  // Input listener for real-time validation and calculation
  tempInput.addEventListener('input', (e) => {
    const val = e.target.value;

    // Check formatting on-the-fly to filter out invalid characters
    if (!isValidFloatInput(val)) {
      showError('Please enter a valid number (e.g. digits, minus sign, decimal).');
      resetOutputs();
      return;
    }

    clearError();
    calculateConversion();
  });

  // Clear Input button
  clearBtn.addEventListener('click', () => {
    tempInput.value = '';
    clearError();
    resetOutputs();
    tempInput.focus();
  });

  // Source unit radio selectors
  sourceRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      currentSourceUnit = e.target.value;
      updateOutputLabels();
      calculateConversion();
    });
  });

  // Convert button manual trigger with click animation
  convertBtn.addEventListener('click', () => {
    convertBtn.classList.add('calculating');
    
    // Perform calculation (gives visual confirmation)
    calculateConversion();

    // Trigger micro-interaction timeout
    setTimeout(() => {
      convertBtn.classList.remove('calculating');
    }, 600);
  });
});
