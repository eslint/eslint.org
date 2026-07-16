export default function AlertsActionBar({
	messages,
	onFixAll,
	options,
	onUpdate,
	setRulesWithInvalidConfigs,
	hasMultipleFixMessages,
	hasMultipleDisableMessages,
}) {
	let description = "";

	if (hasMultipleFixMessages && hasMultipleDisableMessages) {
		description =
			"Resolve all fixable issues or disable their respective rules from config";
	} else if (hasMultipleFixMessages) {
		description = "Resolve all fixable issues";
	} else if (hasMultipleDisableMessages) {
		description =
			"Disable all rules associated with these issues from config";
	}

	const handleDisableAll = () => {
		const updatedOptions = { ...options, rules: { ...options.rules } };

		messages.forEach(message => {
			delete updatedOptions.rules[message.ruleId];
			setRulesWithInvalidConfigs(prev => {
				const updatedSet = new Set(prev);
				updatedSet.delete(message.ruleId);
				return updatedSet;
			});
		});
		onUpdate(updatedOptions);
	};

	return (
		<div className="alerts-action-bar">
			<span className="alerts-action-bar__description">
				{description}
			</span>
			<div className="alerts-action-bar__actions">
				{hasMultipleFixMessages && (
					<button
						className="alerts-action-bar__btn"
						onClick={onFixAll}
					>
						Fix All
					</button>
				)}
				{hasMultipleDisableMessages && (
					<button
						className="alerts-action-bar__btn"
						onClick={handleDisableAll}
					>
						Disable All
					</button>
				)}
			</div>
		</div>
	);
}
