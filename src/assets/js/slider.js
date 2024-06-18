"use strict";
// prepend method polyfill for IE
(function (arr) {
	arr.forEach(function (item) {
		if (item.hasOwnProperty("prepend")) {
			return;
		}
		Object.defineProperty(item, "prepend", {
			configurable: true,
			enumerable: true,
			writable: true,
			value: function prepend() {
				var argArr = Array.prototype.slice.call(arguments),
					docFrag = document.createDocumentFragment();

				argArr.forEach(function (argItem) {
					var isNode = argItem instanceof Node;
					docFrag.appendChild(
						isNode
							? argItem
							: document.createTextNode(String(argItem)),
					);
				});

				this.insertBefore(docFrag, this.firstChild);
			},
		});
	});
})([Element.prototype, Document.prototype, DocumentFragment.prototype]);

if (typeof Object.assign != "function") {
	// Must be writable: true, enumerable: false, configurable: true
	Object.defineProperty(Object, "assign", {
		value: function assign(target, varArgs) {
			// .length of function is 2

			if (target == null) {
				// TypeError if undefined or null
				throw new TypeError(
					"Cannot convert undefined or null to object",
				);
			}

			var to = Object(target);

			for (var index = 1; index < arguments.length; index++) {
				var nextSource = arguments[index];

				if (nextSource != null) {
					// Skip over if undefined or null
					for (var nextKey in nextSource) {
						// Avoid bugs when hasOwnProperty is shadowed
						if (
							Object.prototype.hasOwnProperty.call(
								nextSource,
								nextKey,
							)
						) {
							to[nextKey] = nextSource[nextKey];
						}
					}
				}
			}
			return to;
		},
		writable: true,
		configurable: true,
	});
}
// add utilities; some of them borrowed from: https://scottaohara.github.io/a11y_tab_widget/
var util = {
	keyCodes: {
		UP: 38,
		DOWN: 40,
		LEFT: 37,
		RIGHT: 39,
		HOME: 36,
		END: 35,
		ENTER: 13,
		SPACE: 32,
		DELETE: 46,
		TAB: 9,
	},

	generateID: function (base) {
		return base + Math.floor(Math.random() * 999);
	},

	getDirectChildren: function (elm, selector) {
		return Array.prototype.filter.call(elm.children, function (child) {
			return child.matches(selector);
		});
	},

	getUrlHash: function () {
		return window.location.hash.replace("#", "");
	},

	/**
	 * Use history.replaceState so clicking through Tabs
	 * does not create dozens of new history entries.
	 * Browser back should navigate to the previous page
	 * regardless of how many Tabs were activated.
	 *
	 * @param {string} hash
	 */
	setUrlHash: function (hash) {
		if (history.replaceState) {
			history.replaceState(null, "", "#" + hash);
		} else {
			location.hash = hash;
		}
	},

	/**
	 * Convert hyphen-separated string to camelCase
	 * Source: https://stackoverflow.com/questions/6660977/convert-hyphens-to-camel-case-camelcase
	 * CamelCase is readable by Screen Readers and so can be used as an accessible label for the dotNav
	 * More info: https://adrianroselli.com/2018/01/improving-your-tweet-accessibility.html#Hash
	 */
	dashToCamelCase: function (string) {
		return string.replace(/-([a-z])/g, function (g) {
			return g[1].toUpperCase();
		});
	},

	dashToSpaces: function (string) {
		return string.replace(/-/g, " ");
	},
};

