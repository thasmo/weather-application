import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders';
import { createLocalFontProcessor } from '@unocss/preset-web-fonts/local';
import { readdirSync } from 'node:fs';
import { defineConfig, presetIcons, presetWebFonts, presetWind4, transformerVariantGroup } from 'unocss';

const icons = readdirSync('./src/assets/icons/').map((file) => {
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
	rules: [],
	safelist: [
		...icons,
		'font-sans',
		'bg-bg-light',
		'text-text-light',
		'dark:bg-bg-dark',
		'dark:text-text-dark',
		'min-h-screen',
	],
	theme: {
		breakpoints: {
			lg: '1024px',
			md: '768px',
			sm: '640px',
			xl: '1280px',
		},
		colors: {
			bg: {
				dark: '#111827',
				light: '#f0f9ff',
			},
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
			text: {
				dark: '#f3f4f6',
				light: '#1f2937',
			},
		},
	},
	transformers: [transformerVariantGroup()],
});
