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

/* branding logo theme switcher */
(function() {
    var logo_theme_buttons = document.querySelector('.brand__logo__colors'),
        logo_theme_btn = document.querySelectorAll('.brand__logo__colors__btn'),
        logo_container = document.querySelector('.brand__logo__img');

    if (logo_theme_buttons != null) {
        logo_theme_buttons.removeAttribute('hidden');
        logo_theme_btn.forEach((button) => {

            button.addEventListener('click', function() {
                btn_theme = button.getAttribute('data-theme');
                unsetOtherButtons();
                button.setAttribute('aria-pressed', 'true');
                logo_container.setAttribute('data-theme', btn_theme);
            })
        })
    }

    function unsetOtherButtons() {
        currentButton = document.querySelector('.brand__logo__colors__btn[aria-pressed="true"]');
        currentButton.setAttribute('aria-pressed', "false");
    }
})();

/* switchers */

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
                var selected = this.options[this.selectedIndex],
                    text = selected.text;
                url = selected.getAttribute('data-url');

                window.location.href =  url;
            })
        });
    }


})();
