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
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearStatus(form);

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
            throw new Error("Request failed");
          }
          form.reset();
          updateStatus(
            form,
            "success",
            data.ticket_id
              ? `${window.ESSENCE_SOURCE_CONTENT.forms.successMessage} Ticket: ${data.ticket_id}.`
              : window.ESSENCE_SOURCE_CONTENT.forms.successMessage,
          );
        } catch (error) {
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
        field.addEventListener("blur", () => {
          showError(field, validateField(field));
        });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", initForms);
})();
