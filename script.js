const channelID = "3059584";
const readAPIKey = "U7B35D7SL9DRASPL";
const url = `https://api.thingspeak.com/channels/${channelID}/feeds.json?api_key=${readAPIKey}&results=20`;

// Chart instances
let tempChart, humChart, soilChart, ldrChart;

function initCharts() {
    tempChart = createLineChart('tempChart', 'Temperature (°C)', '#ff3b30', 'rgba(255, 59, 48, 0.12)');
    humChart = createLineChart('humChart', 'Humidity (%)', '#00aaff', 'rgba(0, 170, 255, 0.12)');
    soilChart = createLineChart('soilChart', 'Soil Moisture (%)', '#34c759', 'rgba(52, 199, 89, 0.12)');
    ldrChart = createLineChart('ldrChart', 'Light Level (LDR)', '#ffb300', 'rgba(255, 179, 0, 0.12)');
}

function createLineChart(canvasId, label, borderColor, backgroundColor) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: label,
                data: [],
                borderColor: borderColor,
                backgroundColor: backgroundColor,
                borderWidth: 2.5,
                pointRadius: 2.5,
                pointHoverRadius: 5,
                pointBackgroundColor: borderColor,
                fill: true,
                tension: 0.35
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 400 },
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: '#1e293b',
                    titleFont: { family: 'Inter' },
                    bodyFont: { family: 'Inter' },
                    padding: 8,
                    cornerRadius: 6
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: {
                        color: '#94a3b8',
                        font: { family: 'Inter', size: 10 },
                        maxRotation: 0,
                        autoSkip: true,
                        maxTicksLimit: 6
                    }
                },
                y: {
                    grid: { color: '#f1f5f9' },
                    ticks: {
                        color: '#94a3b8',
                        font: { family: 'Inter', size: 10 }
                    }
                }
            }
        }
    });
}

async function fetchData() {
    const tempElem = document.getElementById("temperature");
    const humElem = document.getElementById("humidity");
    const soilElem = document.getElementById("soil");
    const ldrElem = document.getElementById("ldr");
    const statusElem = document.getElementById("connection-status");
    const lastUpdatedElem = document.getElementById("last-updated");

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.feeds && data.feeds.length > 0) {
            const feeds = data.feeds;
            const lastEntry = feeds[feeds.length - 1];

            // 1. Update numeric telemetry widgets
            const tempVal = parseFloat(lastEntry.field1);
            tempElem.textContent = !isNaN(tempVal) ? `${tempVal.toFixed(1)} °C` : (lastEntry.field1 || "N/A");
            
            const humVal = parseFloat(lastEntry.field2);
            humElem.textContent = !isNaN(humVal) ? `${humVal.toFixed(1)} %` : (lastEntry.field2 || "N/A");

            const soilVal = parseFloat(lastEntry.field3);
            soilElem.textContent = !isNaN(soilVal) ? `${soilVal.toFixed(1)} %` : (lastEntry.field3 || "N/A");

            const ldrRaw = String(lastEntry.field4).trim();
            if (ldrRaw === "1" || ldrRaw.toLowerCase() === "light") {
                ldrElem.textContent = "☀️ Daylight";
            } else if (ldrRaw === "0" || ldrRaw.toLowerCase() === "dark") {
                ldrElem.textContent = "🌙 Low Light";
            } else {
                ldrElem.textContent = lastEntry.field4 || "N/A";
            }

            // Update state styling
            [tempElem, humElem, soilElem, ldrElem].forEach(el => {
                el.classList.remove("loading", "error-text");
                el.classList.add("active-value");
            });

            // Update timestamp
            if (statusElem) statusElem.textContent = "Live Feed Connected";
            if (lastUpdatedElem) {
                const now = new Date();
                lastUpdatedElem.textContent = `Updated: ${now.toLocaleTimeString()}`;
            }

            // 2. Extract feed arrays for Chart.js
            const labels = [];
            const tempData = [];
            const humData = [];
            const soilData = [];
            const ldrData = [];

            feeds.forEach(entry => {
                const dateObj = new Date(entry.created_at);
                const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                labels.push(timeStr);

                tempData.push(parseFloat(entry.field1) || 0);
                humData.push(parseFloat(entry.field2) || 0);
                soilData.push(parseFloat(entry.field3) || 0);
                
                const ldrNum = parseFloat(entry.field4);
                ldrData.push(isNaN(ldrNum) ? (String(entry.field4).toLowerCase() === 'light' ? 1 : 0) : ldrNum);
            });

            // Update Chart.js datasets smoothly
            updateChartData(tempChart, labels, tempData);
            updateChartData(humChart, labels, humData);
            updateChartData(soilChart, labels, soilData);
            updateChartData(ldrChart, labels, ldrData);

        } else {
            showErrorState("No Data Received");
        }
    } catch (error) {
        console.error("Error fetching ThingSpeak telemetry:", error);
        showErrorState("Offline / Fetch Error");
    }
}

function updateChartData(chart, labels, data) {
    if (!chart) return;
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update('none'); // Update dataset without heavy full-page re-animations
}

function showErrorState(message) {
    const ids = ["temperature", "humidity", "soil", "ldr"];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = "N/A";
            el.classList.add("error-text");
            el.classList.remove("loading", "active-value");
        }
    });

    const statusElem = document.getElementById("connection-status");
    if (statusElem) statusElem.textContent = message;
}

// Initialize charts on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    fetchData();
    setInterval(fetchData, 5000);
});

