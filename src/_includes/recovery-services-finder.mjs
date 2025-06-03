//@ts-check

// Recovery Services Finder Functionality
window.addEventListener("load", () => {
  // "load" to support back browsing
  const paramName = "selected";

  const redirectButton = document.getElementById("redirect");
  const redirectTarget = /** @type {HTMLAnchorElement | null} */ (
    document.getElementById("hidden-href-target")
  );
  if (!redirectButton || !redirectTarget) {
    console.error("Redirect button or target not found.");
    return;
  }
  const checkboxes = /** @type {HTMLInputElement[]} */ ([
    ...document.querySelectorAll('input[type="checkbox"]')
  ]);

  const updateButtonState = () => {
    // Enable the button if at least one checkbox is checked
    if (checkboxes.some(cb => cb.checked)) {
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
    // Get a list of selected services based on checked checkboxes
    const selectedServices = checkboxes
      .filter(cb => cb.checked)
      .flatMap(
        cb =>
          cb.value
            .split(".")
            .map(num => num.trim()) // Remove spaces
            .filter(num => num !== "") // Remove empty entries (trailing commas)
            .map(Number) // Convert to numbers
      );

    selectedServices.sort();

    // Send the selectesd services to the redirect target
    window.location.href = `${redirectTarget.href}?${paramName}=${selectedServices.join(".")}`;
  });
});
