//@ts-check

document.addEventListener("DOMContentLoaded", () => {
  // Begin Share Plan
  const sharePlanCopy = document.getElementById("share-plan-copy");
  const sharePlanCopied = document.getElementById("share-plan-copied");
  const inputElement = /** @type {HTMLInputElement | null} */ (
    document.getElementById("url-copy")
  );
  if (!inputElement || !sharePlanCopy || !sharePlanCopied) {
    console.error("Share plan elements not found.");
    return;
  }

  const shareCopyText = () => {
    inputElement.select();
    navigator.clipboard
      .writeText(inputElement.value)
      .catch(err => {
        console.error("Failed to copy: ", err);
      })
      .then(() => {
        sharePlanCopied.classList.remove("d-none");
        sharePlanCopied.hidden = false;
        sharePlanCopied.ariaHidden = null;
        sharePlanCopied.focus();
        sharePlanCopy.classList.add("d-none");
        sharePlanCopy.hidden = true;
        sharePlanCopy.ariaHidden = "true";
      });
  };

  [sharePlanCopy, sharePlanCopied].forEach(btn =>
    btn.addEventListener("click", shareCopyText)
  );
  // End Share Plan

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
