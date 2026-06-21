# TempFlux 🌡️

**TempFlux** is a premium, highly interactive temperature converter web application. Built entirely with vanilla HTML5, CSS3, and JavaScript, it features a glassmorphic user interface, real-time input validations, absolute zero bounds checking, and an interactive thermal-visualizer that changes colors dynamically.

---

## ✨ Features

- **Real-Time Input Validation:** Instantly alerts users when typing non-numeric characters and handles sign inputs (`-`, `.`) seamlessly.
- **Simultaneous Dual Output:** Displays conversions for both alternate temperature units simultaneously (e.g. if Celsius is the input, Fahrenheit and Kelvin are displayed).
- **Absolute Zero Guards:** Prevents calculations below absolute zero with explicit thresholds:
  - **Celsius:** $T < -273.15\text{°C}$
  - **Fahrenheit:** $T < -459.67\text{°F}$
  - **Kelvin:** $T < 0\text{K}$
- **Dynamic Color-Shifting Heat Gauge:** An interactive visualizer showing the temperature relative to freezing ($0\text{°C}$) and boiling ($100\text{°C}$). The hue transitions fluidly from deep freezing blue to hot red.
- **Tactile Segmented Tab Control:** Pure CSS sliding indicator glider for selecting the source unit.
- **Light & Dark Theme Switch:** Fully cohesive dark and light themes with system preference detection and persistence via `localStorage`.
- **Modern Responsive Layout:** Clean glassmorphism styling utilizing `backdrop-filter` and floating background blobs. Fully optimized for desktop, tablet, and mobile displays.

---

## 📂 Project Structure

```
Webdev-L1-TemperatureConverter/
├── index.html       # Application markup and SEO metadata
├── style.css        # Responsive layouts, themes, animations, & glassmorphism variables
├── app.js           # Conversion mathematical models, validations, & UI triggers
└── README.md        # Project guide and documentation
```

---

## 🚀 How to Run the App

Since the application is built entirely with client-side vanilla technologies, there are no dependencies or build steps required.

1. **Direct File Open:**
   - Double-click `index.html` to open the application directly in any modern web browser.

2. **Local Development Server:**
   - If you are using VS Code, you can right-click `index.html` and choose **"Open with Live Server"**.
   - Alternatively, you can run a local server in the project directory using Node.js:
     ```bash
     # Install http-server globally if you haven't
     npm install -g http-server
     
     # Start the server
     http-server .
     ```

---

## 🧮 Mathematical Formulas Used

The conversion models implemented in the core script are:

| Direction | Formula |
| :--- | :--- |
| **Celsius ➡️ Fahrenheit** | $F = (C \times 9/5) + 32$ |
| **Celsius ➡️ Kelvin** | $K = C + 273.15$ |
| **Fahrenheit ➡️ Celsius** | $C = (F - 32) \times 5/9$ |
| **Fahrenheit ➡️ Kelvin** | $K = (F - 32) \times 5/9 + 273.15$ |
| **Kelvin ➡️ Celsius** | $C = K - 273.15$ |
| **Kelvin ➡️ Fahrenheit** | $F = (K - 273.15) \times 9/5 + 32$ |

All outputs are formatted to exactly 2 decimal places to maintain consistency across the visual layout.
