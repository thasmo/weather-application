import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			component: () => import('@/views/home-view.vue'),
			name: 'home',
			path: '/',
		},
		{
			component: () => import('@/views/forecast-view.vue'),
			name: 'forecast',
			path: '/forecast',
		},
		{
			component: () => import('@/views/history-view.vue'),
			name: 'history',
			path: '/history',
		},
		{
			component: () => import('@/views/settings-view.vue'),
			name: 'settings',
			path: '/settings',
		},
	],
});

export default router;
