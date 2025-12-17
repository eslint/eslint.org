import ThemeSwitcher from "./theme-switcher";
import SocialIcons from "./social-icons";

export default function Footer() {
	return (
		<footer className="playground-footer">
			<SocialIcons />
			<div className="copyright">
				&copy; OpenJS Foundation and other contributors,{" "}
				<a href="https://www.openjsf.org">www.openjsf.org</a>
			</div>
			<ThemeSwitcher />
		</footer>
	);
}
