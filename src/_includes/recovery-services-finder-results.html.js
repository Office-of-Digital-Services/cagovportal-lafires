//@ts-check

document.addEventListener("DOMContentLoaded", () => {
  // hide unselected services
  // Get the query string parameters
  const params = new URLSearchParams(window.location.search);
  const selectedIds = params.get("selected")?.split(",") || [];

  // Loop through all divs with a "data-service-id" attribute
  /** @type {NodeListOf<HTMLElement>} */ (
    document.querySelectorAll("div[data-service-id]")
  ).forEach(div => {
    if (!selectedIds.includes(div.dataset.serviceId || "")) {
      div.remove(); // Remove the div from the DOM
    }
  });

  // Select all divs that have both "data-service-category" and "data-service-type"
  /** @type {NodeListOf<HTMLElement>} */
  const categoryTypeDivs = document.querySelectorAll("div[data-service-type]");

  categoryTypeDivs.forEach(div => {
    // Check if it contains any descendant divs with "data-service-id"
    const hasServiceIdChild = div.querySelector("div[data-service-id]");

    if (!hasServiceIdChild) {
      div.remove(); // Remove the div from the DOM
    }
  });

  // Begin share plan functionality

  const sharePlanModal = document.getElementById("share-plan");
  const copyBtn = document.getElementById("share-plan-copy");
  const copiedMsg = document.getElementById("share-plan-copied");
  const urlInput = /** @type {HTMLInputElement | null} */ (
    document.getElementById("url-copy")
  );

  if (sharePlanModal && copyBtn && copiedMsg && urlInput) {
    sharePlanModal.addEventListener("show.bs.modal", () => {
      urlInput.value = window.location.href;
    });

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
});
