import React, { useState, useRef } from "react";
import Select from "react-select";
import RuleItem from "./RuleItem";
import ShareURL from "./ShareURL";
import { ECMA_FEATURES, ECMA_VERSIONS, SOURCE_TYPES, ENV_NAMES } from "../utils/constants";

const customStyles = {
    singleValue: styles => ({
        ...styles,
        color: "var(--body-text-color)"
    }),
    control: styles => ({
        ...styles,
        backgroundColor: "var(--body-background-color)",
        border: "1px solid var(--border-color)",
        color: "var(--body-text-color)",
        padding: 0,
        ":hover": {
            ...styles[":hover"],
            borderColor: "var(--color-primary-700)"
        },
        ":focus": {
            borderColor: "var(--color-primary-700)"
        },
        ":active": {
            borderColor: "var(--color-primary-700)"
        }
    }),
    option: (styles, state) => ({
        ...styles,
        backgroundColor: state.isFocused ? "var(--color-primary-700)" : "var(--body-background-color)",
        color: state.isFocused ? "white" : "var(--body-text-color)",
        cursor: "pointer",
        border: "1px solid var(--border-color)",
        margin: "-4px 0 -4px 0",
        ":hover": {
            ...styles[":hover"],
            backgroundColor: "var(--color-primary-700)",
            color: "white"
        },
        ":active": {
            ...styles[":active"],
            backgroundColor: "var(--color-primary-700)"
        }
    }),
    input: styles => ({
        ...styles,
        color: "var(--body-text-color)",
        caretShape: "underscore"
    }),
    multiValue: styles => ({
        ...styles,
        color: "var(--body-text-color)",
        backgroundColor: "var(--lighter-background-color)",
        border: "1px solid var(--border-color)"
    }),
    multiValueLabel: styles => ({
        ...styles,
        color: "var(--headings-color)",
        backgroundColor: "var(--lighter-background-color)"
    }),
    multiValueRemove: styles => ({
        ...styles,
        color: "var(--headings-color)",
        cursor: "pointer",
        backgroundColor: "var(--lighter-background-color)"
    })
};

const customTheme = theme => ({
    ...theme,
    colors: {
        ...theme.colors,
        primary25: "var(--color-primary-500)",
        primary: "var(--color-primary-700)"
    }
});

