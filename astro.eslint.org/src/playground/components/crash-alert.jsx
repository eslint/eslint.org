import Alert from "./alert";

export default function CrashAlert({ error }) {
	const AlertMessage = (
		<>
			<p>
				ESLint Crashed!
				<br />
				Please submit a bug report at{" "}
				<a
					href="https://github.com/eslint/eslint/issues"
					target="_blank"
					rel="noreferrer"
				>
					https://github.com/eslint/eslint/issues
				</a>
			</p>
			<p>Error: {error.message}</p>
		</>
	);

	return <Alert type="error" text={AlertMessage} />;
}
