// Appends the current query string to all language switcher links to fix issue on service finder results not showing selected services after switching languages
document.addEventListener("DOMContentLoaded", function () {
  var query = window.location.search;
  if (!query) return;
  document.querySelectorAll(".lang-switch").forEach(function (link) {
    // Only append if not already present and not just a hash
    if (link.href && !link.href.includes(query) && !link.href.endsWith("#")) {
      link.href += query;
    }
  });
});
