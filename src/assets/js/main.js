(function() {
  var nav_trigger = document.getElementById("nav-toggle"),
    nav = document.getElementById("nav-list"),
    body = document.getElementsByTagName("body")[0],
    open = false;

    nav_trigger.removeAttribute("hidden");
    nav_trigger.setAttribute("aria-expanded", "false");
    nav.setAttribute("data-open", "false");

    nav.setAttribute("data-open", "false");
    nav_trigger.addEventListener("click", togglenav, false);

  function togglenav(e) {
    if (!open) {
      this.setAttribute("aria-expanded", "true");
      nav.setAttribute("data-open", "true");
      open = true;
    } else {
      this.setAttribute("aria-expanded", "false");
      nav.setAttribute("data-open", "false");
      open = false;
    }
  }
})();
