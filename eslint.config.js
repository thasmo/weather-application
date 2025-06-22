import config from '@somehow-digital/eslint-config/basic';
import unocss from '@unocss/eslint-config/flat';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import vue from 'eslint-plugin-vue';
import { globalIgnores } from 'eslint/config';
import globals from 'globals';

export default defineConfigWithVueTs(
	config,
	{
		files: ['**/*.{ts,mts,tsx,js,jsx,vue}'],
		name: 'app/files-to-lint',
	},
	globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),
	vue.configs['flat/essential'],
	vueTsConfigs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	unocss,
);
