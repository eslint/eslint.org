(function () {
	var nav_trigger = document.getElementById("nav-toggle"),
		nav = document.getElementById("nav-list"),
		body = document.getElementsByTagName("body")[0],
		open = false;

	if (matchMedia) {
		const mq = window.matchMedia("(max-width: 680px)");
		mq.addEventListener("change", WidthChange);
		WidthChange(mq);
	}

	// media query change
	function WidthChange(mq) {
		if (mq.matches) {
			nav.setAttribute("data-open", "false");
			nav_trigger.removeAttribute("hidden");
			nav_trigger.setAttribute("aria-expanded", "false");
			nav_trigger.addEventListener("click", togglenav, false);
		} else {
			nav.setAttribute("data-open", "true");
			nav_trigger.setAttribute("hidden", "");
			nav_trigger.setAttribute("aria-expanded", "true");
		}
	}

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
(function () {
	var logo_theme_buttons = document.querySelector(".brand__logo__colors"),
		logo_theme_btn = document.querySelectorAll(".brand__logo__colors__btn"),
		logo_container = document.querySelector(".brand__logo__img");

	if (logo_theme_buttons != null) {
		logo_theme_buttons.removeAttribute("hidden");
		logo_theme_btn.forEach(button => {
			button.addEventListener("click", function () {
				btn_theme = button.getAttribute("data-brand-theme");
				unsetOtherButtons();
				button.setAttribute("aria-pressed", "true");
				logo_container.setAttribute("data-brand-theme", btn_theme);
			});
		});
	}

	function unsetOtherButtons() {
		currentButton = document.querySelector(
			'.brand__logo__colors__btn[aria-pressed="true"]',
		);
		currentButton.setAttribute("aria-pressed", "false");
	}
})();

/* switchers */

(function () {
	var switchers = document.querySelectorAll(".switcher"),
		fallbacks = document.querySelectorAll(".switcher-fallback");

	if (fallbacks != null) {
		fallbacks.forEach(el => {
			el.setAttribute("hidden", "");
		});
	}

	if (switchers != null) {
		switchers.forEach(element => {
			element.removeAttribute("hidden");
			const select = element.querySelector("select");

			select.addEventListener("change", function () {
				var selected = this.options[this.selectedIndex];
				url = selected.getAttribute("data-url");

				window.location.href = url;
			});
		});
	}
})();

(function () {
	var toc_trigger = document.getElementById("js-toc-label"),
		toc = document.getElementById("js-toc-panel"),
		open = false;

	if (toc && matchMedia) {
		const mq = window.matchMedia("(max-width: 1023px)");
		mq.addEventListener("change", WidthChange);
		WidthChange(mq);
	}

	// media query change
	function WidthChange(mq) {
		if (mq.matches && toc_trigger) {
			let text = toc_trigger.innerText;
			let headingButton = document.createElement("button");
			headingButton.setAttribute("aria-expanded", "false");
			headingButton.innerText = text;
			toc_trigger.innerHTML = "";

			toc_trigger.appendChild(headingButton);
			headingButton.innerHTML += `<svg class="toc-trigger-icon" width="12" height="8" aria-hidden="true" focusable="false" viewBox="0 0 12 8"><g fill="none"><path fill="currentColor" d="M1.41.59l4.59 4.58 4.59-4.58 1.41 1.41-6 6-6-6z"/><path d="M-6-8h24v24h-24z"/></g></svg>`;

			toc.setAttribute("data-open", "false");
			toc_trigger.setAttribute("aria-expanded", "false");
			headingButton.addEventListener("click", toggleTOC, true);
		} else {
			toc_trigger.innerHTML = "Table of Contents";
			toc.setAttribute("data-open", "true");
		}
	}

	function toggleTOC(e) {
		if (!open) {
			this.setAttribute("aria-expanded", "true");
			toc.setAttribute("data-open", "true");
			open = true;
		} else {
			this.setAttribute("aria-expanded", "false");
			toc.setAttribute("data-open", "false");
			open = false;
		}
	}
})();
