import "regenerator-runtime/runtime";

import React, {
	useState,
	useEffect,
	useMemo,
	useCallback,
	useRef,
} from "react";
import { flushSync } from "react-dom";
import Alert from "./components/Alert";
import CrashAlert from "./components/CrashAlert";
import Footer from "./components/Footer";
import CodeEditor from "./components/CodeEditor";
import { Linter } from "eslint/universal";
import Unicode from "./utils/unicode";
import Configuration from "./components/Configuration";
import Split from "react-split";
import debounce from "./utils/debounce";
import AlertsActionBar from "./components/AlertsActionBar";
import "./scss/split-pane.scss";
import * as typeScriptESLintParser from "@typescript-eslint/parser";

const BOM = "\uFEFF";

const DEFAULT_TEXT =
	'/* eslint quotes: ["error", "double"] */\nconst a = \'b\';';

const linter = new Linter({ configType: "flat" });
const legacyLinter = new Linter({ configType: "eslintrc" });
const rules = legacyLinter.getRules();
const ruleNames = Array.from(rules.keys());
const rulesMeta = Array.from(rules.entries()).reduce((result, [key, value]) => {
	result[key] = value.meta;
	return result;
}, {});

const getDefaultOptions = () => ({
	rules: [...rules.entries()].reduce((result, [ruleId, rule]) => {
		if (rule.meta.docs.recommended) {
			result[ruleId] = ["error"];
		}
		return result;
	}, {}),
});

const fillOptionsDefaults = options => ({
	rules: {},
	...options,
	languageOptions: {
		...options.languageOptions,
		parserOptions: {
			ecmaFeatures: {},
			...options.languageOptions?.parserOptions,
		},
	},
});

const convertLegacyOptionsToFlatConfig = options => {
	// If there are no legacy properties, return it
	if (!options.env && !options.parserOptions) {
		return options;
	}

	// eslint-disable-next-line no-unused-vars -- `env` is discarded as it doesn't exist in flat config
	const { env, parserOptions, ...flatConfigOptions } = options;

	if (parserOptions) {
		const { ecmaFeatures, ...restParserOptions } = parserOptions;

		flatConfigOptions.languageOptions = restParserOptions;

		/*
		 * Normalize ecmaVersion to support links with configs generated
		 * by the old demo (https://archive.eslint.org/demo)
		 */
		if (
			typeof parserOptions.ecmaVersion === "number" &&
			parserOptions.ecmaVersion >= 6 &&
			parserOptions.ecmaVersion < 2015
		) {
			flatConfigOptions.languageOptions.ecmaVersion =
				parserOptions.ecmaVersion + 2009;
		}

		if (ecmaFeatures) {
			flatConfigOptions.languageOptions.parserOptions = { ecmaFeatures };
		}
	}

	return flatConfigOptions;
};

