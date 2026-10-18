export const customStyles = {
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

export const customTheme = theme => ({
	...theme,
	colors: {
		...theme.colors,
		primary25: "var(--color-primary-500)",
		primary: "var(--color-primary-700)",
	},
});