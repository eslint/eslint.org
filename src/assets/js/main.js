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

        element.addEventListener("click", function(e) {
            e.preventDefault(); // ensures links enhanced to buttons don't fire
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

/* language switcher disclosure widget enhancement */
(function() {
    var languages_toggle = document.getElementById("languages-toggle");

        // enhance it into a button
        languages_toggle.setAttribute('role', 'button');

        // add space bar functionality so it behaves like a button
        languages_toggle.addEventListener('keydown', function(e){
            if(e.keyCode == 32) {
                let currentState = this.getAttribute("aria-expanded"),
                newState = currentState === "true" ? "false" : "true";

                this.setAttribute("aria-expanded", newState);
            }
        });

    // add checkmark to currently active item
    // adding using JS to make sure the SVG is inlined and adaptable in WHCM and other environments
    var current_lang = document.querySelectorAll('.languages-list a[aria-current="true"]'),
        check = '<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

        current_lang.forEach(el => {
            text = el.innerHTML;
            el.innerHTML = text + check;
        });
})();
