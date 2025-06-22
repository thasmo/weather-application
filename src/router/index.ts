import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '../views/home-view.vue';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			component: HomeView,
			name: 'home',
			path: '/',
		},
	],
});

export default router;
