import Select from "react-select";
import { customStyles, customTheme } from "../utils/configuration-theme";

const optionsForLanguage = [
	{ value: "javascript", label: "JavaScript" },
	{ value: "typescript", label: "TypeScript" },
	{ value: "css", label: "CSS" },
	{ value: "markdown", label: "Markdown" },
	{ value: "json", label: "JSON" },
];

export default function LanguageSwitcher({
	selectedLanguage,
	setSelectedLanguage,
	changeRulesDataWithLanguage,
}) {
	const handleLanguageChange = (option) => {
		setSelectedLanguage(option.value);
		changeRulesDataWithLanguage(option.value);
	};

	return (
		<div
			className="playground__config-options__section"
		>
			<label className="label__text" htmlFor="playground-language">
				Language
			</label>
			<div data-config-section>
				<Select
					inputId="playground-language"
					className="language-switcher-input"
					isSearchable={false}
					styles={customStyles}
					theme={theme => customTheme(theme)}
					value={optionsForLanguage.find(
						option => option.value === selectedLanguage,
					)}
					options={optionsForLanguage}
					onChange={handleLanguageChange}
				/>
			</div>
		</div>
	);
}
