// =========================================================
// Temperature Converter – script.js
// =========================================================

// ---------- 1. Grab the elements we need from the page ----------
const form = document.getElementById("converterForm");
const input = document.getElementById("tempInput");
const errorMsg = document.getElementById("errorMsg");
const resetBtn = document.getElementById("resetBtn");
const feelMsg = document.getElementById("feelMsg");

const resultEls = {
  C: document.getElementById("resultC"),
  F: document.getElementById("resultF"),
  K: document.getElementById("resultK"),
};

const cardEls = {
  C: document.getElementById("cardC"),
  F: document.getElementById("cardF"),
  K: document.getElementById("cardK"),
};

const ABSOLUTE_ZERO_C = -273.15;   // coldest possible temperature

// ---------- 2. Conversion helpers ----------
// Step 1: turn any unit into Celsius
function toCelsius(value, unit) {
  if (unit === "F") return (value - 32) * 5 / 9;
  if (unit === "K") return value - 273.15;
  return value;                      // already Celsius
}

// Step 2: from Celsius, work out all three units
function fromCelsius(celsius) {
  return {
    C: celsius,
    F: celsius * 9 / 5 + 32,
    K: celsius + 273.15,
  };
}

// Round to 2 decimal places and drop trailing zeros (25.00 → 25)
function format(num) {
  const rounded = Math.round(num * 100) / 100;
  return Object.is(rounded, -0) ? "0" : String(rounded);
}

// ---------- 3. Show / clear messages ----------
function showError(message) {
  errorMsg.textContent = message;
  input.classList.add("invalid");
  clearResults();
}

function clearError() {
  errorMsg.textContent = "";
  input.classList.remove("invalid");
}

function clearResults() {
  for (const unit in resultEls) {
    resultEls[unit].textContent = "--";
    cardEls[unit].classList.remove("is-source");
  }
  feelMsg.textContent = "Enter a value and press Convert.";
}

// A small fun line based on how hot or cold it is
function describe(celsius) {
  if (celsius <= 0) return "🥶 Freezing! Water turns to ice at this point.";
  if (celsius < 15) return "🧥 Chilly. Grab a jacket.";
  if (celsius < 30) return "🙂 Pleasant weather.";
  if (celsius < 45) return "🥵 Hot! Stay hydrated.";
  if (celsius < 100) return "🔥 Extremely hot.";
  return "♨️ Above the boiling point of water!";
}

// ---------- 4. Main function: runs when Convert is clicked ----------
function convert(event) {
  event.preventDefault();            // stop the form from reloading the page

  const raw = input.value.trim();
  const unit = form.querySelector('input[name="unit"]:checked').value;

  // (a) Empty input
  if (raw === "") {
    showError("Please enter a temperature value.");
    return;
  }

  // (b) Non-numeric input – only digits, one optional minus sign and one dot allowed
  const numberPattern = /^-?(\d+\.?\d*|\.\d+)$/;
  if (!numberPattern.test(raw)) {
    showError("That's not a valid number. Use digits only, e.g. 36.6 or -10.");
    return;
  }

  const value = parseFloat(raw);
  const celsius = toCelsius(value, unit);

  // (c) Below absolute zero – physically impossible
  if (celsius < ABSOLUTE_ZERO_C) {
    const limits = { C: "-273.15 °C", F: "-459.67 °F", K: "0 K" };
    showError(`Nothing can be colder than absolute zero (${limits[unit]}). Please enter a higher value.`);
    return;
  }

  // (d) All good – show every unit
  clearError();
  const results = fromCelsius(celsius);

  resultEls.C.textContent = `${format(results.C)} °C`;
  resultEls.F.textContent = `${format(results.F)} °F`;
  resultEls.K.textContent = `${format(results.K)} K`;

  // fade the card of the unit the user typed in, so the converted ones stand out
  for (const u in cardEls) {
    cardEls[u].classList.toggle("is-source", u === unit);
  }

  feelMsg.textContent = describe(celsius);
}

// ---------- 5. Connect events ----------
form.addEventListener("submit", convert);   // Convert button and Enter key

resetBtn.addEventListener("click", () => {
  form.reset();
  clearError();
  clearResults();
  input.focus();
});

// Remove the red error as soon as the user starts fixing the input
input.addEventListener("input", clearError);