//@ts-check

document.addEventListener("DOMContentLoaded", () => {
  // Share Plan events

  const sharePlanCopy = /** @type {HTMLButtonElement | null} */ (
    document.getElementById("share-plan-copy")
  );
  const sharePlanCopied = /** @type {HTMLButtonElement | null} */ (
    document.getElementById("share-plan-copied")
  );
  const inputElement = /** @type {HTMLInputElement | null} */ (
    document.getElementById("url-copy")
  );
  if (!inputElement || !sharePlanCopy || !sharePlanCopied) {
    console.error("Share plan elements not found.");
    return;
  }

  const copyFunction = () => {
    inputElement.select();
    console.log("Copying the URL: ", inputElement.value);
    navigator.clipboard.writeText(inputElement.value).catch(err => {
      console.error("Failed to copy: ", err);
    });

    sharePlanCopied.classList.remove("d-none");
    sharePlanCopied.hidden = false;
    sharePlanCopied.ariaHidden = null;
    sharePlanCopied.focus();
    sharePlanCopy.classList.add("d-none");
    sharePlanCopy.hidden = true;
    sharePlanCopy.ariaHidden = "true";
  };

  [sharePlanCopy, sharePlanCopied].forEach(btn =>
    btn.addEventListener("click", copyFunction)
  );

  const clearVarsButton = document.querySelector(".clearVars");
  if (clearVarsButton) {
    clearVarsButton.addEventListener("click", event => {
      event.preventDefault();
      sessionStorage.clear();
      window.location.href = "/lafires/recovery-services-finder/";
    });
  }

  const checks = /** @type {string[]} */ (window["getCheckboxStates"]());

  const categories = ["business", "long", "short"];

  const classes = checks
    .filter(item => categories.some(cat => item.startsWith(`category_${cat}`)))
    .map(x => `.${x}`)
    .join(",");

  /** @type {HTMLElement[]} */ ([
    ...document.querySelectorAll(classes)
  ]).forEach(el => {
    el.classList.remove("d-none");
    el.ariaHidden = null;
    el.hidden = false;
  });
});
