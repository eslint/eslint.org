import React, { useState, useRef, useEffect } from "react";
import Select, { components } from "react-select";
import ShareURL from "./ShareURL";
import {
	ECMA_FEATURES,
	ECMA_VERSIONS,
	SOURCE_TYPES,
	CONFIG_FORMATS,
} from "../utils/constants";

const customStyles = {
	singleValue: styles => ({
		...styles,
		color: "var(--body-text-color)",
	}),
	control: styles => ({
		...styles,
		backgroundColor: "var(--body-background-color)",
		border: "1px solid var(--border-color)",
		color: "var(--body-text-color)",
		padding: 0,
		":hover": {
			...styles[":hover"],
			borderColor: "var(--color-primary-700)",
		},
		":focus": {
			borderColor: "var(--color-primary-700)",
		},
		":active": {
			borderColor: "var(--color-primary-700)",
		},
	}),
	option: (styles, state) => ({
		...styles,
		backgroundColor: state.isFocused
			? "var(--color-primary-700)"
			: "var(--body-background-color)",
		color: state.isFocused ? "white" : "var(--body-text-color)",
		cursor: "pointer",
		border: "1px solid var(--border-color)",
		borderBottom: "none",
		":hover": {
			...styles[":hover"],
			backgroundColor: "var(--color-primary-700)",
			color: "white",
		},
		":active": {
			...styles[":active"],
			backgroundColor: "var(--color-primary-700)",
		},
	}),
	input: styles => ({
		...styles,
		color: "var(--body-text-color)",
		caretShape: "underscore",
	}),
	indicatorsContainer: styles => ({
		...styles,
		cursor: "pointer",
	}),
	indicatorSeparator: styles => ({
		...styles,
		cursor: "auto",
	}),
	multiValue: styles => ({
		...styles,
		color: "var(--body-text-color)",
		backgroundColor: "var(--lighter-background-color)",
		border: "1px solid var(--border-color)",
	}),
	multiValueLabel: styles => ({
		...styles,
		color: "var(--headings-color)",
		backgroundColor: "var(--lighter-background-color)",
	}),
	multiValueRemove: styles => ({
		...styles,
		color: "var(--headings-color)",
		cursor: "pointer",
		backgroundColor: "var(--lighter-background-color)",
	}),
	noOptionsMessage: styles => ({
		...styles,
		backgroundColor: "var(--body-background-color)",
		border: "1px solid var(--border-color)",
		borderBottom: "none",
	}),
	menuList: styles => ({
		...styles,
		padding: 0,
		borderBottom: "1px solid var(--border-color)",
	}),
};

const customTheme = theme => ({
	...theme,
	colors: {
		...theme.colors,
		primary25: "var(--color-primary-500)",
		primary: "var(--color-primary-700)",
	},
});

const defaultOption = {
	value: "default",
	label: "(default)",
};

const isEmpty = obj => Object.keys(obj).length === 0;

