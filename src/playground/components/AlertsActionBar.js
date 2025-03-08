import React from "react";

export default function AlertsActionBar({
	messages,
	onFixAll,
	options,
	onUpdate,
	rulesWithInvalidConfigs,
	setRulesWithInvalidConfigs,
}) {
	return (
		<div className="alerts-action-bar">
			<span className="alerts-action-bar__description">
				Resolve all fixable issues or disable their respective rules
				from config
			</span>
			<div className="alerts-action-bar__actions">
				{messages.some(message => message.fix) && (
					<button
						className="alerts-action-bar__btn"
						onClick={onFixAll}
					>
						Fix All
					</button>
				)}
				{messages.some(message => options.rules[message.ruleId]) && (
					<button
						className="alerts-action-bar__btn"
						onClick={() => {
							messages.forEach(message => {
								delete options.rules[message.ruleId];
								setRulesWithInvalidConfigs(
									new Set(
										[...rulesWithInvalidConfigs].filter(
											rule => rule !== message.ruleId,
										),
									),
								);
							});
							onUpdate(Object.assign({}, options));
						}}
					>
						Disable All
					</button>
				)}
			</div>
		</div>
	);
}
