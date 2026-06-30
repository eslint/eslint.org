import Select from "react-select";
import { customStyles, customTheme } from "../utils/constants";

const optionsForLanguage = [
	{ value: "javascript", label: "JavaScript" },
	{ value: "typescript", label: "TypeScript" },
	{ value: "css", label: "CSS" },
	{ value: "markdown", label: "Markdown" },
	{ value: "json", label: "JSON" },
];

export default function LanguageSwitcher({ className, selectedLanguage, setSelectedLanguage }) {
	return (
		<div className={`playground__config-options__section ${className || ""}`}>
			<label className="label__text">Language</label>
			<div data-config-section>
				<Select
					isSearchable={false}
					styles={customStyles}
					theme={theme => customTheme(theme)}
					value={optionsForLanguage.find(option => option.value === selectedLanguage)}
					options={optionsForLanguage}
					onChange={option => setSelectedLanguage(option.value)}
				/>
			</div>
		</div>
	);
}
