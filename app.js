const checkBtn = document.getElementById("checkBtn");
const output = document.getElementById("output");
console.log("App started");

// YOUR LOCATION RANGE (replace with your real values)
const X_MIN = 5.0390;
const X_MAX = 5.0395;

const Y_MIN = 7.9752;
const Y_MAX = 7.9756;

checkBtn.addEventListener("click", async () => {
  output.innerHTML = "Collecting 5 GPS readings...\n";

  let xs = [];
  let ys = [];

  console.log("Collecting GPS readings");
  for (let i = 0; i < 5; i++) {
    try {
      const pos = await getPosition();
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      xs.push(lat);
      ys.push(lon);

      output.innerHTML += `Reading ${i+1}: lat=${lat}, lon=${lon}\n`;
    } catch (err) {
      output.innerHTML += `ERROR: ${err.message}\n`;
    }

    await delay(1000); // 1 second delay between readings
  }

  if (xs.length < 5) {
    output.innerHTML += "\n❌ Not enough readings. Try again.";
    return;
  }

  // Average
  const avgX = xs.reduce((a,b)=>a+b)/xs.length;
  const avgY = ys.reduce((a,b)=>a+b)/ys.length;

  output.innerHTML += `\nAverage Lat: ${avgX}\nAverage Lon: ${avgY}\n`;

  const insideX = avgX >= X_MIN && avgX <= X_MAX;
  const insideY = avgY >= Y_MIN && avgY <= Y_MAX;

  if (insideX && insideY) {
    output.innerHTML += `\n✅ You ARE inside the allowed area.`;
  } else {
    output.innerHTML += `\n❌ You are OUTSIDE the allowed area.`;
  }
});

// Helper functions
function getPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 15000
    });
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
