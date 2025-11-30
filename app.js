document.getElementById("getLocationBtn").addEventListener("click", () => {
    const output = document.getElementById("output");
    const mapFrame = document.getElementById("mapFrame");

    // Check if geolocation is supported
    if (!navigator.geolocation) {
        output.innerHTML = "<p style='color:red;'>Geolocation is not supported on this device.</p>";
        return;
    }

    output.innerHTML = "<p>Fetching location…</p>";

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude, accuracy } = position.coords;

            output.innerHTML = `
                <h3>Location Found:</h3>
                <p><strong>Latitude:</strong> ${latitude}</p>
                <p><strong>Longitude:</strong> ${longitude}</p>
                <p><strong>Accuracy:</strong> ${accuracy} meters</p>
            `;

            // Show map
            const mapURL = `https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
            mapFrame.src = mapURL;
            mapFrame.style.display = "block";
        },

        (error) => {
            let msg = "Unknown error";
            if (error.code === 1) msg = "Permission denied";
            if (error.code === 2) msg = "Location unavailable";
            if (error.code === 3) msg = "Request timed out";

            output.innerHTML = `<p style="color:red;">Error: ${msg}</p>`;
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
});
