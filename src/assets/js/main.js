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

/* disclosure widgets */
(function() {
    var dw_toggles = document.querySelectorAll("[data-dw-toggle]"),
        dw_panels = document.querySelectorAll("[data-dw-toggle]");


    dw_toggles.forEach(element => {
        element.removeAttribute('hidden');
        ariaState = element.getAttribute("aria-expanded");

        // if the attribute is not set..
        if (ariaState === null) {
            element.setAttribute("aria-expanded", "false");
        }

        element.addEventListener("click", function() {
            let currentState = this.getAttribute("aria-expanded"),
                newState = currentState === "true" ? "false" : "true";

            this.setAttribute("aria-expanded", newState);
        }, false);

        document.addEventListener('keyup', function(e) {
            if (e.keyCode == 27) {
                element.setAttribute("aria-expanded", 'false');
            }
        });
    });


})();
