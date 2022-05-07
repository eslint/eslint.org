/* theme toggle buttons */
(function () {
    const enableToggle = btn => {
        btn.setAttribute("aria-pressed", "true");
    }
    const disableToggle = btn => {
        btn.setAttribute("aria-pressed", "false");
    }
    const setTheme = theme => {
        document.documentElement.setAttribute('data-theme', theme);
        window.localStorage.setItem("theme", theme);
    }

    let theme = window.localStorage.getItem("theme");
    if (!theme || !(theme === "light") || !(theme === "dark")) {
        let isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        theme = isDark ? "dark" : "light";
    }

    document.addEventListener('DOMContentLoaded', function () {
        const switcher = document.getElementById('js-theme-switcher');
        switcher.removeAttribute('hidden');
        const light_theme_toggle = document.getElementById('light-theme-toggle'),
            dark_theme_toggle = document.getElementById('dark-theme-toggle');
        if (theme === "light") {
            enableToggle(light_theme_toggle);
            disableToggle(dark_theme_toggle);
            setTheme(theme);
        } else if (theme === "dark") {
            enableToggle(dark_theme_toggle);
            disableToggle(light_theme_toggle);
            setTheme(theme);
        }
        light_theme_toggle.addEventListener("click", function () {
            enableToggle(light_theme_toggle);
            theme = this.getAttribute('data-theme');
            setTheme(theme);
            disableToggle(dark_theme_toggle);

        }, false);
        dark_theme_toggle.addEventListener("click", function () {
            enableToggle(dark_theme_toggle);
            theme = this.getAttribute('data-theme');
            setTheme(theme);
            disableToggle(light_theme_toggle);
        }, false);
    }, false);
})();
