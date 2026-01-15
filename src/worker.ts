export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		// Redirect /index.html to / for SEO and consistency.
		if (url.pathname === '/index.html') {
			return Response.redirect(`${url.origin}/`, 301);
		}

		let response = await env.ASSETS.fetch(request);

		if (
			response.status === 404
			&& request.method === 'GET'
			&& request.headers.get('Accept')?.includes('text/html')
		) {
			const indexRequest = new Request(new URL('/index.html', url.origin), {
				headers: request.headers,
			});
			response = await env.ASSETS.fetch(indexRequest);
		}

		const newHeaders = new Headers(response.headers);
		newHeaders.set('Referrer-Policy', 'no-referrer');
		newHeaders.set('Permissions-Policy', '');
		newHeaders.set('X-Frame-Options', 'DENY');
		newHeaders.set('X-Content-Type-Options', 'nosniff');

		return new Response(response.body, {
			headers: newHeaders,
			status: response.status,
			statusText: response.statusText,
		});
	},
};
