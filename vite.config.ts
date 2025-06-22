import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import unocss from 'unocss/vite';
import { defineConfig } from 'vite';
import tools from 'vite-plugin-vue-devtools';

export default defineConfig({
	plugins: [vue(), tools(), unocss()],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('src', import.meta.url)),
		},
	},
});
