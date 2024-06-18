/* theme toggle buttons */
(function () {
    var enableToggle = function (btn) {
        btn.setAttribute("aria-pressed", "true");
    }
    var disableToggle = function (btns) {
        btns.forEach(btn => btn.setAttribute("aria-pressed", "false"));
    }
    var setTheme = function (theme, isSystemTheme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.setAttribute('data-system-theme', isSystemTheme);
        window.localStorage.setItem("theme", theme);
        window.localStorage.setItem("system-theme", isSystemTheme);
    }

    var theme = document.documentElement.getAttribute('data-theme');
    
    document.addEventListener('DOMContentLoaded', function () {
        var switcher = document.getElementById('js-theme-switcher');
        switcher.removeAttribute('hidden');
        var light_theme_toggle = document.getElementById('light-theme-toggle'),
            dark_theme_toggle = document.getElementById('dark-theme-toggle'),
            system_theme_toggle = document.getElementById('system-theme-toggle');
        var isSystemTheme = document.documentElement.getAttribute("data-system-theme") === "true";
        if (theme) {
            if (isSystemTheme) {
                enableToggle(system_theme_toggle);
                disableToggle([light_theme_toggle, dark_theme_toggle]);
                theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
                setTheme(theme, true);
            } else if (theme === "light") {
                enableToggle(light_theme_toggle);
                disableToggle([system_theme_toggle, dark_theme_toggle]);
            } else if (theme === "dark") {
                enableToggle(dark_theme_toggle);
                disableToggle([system_theme_toggle, light_theme_toggle]);
            }
        }
        light_theme_toggle.addEventListener("click", function () {
            enableToggle(light_theme_toggle);
            theme = this.getAttribute('data-theme');
            setTheme(theme, false);
            disableToggle([system_theme_toggle, dark_theme_toggle]);
        }, false);
        dark_theme_toggle.addEventListener("click", function () {
            enableToggle(dark_theme_toggle);
            theme = this.getAttribute('data-theme');
            setTheme(theme, false);
            disableToggle([system_theme_toggle, light_theme_toggle]);
        }, false);
        system_theme_toggle.addEventListener("click", function () {
            enableToggle(system_theme_toggle);
            theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
            setTheme(theme, true);
            disableToggle([light_theme_toggle, dark_theme_toggle]);
        }, false);
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            const newSystemTheme = event.matches ? "dark" : "light";
            if (isSystemTheme) {
                enableToggle(system_theme_toggle);
                disableToggle([light_theme_toggle, dark_theme_toggle]);
                setTheme(newSystemTheme, true);
            }
        });
    }, false);
})();
