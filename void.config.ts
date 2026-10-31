import { defineConfig } from 'void/config';

export default defineConfig({
	cloudflare: {
		compatibility_date: '2026-06-18',
		compatibility_flags: [
			'nodejs_compat',
			'global_fetch_strictly_public',
			'nodejs_als',
		],
		keep_vars: true,
		name: 'thasmo-weather-application',
		observability: {
			enabled: true,
			head_sampling_rate: 1,
		},
		preview_urls: true,
		routes: [
			{
				pattern: 'weather.thasmo.dev',
				custom_domain: true,
			},
		],
		send_metrics: false,
		workers_dev: false,
	},
	inference: {
		appType: 'spa',
		outputDir: 'dist/client',
	},
	routing: {
		headers: {
			'/*': [
				'Referrer-Policy: no-referrer',
				'Permissions-Policy: ',
				'X-Frame-Options: DENY',
				'X-Content-Type-Options: nosniff',
			],
		},
		redirects: {
			'/index.html': {
				status: 301,
				to: '/',
			},
		},
	},
});
