export default function AlertsActionBar({
	messages,
	onFixAll,
	options,
	onUpdate,
	setRulesWithInvalidConfigs,
}) {
	const hasFixableMessages = messages.some(message => message.fix);
	const hasDisableableMessages = messages.some(
		message => !message.suggestions && options.rules[message.ruleId],
	);

	let description = "";

	if (hasFixableMessages && hasDisableableMessages) {
		description =
			"Resolve all fixable issues or disable their respective rules from config";
	} else if (hasFixableMessages) {
		description = "Resolve all fixable issues";
	} else if (hasDisableableMessages) {
		description =
			"Disable all rules associated with these issues from config";
	}

	const handleDisableAll = () => {
		const updatedOptions = { ...options };

		messages.forEach(message => {
			if (!message.suggestions) {
				delete updatedOptions.rules[message.ruleId];
				setRulesWithInvalidConfigs(prev => {
					const updatedSet = new Set(prev);
					updatedSet.delete(message.ruleId);
					return updatedSet;
				});
			}
		});
		onUpdate(updatedOptions);
	};

	return (
		<div className="alerts-action-bar">
			<span className="alerts-action-bar__description">
				{description}
			</span>
			<div className="alerts-action-bar__actions">
				{hasFixableMessages && (
					<button
						className="alerts-action-bar__btn"
						onClick={onFixAll}
					>
						Fix All
					</button>
				)}
				{hasDisableableMessages && (
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
