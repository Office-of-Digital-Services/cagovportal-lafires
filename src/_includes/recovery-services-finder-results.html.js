//@ts-check

document.addEventListener("DOMContentLoaded", () => {
  // Begin share plan functionality
  const sharePlanModal = document.getElementById("share-plan");
  const copyBtn = document.getElementById("share-plan-copy");
  const copiedBtn = document.getElementById("share-plan-copied");
  const mailBtn = /** @type {HTMLAnchorElement} */ (
    document.getElementById("share-plan-mailto")
  );
  const urlInput = /** @type {HTMLInputElement | null} */ (
    document.getElementById("url-copy")
  );

  if (!(sharePlanModal && copyBtn && copiedBtn && urlInput)) {
    console.error("Share plan elements not found.");
    return;
  }
  const paramName = "selected";

  const allServiceDivs = [
    .../** @type {NodeListOf<HTMLElement>} */ (
      document.querySelectorAll("div[data-service-id]")
    )
  ];
  const getURL = () => new URL(window.location.href);

  // Get an array of selected IDs from the URL
  const getSelectedIDs = () =>
    (getURL().searchParams.get(paramName) || "")
      .split(/[^0-9]+/)
      .filter(id => id !== "");

  const updateMailButton = () => {
    // Update the mailto link with the current URL
    mailBtn.href = `mailto:?subject=${mailBtn.dataset.mailSubject}&body=${mailBtn.dataset.mailBody}%0A%0A${getURL().toString()}`;
  };

  // Hide all service divs that are not selected
  // and remove their parent divs if they contain no selected services
  const hideUnselectedServices = () => {
    const selectedIds = getSelectedIDs();
    // Remove all service divs that are not selected
    allServiceDivs
      .filter(div => !selectedIds.includes(div.dataset.serviceId || ""))
      .forEach(
        div => div.remove() // Remove the div from the DOM
      );

    // Select all parent divs for services
    document.querySelectorAll("div[data-service-type]").forEach(div => {
      // Check if it contains any descendant divs with "data-service-id"
      if (!div.querySelector("div[data-service-id]")) {
        div.remove(); // Remove the div from the DOM
      }
    });
  };

  allServiceDivs.forEach(div => {
    // Add click event listener to each service div's close button
    const closeButton = div.querySelector("button[data-bs-dismiss]");

    if (closeButton && div.dataset.serviceId) {
      closeButton.addEventListener("click", () => {
        const url = getURL();
        const ids = getSelectedIDs().filter(id => id !== div.dataset.serviceId);

        if (ids.length) {
          url.searchParams.set(paramName, ids.join("."));
        } else {
          url.searchParams.delete(paramName);
        }

        // Update the URL without reloading the page
        window.history.replaceState(null, "", url);

        hideUnselectedServices();
        updateMailButton();
      });
    }
  });

  hideUnselectedServices();
  updateMailButton();

  // Bootstrap Modal Show Event
  // Set the URL input value to the current page URL when the modal is shown
  sharePlanModal.addEventListener("show.bs.modal", () => {
    urlInput.value = window.location.href;
  });

  const copyButtonClick = () => {
    urlInput.select();
    navigator.clipboard
      .writeText(urlInput.value)
      .then(() => {
        // Show the copied button and hide the copy button
        copiedBtn.classList.remove("d-none");
        copiedBtn.hidden = false;
        copiedBtn.ariaHidden = null;
        copiedBtn.focus();
        copyBtn.classList.add("d-none");
        copyBtn.hidden = true;
        copyBtn.ariaHidden = "true";
      })
      .catch(err => {
        console.error("Failed to copy: ", err);
      });
  };
  copyBtn.addEventListener("click", copyButtonClick);
  copiedBtn.addEventListener("click", copyButtonClick);

  // End share plan functionality
});
