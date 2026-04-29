(function () {
  function validateField(field) {
    const value = field.value.trim();
    if (field.hasAttribute("required") && !value) {
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

  async function submitPlaceholder(form, payload) {
    const { endpoints, forms } = window.ESSENCE_SOURCE_CONTENT;
    if (forms.mockMode) {
      await new Promise((resolve) => window.setTimeout(resolve, 200));
      return { ok: true };
    }

    return fetch(endpoints.inquiry, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }

  function serialize(form) {
    const data = new FormData(form);
    const payload = {};
    data.forEach((value, key) => {
      payload[key] = String(value);
    });
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
          const response = await submitPlaceholder(form, payload);
          if (!response.ok) {
            throw new Error("Request failed");
          }
          form.reset();
          updateStatus(
            form,
            "success",
            window.ESSENCE_SOURCE_CONTENT.forms.successMessage,
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
