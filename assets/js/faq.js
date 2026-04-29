(function () {
  async function initFaq() {
    const containers = document.querySelectorAll("[data-faq-list]");
    if (!containers.length) return;
    const items = await window.EssenceSource.fetchJson("assets/data/faqs.json");

    containers.forEach((container) => {
      container.innerHTML = items
        .map(
          (item, index) => `
            <article class="faq-item">
              <button class="faq-question" type="button" aria-expanded="false" aria-controls="faq-answer-${index}">
                <span>${item.question}</span>
                <span aria-hidden="true">+</span>
              </button>
              <div class="faq-answer" id="faq-answer-${index}" hidden>
                <p>${item.answer}</p>
              </div>
            </article>
          `,
        )
        .join("");
    });

    document.querySelectorAll(".faq-question").forEach((button) => {
      button.addEventListener("click", () => toggle(button));
      button.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggle(button);
        }
      });
    });
  }

  function toggle(button) {
    const answer = document.getElementById(
      button.getAttribute("aria-controls"),
    );
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));
    button.querySelector("[aria-hidden='true']").textContent = expanded
      ? "+"
      : "−";
    answer.hidden = expanded;
  }

  document.addEventListener("DOMContentLoaded", initFaq);
})();
