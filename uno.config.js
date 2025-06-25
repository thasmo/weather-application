import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders';
import { createLocalFontProcessor } from '@unocss/preset-web-fonts/local';
import { readdirSync } from 'node:fs';
import { defineConfig, presetIcons, presetWebFonts, presetWind4, transformerVariantGroup } from 'unocss';

const iconFiles = readdirSync('./src/assets/icons/').map((file) => {
	const name = file.replace('.svg', '');
	return `i-custom-${name}`;
});

export default defineConfig({
	presets: [
		presetWind4({
			dark: 'class',
		}),
		presetWebFonts({
			fonts: {
				sans: {
					name: 'Satoshi',
				},
				serif: {
					name: 'Sentient',
				},
			},
			processors: createLocalFontProcessor({
				cacheDir: 'node_modules/.cache/unocss/fonts/',
				fontAssetsDir: 'public/assets/fonts/',
				fontServeBaseUrl: '/assets/fonts/',
			}),
			provider: 'fontshare',
		}),
		presetIcons({
			cdn: 'https://esm.sh/',
			collections: {
				custom: FileSystemIconLoader('./src/assets/icons/'),
			},
			scale: 1.2,
		}),
	],
	rules: [
		['text-rendering-optimizeLegibility', { 'text-rendering': 'optimizeLegibility' }],
		[
			'antialiased',
			{
				'-moz-osx-font-smoothing': 'grayscale',
				'-webkit-font-smoothing': 'antialiased',
			},
		],
		// Custom line heights
		['leading-comfortable', { 'line-height': '1.6' }],
		['leading-tight', { 'line-height': '1.25' }],
		// Custom shadows
		['shadow-card', { 'box-shadow': '0 4px 12px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)' }],
		['shadow-card-hover', { 'box-shadow': '0 8px 16px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.12)' }],
		['shadow-card-dark', { 'box-shadow': '0 4px 12px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.4)' }],
		// Hide scrollbar but keep functionality
		[
			'hide-scrollbar',
			{
				'&::-webkit-scrollbar': 'display: none',
				'-ms-overflow-style': 'none',
				'scrollbar-width': 'none',
			},
		],
	],
	safelist: [...iconFiles],
	theme: {
		breakpoints: {
			lg: '1024px',
			md: '768px',
			sm: '640px',
			xl: '1280px',
		},
		colors: {
			gray: {
				50: '#f8fafc',
				100: '#f1f5f9',
				200: '#e2e8f0',
				300: '#cbd5e1',
				400: '#94a3b8',
				500: '#64748b',
				600: '#475569',
				700: '#334155',
				800: '#1e293b',
				900: '#0f172a',
				950: '#020617',
			},
			primary: {
				50: '#eef7ff',
				100: '#d9edff',
				200: '#bce0ff',
				300: '#8ecdff',
				400: '#59b0ff',
				500: '#3498ff',
				600: '#1a7ff7',
				700: '#1366e8',
				800: '#1554bc',
				900: '#174893',
				950: '#112d5e',
			},
		},
	},
	transformers: [transformerVariantGroup()],
});
