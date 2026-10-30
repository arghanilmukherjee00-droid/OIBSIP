// =========================================================
// Portfolio – script.js
// Small enhancements: theme toggle, mobile menu, active nav link
// =========================================================

const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const links = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section[id]");

// ---------- 1. Light / dark theme toggle ----------
function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  try {
    localStorage.setItem("theme", theme);   // remember the choice
  } catch (e) {
    // storage can be blocked in private mode – ignore
  }
}

let savedTheme = "dark";
try {
  savedTheme = localStorage.getItem("theme") || "dark";
} catch (e) {}
setTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const current = root.getAttribute("data-theme");
  setTheme(current === "dark" ? "light" : "dark");
});

// ---------- 2. Mobile menu ----------
menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  menuToggle.textContent = navLinks.classList.contains("open") ? "✕" : "☰";
});

// Close the menu after tapping a link
links.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.textContent = "☰";
  });
});

// ---------- 3. Highlight the nav link of the section on screen ----------
function highlightNav() {
  let currentId = "";
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 120) {
      currentId = section.id;
    }
  });

  links.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + currentId);
  });
}

window.addEventListener("scroll", highlightNav);
highlightNav();