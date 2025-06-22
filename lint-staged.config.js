export default {
	'**/*.{js,jsx,ts,tsx}': ['eslint'],
	'**/*.{md,json,yml,yaml,css}': ['prettier --check', 'cspell --no-progress --no-must-find-files'],
};
