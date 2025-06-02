//@ts-check

document.addEventListener("DOMContentLoaded", () => {
  // Begin share plan functionality
  const copyBtn = document.getElementById("share-plan-copy");
  const copiedMsg = document.getElementById("share-plan-copied");
  const urlInput = /** @type {HTMLInputElement | null} */ (
    document.getElementById("url-copy")
  );

  if (copyBtn && copiedMsg && urlInput) {
    const copyUrl = () => {
      urlInput.select();
      navigator.clipboard
        .writeText(urlInput.value)
        .then(() => {
          copiedMsg.classList.remove("d-none");
          copiedMsg.hidden = false;
          copiedMsg.ariaHidden = null;
          copiedMsg.focus();
          copyBtn.classList.add("d-none");
          copyBtn.hidden = true;
          copyBtn.ariaHidden = "true";
        })
        .catch(err => {
          console.error("Failed to copy: ", err);
        });
    };
    copyBtn.addEventListener("click", copyUrl);
    copiedMsg.addEventListener("click", copyUrl);
  } else {
    console.error("Share plan elements not found.");
  }
  // End share plan functionality

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

  if (classes.length > 0) {
    /** @type {HTMLElement[]} */ ([
      ...document.querySelectorAll(classes)
    ]).forEach(el => {
      el.classList.remove("d-none");
      el.ariaHidden = null;
      el.hidden = false;
    });
  }
});
