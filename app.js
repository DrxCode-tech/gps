const readingsNeeded = 5;

// Your boundary box
const X_MAX = 5.0400;
const X_MIN = 5.0380;

const Y_MAX = 7.9760;
const Y_MIN = 7.9752;

document.getElementById("checkBtn").addEventListener("click", async () => {
    const output = document.getElementById("output");
    output.textContent = "Collecting GPS data...\n";

    const latList = [];
    const lonList = [];

    for (let i = 1; i <= readingsNeeded; i++) {
        const pos = await getPosition();

        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lon = parseFloat(pos.coords.longitude.toFixed(6));

        latList.push(lat);
        lonList.push(lon);

        output.textContent += `Reading ${i}:  Lat=${lat}, Lon=${lon}\n`;
    }

    // Compute averages
    const avgLat = average(latList);
    const avgLon = average(lonList);

    output.textContent += `\nAverage Lat: ${avgLat}`;
    output.textContent += `\nAverage Lon: ${avgLon}\n`;

    const inX = avgLat <= X_MAX && avgLat >= X_MIN;
    const inY = avgLon <= Y_MAX && avgLon >= Y_MIN;

    output.textContent += `\nLatitude in range: ${inX}`;
    output.textContent += `\nLongitude in range: ${inY}\n`;

    if (inX && inY) {
        output.textContent += `\n✅ USER IS WITHIN ALLOWED LOCATION`;
    } else {
        output.textContent += `\n❌ USER IS OUTSIDE LOCATION`;
    }
});

// Helper: get GPS reading (Promise version)
function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            { enableHighAccuracy: true, timeout: 15000 }
        );
    });
}

// Helper: average numbers
function average(arr) {
    return (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(6);
}
