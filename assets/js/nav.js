(function () {
  function getFocusable(container) {
    return Array.from(
      container.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => !element.hasAttribute("hidden"));
  }

  function trapFocus(event, container) {
    if (event.key !== "Tab") return;
    const focusable = getFocusable(container);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function initMobileNav() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const close = document.querySelector("[data-nav-close]");
    const drawer = document.querySelector("[data-mobile-drawer]");
    const overlay = document.querySelector("[data-mobile-overlay]");
    if (!toggle || !close || !drawer || !overlay) return;

    let lastFocused = null;

    function openDrawer() {
      lastFocused = document.activeElement;
      toggle.setAttribute("aria-expanded", "true");
      drawer.dataset.open = "true";
      overlay.dataset.open = "true";
      drawer.removeAttribute("inert");
      drawer.querySelector("a, button")?.focus();
      document.body.style.overflow = "hidden";
    }

    function closeDrawer() {
      toggle.setAttribute("aria-expanded", "false");
      drawer.dataset.open = "false";
      overlay.dataset.open = "false";
      drawer.setAttribute("inert", "");
      document.body.style.overflow = "";
      if (lastFocused instanceof HTMLElement) {
        lastFocused.focus();
      } else {
        toggle.focus();
      }
    }

    toggle.addEventListener("click", () => {
      if (drawer.dataset.open === "true") {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    close.addEventListener("click", closeDrawer);
    overlay.addEventListener("click", closeDrawer);
    drawer.addEventListener("keydown", (event) => trapFocus(event, drawer));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && drawer.dataset.open === "true") {
        closeDrawer();
      }
    });
  }

  function initMegaMenu() {
    const trigger = document.querySelector("[data-mega-trigger]");
    const panel = document.querySelector("[data-mega-panel]");
    if (!trigger || !panel) return;

    let closeTimer = 0;

    function openPanel() {
      window.clearTimeout(closeTimer);
      panel.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
    }

    function closePanel() {
      closeTimer = window.setTimeout(() => {
        panel.hidden = true;
        trigger.setAttribute("aria-expanded", "false");
      }, 120);
    }

    trigger.addEventListener("click", () => {
      if (panel.hidden) {
        openPanel();
      } else {
        panel.hidden = true;
        trigger.setAttribute("aria-expanded", "false");
      }
    });

    trigger.addEventListener("mouseenter", openPanel);
    trigger.addEventListener("focus", openPanel);
    trigger.addEventListener("mouseleave", closePanel);
    panel.addEventListener("mouseenter", openPanel);
    panel.addEventListener("mouseleave", closePanel);
    panel.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        panel.hidden = true;
        trigger.setAttribute("aria-expanded", "false");
        trigger.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (!panel.contains(event.target) && !trigger.contains(event.target)) {
        panel.hidden = true;
        trigger.setAttribute("aria-expanded", "false");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initMobileNav();
    initMegaMenu();
  });
})();
