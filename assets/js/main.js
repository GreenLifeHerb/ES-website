(function () {
  const state = {
    cache: new Map(),
  };

  window.EssenceSource = {
    async fetchJson(url) {
      if (state.cache.has(url)) {
        return state.cache.get(url);
      }

      const response = await fetch(`${url}${url.includes("?") ? "&" : "?"}v=${Date.now()}`, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(`Failed to load ${url}`);
      }

      const data = await response.json();
      state.cache.set(url, data);
      return data;
    },
    trackEvent(name, meta = {}) {
      const { endpoints = {}, forms = {} } = window.ESSENCE_SOURCE_CONTENT || {};
      const path = endpoints.events;

      if (!path || forms.mockMode) {
        return Promise.resolve();
      }

      return fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          path: window.location.pathname,
          label: document.title,
          href: window.location.href,
          meta,
        }),
        keepalive: true,
      }).catch(() => undefined);
    },
  };

  function ensureSiteIcons() {
    const icons = [
      {
        rel: "icon",
        type: "image/png",
        href: "favicon.png",
      },
      {
        rel: "apple-touch-icon",
        href: "favicon.png",
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
              src="assets/img/optimized/essence-source-logo-96.png"
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
            <a class="button button--primary" href="contact.html?inquiry_type=quote#contact-form">Request Quote</a>
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
              src="assets/img/optimized/essence-source-logo-96.png"
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
          <a href="contact.html?inquiry_type=docs#contact-form">Request COA/TDS</a>
          <a href="contact.html?inquiry_type=quote#contact-form">Request Quote</a>
        </nav>
      </aside>
    `;
  }

  function buildFooter() {
    const content = window.ESSENCE_SOURCE_CONTENT;
    const navLinks = (content.footerNav || content.primaryNav)
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

    const certsHTML = content.certifications
      .map(
        (cert) =>
          `<span class="footer-cert-badge"><span class="cert-check">✓</span> ${cert}</span>`,
      )
      .join("");

    const phoneBlock = content.contact.phone
      ? `
                <div>
                  <div class="contact-val">
                    <a class="footer-link font-semibold" href="tel:${content.contact.phone.replace(/[^+\d]/g, "")}">${content.contact.phone}</a>
                  </div>
                </div>
      `
      : "";

    return `
      <footer class="site-footer">
        <div class="container section">
          <div class="site-footer__grid">
            <section class="stack">
              <div class="site-brand">
                <img
                  class="site-brand__logo"
                  src="assets/img/optimized/essence-source-logo-96.png"
                  alt="Essence Source logo"
                  width="72"
                  height="72"
                />
                <span class="site-brand__copy">
                  <strong style="color: #ffffff;">${content.siteName}</strong>
                  <span style="color: rgba(255, 255, 255, 0.64);">${content.tagline}</span>
                </span>
              </div>
              <p>${content.description}</p>
              <div class="footer-certs-container">
                ${certsHTML}
              </div>
            </section>
            <section class="stack">
              <h2>Explore</h2>
              <div class="stack" style="gap: 0.75rem;">${navLinks}</div>
            </section>
            <section class="stack">
              <h2>U.S. Presence & Contact</h2>
              <div class="footer-contact-details stack" style="gap: 1rem;">
                <div>
                  <div class="contact-label">Corporate Office:</div>
                  <address class="contact-val">${content.contact.officeAddress}</address>
                </div>
                <div>
                  <div class="contact-label"><a class="footer-link" href="new-york-office.html" style="text-decoration: underline;">Northeast Sales Office (NY):</a></div>
                  <address class="contact-val">${content.contact.nyOfficeAddress || 'Commercial & Document Services Hub'}</address>
                </div>
                <div>
                  <div class="contact-label">West Coast Logistics Hub:</div>
                  <address class="contact-val">${content.contact.warehouseAddress}</address>
                </div>
                <div>
                  <div class="contact-label">U.S. Inquiry Desk:</div>
                  ${phoneBlock}
                  <div class="contact-val">
                    <a class="footer-link" href="mailto:${content.contact.email}">${content.contact.email}</a>
                  </div>
                </div>
                <div>
                  <div class="contact-val">
                    <a class="footer-link" href="${content.contact.linkedInUrl}" target="_blank" rel="noreferrer" style="display: inline-flex; align-items: center; gap: 0.35rem;">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle;"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                      ${content.contact.linkedInLabel}
                    </a>
                  </div>
                  <div class="contact-val" style="font-size: 0.8rem; color: rgba(255, 255, 255, 0.45); margin-top: 0.25rem;">
                    ${content.contact.responseTime}
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div class="site-footer__legal">
            <div class="cluster">${legalLinks}</div>
            <p>Copyright &copy; <span data-current-year></span> ${content.siteName} LLC. For B2B botanical ingredient sourcing only. FDA Disclaimer: These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure, or prevent any disease.</p>
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
    if (!container || container.children.length) return;

    container.innerHTML = window.ESSENCE_SOURCE_CONTENT.trustBadges
      .map((item) => `<li class="trust-badge">${item}</li>`)
      .join("");
  }

  function renderResourceCards() {
    const container = document.querySelector("[data-resource-cards]");
    if (!container || container.children.length) return;

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

  function prefillQueryFields() {
    const params = new URLSearchParams(window.location.search);
    document.querySelectorAll("[data-prefill-query]").forEach((field) => {
      const param = field.getAttribute("data-prefill-query");
      const value = params.get(param);
      if (value) {
        field.value = value;
        field.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
  }

  async function populateProductDatalist() {
    const datalist = document.querySelector("[data-product-datalist]");
    if (!datalist) return;

    try {
      const products = await window.EssenceSource.fetchJson("assets/data/products.json");
      const values = Array.from(
        new Set([
          ...products.map((product) => product.name).filter(Boolean),
          "Other / Custom Botanical",
        ]),
      ).sort((a, b) => a.localeCompare(b));

      datalist.innerHTML = values
        .map((value) => `<option value="${value}"></option>`)
        .join("");
    } catch (error) {
      console.error("Failed to populate product datalist", error);
    }
  }

  function bindAnalyticsTracking() {
    document.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (!link) return;

      const href = link.getAttribute("href") || "";
      if (!href) return;

      if (href.startsWith("mailto:")) {
        window.EssenceSource.trackEvent("cta_mailto_click", {
          href,
          text: link.textContent.trim(),
        });
        return;
      }

      if (/contact\.html\?inquiry_type=/i.test(href)) {
        window.EssenceSource.trackEvent("cta_rfq_click", {
          href,
          text: link.textContent.trim(),
        });
      }
    });
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
    prefillQueryFields();
    populateProductDatalist();
    bindAnalyticsTracking();
  });
})();
