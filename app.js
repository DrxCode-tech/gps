let watchID = null;

// DOM elements
const output = document.getElementById("locationOutput");
const logContainer = document.getElementById("logContainer");

// Load logs on start
loadLogs();

document.getElementById("startTracking").addEventListener("click", () => {
    if (!navigator.geolocation) {
        output.innerHTML = "<p style='color:red;'>Geolocation not supported.</p>";
        return;
    }

    output.innerHTML = "<p>Tracking started… waiting for GPS signal.</p>";

    watchID = navigator.geolocation.watchPosition(
        positionSuccess,
        positionError,
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 15000
        }
    );
});

document.getElementById("stopTracking").addEventListener("click", () => {
    if (watchID !== null) {
        navigator.geolocation.clearWatch(watchID);
        watchID = null;
        output.innerHTML = "<p>Tracking stopped.</p>";
    }
});

document.getElementById("clearLogs").addEventListener("click", () => {
    localStorage.removeItem("gps_logs");
    logContainer.innerHTML = "";
});

// -----------------------
// SUCCESS HANDLER
// -----------------------
function positionSuccess(pos) {
    const { latitude, longitude, accuracy, speed, heading } = pos.coords;
    const timestamp = new Date(pos.timestamp).toLocaleString();

    // Speed is in m/s → convert to km/h
    const kmh = speed ? (speed * 3.6).toFixed(2) : 0;

    output.innerHTML = `
        <h3>Live Position</h3>
        <p><strong>Latitude:</strong> ${latitude}</p>
        <p><strong>Longitude:</strong> ${longitude}</p>
        <p><strong>Accuracy:</strong> ${accuracy} meters</p>
        <p><strong>Speed:</strong> ${kmh} km/h</p>
        <p><strong>Direction:</strong> ${heading ?? "Not Available"}</p>
        <p><strong>Time:</strong> ${timestamp}</p>
    `;

    saveLog({ latitude, longitude, accuracy, kmh, heading, timestamp });
    loadLogs();
}

// -----------------------
// ERROR HANDLER
// -----------------------
function positionError(err) {
    let msg = "Unknown error";
    if (err.code === 1) msg = "Permission denied";
    if (err.code === 2) msg = "Position unavailable";
    if (err.code === 3) msg = "Request timed out (GPS weak)";

    output.innerHTML = `<p style="color:red;">${msg}</p>`;
}

// -----------------------
// SAVE LOG TO LOCALSTORAGE
// -----------------------
function saveLog(data) {
    let logs = JSON.parse(localStorage.getItem("gps_logs")) || [];
    logs.push(data);
    localStorage.setItem("gps_logs", JSON.stringify(logs));
}

// -----------------------
// LOAD LOGS TO SCREEN
// -----------------------
function loadLogs() {
    let logs = JSON.parse(localStorage.getItem("gps_logs")) || [];
    logContainer.innerHTML = logs
        .map(log => `
            <div class="log-item">
                <p>📍 <strong>${log.latitude}, ${log.longitude}</strong></p>
                <p>Accuracy: ${log.accuracy}m – Speed: ${log.kmh} km/h</p>
                <p>Heading: ${log.heading} – Time: ${log.timestamp}</p>
            </div>
        `)
        .join("");
}
