# 🌿 IoT Smart Plant Monitoring System

A modern, responsive, real-time web dashboard for monitoring plant environmental metrics (Temperature, Humidity, Soil Moisture, and Light Levels) powered by **ThingSpeak IoT Cloud** and **Chart.js**, ready for instant deployment on **GitHub Pages**.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Status](https://img.shields.io/badge/Status-Deployment--Ready-success)
![Platform](https://img.shields.io/badge/Platform-GitHub%20Pages-brightgreen)
![Tech Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20JS%20%7C%20Chart.js-orange)

---

## 🌟 Key Features

- ⚡ **Real-Time Telemetry**: Automatically polls live sensor values every 5 seconds via ThingSpeak REST API.
- 📊 **Scrollbar-Free Dynamic Charts**: Uses high-performance HTML5 `<canvas>` elements powered by **Chart.js 4.x** with smooth bezier curves and gradient fills.
- 🌿 **Environmental Metrics Monitored**:
  - 🌡️ **Temperature** (°C)
  - 💧 **Ambient Humidity** (%)
  - 🌱 **Soil Moisture** (%)
  - 💡 **Light Level** (Daylight / Low Light)
- 🟢 **Live Status Indicator**: Animated pulse badge and real-time timestamp updates (`Updated: HH:MM:SS`).
- 📱 **Mobile First & Responsive**: CSS Grid & Flexbox layout that scales seamlessly from desktop displays down to mobile screens.
- 🔒 **Secure Client Architecture**: Built using safe DOM methods (`textContent`) to prevent XSS.

---

## 📁 Repository Structure

```
smart-plant-monitoring/
├── index.html     # Dashboard layout & Chart.js canvas containers
├── style.css      # Custom styling, Inter typography, glassmorphism, responsive grid
├── script.js      # Fetch API telemetry handler & dynamic Chart.js updating engine
└── README.md      # Comprehensive repository documentation
```

---

## 🛠️ Tech Stack

| Component | Technology Used |
| :--- | :--- |
| **Frontend Framework** | Pure HTML5, Vanilla JavaScript (ES6+ Async/Await) |
| **Styling** | Modern CSS3 (Variables, Flexbox, Grid, Keyframe Animations) |
| **Charting Engine** | [Chart.js 4.4.1](https://www.chartjs.org/) |
| **IoT Platform** | [ThingSpeak IoT Cloud](https://thingspeak.com/) |
| **Hosting Platform** | [GitHub Pages](https://pages.github.com/) |

---

## 🚀 How to Run Locally

No build step, node modules, or local server required!

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/anand-00281/smart-plant-monitoring.git
   cd smart-plant-monitoring
   ```
2. **Launch the Dashboard**:
   - Simply double-click `index.html` to open it in your browser.
   - Or use VS Code **Live Server** extension or Python HTTP server:
     ```bash
     python -m http.server 8000
     ```

---

## 📡 ThingSpeak Channel Setup

To connect your own IoT sensor device (ESP32, ESP8266, Arduino):

1. Create a channel on [ThingSpeak](https://thingspeak.com/) with 4 fields:
   - **Field 1**: Temperature
   - **Field 2**: Humidity
   - **Field 3**: Soil Moisture
   - **Field 4**: Light Level (LDR)
2. Update the credentials in `script.js`:
   ```javascript
   const channelID = "YOUR_CHANNEL_ID"; // Your ThingSpeak Channel ID
   const readAPIKey = "YOUR_READ_API_KEY"; // Your Read API Key
   ```

---

## 🔒 Security Notes

- **Read API Key (`YOUR_READ_API_KEY`)**: Safe for public repository exposure as it grants **read-only** telemetry access.
- **Write API Key**: **NEVER** expose your Write API key in frontend JS or GitHub code. Keep write credentials stored safely inside your microcontroller firmware.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
