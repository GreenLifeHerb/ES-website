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

  function ensureSearchStyles() {
    const href = "assets/css/search.css?v=20260626-search";
    if (document.head.querySelector(`link[href="${href}"]`)) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
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
            <button class="button button--secondary site-search-trigger" type="button" aria-label="Search products, insights, and documents" aria-expanded="false" data-site-search-open>
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="m21 21-4.35-4.35m1.35-5.15a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <span class="site-search-trigger__label">Search</span>
            </button>
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
        <form class="mobile-search" data-site-search-inline>
          <label class="mobile-search__label" for="mobile-site-search">Search site</label>
          <div class="mobile-search__row">
            <input id="mobile-site-search" type="search" name="q" placeholder="Product, COA, RFQ, guide..." autocomplete="off" data-site-search-inline-input />
            <button class="button button--primary" type="submit">Search</button>
          </div>
        </form>
        <nav class="mobile-nav">
          <a href="products.html">Products Overview</a>
          ${mobileLinks}
          <a href="contact.html?inquiry_type=docs#contact-form">Request COA/TDS</a>
          <a href="contact.html?inquiry_type=quote#contact-form">Request Quote</a>
        </nav>
      </aside>
      <div class="site-search" role="dialog" aria-modal="true" aria-labelledby="site-search-title" data-site-search hidden>
        <div class="site-search__backdrop" data-site-search-close></div>
        <section class="site-search__panel" aria-describedby="site-search-help">
          <div class="site-search__header">
            <div>
              <p class="site-search__eyebrow">Site search</p>
              <h2 id="site-search-title">Search products, insights, and documents</h2>
            </div>
            <button class="button button--secondary site-search__close" type="button" aria-label="Close search" data-site-search-close>Close</button>
          </div>
          <form class="site-search__form" data-site-search-form>
            <label class="sr-only" for="site-search-input">Search products, insights, and documents</label>
            <input id="site-search-input" type="search" name="q" placeholder="Try green coffee, COA, TDS, elderberry, RFQ..." autocomplete="off" data-site-search-input />
            <button class="button button--primary" type="submit">Search</button>
          </form>
          <p class="site-search__help" id="site-search-help">Find product pages, sourcing articles, COA/TDS request paths, RFQ templates, and buyer resources.</p>
          <div class="site-search__quick" aria-label="Suggested searches">
            <button type="button" data-site-search-suggestion="Green Coffee">Green Coffee</button>
            <button type="button" data-site-search-suggestion="COA TDS">COA/TDS</button>
            <button type="button" data-site-search-suggestion="RFQ">RFQ</button>
            <button type="button" data-site-search-suggestion="Elderberry">Elderberry</button>
            <button type="button" data-site-search-suggestion="Sample Request">Sample Request</button>
          </div>
          <div class="site-search__status" role="status" aria-live="polite" data-site-search-status></div>
          <div class="site-search__results" data-site-search-results></div>
        </section>
      </div>
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

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalizeSearchText(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function getSearchTokens(query) {
    return normalizeSearchText(query)
      .split(/\s+/)
      .filter((token) => token.length > 1);
  }

  function getSearchHaystack(entry) {
    return normalizeSearchText([
      entry.title,
      entry.summary,
      entry.type,
      entry.group,
      ...(entry.tags || []),
      ...(entry.keywords || []),
    ].join(" "));
  }

  function scoreSearchEntry(entry, query, tokens) {
    const title = normalizeSearchText(entry.title);
    const summary = normalizeSearchText(entry.summary);
    const haystack = getSearchHaystack(entry);
    const normalizedQuery = normalizeSearchText(query);
    let score = 0;

    if (!tokens.length) return 0;
    if (title === normalizedQuery) score += 120;
    if (title.startsWith(normalizedQuery)) score += 70;
    if (title.includes(normalizedQuery)) score += 45;
    if (summary.includes(normalizedQuery)) score += 18;

    tokens.forEach((token) => {
      if (title.split(" ").includes(token)) score += 28;
      else if (title.includes(token)) score += 18;
      if (haystack.includes(token)) score += 8;
    });

    if (entry.group === "Products") score += 12;
    if (entry.group === "Documents" && /\b(coa|tds|rfq|sample|document)\b/i.test(query)) score += 35;
    if (entry.group === "Insights" && /\b(blog|guide|article|insight|market|technical)\b/i.test(query)) score += 25;

    return tokens.every((token) => haystack.includes(token)) ? score : 0;
  }

  function renderSearchResult(entry) {
    const image = entry.image
      ? `<img src="${escapeHtml(entry.image.replace("-1200.", "-480."))}" alt="" width="96" height="72" loading="lazy" />`
      : `<span class="site-search-result__icon" aria-hidden="true">${entry.group === "Products" ? "P" : entry.group === "Documents" ? "D" : "I"}</span>`;
    const tags = (entry.tags || [])
      .slice(0, 4)
      .map((tag) => `<span>${escapeHtml(tag)}</span>`)
      .join("");

    return `
      <a class="site-search-result" href="${escapeHtml(entry.url)}">
        <span class="site-search-result__media">${image}</span>
        <span class="site-search-result__body">
          <span class="site-search-result__type">${escapeHtml(entry.type || entry.group)}</span>
          <strong>${escapeHtml(entry.title)}</strong>
          <span class="site-search-result__summary">${escapeHtml(entry.summary)}</span>
          <span class="site-search-result__tags">${tags}</span>
        </span>
      </a>
    `;
  }

  function renderSearchResults(container, statusNode, entries, query) {
    const tokens = getSearchTokens(query);
    const results = entries
      .map((entry) => ({ entry, score: scoreSearchEntry(entry, query, tokens) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
      .slice(0, 18)
      .map((item) => item.entry);

    if (!query.trim()) {
      statusNode.textContent = "Start with a product name, document type, or buyer topic.";
      container.innerHTML = "";
      return;
    }

    if (!results.length) {
      statusNode.textContent = `No direct results for "${query}". Try a product name, COA, TDS, RFQ, or sample request.`;
      container.innerHTML = `
        <div class="site-search-empty">
          <strong>No exact match found</strong>
          <p>For custom botanical ingredients, use the quote form and include the ingredient name, target specification, application, and document needs.</p>
          <a class="button button--primary" href="contact.html?inquiry_type=quote#contact-form">Send RFQ</a>
        </div>
      `;
      return;
    }

    const groups = ["Products", "Documents", "Insights", "Resources", "Pages"]
      .map((group) => [group, results.filter((entry) => entry.group === group)])
      .filter(([, groupResults]) => groupResults.length);

    statusNode.textContent = `${results.length} result${results.length === 1 ? "" : "s"} for "${query}".`;
    container.innerHTML = groups
      .map(
        ([group, groupResults]) => `
          <section class="site-search-group">
            <h3>${escapeHtml(group)}</h3>
            <div class="site-search-group__list">
              ${groupResults.map(renderSearchResult).join("")}
            </div>
          </section>
        `,
      )
      .join("");
  }

  function closeMobileDrawerForSearch() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const drawer = document.querySelector("[data-mobile-drawer]");
    const overlay = document.querySelector("[data-mobile-overlay]");
    if (!drawer || drawer.dataset.open !== "true") return;

    toggle?.setAttribute("aria-expanded", "false");
    drawer.dataset.open = "false";
    overlay?.setAttribute("data-open", "false");
    drawer.setAttribute("inert", "");
    document.body.style.overflow = "";
  }

  function initSiteSearch() {
    const dialog = document.querySelector("[data-site-search]");
    const openButtons = document.querySelectorAll("[data-site-search-open]");
    const closeButtons = document.querySelectorAll("[data-site-search-close]");
    const form = document.querySelector("[data-site-search-form]");
    const input = document.querySelector("[data-site-search-input]");
    const results = document.querySelector("[data-site-search-results]");
    const status = document.querySelector("[data-site-search-status]");
    const inlineForm = document.querySelector("[data-site-search-inline]");
    const inlineInput = document.querySelector("[data-site-search-inline-input]");
    if (!dialog || !openButtons.length || !form || !input || !results || !status) return;

    let searchEntries = [];
    let lastFocused = null;
    let searchTimer = 0;

    async function loadSearchEntries() {
      if (searchEntries.length) return searchEntries;
      try {
        const payload = await window.EssenceSource.fetchJson("assets/data/search-index.json");
        searchEntries = payload.entries || [];
      } catch (error) {
        console.error("Failed to load search index", error);
        status.textContent = "Search is temporarily unavailable. Please use Products or Resources navigation.";
      }
      return searchEntries;
    }

    async function runSearch(query) {
      const entries = await loadSearchEntries();
      renderSearchResults(results, status, entries, query);
    }

    async function openSearch(query = "") {
      lastFocused = document.activeElement;
      closeMobileDrawerForSearch();
      dialog.hidden = false;
      document.body.style.overflow = "hidden";
      openButtons.forEach((button) => button.setAttribute("aria-expanded", "true"));
      input.value = query;
      input.focus();
      input.select();
      await runSearch(query);
    }

    function trapSearchFocus(event) {
      if (event.key !== "Tab") return;
      const focusable = Array.from(
        dialog.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hasAttribute("hidden"));
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

    function closeSearch() {
      dialog.hidden = true;
      document.body.style.overflow = "";
      openButtons.forEach((button) => button.setAttribute("aria-expanded", "false"));
      if (lastFocused instanceof HTMLElement) {
        lastFocused.focus();
      }
    }

    openButtons.forEach((button) => {
      button.addEventListener("click", () => openSearch(""));
    });

    closeButtons.forEach((button) => {
      button.addEventListener("click", closeSearch);
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      runSearch(input.value);
    });

    input.addEventListener("input", () => {
      window.clearTimeout(searchTimer);
      searchTimer = window.setTimeout(() => runSearch(input.value), 120);
    });

    inlineForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      openSearch(inlineInput?.value || "");
    });

    document.querySelectorAll("[data-site-search-suggestion]").forEach((button) => {
      button.addEventListener("click", () => {
        const query = button.getAttribute("data-site-search-suggestion") || "";
        input.value = query;
        input.focus();
        runSearch(query);
      });
    });

    dialog.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeSearch();
        return;
      }

      trapSearchFocus(event);
    });
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
    ensureSearchStyles();

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
    initSiteSearch();
    bindAnalyticsTracking();
  });
})();
