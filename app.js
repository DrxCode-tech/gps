const checkBtn = document.getElementById("checkBtn");
const statusDiv = document.getElementById("status");
const resultDiv = document.getElementById("result");
const logBox = document.getElementById("log");

// YOUR RANGE LIMITS (from your data)
const X_MIN = 5.0390;
const X_MAX = 5.0395;

const Y_MIN = 7.9755;
const Y_MAX = 7.9756;

checkBtn.addEventListener("click", () => {
  statusDiv.textContent = "Collecting location readings...";
  resultDiv.textContent = "—";
  logBox.textContent = "";
  collectAveragedLocation();
});

function collectAveragedLocation() {
  let readingsX = [];
  let readingsY = [];
  let count = 0;
  let totalReadingsRequired = 5;

  const interval = setInterval(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        let lat = parseFloat(pos.coords.latitude.toFixed(4));
        let lon = parseFloat(pos.coords.longitude.toFixed(4));

        readingsX.push(lat);
        readingsY.push(lon);
        count++;

        logBox.textContent += `Reading ${count}:  X=${lat},  Y=${lon}\n`;

        if (count === totalReadingsRequired) {
          clearInterval(interval);
          computeDecision(readingsX, readingsY);
        }
      },
      (err) => {
        logBox.textContent += `ERROR: ${err.message}\n`;
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  }, 1500); // wait 1.5s between each reading for accuracy
}

function computeDecision(xs, ys) {
  const avgX = average(xs);
  const avgY = average(ys);

  logBox.textContent += `\nAverage X: ${avgX}\nAverage Y: ${avgY}\n`;

  const inXRange = avgX >= X_MIN && avgX <= X_MAX;
  const inYRange = avgY >= Y_MIN && avgY <= Y_MAX;

  if (inXRange && inYRange) {
    resultDiv.textContent = "✔ You are inside the correct area.";
    resultDiv.style.color = "#00ff9d";
  } else {
    resultDiv.textContent = "✖ You are NOT in the specified area.";
    resultDiv.style.color = "red";
  }

  statusDiv.textContent = "Done.";
}

function average(arr) {
  return parseFloat((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(4));
}