const getUrlState = () => {
	try {
		const urlState = JSON.parse(
			Unicode.decodeFromBase64(window.location.hash.replace(/^#/u, "")),
		);

		if (typeof urlState.text === "undefined") {
			return null;
		}

		return { text: urlState.text, options: urlState.options };
	} catch {
		return null;
	}
};

const getLocalStorageState = () => {
	try {
		const localStorageState = JSON.parse(
			window.localStorage.getItem("linterDemoState") || "{}",
		);

		if (typeof localStorageState.text === "undefined") {
			return null;
		}

		return {
			text: localStorageState.text,
			options: localStorageState.options,
		};
	} catch {
		return null;
	}
};

const hasLocalStorage = () => {
	try {
		window.localStorage.setItem("localStorageTest", "foo");
		window.localStorage.removeItem("localStorageTest");
		return true;
	} catch {
		return false;
	}
};

const applyFix = (text, fix) => {
	const bomOffset = text.startsWith(BOM) ? 1 : 0;
	const start = fix.range[0] + bomOffset;
	const end = fix.range[1] + bomOffset;

	return `${text.slice(0, start)}${fix.text}${text.slice(end)}`;
};

const App = () => {
	let initialText, initialOptions;
	const editorRef = useRef(null);

	const initialState = getUrlState() || getLocalStorageState();

	if (initialState) {
		initialText = initialState.text;
		initialOptions = initialState.options
			? convertLegacyOptionsToFlatConfig(initialState.options)
			: {};
	} else {
		initialText = DEFAULT_TEXT;
		initialOptions = getDefaultOptions();
	}

	initialOptions = fillOptionsDefaults(initialOptions);

	const [text, setText] = useState(initialText);
	const [fix, setFix] = useState(false);
	const [options, setOptions] = useState(initialOptions);

	// In some cases, Linter modifies `languageOptions`, so we'll deep-clone them
	const optionsForLinter = {
		...options,
		languageOptions: {
			...options.languageOptions,
			...(options?.languageOptions.parser ===
				"@typescript-eslint/parser" && {
				parser: typeScriptESLintParser,
			}),
			parserOptions: {
				...options.languageOptions.parserOptions,
				ecmaFeatures: {
					...options.languageOptions.parserOptions.ecmaFeatures,
				},
				...(options?.languageOptions.parser && {
					sourceType: "module",
				}),
			},
		},
	};

	const lint = () => {
		try {
			const { messages, output } = linter.verifyAndFix(
				text,
				optionsForLinter,
				{ fix },
			);
			let fatalMessage;

			if (messages && messages.length > 0 && messages[0].fatal) {
				fatalMessage = messages[0];
			}

			return {
				messages,
				output,
				fatalMessage,
			};
		} catch (error) {
			if (error.message.includes('Key "rules":')) {
				return {
					messages: [],
					output: text,
					validationError: error,
				};
			}

			return {
				messages: [],
				output: text,
				crashError: error,
			};
		}
	};

	const storeState = useCallback(
		({ newText, newOptions }) => {
			const serializedState = JSON.stringify({
				text: newText,
				options: newOptions || options,
			});

			if (hasLocalStorage()) {
				window.localStorage.setItem("linterDemoState", serializedState);
			}

			const url = new URL(location);

			url.hash = Unicode.encodeToBase64(serializedState);
			history.replaceState(null, null, url);
		},
		[options],
	);

	const { messages, output, fatalMessage, crashError, validationError } =
		lint();
	const isInvalidAutofix = fatalMessage && text !== output;

	const onFix = message => {
		if (message.fix) {
			const fixedCode = applyFix(text, message.fix);

			setText(fixedCode);
			storeState({ newText: fixedCode });
		}
	};

	const onFixAll = () => {
		const hasFixableMessages = messages.filter(message => message.fix);
		if (!hasFixableMessages) {
			return;
		}

		const result = linter.verifyAndFix(text, optionsForLinter, {
			fix: true,
		});
		setText(result.output);
		storeState({
			newText: result.output,
		});
	};

	const onPositionClick = message => {
		if (editorRef.current) {
			editorRef.current.scrollToPosition(
				message.line,
				message.column - 1,
			);
		}
	};

	const updateOptions = newOptions => {
		setOptions(newOptions);
		storeState({ newOptions, newText: text });
	};
	const [showConfigMenu, setShowConfigMenu] = useState(false);
	const [isConfigHidden, setIsConfigHidden] = useState(
		window.matchMedia("(min-width: 1023px)").matches,
	);

	useEffect(() => {
		const mq = window.matchMedia("(min-width: 1023px)");

		const ConfigToggler = () => {
			setIsConfigHidden(mq.matches);
		};

		mq.addEventListener("change", ConfigToggler);

		return () => mq.removeEventListener("change", ConfigToggler);
	}, []);

	// Please do not remove `flushSync`: https://github.com/eslint/eslint.org/pull/745
	const debouncedOnUpdate = useMemo(
		() =>
			debounce(
				value =>
					flushSync(() => {
						setFix(false);
						setText(value);
						storeState({ newText: value });
					}),
				400,
			),
		[storeState],
	);

	const [rulesWithInvalidConfigs, setRulesWithInvalidConfigs] = useState(
		new Set([]),
	);

	const filteredMessages = messages.filter(
		message =>
			!message.suggestions &&
			(message.fix || options.rules[message.ruleId]),
	);

	return (
		<div className="playground-wrapper">
			<div className="playground__config-and-footer">
				<section
					className="playground__config"
					aria-labelledby="playground__config-toggle"
				>
					<button
						className="playground__config-toggle"
						id="playground__config-toggle"
						onClick={() => {
							setShowConfigMenu(value => !value);
						}}
						aria-expanded={showConfigMenu}
						hidden={isConfigHidden}
					>
						<span>Configuration</span>
						<svg
							width="20"
							height="20"
							viewBox="20 20 60 60"
							aria-hidden="true"
							focusable="false"
						>
							<path
								id="ham-top"
								d="M30,37 L70,37 Z"
								stroke="currentColor"
							></path>
							<path
								id="ham-middle"
								d="M30,50 L70,50 Z"
								stroke="currentColor"
							></path>
							<path
								id="ham-bottom"
								d="M30,63 L70,63 Z"
								stroke="currentColor"
							></path>
						</svg>
					</button>
					<span className="visually-hidden" id="infobox">
						Changing configurations will apply the selected changes
						to the playground.
					</span>
					<div
						className="playground__config-options"
						id="playground__config-options"
						data-open={isConfigHidden ? true : showConfigMenu}
					>
						<Configuration
							errors={messages}
							initialOptions={fillOptionsDefaults(
								getDefaultOptions(),
							)}
							ruleNames={ruleNames}
							options={options}
							onUpdate={updateOptions}
							rulesMeta={rulesMeta}
							validationError={validationError}
							eslintVersion={linter.version}
							rulesWithInvalidConfigs={rulesWithInvalidConfigs}
							setRulesWithInvalidConfigs={
								setRulesWithInvalidConfigs
							}
						/>
						<Footer />
					</div>
				</section>
			</div>

			<div className="playground__main">
				<Split
					className="resizable__container"
					direction="vertical"
					minSize={180}
					gutterAlign="start"
				>
					<main
						className="playground__editor"
						id="main"
						aria-label="Editor"
					>
						<CodeEditor
							ref={editorRef}
							tabIndex="0"
							codeValue={text}
							eslintInstance={linter}
							eslintOptions={optionsForLinter}
							onUpdate={debouncedOnUpdate}
						/>
					</main>
					<section
						className="playground__console"
						aria-labelledby="playground__console-label"
					>
						{/* <div className="playground__console-announcements visually-hidden" aria-live="polite" aria-atomic="true">
                        2 warnings and 1 error logged to the console.
                    </div> */}

						{isInvalidAutofix && (
							<Alert
								type="error"
								text={`Invalid autofix! ${fatalMessage.message}`}
							/>
						)}
						{crashError && <CrashAlert error={crashError} />}
						{validationError && (
							<Alert
								type="error"
								text={validationError.message}
							/>
						)}
						{filteredMessages.length > 1 && (
							<AlertsActionBar
								messages={messages}
								options={options}
								setRulesWithInvalidConfigs={
									setRulesWithInvalidConfigs
								}
								onFixAll={onFixAll}
								onUpdate={updateOptions}
							/>
						)}
						{messages.length > 0 &&
							messages.map(message => (
								<Alert
									key={`${message.ruleId}:${message.line}:${message.column}`}
									type={
										message.severity === 2
											? "error"
											: "warning"
									}
									message={message}
									suggestions={message.suggestions}
									options={options}
									rulesWithInvalidConfigs={
										rulesWithInvalidConfigs
									}
									setRulesWithInvalidConfigs={
										setRulesWithInvalidConfigs
									}
									onFix={onFix}
									onUpdate={updateOptions}
									onPositionClick={onPositionClick}
								/>
							))}
					</section>
				</Split>
			</div>
		</div>
	);
};

export default App;
