import { createRouter, createWebHistory } from 'vue-router';

import ForecastView from '@/views/forecast-view.vue';
import HistoryView from '@/views/history-view.vue';
import HomeView from '@/views/home-view.vue';
import SettingsView from '@/views/settings-view.vue';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			component: HomeView,
			name: 'home',
			path: '/',
		},
		{
			component: ForecastView,
			name: 'forecast',
			path: '/forecast',
		},
		{
			component: HistoryView,
			name: 'history',
			path: '/history',
		},
		{
			component: SettingsView,
			name: 'settings',
			path: '/settings',
		},
	],
});

export default router;
