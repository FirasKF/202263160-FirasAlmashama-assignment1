/* =========================
   Utilities
   ========================= */
function $(selector) {
  return document.querySelector(selector);
}

function setText(el, text) {
  if (!el) return;
  el.textContent = text;
}

/* =========================
   Theme Toggle (LocalStorage)
   ========================= */
(function initTheme() {
  const saved = localStorage.getItem("theme");
  const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)").matches;

  const initialTheme = saved ?? (prefersLight ? "light" : "dark");
  document.documentElement.setAttribute("data-theme", initialTheme);

  const btn = $(".theme-toggle");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
})();

/* =========================
   Greeting by Time of Day
   ========================= */
(function initGreeting() {
  const greetingEl = $("#greeting");
  if (!greetingEl) return;

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning 👋" : hour < 18 ? "Good afternoon 👋" : "Good evening 👋";

  setText(greetingEl, greeting);
})();

/* =========================
   Footer Year
   ========================= */
setText($("#year"), String(new Date().getFullYear()));

/* =========================
   Mobile Nav Toggle
   ========================= */
(function initMobileNav() {
  const toggle = $(".nav__toggle");
  const links = $("#navLinks");
  if (!toggle || !links) return;

  function closeMenu() {
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  // Close menu when clicking any nav link (better UX on mobile)
  links.addEventListener("click", (e) => {
    const target = e.target;
    if (target instanceof HTMLElement && target.tagName.toLowerCase() === "a") {
      closeMenu();
    }
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
})();

/* =========================
   Contact Form Validation (No Backend)
   ========================= */
(function initForm() {
  const form = $("#contactForm");
  if (!form) return;

  const nameInput = $("#name");
  const emailInput = $("#email");
  const messageInput = $("#message");

  const nameError = $("#nameError");
  const emailError = $("#emailError");
  const messageError = $("#messageError");
  const status = $("#formStatus");

  function isValidEmail(email) {
    // Simple, practical validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function clearErrors() {
    setText(nameError, "");
    setText(emailError, "");
    setText(messageError, "");
    setText(status, "");
  }

  function validate() {
    clearErrors();
    let ok = true;

    const name = nameInput?.value.trim() ?? "";
    const email = emailInput?.value.trim() ?? "";
    const message = messageInput?.value.trim() ?? "";

    if (name.length < 2) {
      setText(nameError, "Please enter your name (at least 2 characters).");
      ok = false;
    }

    if (!isValidEmail(email)) {
      setText(emailError, "Please enter a valid email address.");
      ok = false;
    }

    if (message.length < 10) {
      setText(messageError, "Message should be at least 10 characters.");
      ok = false;
    }

    return ok;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validate()) {
      setText(status, "Please fix the errors above and try again.");
      return;
    }

    // No backend: show success message and reset
    setText(status, "✅ Thanks! Your message is ready to send (no backend connected).");
    form.reset();
  });
})();