(function (w, doc, undefined) {
	var ARIASliderOptions = {
		manual: false,
		loop: false,
		withDotNav: false,
	};

	var ARIAslider = function (inst, options) {
		var _options = Object.assign(ARIASliderOptions, options);
		var el = inst;
		var slidesContainer = el.querySelector("[data-slides]");
		var slidesWrapper = el.querySelector("[data-slides-wrapper]");
		var slides = Array.from(el.querySelectorAll("[data-slide]"));
		var paddleNav = el.querySelector("[data-slider-paddleNav]");
		var prevButton = paddleNav.querySelector("[data-prev]");
		var nextButton = paddleNav.querySelector("[data-next]");

		var sliderID = util.generateID("c-slider-");

		var currentIndex = 0;
		var selectedDot = 0;
		var tempDot = 0;
		var manual = _options.manual;
		var loop = _options.loop;
		var withDotNav = _options.withDotNav;
		var dots = [];

		var init = function () {
			el.setAttribute("id", sliderID);
			el.classList.add("js-slider");

			el.setAttribute("role", "group"); // or region
			el.setAttribute("aria-roledescription", "Slider");
			el.setAttribute("aria-label", el.getAttribute("data-aria-label"));

			// show Next and Prev Buttons
			paddleNav.removeAttribute("hidden");

			setupPaddleNav();
			if (withDotNav) setupDotNav();
			setupSlides();

			setupSRHelper();

			enableTouchSwipes();
		};

		var enableTouchSwipes = function () {
			var mc = new Hammer(slidesWrapper, { threshold: 500 });
			// listen to events...
			mc.on("swipeleft", function (e) {
				paddleForward();
			});

			mc.on("swiperight", function (e) {
				paddleBack();
			});
		};

		var setupSRHelper = function () {
			let helper = document.createElement("span");
			helper.setAttribute("aria-live", "polite");
			helper.setAttribute("id", sliderID + "__SRHelper");
			helper.classList.add("visually-hidden");
			helper.classList.add("c-slider__SRHelper");

			el.prepend(helper);

			updateHelper();
		};

		var updateHelper = function () {
			//   let showing = slides[currentIndex].getAttribute('data-slide-label');
			let showingNb = currentIndex + 1;
			let helper = el.querySelector(".c-slider__SRHelper");
			helper.innerHTML =
				"Showing slide " + showingNb + " of " + slides.length;
		};

		var setupPaddleNav = function () {
			prevButton.addEventListener(
				"keydown",
				e => {
					paddleKeyboardRespond(e);
					updateHelper();
				},
				false,
			);

			nextButton.addEventListener(
				"keydown",
				e => {
					paddleKeyboardRespond(e);
					updateHelper();
				},
				false,
			);

			prevButton.addEventListener("click", function (e) {
				paddleBack();
				updateHelper();
			});

			nextButton.addEventListener("click", function (e) {
				paddleForward(e);
				updateHelper();
			});

			handlePaddleButtonsState();
		};

		var handlePaddleButtonsState = function () {
			if (!loop && currentIndex == slides.length - 1) {
				nextButton.setAttribute("aria-disabled", "true");
				nextButton.setAttribute("tabindex", "-1");
			} else if (!loop && currentIndex < slides.length - 1) {
				nextButton.removeAttribute("aria-disabled");
				nextButton.removeAttribute("tabindex");
			}

			if (!loop && currentIndex == 0) {
				prevButton.setAttribute("aria-disabled", "true");
				prevButton.setAttribute("tabindex", "-1");
			} else if (!loop && currentIndex > 0) {
				prevButton.removeAttribute("aria-disabled");
				prevButton.removeAttribute("tabindex");
			}
		};

		var setupDotNav = function () {
			var dotNavList = document.createElement("div");
			dotNavList.setAttribute("data-slider-dotNav", "");
			dotNavList.setAttribute("role", "tablist");
			dotNavList.setAttribute("class", "c-slider__dotNav");

			// create dots
			var nb = slides.length;
			for (var i = 0; i < nb; i++) {
				let dot = document.createElement("button");
				dot.setAttribute("role", "tab");

				dot.setAttribute("id", sliderID + "__dot-" + i);
				dot.setAttribute("class", "c-slider__dotNav__dot");
				dot.setAttribute("data-slider-dot", ""); // to be used in the CSS as a hook if needed; not used elsewhere.
				dot.setAttribute("data-controls", slides[i].getAttribute("id"));

				let dotLabel = document.createElement("span");
				dotLabel.textContent =
					slides[i].getAttribute("data-slide-label");
				dotLabel.classList.add("dot-label");

				// append dot to dotNavList
				dotNavList.appendChild(dot);
				dot.appendChild(dotLabel);
				dots.push(dot);
			}

			dots.forEach((dot, index) => {
				if (index === currentIndex) {
					selectDot();
				}

				dot.addEventListener(
					"click",
					e => {
						e.preventDefault();
						e.preventDefault();
						selectedDot = index;
						currentIndex = selectedDot;
						focusCurrentDot();
						selectDot();
						handlePaddleButtonsState();
						updateHelper();
					},
					false,
				);

				dot.addEventListener(
					"keydown",
					e => {
						dotKeyboardRespond(e, dot);
						updateHelper();
					},
					false,
				);
			});

			// append dotNavList to slider
			el.appendChild(dotNavList);
		};

		var selectDot = function () {
			// unactivate all other dots
			dots.forEach(dot => {
				dot.setAttribute("aria-selected", "false");
				dot.setAttribute("tabindex", "-1");
			});
			//activate current tab
			dots[selectedDot].setAttribute("aria-selected", "true");
			dots[selectedDot].setAttribute("tabindex", "0");

			// activate corresponding panel
			activateCurrentSlide();
		};

		var setupSlides = function () {
			slides.forEach((slide, index) => {
				if (_options.withDotNav) {
					slide.setAttribute("role", "tabpanel");
					slide.setAttribute(
						"aria-labelledby",
						dots[index].getAttribute("id"),
					);
				} else {
					slide.setAttribute("role", "group");
					slide.setAttribute("aria-roledescription", "Slide");
				}

				slide.setAttribute("tabindex", "-1");
				slide.setAttribute("data-hidden", "true");

				slide.addEventListener(
					"keydown",
					e => {
						// slideKeyboardRespond(e);
					},
					false,
				);

				slide.addEventListener(
					"blur",
					() => {
						slide.setAttribute("tabindex", "-1");
					},
					false,
				);
			});

			activateCurrentSlide();
		};

		var slideKeyboardRespond = function (e) {
			var keyCode = e.keyCode || e.which;

			switch (keyCode) {
				case util.keyCodes.TAB:
					slides[currentIndex].setAttribute("tabindex", "-1");
					break;

				default:
					break;
			}
		};

		var activateCurrentSlide = function () {
			slides.forEach((slide, index) => {
				slide.setAttribute("data-hidden", "true");
				slide.removeAttribute("tabindex");
			});

			slides[currentIndex].setAttribute("data-hidden", "false");
			// if (withDotNav) slides[currentIndex].setAttribute('aria-labelledby', dots[currentIndex].getAttribute('id'));
			slides[currentIndex].setAttribute("tabindex", "0");
			slideToCurrentSlide(currentIndex);
		};

		var slideToCurrentSlide = function () {
			var translateValue = currentIndex * -100;
			slidesWrapper.style.transform =
				"translateX(" + translateValue + "%)";
		};

		var incrementcurrentIndex = function () {
			if (currentIndex < slides.length - 1) {
				return ++currentIndex;
			} else {
				if (loop) {
					currentIndex = 0;
					return currentIndex;
				} else return;
			}
		};

		var decrementcurrentIndex = function () {
			if (currentIndex > 0) {
				return --currentIndex;
			} else {
				if (loop) {
					currentIndex = slides.length - 1;
					return currentIndex;
				} else return;
			}
		};

		var paddleBack = function (e) {
			decrementcurrentIndex();
			activateCurrentSlide();
			handlePaddleButtonsState();
			selectedDot = currentIndex;
			tempDot = selectedDot;
			if (withDotNav) selectDot();
		};

		var paddleForward = function (e) {
			incrementcurrentIndex();
			activateCurrentSlide();
			handlePaddleButtonsState();
			selectedDot = currentIndex;
			tempDot = selectedDot;
			if (withDotNav) selectDot();
		};

		var incrementTempDot = function () {
			if (tempDot < dots.length - 1) {
				return ++tempDot;
			} else {
				if (loop) {
					tempDot = 0;
					return tempDot;
				} else return;
			}
		};

		var decrementTempDot = function () {
			if (tempDot > 0) {
				return --tempDot;
			} else {
				if (loop) {
					tempDot = slides.length - 1;
					return tempDot;
				} else {
					return;
				}
			}
		};

		var focusCurrentDot = function () {
			dots[tempDot].focus();
		};

		var moveBack = function (e) {
			e.preventDefault();
			decrementTempDot();
			focusCurrentDot();

			if (!manual) {
				selectedDot = tempDot;
				currentIndex = selectedDot;
				selectDot();
				activateCurrentSlide();
				handlePaddleButtonsState();
			}
		};

		var moveForward = function (e) {
			e.preventDefault();
			incrementTempDot();
			focusCurrentDot();

			if (!manual) {
				selectedDot = tempDot;
				currentIndex = selectedDot;
				selectDot();
				activateCurrentSlide();
				handlePaddleButtonsState();
			}
		};

		var dotKeyboardRespond = function (e, dot) {
			var firstDot = dots[0];
			var lastDot = dots[dots.length - 1];

			var keyCode = e.keyCode || e.which;

			switch (keyCode) {
				case util.keyCodes.UP:
				case util.keyCodes.LEFT:
					moveBack(e);

					break;

				case util.keyCodes.DOWN:
				case util.keyCodes.RIGHT:
					moveForward(e);

					break;

				case util.keyCodes.ENTER:
				case util.keyCodes.SPACE:
					e.preventDefault();
					selectedDot = tempDot;
					currentIndex = selectedDot;
					handlePaddleButtonsState();
					selectDot();

					break;

				case util.keyCodes.TAB:
					slides[selectedDot].setAttribute("tabindex", "0");
					selectedDot = tempDot;
					currentIndex = selectedDot;
					break;

				case util.keyCodes.HOME:
					e.preventDefault();
					firstTab.focus();

					break;

				case util.keyCodes.END:
					e.preventDefault();
					lastTab.focus();

					break;
			}
		};

		var paddleKeyboardRespond = function (e) {
			var keyCode = e.keyCode || e.which;

			switch (keyCode) {
				case util.keyCodes.LEFT:
					prevButton.focus();
					paddleBack(e);
					break;

				case util.keyCodes.RIGHT:
					nextButton.focus();
					paddleForward(e);
					break;

				case util.keyCodes.ENTER:
				case util.keyCodes.SPACE:
					selectedDot = currentIndex;
					selectDot();
					break;

				case util.keyCodes.TAB:
					slides[selectedDot].setAttribute("tabindex", "0");
					currentIndex = selectedDot;
					break;
			}
		};

		init.call(this);
		return this;
	}; // ARIAslider()

	w.ARIAslider = ARIAslider;
})(window, document);

var sliderInstance = "[data-slider]";
var els = document.querySelectorAll(sliderInstance);
var allslider = [];

// Generate all slider instances
for (var i = 0; i < els.length; i++) {
	var nslider = new ARIAslider(els[i]); // if manual is set to false, the slider open on focus without needing an ENTER or SPACE press
	allslider.push(nslider);
}
