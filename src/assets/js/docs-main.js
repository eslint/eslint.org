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

(function() {
    var index_trigger = document.getElementById("index-toggle"),
        index = document.getElementById("js-index-list"),
        body = document.getElementsByTagName("body")[0],
        open = false;

    index_trigger.removeAttribute("hidden");
    index_trigger.setAttribute("aria-expanded", "false");
    index.setAttribute("data-open", "false");

    index.setAttribute("data-open", "false");
    index_trigger.addEventListener("click", toggleindex, false);

    function toggleindex(e) {
        if (!open) {
            this.setAttribute("aria-expanded", "true");
            index.setAttribute("data-open", "true");
            open = true;
        } else {
            this.setAttribute("aria-expanded", "false");
            index.setAttribute("data-open", "false");
            open = false;
        }
    }
})();

(function() {
    var switchers = document.querySelectorAll('.switcher'),
        fallbacks = document.querySelectorAll('.switcher-fallback');

    if(fallbacks != null) {
        fallbacks.forEach(el => {
            el.setAttribute('hidden', '');
        });
    }

    if (switchers != null) {
        switchers.forEach(element => {
            element.removeAttribute('hidden');
            const select = element.querySelector('select');

            select.addEventListener('change', function() {
                var selected = this.options[this.selectedIndex];
                url = selected.getAttribute('data-url');

                window.location.href =  url;
            })
        });
    }
})();