export default function Configuration({ rulesMeta, eslintVersion, onUpdate, options, ruleNames, validationError }) {
    const sourceTypeOptions = SOURCE_TYPES.map(sourceType => ({ value: sourceType, label: sourceType }));
    const ECMAFeaturesOptions = ECMA_FEATURES.map(ecmaFeature => ({ value: ecmaFeature, label: ecmaFeature }));
    const ECMAVersionsOptions = ECMA_VERSIONS.map(ecmaVersion => ({ value: ecmaVersion === "latest" ? ecmaVersion : Number(ecmaVersion), label: ecmaVersion }));
    const envNamesOptions = ENV_NAMES.map(envName => ({ value: envName, label: envName }));

    // filter rules which are already added to the configuration
    const ruleNamesOptions = ruleNames.filter(ruleName => options.rules && !options.rules[ruleName]).map(ruleName => ({
        value: ruleName,
        label: rulesMeta[ruleName].deprecated ? ruleName.concat(" (deprecated)") : ruleName
    }));
    const [selectedRule, setSelectedRule] = useState();
    const ruleInputRef = useRef(null);
    const [rulesWithInvalidConfigs, setRulesWithInvalidConfigs] = useState(new Set([]));

    return (
        <div className="playground__config-options__sections">
            <div className="playground__config-options__section">
                <ShareURL url={window.location}/>
            </div>
            <div className="playground__config-options__section">
                <h2 data-config-section-title className="title-toggle">Versioning and Config</h2>
                <div data-config-section>
                    <div className="c-field-group">
                        <label className="c-field" htmlFor="eslint-version">
                            <span className="label__text">ESLint Version</span>
                            <span className="label__text">{`v${eslintVersion}`}</span>
                        </label>
                        <label className="c-field" htmlFor="ecma-version">
                            <span className="label__text">ECMA Version</span>
                            <Select
                                isSearchable={false}
                                styles={customStyles}
                                theme={theme => customTheme(theme)}
                                defaultValue={ECMAVersionsOptions.filter(ecmaVersion => options.parserOptions.ecmaVersion === ecmaVersion.value)}
                                options={ECMAVersionsOptions}
                                onChange={selected => {
                                    options.parserOptions.ecmaVersion = selected.value;
                                    onUpdate(Object.assign({}, options));
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
                            defaultValue={sourceTypeOptions.filter(sourceTypeOption => options.parserOptions.sourceType === sourceTypeOption.value) }
                            options={sourceTypeOptions}
                            onChange={selected => {
                                options.parserOptions.sourceType = selected.value;
                                onUpdate(Object.assign({}, options));
                            }}

                        />
                    </label>
                    <div className="combo">
                        <label id="ecma-combo-label" htmlFor="ECMA Feature" className="label__text">ECMA Features</label>
                        <Select
                            isClearable
                            isMulti
                            defaultValue={ECMAFeaturesOptions.filter(ecmaFeatureName => options.parserOptions.ecmaFeatures[ecmaFeatureName.value])}
                            isSearchable={false}
                            styles={customStyles}
                            theme={theme => customTheme(theme)}
                            options={ECMAFeaturesOptions}
                            onChange={selectedOptions => {
                                options.parserOptions.ecmaFeatures = {};
                                selectedOptions.forEach(selected => {
                                    options.parserOptions.ecmaFeatures[selected.value] = true;
                                });
                                onUpdate(Object.assign({}, options));
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="playground__config-options__section">
                <h2 data-config-section-title>Environments</h2>
                <div data-config-section>
                    <Select
                        isMulti
                        styles={customStyles}
                        theme={theme => customTheme(theme)}
                        defaultValue={envNamesOptions.filter(envName => options.env[envName.value])}
                        options={envNamesOptions}
                        onChange={selectedOptions => {
                            options.env = {};
                            selectedOptions.forEach(selected => {
                                options.env[selected.value] = true;
                            });
                            onUpdate(Object.assign({}, options));
                        }}
                    />
                </div>
            </div>
            <div className="playground__config-options__section playground__config-options__section--rules">
                <h2 data-config-section-title>Rules</h2>
                <div data-config-section>
                    <label htmlFor="rules" className="combo-label"><span className="label__text">Choose a rule</span></label>
                    <Select
                        isClearable
                        isSearchable
                        styles={customStyles}
                        theme={theme => customTheme(theme)}
                        ref={ruleInputRef}
                        onChange={selected => {
                            if (!selected) {
                                setSelectedRule(null);
                            } else {
                                setSelectedRule(selected.value);
                            }
                        }}
                        options={ruleNamesOptions}
                    />
                    <button
                        className="c-btn c-btn--ghost add-rule-btn"
                        onClick={() => {
                            if (ruleNames.includes(selectedRule)) {
                                options.rules[selectedRule] = ["error"];
                                onUpdate(Object.assign({}, options));
                                ruleInputRef.current.setValue("");
                            }
                        }}
                    >
                        Add this rule
                    </button>
                    <ul className="config__added-rules" aria-labelledby="added-rules-label">
                        {options.rules && Object.keys(options.rules).sort().map(ruleName => (
                            <RuleItem key={ruleName}>
                                <h4 className="config__added-rules__rule-name">
                                    <a href={rulesMeta[ruleName].docs.url}>
                                        {`${ruleName} ${rulesMeta[ruleName].deprecated ? "(deprecated)" : ""}`}
                                    </a>
                                    <button
                                        aria-label={`Remove ${ruleName}`}
                                        title={`Remove ${ruleName}`}
                                        onClick={() => {
                                            delete options.rules[ruleName];
                                            setRulesWithInvalidConfigs(new Set([...rulesWithInvalidConfigs].filter(rule => rule !== ruleName)));
                                            onUpdate(Object.assign({}, options));
                                        }}
                                    >
                                        <svg width="25" height="25" viewBox="0 0 45 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M28.5 16L16.5 28M16.5 16L28.5 28" stroke="var(--link-color)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                </h4>
                                <input
                                    id={ruleName}
                                    className={rulesWithInvalidConfigs.has(ruleName) || validationError?.message.includes(`"${ruleName}"`) ? "config__added-rules__rule-input-error" : ""}
                                    style={{ width: "100%" }}
                                    defaultValue={JSON.stringify(options.rules[ruleName])}
                                    placeholder={"[\"error\"]"}
                                    onChange={event => {
                                        try {
                                            options.rules[ruleName] = JSON.parse(event.target.value);
                                            setRulesWithInvalidConfigs(new Set([...rulesWithInvalidConfigs].filter(rule => rule !== ruleName)));
                                            onUpdate(Object.assign({}, options));
                                        } catch {
                                            setRulesWithInvalidConfigs(new Set([...rulesWithInvalidConfigs, ruleName]));
                                        }
                                    }}
                                />
                                {rulesWithInvalidConfigs.has(ruleName) && (
                                    <p className="config__added-rules__rule-error">Invalid rule configuration. Please use a valid JSON format.</p>
                                )}
                            </RuleItem>
                        ))}
                    </ul>
                </div>
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
            <a
                href={
                    `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(options, null, 4))}`
                }
                download=".eslintrc.json"
                className="c-btn c-btn--primary playground__config__download-btn"
            >
                Download this config file
            </a>
        </div>
    );
}
