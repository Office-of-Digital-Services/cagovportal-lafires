//@ts-check

// Recovery Services Finder Functionality
window.addEventListener("load", () => {
  // "load" to support back browsing

  const redirectButton = document.getElementById("redirect");
  const redirectTarget = /** @type {HTMLAnchorElement | null} */ (
    document.getElementById("hidden-href-target")
  );
  if (redirectButton && redirectTarget) {
    const checkboxes = /** @type {HTMLInputElement[]} */ ([
      ...document.querySelectorAll('input[type="checkbox"]')
    ]);

    const updateButtonState = () => {
      const anyChecked = checkboxes.some(cb => cb.checked);
      if (anyChecked) {
        redirectButton.classList.remove("disabled");
        redirectButton.removeAttribute("aria-disabled");
      } else {
        redirectButton.setAttribute("aria-disabled", "true");
        redirectButton.classList.add("disabled");
      }
    };

    updateButtonState();

    checkboxes.forEach(checkbox => {
      checkbox.addEventListener("change", () => {
        updateButtonState();
      });
    });

    redirectButton.addEventListener("click", () => {
      const selectedCheckboxes = checkboxes
        .filter(cb => cb.checked)
        .flatMap(
          cb =>
            cb.value
              .split(",")
              .map(num => num.trim()) // Remove spaces
              .filter(num => num !== "") // Remove empty entries (trailing commas)
              .map(Number) // Convert to numbers
        );

      selectedCheckboxes.sort();

      if (selectedCheckboxes.length > 0) {
        const url = `${redirectTarget.href}?selected=${selectedCheckboxes.join(",")}`;
        window.location.href = url;
      } else {
        console.warn("No checkboxes selected.");
      }
    });
  }
});
