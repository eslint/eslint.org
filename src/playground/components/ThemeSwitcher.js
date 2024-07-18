import React, { useEffect, useState } from "react";

export default function ThemeSwitcher() {
	const [theme, setTheme] = useState(window.localStorage.getItem("theme"));

	const toggleTheme = newTheme => {
		if (newTheme === "system") {
			const currentSystemTheme = window.matchMedia(
				"(prefers-color-scheme: dark)",
			).matches
				? "dark"
				: "light";
			document.documentElement.setAttribute(
				"data-theme",
				currentSystemTheme,
			);
		} else {
			document.documentElement.setAttribute("data-theme", newTheme);
		}
		window.localStorage.setItem("theme", newTheme);
		setTheme(newTheme);
	};

	useEffect(() => {
		const media = window.matchMedia("(prefers-color-scheme: dark)");

		function onChangeMedia() {
			const currentTheme = window.localStorage.getItem("theme");

			if (currentTheme === "system" || !currentTheme) {
				toggleTheme("system");
			}
		}

		media.addEventListener("change", onChangeMedia);
		return () => media.removeEventListener("change", onChangeMedia);
	}, []);

	return (
		<div
			role="region"
			className="theme-switcher"
			aria-labelledby="theme-switcher-label"
			id="js-theme-switcher"
		>
			<h2
				className="theme-switcher-label visually-hidden"
				id="theme-switcher-label"
			>
				Theme <span className="visually-hidden">Switcher</span>
			</h2>
			<div className="theme-switcher__buttons">
				<button
					className="theme-switcher__button js-toggle-button"
					onClick={() => {
						toggleTheme("light");
					}}
					aria-pressed={theme === "light"}
					data-theme="light"
				>
					<svg
						className="theme-switcher__icon"
						focusable="false"
						width="22"
						height="22"
						viewBox="0 0 100 100"
						aria-hidden="true"
					>
						<g transform="translate(0,-952.36218)">
							<path
								d="m 50,955.36218 c 1.6568,0 3,1.3431 3,3 l 0,16 c 0,1.6569 -1.3432,3 -3,3 -1.6569,0 -3,-1.3431 -3,-3 l 0,-16 c 0,-1.6569 1.3431,-3 3,-3 z m 31.125,12.875 c 0.76777,0 1.50798,0.3205 2.09375,0.9062 1.17159,1.1717 1.17157,3.0472 0,4.2188 l -11.3125,11.3125 c -1.17157,1.1716 -3.04714,1.1716 -4.21875,0 -1.17153,-1.1715 -1.17158,-3.0472 0,-4.2187 L 79,969.14338 c 0.58579,-0.5857 1.35723,-0.9062 2.125,-0.9062 z m -62.25,0 c 0.76777,0 1.53921,0.3205 2.125,0.9062 l 11.3125,11.3126 c 1.17158,1.1715 1.17153,3.0472 0,4.2187 -1.17161,1.1716 -3.04718,1.1716 -4.21875,0 l -11.3125,-11.3125 c -1.17157,-1.1716 -1.17159,-3.0471 0,-4.2188 0.58577,-0.5857 1.32598,-0.9062 2.09375,-0.9062 z M 50,983.36218 c 10.45786,0 19,8.5422 19,19.00002 0,10.4579 -8.54214,19 -19,19 -10.45784,0 -19,-8.5421 -19,-19 0,-10.45792 8.54216,-19.00002 19,-19.00002 z m 0,6 c -7.21516,0 -13,5.7848 -13,13.00002 0,7.2152 5.78484,13 13,13 7.21518,0 13,-5.7848 13,-13 0,-7.21522 -5.78482,-13.00002 -13,-13.00002 z m 44,10 c 1.65686,0 2.99999,1.34322 3,3.00002 -1e-5,1.6569 -1.34315,3 -3,3 l -16,0 c -1.65685,0 -3,-1.3431 -3,-3 0,-1.6568 1.34316,-3.00002 3,-3.00002 l 16,0 z m -72,0 c 1.65684,0 3,1.34322 3,3.00002 0,1.6569 -1.34315,3 -3,3 l -16,0 c -1.65685,0 -2.99999,-1.3431 -3,-3 1e-5,-1.6568 1.34314,-3.00002 3,-3.00002 l 16,0 z m 47.8125,19.81252 c 0.76777,0 1.50797,0.2892 2.09375,0.875 l 11.3125,11.3125 c 1.17158,1.1716 1.17152,3.0472 0,4.2188 -1.1716,1.1715 -3.04718,1.1715 -4.21875,0 l -11.3125,-11.3126 c -1.17157,-1.1715 -1.1716,-3.0471 0,-4.2187 0.58577,-0.5858 1.35723,-0.875 2.125,-0.875 z m -39.625,0 c 0.76777,0 1.53923,0.2892 2.125,0.875 1.1716,1.1716 1.17157,3.0472 0,4.2187 L 21,1035.581 c -1.17157,1.1715 -3.04715,1.1715 -4.21875,0 -1.17152,-1.1716 -1.17158,-3.0472 0,-4.2188 l 11.3125,-11.3125 c 0.58578,-0.5858 1.32598,-0.875 2.09375,-0.875 z M 50,1027.3622 c 1.6568,0 3,1.3431 3,3 l 0,16 c 0,1.6569 -1.3432,3 -3,3 -1.6569,0 -3,-1.3431 -3,-3 l 0,-16 c 0,-1.6569 1.3431,-3 3,-3 z"
								fill="currentColor"
								fillOpacity="1"
								stroke="none"
							></path>
						</g>
					</svg>
					<span>Light</span>
				</button>
				<button
					className="theme-switcher__button js-toggle-button"
					id="system-theme-toggle"
					data-theme="system"
					onClick={() => {
						toggleTheme("system");
					}}
					aria-pressed={theme === "system"}
				>
					<svg
						className="theme-switcher__icon"
						focusable="false"
						width="22"
						height="22"
						viewBox="0 0 24 24"
						aria-hidden="true"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<rect
							x="2"
							y="3"
							width="20"
							height="14"
							rx="2"
							ry="2"
						></rect>
						<line x1="8" y1="21" x2="16" y2="21"></line>
						<line x1="12" y1="17" x2="12" y2="21"></line>
					</svg>
					<span>System</span>
				</button>
				<button
					className="theme-switcher__button js-toggle-button"
					onClick={() => {
						toggleTheme("dark");
					}}
					data-theme="dark"
					aria-pressed={theme === "dark"}
				>
					<svg
						className="theme-switcher__icon"
						focusable="false"
						width="22"
						height="22"
						viewBox="0 0 100 100"
						aria-hidden="true"
					>
						<g transform="translate(0,-952.36218)">
							<path
								d="m 35.377874,961.36325 a 3.0003,3.0003 0 0 0 -0.9063,0.1875 c -16.1759,5.9947 -25.4686997,21.7109 -25.4686997,39.59375 0,23.2769 18.9104997,42.2187 42.1873997,42.2187 17.8829,0 33.6304,-9.324 39.625,-25.5 a 3.0003,3.0003 0 0 0 -3.9374,-3.8125 c -4.0936,1.6462 -8.5949,2.5 -13.3438,2.5 -19.5969,0 -37.7188,-18.15315 -37.7188,-37.74995 0,-4.7489 0.8226,-9.2504 2.4688,-13.3437 a 3.0003,3.0003 0 0 0 -2.9062,-4.0938 z m -4.6563,8.7188 c -0.5822,2.8241 -0.9063,5.7363 -0.9063,8.7187 0,23.21085 20.5079,43.74995 43.7188,43.74995 2.9824,0 5.8946,-0.3553 8.7188,-0.9375 -6.2657,10.0487 -17.6431,15.75 -31.0626,15.75 -20.0342,0 -36.1874,-16.1844 -36.1874,-36.2187 0,-13.42105 5.6679,-24.79725 15.7187,-31.06245 z"
								fill="currentColor"
								fillOpacity="1"
								stroke="none"
							></path>
						</g>
					</svg>
					<span>Dark</span>
				</button>
			</div>
		</div>
	);
}
