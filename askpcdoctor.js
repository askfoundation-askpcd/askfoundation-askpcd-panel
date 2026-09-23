// ===============================
// AskPCDoctor Rev1.5 Front-End
// ===============================

// Foundation + Backend Imports
import { loadFoundation } from "./foundation.js";
import { askPCDoctorBrain } from "./backend-sim.js";
import { switchModule } from "./module-switcher.js";

// ===============================
// DOM Elements
// ===============================
const input = document.getElementById("apc-input");
const sendBtn = document.getElementById("apc-send");
const subtitle = document.getElementById("apc-subtitle");
const status = document.getElementById("apc-status");
const avatar = document.getElementById("apc-avatar");

// ===============================
// Subtitle Display System
// ===============================
function showSubtitle(text, duration = 3000) {
  subtitle.textContent = text;
  subtitle.style.opacity = 1;

  setTimeout(() => {
    subtitle.style.opacity = 0;
  }, duration);
}

// ===============================
// Status Overlay
// ===============================
function setStatus(text) {
  status.textContent = text;
}

// ===============================
// Avatar Breathing + Blinking
// ===============================
function startAvatarAnimations() {
  // Breathing animation (CSS handles the loop)
  avatar.classList.add("breathing");

  // Blinking animation (JS timed)
  setInterval(() => {
    avatar.classList.add("blink");
    setTimeout(() => avatar.classList.remove("blink"), 150);
  }, 4000);
}

// ===============================
// Load Foundation (Phase 3)
// ===============================
(async () => {
  const foundation = await loadFoundation();

  console.log("Foundation loaded:", foundation);

  // Show active module in status overlay
  setStatus(`${foundation.activeModule} Ready`);

  // Start avatar animations
  startAvatarAnimations();
})();

// ===============================
// Main Input Handler (Rev1.5)
// ===============================
sendBtn.addEventListener('click', async () => {
  const q = input.value.trim();
  if (!q) {
    showSubtitle('Please type a question first.');
    return;
  }

  showSubtitle('Processing your question...', 2000);

  const answer = await askPCDoctorBrain(q);

  showSubtitle(answer, 4000);
});

// ===============================
// Future Module Switching (Phase 3)
// ===============================
// Example usage:
// switchModule("AskSolicitor");
// switchModule("AskAccountant");
// switchModule("AskMD");
// switchModule("AskCEO");
