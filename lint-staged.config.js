export default {
	'**/*.{js,ts,vue}': ['eslint'],
	'**/*.{md,json,yml,yaml,css}': ['prettier --check', 'cspell --no-progress --no-must-find-files'],
};
