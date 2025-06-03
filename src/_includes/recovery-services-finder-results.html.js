//@ts-check

document.addEventListener("DOMContentLoaded", () => {
  const allServices = /** @type {NodeListOf<HTMLElement>} */ (
    document.querySelectorAll("div[data-service-id]")
  );

  const hideUnselectedServices = () => {
    // hide unselected services
    // Get the query string parameters
    const params = new URLSearchParams(window.location.search);
    const selectedIds = params.get("selected")?.split(",") || [];

    // Loop through all divs with a "data-service-id" attribute
    allServices.forEach(div => {
      if (!selectedIds.includes(div.dataset.serviceId || "")) {
        div.remove(); // Remove the div from the DOM
      }
    });

    // Select all parent divs for services
    document.querySelectorAll("div[data-service-type]").forEach(div => {
      // Check if it contains any descendant divs with "data-service-id"
      if (!div.querySelector("div[data-service-id]")) {
        div.remove(); // Remove the div from the DOM
      }
    });
  };

  const removeFromQueryString = (paramName, valueToRemove) => {
    const params = new URLSearchParams(window.location.search);
    const ids = (params.get(paramName) || "")
      .split(",")
      .filter(id => id && id !== valueToRemove);
    ids.length
      ? params.set(paramName, ids.join(","))
      : params.delete(paramName);
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params.toString().replace(/%2C/g, ",")}`
    );
  };

  allServices.forEach(div => {
    // Add click event listener to each service div
    /** @type {HTMLButtonElement | null} */
    const closeButton = div.querySelector("button[data-bs-dismiss]");

    if (closeButton) {
      closeButton.addEventListener("click", () => {
        removeFromQueryString("selected", div.dataset.serviceId);
        hideUnselectedServices();
      });
    }
  });

  hideUnselectedServices();

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
