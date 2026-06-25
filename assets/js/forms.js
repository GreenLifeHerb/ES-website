(function () {
  function validateField(field) {
    const value =
      field.type === "checkbox" ? String(field.checked) : field.value.trim();

    if (field.type === "checkbox" && field.hasAttribute("required") && !field.checked) {
      return field.dataset.errorRequired || "This field is required.";
    }

    if (field.hasAttribute("required") && field.type !== "checkbox" && !value) {
      return field.dataset.errorRequired || "This field is required.";
    }

    if (field.type === "email") {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!isValid) {
        return field.dataset.errorEmail || "Please enter a valid email.";
      }
    }

    return "";
  }

  function showError(field, message) {
    const errorNode = document.querySelector(
      `[data-error-for='${field.name}']`,
    );
    if (errorNode) {
      errorNode.textContent = message;
    }
    field.setAttribute("aria-invalid", String(Boolean(message)));
  }

  function buildEndpointUrl() {
    const { api = {}, endpoints } = window.ESSENCE_SOURCE_CONTENT;
    const baseUrl = (api.baseUrl || "").trim();
    const path = endpoints.inquiry;

    if (!path) {
      throw new Error("Inquiry endpoint is not configured.");
    }

    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    if (baseUrl) {
      return `${baseUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
    }

    return path;
  }

  async function submitInquiry(payload) {
    const { forms } = window.ESSENCE_SOURCE_CONTENT;
    if (forms.mockMode) {
      await new Promise((resolve) => window.setTimeout(resolve, 200));
      return {
        ok: true,
        json: async () => ({
          success: true,
          ticket_id: "MOCK-0000",
        }),
      };
    }

    return fetch(buildEndpointUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }

  function serialize(form) {
    const data = new FormData(form);
    const payload = {};
    data.forEach((value, key) => {
      payload[key] = String(value).trim();
    });
    form.querySelectorAll("input[type='checkbox']").forEach((field) => {
      payload[field.name] = field.checked;
    });
    payload.source_page = window.location.href;
    return payload;
  }

  function updateStatus(form, type, message) {
    const status = form.querySelector("[data-form-status]");
    if (!status) return;
    status.hidden = false;
    status.className = `notice notice--${type}`;
    status.textContent = message;
  }

  function clearStatus(form) {
    const status = form.querySelector("[data-form-status]");
    if (status) {
      status.hidden = true;
      status.textContent = "";
    }
  }

  function trackEvent(name, meta = {}) {
    if (window.EssenceSource && typeof window.EssenceSource.trackEvent === "function") {
      window.EssenceSource.trackEvent(name, meta);
    }
  }

  function applyServerErrors(form, errors) {
    Object.entries(errors || {}).forEach(([name, message]) => {
      const field = form.querySelector(`[name='${name}']`);
      if (field) {
        showError(field, message);
      }
    });
  }

  function initForms() {
    document.querySelectorAll("[data-form='inquiry']").forEach((form) => {
      let started = false;
      const helperContent = {
        quote: {
          title: "For RFQ requests",
          summary:
            "A useful quote request connects the commercial question to a specific grade, order size, destination, and document path.",
          items: [
            "Target product, specification, and application format.",
            "Estimated first order, repeat volume, packing, and destination.",
            "Sample need, lead-time target, and required COA/TDS review.",
          ],
        },
        sample: {
          title: "For sample requests",
          summary:
            "A useful sample request tells us what your team needs to evaluate and what the next internal decision will be.",
          items: [
            "Product, grade, intended application, and sample quantity.",
            "What the sample will test: handling, taste, solubility, color, or formula fit.",
            "Whether COA/TDS or representative testing files are needed with the sample.",
          ],
        },
        docs: {
          title: "For COA/TDS requests",
          summary:
            "A useful document request ties the file need to the product, grade, and review stage instead of asking for generic documents.",
          items: [
            "Product name, target specification, and whether a sample or lot path is under review.",
            "Which files are needed: COA, TDS, or available testing files.",
            "Internal QA limits or review questions your team needs answered.",
          ],
        },
        contact: {
          title: "For general sourcing questions",
          summary:
            "A useful general inquiry gives enough context for the right commercial or technical follow-up.",
          items: [
            "Ingredient category, intended application, and project stage.",
            "Any target specification, document need, or timing constraint.",
            "Whether you are screening suppliers, planning a sample, or preparing an RFQ.",
          ],
        },
        default: {
          title: "What to include",
          summary:
            "Choose an inquiry type to see the most useful details to include before your team sends the request.",
          items: [
            "Product name, target specification, and application.",
            "Sample, RFQ, or COA/TDS review stage.",
            "Estimated quantity, destination, and timing if known.",
          ],
        },
      };

      function updateInquiryHelper() {
        const type = form.querySelector("[name='inquiry_type']")?.value || "default";
        const content = helperContent[type] || helperContent.default;
        const title = form.querySelector("[data-inquiry-helper-title]");
        const summary = form.querySelector("[data-inquiry-helper-summary]");
        const list = form.querySelector("[data-inquiry-helper-list]");

        if (title) title.textContent = content.title;
        if (summary) summary.textContent = content.summary;
        if (list) {
          list.innerHTML = content.items.map((item) => `<li>${item}</li>`).join("");
        }
      }

      function markStarted() {
        if (started) return;
        started = true;
        trackEvent("rfq_form_start", {
          path: window.location.pathname,
          inquiryType: form.querySelector("[name='inquiry_type']")?.value || "",
        });
      }

      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearStatus(form);
        markStarted();

        const fields = Array.from(
          form.querySelectorAll("input, textarea, select"),
        );
        let firstInvalidField = null;

        fields.forEach((field) => {
          const message = validateField(field);
          showError(field, message);
          if (message && !firstInvalidField) {
            firstInvalidField = field;
          }
        });

        if (firstInvalidField) {
          firstInvalidField.focus();
          return;
        }

        const submitButton = form.querySelector("[type='submit']");
        submitButton.disabled = true;

        try {
          const payload = serialize(form);
          const response = await submitInquiry(payload);
          const data = await response.json().catch(() => ({}));
          if (!response.ok) {
            applyServerErrors(form, data.errors);
            if (data.fallback_mailto) {
              updateStatus(
                form,
                "error",
                "Website email delivery is not configured yet. We are opening a draft email so your inquiry is not lost.",
              );
              trackEvent("rfq_form_submit_fallback_mailto", {
                path: window.location.pathname,
                inquiryType: payload.inquiry_type,
                product: payload.product_interest || "",
              });
              window.location.href = data.fallback_mailto;
              return;
            }
            throw new Error("Request failed");
          }
          form.reset();
          started = false;
          trackEvent("rfq_form_submit_success", {
            path: window.location.pathname,
            inquiryType: payload.inquiry_type,
            product: payload.product_interest || "",
          });
          updateStatus(
            form,
            "success",
            data.ticket_id
              ? `${window.ESSENCE_SOURCE_CONTENT.forms.successMessage} Ticket: ${data.ticket_id}.`
              : window.ESSENCE_SOURCE_CONTENT.forms.successMessage,
          );
        } catch (error) {
          trackEvent("rfq_form_submit_error", {
            path: window.location.pathname,
          });
          updateStatus(
            form,
            "error",
            window.ESSENCE_SOURCE_CONTENT.forms.errorMessage,
          );
        } finally {
          submitButton.disabled = false;
        }
      });

      form.querySelectorAll("input, textarea, select").forEach((field) => {
        field.addEventListener("focus", markStarted, { once: true });
        field.addEventListener("blur", () => {
          showError(field, validateField(field));
        });
      });

      const inquiryTypeField = form.querySelector("[name='inquiry_type']");
      if (inquiryTypeField) {
        inquiryTypeField.addEventListener("change", updateInquiryHelper);
      }
      updateInquiryHelper();
      window.setTimeout(updateInquiryHelper, 0);
    });
  }

  document.addEventListener("DOMContentLoaded", initForms);
})();