export default function Configuration({
	initialOptions,
	rulesMeta,
	eslintVersion,
	errors,
	onUpdate,
	options,
	ruleNames,
	validationError,
	rulesWithInvalidConfigs,
	setRulesWithInvalidConfigs,
}) {
	const [showVersion, setShowVersions] = useState(false);
	const [showRules, setShowRules] = useState(true);
	const [configFileFormat, setConfigFileFormat] = useState("ESM");

	const sourceTypeOptions = [
		defaultOption,
		...SOURCE_TYPES.map(sourceType => ({
			value: sourceType,
			label: sourceType,
		})),
	];
	const sourceTypeOptionsForTypeScriptParser = [
		...SOURCE_TYPES.map(sourceType => ({
			value: sourceType,
			label: sourceType,
		})),
	];
	const ECMAFeaturesOptions = ECMA_FEATURES.map(ecmaFeature => ({
		value: ecmaFeature,
		label: ecmaFeature,
	}));
	const ECMAVersionsOptions = [
		defaultOption,
		...ECMA_VERSIONS.map(ecmaVersion => ({
			value: ecmaVersion === "latest" ? ecmaVersion : Number(ecmaVersion),
			label: ecmaVersion,
		})),
	];
	const configFileFormatOptions = CONFIG_FORMATS.map(configFormat => ({
		value: configFormat,
		label: configFormat,
	}));
	const ESLintParserOptions = [
		{ value: "default", label: "Espree (default)" },
		{
			value: "@typescript-eslint/parser",
			label: "@typescript-eslint/parser",
		},
	];

	// filter rules which are already added to the configuration
	const ruleNamesOptions = ruleNames
		.filter(ruleName => options.rules && !options.rules[ruleName])
		.map(ruleName => ({
			value: ruleName,
			label: rulesMeta[ruleName].deprecated
				? ruleName.concat(" (deprecated)")
				: ruleName,
		}));
	const [selectedRules, setSelectedRules] = useState([]);
	const ruleInputRef = useRef(null);
	const firstRuleRef = useRef();

	useEffect(() => {
		firstRuleRef.current?.focus();
	}, [options.rules]);

	const handleRuleChange = () => {
		selectedRules.forEach(selectedRule => {
			if (ruleNames.includes(selectedRule)) {
				const newOptions = {
					...options,
					rules: {
						...options.rules,
						[selectedRule]: ["error"],
					},
				};

				onUpdate(newOptions);
				ruleInputRef.current.setValue("");
			}
		});
	};

	const Input = props => {
		if (props.isHidden) {
			return <components.Input {...props} />;
		}
		return (
			<components.Input
				{...props}
				onKeyDown={e => {
					if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
						handleRuleChange();
						e.stopPropagation();
					}
				}}
			/>
		);
	};

	const allRulesSelected =
		Object.keys(options.rules).length === ruleNames.length;

	const selectAll = () => {
		if (allRulesSelected) {
			const newOptions = {
				...options,
				rules: {},
			};

			setSelectedRules([]);
			onUpdate(newOptions);
		} else {
			const rules = {};

			ruleNames.forEach(ruleName => {
				rules[ruleName] = ["error"];
			});

			const newOptions = {
				...options,
				rules,
			};

			ruleInputRef.current.setValue("");
			onUpdate(newOptions);
		}
	};

	const revertToDefault = () => {
		onUpdate(Object.assign({}, initialOptions));
	};

	const normalizeParser = config => {
		if (config.languageOptions && config.languageOptions.parser) {
			const parser = config.languageOptions.parser;

			if (parser === "@typescript-eslint/parser") {
				config.languageOptions.parser = "___TS_PARSER_PLACEHOLDER___";
			}
		}

		return config;
	};

	// Remove empty objects from download configuration
	const hasEcmaFeatures = !isEmpty(
		options.languageOptions.parserOptions.ecmaFeatures,
	);
	const optionsForConfigFile = {
		rules: isEmpty(options.rules) ? void 0 : options.rules,
		languageOptions:
			Object.keys(options.languageOptions).length === 1 &&
			!hasEcmaFeatures
				? void 0
				: {
						...options.languageOptions,
						parserOptions: !hasEcmaFeatures
							? void 0
							: options.languageOptions.parserOptions,
					},
	};

	const configOptionsWithNormalizedParser =
		normalizeParser(optionsForConfigFile);

	const configFileContent =
		`${options.languageOptions.parser && 'import tsParser from "@typescript-eslint/parser";'}\n${configFileFormat === "ESM" ? "export default" : "module.exports ="} ${JSON.stringify([configOptionsWithNormalizedParser], null, 4)};`.replace(
			/"___TS_PARSER_PLACEHOLDER___"/gu,
			"tsParser",
		);

	return (
		<div className="playground__config-options__sections">
			<div className="playground__config-options__section">
				<ShareURL
					errors={errors}
					url={window.location}
					config={configFileContent}
				/>
			</div>
			<div className="playground__config-options__section">
				<button
					className="playground-toggle c-btn c-btn--ghost"
					onClick={() =>
						setShowVersions(currentValue => !currentValue)
					}
				>
					<h2 data-config-section-title>Versioning and Config</h2>
					<svg
						height="20"
						width="20"
						viewBox="0 0 20 20"
						aria-hidden="true"
						focusable="false"
						fill="currentColor"
						style={{
							transform: showVersion ? "rotate(180deg)" : null,
						}}
					>
						<path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
					</svg>
				</button>
				{showVersion && (
					<div data-config-section>
						<div className="c-field-group">
							<label className="c-field" htmlFor="eslint-version">
								<span className="label__text">
									ESLint Version
								</span>
								<span className="label__text">{`v${eslintVersion}`}</span>
							</label>
							<label className="c-field" htmlFor="ecma-version">
								<span className="label__text">
									ECMA Version
								</span>
								<Select
									isSearchable={false}
									styles={customStyles}
									theme={theme => customTheme(theme)}
									value={ECMAVersionsOptions.filter(
										ecmaVersion =>
											ecmaVersion.value ===
											(options.languageOptions
												?.ecmaVersion || "default"),
									)}
									options={ECMAVersionsOptions}
									onChange={selected => {
										const newOptions = {
											...options,
											languageOptions: {
												...options.languageOptions,
											},
										};

										if (selected.value === "default") {
											delete newOptions.languageOptions
												.ecmaVersion;
										} else {
											newOptions.languageOptions.ecmaVersion =
												selected.value;
										}

										onUpdate(newOptions);
									}}
								/>
							</label>
						</div>
						<label className="c-field" htmlFor="source-type">
							<span className="label__text">Source Type</span>
							<Select
								isSearchable={false}
								styles={customStyles}
								theme={theme => customTheme(theme)}
								value={
									options.languageOptions.parser
										? sourceTypeOptionsForTypeScriptParser.filter(
												sourceTypeOption =>
													sourceTypeOption.value ===
													options.languageOptions
														.parserOptions
														.sourceType,
											)
										: sourceTypeOptions.filter(
												sourceTypeOption =>
													sourceTypeOption.value ===
													(options.languageOptions
														?.sourceType ||
														"default"),
											)
								}
								options={
									options.languageOptions.parser
										? sourceTypeOptionsForTypeScriptParser
										: sourceTypeOptions
								}
								onChange={selected => {
									const newOptions = {
										...options,
										languageOptions: {
											...options.languageOptions,
											parserOptions: {
												...options.languageOptions
													.parserOptions,
											},
										},
									};

									if (newOptions.languageOptions.parser) {
										newOptions.languageOptions.parserOptions.sourceType =
											selected.value;
									} else {
										if (selected.value === "default") {
											delete newOptions.languageOptions
												.sourceType;
										} else {
											newOptions.languageOptions.sourceType =
												selected.value;
										}
									}

									onUpdate(newOptions);
								}}
							/>
						</label>
						<div className="combo">
							<label
								id="ecma-combo-label"
								htmlFor="ECMA Feature"
								className="label__text"
							>
								ECMA Features
							</label>
							<Select
								isClearable
								isMulti
								value={ECMAFeaturesOptions.filter(
									ecmaFeatureName =>
										options.languageOptions.parserOptions
											.ecmaFeatures[
											ecmaFeatureName.value
										],
								)}
								isSearchable={false}
								styles={customStyles}
								theme={theme => customTheme(theme)}
								options={
									options.languageOptions.parser
										? ECMAFeaturesOptions.slice(0, -1)
										: ECMAFeaturesOptions
								}
								onChange={selectedOptions => {
									const newOptions = {
										...options,
										languageOptions: {
											...options.languageOptions,
											parserOptions: {
												...options.languageOptions
													.parserOptions,
												ecmaFeatures: {},
											},
										},
									};

									selectedOptions.forEach(selected => {
										newOptions.languageOptions.parserOptions.ecmaFeatures[
											selected.value
										] = true;
									});
									onUpdate(newOptions);
								}}
							/>
						</div>
						<label
							className="c-field"
							style={{ marginTop: "1rem", marginBottom: "0" }}
							htmlFor="parser"
						>
							<span className="label__text">Parser</span>
							<Select
								isSearchable={false}
								styles={customStyles}
								theme={theme => customTheme(theme)}
								value={ESLintParserOptions.filter(
									eslintParser =>
										eslintParser.value ===
										(options.languageOptions?.parser ||
											"default"),
								)}
								options={ESLintParserOptions}
								onChange={selected => {
									const newOptions = {
										...options,
										languageOptions: {
											...options.languageOptions,
											parserOptions: {
												...options.languageOptions
													.parserOptions,
												ecmaFeatures: {},
											},
										},
									};

									if (selected.value === "default") {
										delete newOptions.languageOptions
											.parser;
										delete newOptions.languageOptions
											.parserOptions.sourceType;
										newOptions.languageOptions.parserOptions.ecmaFeatures =
											{};
									} else {
										newOptions.languageOptions.parser =
											selected.value;
										delete newOptions.languageOptions
											.sourceType;
										newOptions.languageOptions.parserOptions.sourceType =
											"module";
										newOptions.languageOptions.parserOptions.ecmaFeatures.jsx = true;
									}

									onUpdate(newOptions);
								}}
							/>
						</label>
					</div>
				)}
			</div>
			<div className="playground__config-options__section playground__config-options__section--rules">
				<button
					className="playground-toggle c-btn c-btn--ghost"
					onClick={() => setShowRules(currentValue => !currentValue)}
				>
					<h2 data-config-section-title>Rules</h2>
					<svg
						height="20"
						width="20"
						viewBox="0 0 20 20"
						aria-hidden="true"
						focusable="false"
						fill="currentColor"
						style={{
							transform: showRules ? "rotate(180deg)" : null,
						}}
					>
						<path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
					</svg>
				</button>
				{showRules && (
					<div data-config-section>
						{!allRulesSelected && (
							<>
								<label htmlFor="rules" className="combo-label">
									<span className="label__text">
										Choose a rule
									</span>
								</label>
								<Select
									isMulti
									components={{ Input }}
									isClearable
									isSearchable
									styles={customStyles}
									theme={theme => customTheme(theme)}
									ref={ruleInputRef}
									onChange={selected => {
										if (!selected) {
											setSelectedRules([]);
										} else {
											setSelectedRules(
												selected.map(
													values => values.value,
												),
											);
										}
									}}
									options={ruleNamesOptions}
								/>
							</>
						)}
						<div className="rules-actions">
							{!allRulesSelected && (
								<button
									className="c-btn c-btn--ghost add-rule-btn"
									onClick={() => {
										handleRuleChange();
									}}
								>
									{selectedRules.length > 1
										? "Add these Rules"
										: "Add this Rule"}
								</button>
							)}
							<button
								className="c-btn c-btn--ghost add-rule-btn"
								onClick={selectAll}
							>
								{allRulesSelected
									? "Disable all rules"
									: "Enable all rules"}
							</button>
						</div>
						<ul
							className="config__added-rules"
							aria-labelledby="added-rules-label"
						>
							{options.rules &&
								Object.keys(options.rules)
									.sort()
									.map((ruleName, index) => (
										<li
											className="config__added-rules__item"
											key={ruleName}
										>
											<h4 className="config__added-rules__rule-name">
												<a
													href={
														rulesMeta[ruleName].docs
															.url
													}
												>
													{`${ruleName} ${rulesMeta[ruleName].deprecated ? "(deprecated)" : ""}`}
												</a>
												<button
													aria-label={`Remove ${ruleName}`}
													title={`Remove ${ruleName}`}
													onClick={() => {
														const newOptions = {
															...options,
															rules: {
																...options.rules,
															},
														};

														delete newOptions.rules[
															ruleName
														];

														setRulesWithInvalidConfigs(
															new Set(
																[
																	...rulesWithInvalidConfigs,
																].filter(
																	rule =>
																		rule !==
																		ruleName,
																),
															),
														);
														onUpdate(newOptions);
													}}
												>
													<svg
														width="25"
														height="25"
														viewBox="0 0 45 44"
														fill="none"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path
															d="M28.5 16L16.5 28M16.5 16L28.5 28"
															stroke="var(--link-color)"
															strokeWidth="5"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
													</svg>
												</button>
											</h4>
											<input
												{...(index === 0
													? { ref: firstRuleRef }
													: {})}
												id={ruleName}
												className={
													rulesWithInvalidConfigs.has(
														ruleName,
													) ||
													validationError?.message.includes(
														`"${ruleName}"`,
													)
														? "config__added-rules__rule-input-error"
														: ""
												}
												style={{ width: "100%" }}
												defaultValue={JSON.stringify(
													options.rules[ruleName],
												)}
												placeholder={'["error"]'}
												onChange={event => {
													try {
														const newOptions = {
															...options,
															rules: {
																...options.rules,
																[ruleName]:
																	JSON.parse(
																		event
																			.target
																			.value,
																	),
															},
														};

														setRulesWithInvalidConfigs(
															new Set(
																[
																	...rulesWithInvalidConfigs,
																].filter(
																	rule =>
																		rule !==
																		ruleName,
																),
															),
														);

														onUpdate(newOptions);
													} catch {
														setRulesWithInvalidConfigs(
															new Set([
																...rulesWithInvalidConfigs,
																ruleName,
															]),
														);
													}
												}}
											/>
											{rulesWithInvalidConfigs.has(
												ruleName,
											) && (
												<p className="config__added-rules__rule-error">
													Invalid rule configuration.
													Please use a valid JSON
													format.
												</p>
											)}
										</li>
									))}
						</ul>
					</div>
				)}
			</div>
			{/* TODO: Add Plugins */}
			{/* <div className="playground__config-options__section">
                <h2 data-config-section-title>Plugins</h2>
                <div data-config-section>
                     <!-- <label className="c-checkbox c-field" htmlFor="plugins-select-all">
                                            <input type="checkbox" id="plugins-select-all">
                                            <span class ="label__text">Install plugins</span>
                                            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none" class ="c-checkbox__icon">
                                            <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" fill="var(--lightest-background-color)" />
                                            <path class ="cm" d="M12 5L6.5 10.5L4 8" stroke="transparent" strokeWidth="1.6666" strokeLinecap="round" strokeLinejoin="round" />
                                            <rect class ="border" x="0.5" y="0.5" width="15" height="15" rx="3.5" stroke="var(--border-color)" />
                                            </svg>
                                        </label> -->
                    <div className="combo">
                        <label id="plugins-combo-label" className="combo-label visually-hidden">Select plugins</label>
                        <span id="combo-remove" hidden>remove</span>
                        <ul role="list" className="selected-options pills" id="plugins-combo-selected"></ul>
                        <div className="combo js-multiselect">
                            <input aria-activedescendant="" autocomplete="off" aria-autocomplete="none" aria-controls="listbox3" aria-expanded="false" aria-haspopup="listbox" aria-labelledby="plugins-combo-label combo-selected" id="plugins-combo" className="combo-input c-field__input custom-select" role="combobox" type="text" placeholder="Choose plugins" />
                            <div className="combo-menu" role="listbox" id="listbox3"></div>
                        </div>
                    </div>
                </div>
            </div> */}

			<div className="playground__config-options__section">
				<div data-config-section>
					<label className="c-field" htmlFor="config-format">
						<span className="label__text">
							Configuration File Format
						</span>
						<Select
							isSearchable={false}
							styles={customStyles}
							theme={theme => customTheme(theme)}
							defaultValue={configFileFormatOptions.filter(
								formatOption => formatOption.value === "ESM",
							)}
							options={configFileFormatOptions}
							onChange={selected => {
								setConfigFileFormat(selected.value);
							}}
						/>
					</label>
					<a
						href={`data:application/json;charset=utf-8,${encodeURIComponent(configFileContent)}`}
						download="eslint.config.js"
						className="c-btn c-btn--primary playground__config__download-btn"
					>
						Download this config file
					</a>

					<button
						onClick={revertToDefault}
						className="c-btn c-btn--secondary"
					>
						Reset
					</button>
				</div>
			</div>
		</div>
	);
}
