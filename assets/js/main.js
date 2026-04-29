(function () {
  const state = {
    cache: new Map(),
  };

  window.EssenceSource = {
    async fetchJson(url) {
      if (state.cache.has(url)) {
        return state.cache.get(url);
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load ${url}`);
      }

      const data = await response.json();
      state.cache.set(url, data);
      return data;
    },
  };

  function ensureSiteIcons() {
    const icons = [
      {
        rel: "icon",
        type: "image/png",
        href: "assets/img/essence-source-logo.png",
      },
      {
        rel: "apple-touch-icon",
        href: "assets/img/essence-source-logo.png",
      },
    ];

    icons.forEach((icon) => {
      const selector = `link[rel="${icon.rel}"]`;
      let link = document.head.querySelector(selector);
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", icon.rel);
        document.head.appendChild(link);
      }

      if (icon.type) {
        link.setAttribute("type", icon.type);
      }

      link.setAttribute("href", icon.href);
    });
  }

  function buildHeader() {
    const content = window.ESSENCE_SOURCE_CONTENT;
    const navLinks = content.headerPrimaryNav
      .map(
        (item) =>
          `<a class="site-nav__link" href="${item.href}" data-nav-link="${item.href}">${item.label}</a>`,
      )
      .join("");
    const mobileLinks = content.primaryNav
      .map(
        (item) =>
          `<a href="${item.href}" data-nav-link="${item.href}">${item.label}</a>`,
      )
      .join("");
    const megaColumns = content.megaMenu.columns
      .map(
        (column) => `
          <section>
            <h3>${column.title}</h3>
            ${column.links.map((link) => `<a href="${link.href}">${link.label}</a>`).join("")}
          </section>
        `,
      )
      .join("");

    return `
      <a class="skip-link" href="#main-content">Skip to content</a>
      <header class="site-header">
        <div class="container site-header__inner">
          <a class="site-brand" href="index.html" aria-label="Essence Source home">
            <img
              class="site-brand__logo"
              src="assets/img/essence-source-logo.png"
              alt="Essence Source logo"
              width="72"
              height="72"
            />
            <span class="site-brand__copy">
              <strong>${content.siteName}</strong>
              <span>${content.tagline}</span>
            </span>
          </a>
          <nav class="site-nav" aria-label="Primary navigation">
            <button class="site-nav__button" type="button" aria-expanded="false" aria-controls="site-mega-panel" data-mega-trigger>
              Products
            </button>
            ${navLinks}
          </nav>
          <div class="site-actions">
            <a class="site-nav__link site-nav__link--desktop-wide" href="quality.html#document-request">Ask for COA</a>
            <a class="button button--primary" href="contact.html#inquiry-form">Request Quote</a>
            <button class="button button--secondary menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-navigation" aria-label="Open navigation menu" data-nav-toggle>
              Menu
            </button>
          </div>
        </div>
        <div class="site-mega" id="site-mega-panel" hidden data-mega-panel>
          <div class="container site-mega__panel">
            <section>
              <h3>Essence Source</h3>
              <p>${content.megaMenu.summary}</p>
            </section>
            ${megaColumns}
          </div>
        </div>
      </header>
      <div class="mobile-overlay" data-mobile-overlay data-open="false"></div>
      <aside class="mobile-drawer" id="mobile-navigation" aria-label="Mobile navigation" data-mobile-drawer data-open="false" inert>
        <div class="mobile-drawer__header">
          <div class="site-brand site-brand--compact">
            <img
              class="site-brand__logo"
              src="assets/img/essence-source-logo.png"
              alt="Essence Source logo"
              width="72"
              height="72"
            />
            <strong>${content.siteName}</strong>
          </div>
          <button class="button button--secondary" type="button" aria-label="Close navigation menu" data-nav-close>Close</button>
        </div>
        <nav class="mobile-nav">
          <a href="products.html">Products Overview</a>
          ${mobileLinks}
          <a href="quality.html#document-request">Ask for COA</a>
          <a href="contact.html#inquiry-form">Request Quote</a>
        </nav>
      </aside>
    `;
  }

  function buildFooter() {
    const content = window.ESSENCE_SOURCE_CONTENT;
    const navLinks = content.primaryNav
      .slice(0, 6)
      .map(
        (item) =>
          `<a class="footer-link" href="${item.href}">${item.label}</a>`,
      )
      .join("");
    const legalLinks = content.legalLinks
      .map(
        (item) =>
          `<a class="footer-link" href="${item.href}">${item.label}</a>`,
      )
      .join("");

    return `
      <footer class="site-footer">
        <div class="container section">
          <div class="site-footer__grid">
            <section class="stack">
              <div class="site-brand">
                <img
                  class="site-brand__logo"
                  src="assets/img/essence-source-logo.png"
                  alt="Essence Source logo"
                  width="72"
                  height="72"
                />
                <span class="site-brand__copy">
                  <strong>${content.siteName}</strong>
                  <span>${content.tagline}</span>
                </span>
              </div>
              <p>${content.description}</p>
            </section>
            <section class="stack">
              <h2>Explore</h2>
              <div class="stack">${navLinks}</div>
            </section>
            <section class="stack">
              <h2>Contact</h2>
              <p><a class="footer-link" href="mailto:${content.contact.email}">${content.contact.email}</a></p>
              <p><a class="footer-link" href="${content.contact.linkedInUrl}" target="_blank" rel="noreferrer">${content.contact.linkedInLabel}</a></p>
              <p>${content.contact.responseTime}</p>
            </section>
          </div>
          <div class="site-footer__legal">
            <div class="cluster">${legalLinks}</div>
            <p>Copyright <span data-current-year></span> ${content.siteName}. For B2B ingredient sourcing only.</p>
          </div>
        </div>
      </footer>
    `;
  }

  function markActiveLinks() {
    const page = document.body.dataset.page;
    if (!page) return;

    document.querySelectorAll("[data-nav-link]").forEach((link) => {
      const href = link.getAttribute("href");
      if (href === page) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function renderTrustBadges() {
    const container = document.querySelector("[data-trust-badges]");
    if (!container) return;

    container.innerHTML = window.ESSENCE_SOURCE_CONTENT.trustBadges
      .map((item) => `<li class="trust-badge">${item}</li>`)
      .join("");
  }

  function renderResourceCards() {
    const container = document.querySelector("[data-resource-cards]");
    if (!container) return;

    container.innerHTML = window.ESSENCE_SOURCE_CONTENT.resources
      .map(
        (item) => `
          <article class="resource-card info-card">
            <small>${item.type}</small>
            <h3>${item.title}</h3>
            <p>${item.summary}</p>
            <a class="button button--secondary" href="${item.url}">Read more about ${item.title}</a>
          </article>
        `,
      )
      .join("");
  }

  function prefillProductField() {
    const params = new URLSearchParams(window.location.search);
    const value = params.get("product");
    const input = document.querySelector("[data-prefill-product]");
    if (value && input) {
      input.value = value;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    ensureSiteIcons();

    const headerTarget = document.querySelector("[data-site-header]");
    const footerTarget = document.querySelector("[data-site-footer]");

    if (headerTarget) {
      headerTarget.innerHTML = buildHeader();
    }

    if (footerTarget) {
      footerTarget.innerHTML = buildFooter();
    }

    document.querySelectorAll("[data-current-year]").forEach((node) => {
      node.textContent = String(new Date().getFullYear());
    });

    renderTrustBadges();
    renderResourceCards();
    markActiveLinks();
    prefillProductField();
  });
})();
