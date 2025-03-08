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
			<div className="alerts-action-bar__content">
				<span>Line No.</span>
				<span>Description</span>
			</div>
			<div className="alerts-action-bar__actions">
				{messages.some(message => message.fix) && (
					<button
						className="alerts-action-bar__btn"
						onClick={onFixAll}
					>
						Fix All
					</button>
				)}
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
			</div>
		</div>
	);
}
