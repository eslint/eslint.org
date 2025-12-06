export default function Popup({ message, ruleName, onFix }) {
	return (
		<div className="popup">
			<div className="popup__content">
				<div className="popup__main">
					<p className="popup__text">{message}</p>
					<div className="popup__refs">
						<a
							href={`https://eslint.org/docs/rules/${ruleName}`}
							target="_blank"
							rel="noreferrer"
						>
							{ruleName}
						</a>
					</div>
				</div>

				{onFix && (
					<button onClick={onFix} className="popup__fix-btn">
						<span>Fix</span>
					</button>
				)}
			</div>
		</div>
	);
}
