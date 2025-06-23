import 'virtual:uno.css';
import '@unocss/reset/tailwind-compat.css';

import '@/assets/styles.css';

import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';

import ApplicationRoot from '@/application-root.vue';
import { type Locale, messages, type MessageSchema } from '@/locales';
import router from '@/router';

// Detect browser language
const getSavedLocale = (): Locale | null => {
	const savedLocale = localStorage.getItem('userLocale');
	return savedLocale && savedLocale in messages ? (savedLocale as Locale) : undefined;
};

const getBrowserLocale = (): Locale => {
	const navigatorLocale = navigator.languages === undefined ? navigator.language : navigator.languages[0];

	if (!navigatorLocale) {
		return 'en';
	}

	// Handle both 'en-US' and 'en' formats
	const trimmedLocale = navigatorLocale.trim().split(/-|_/)[0];

	// Check if the locale is supported
	return trimmedLocale && trimmedLocale in messages ? (trimmedLocale as Locale) : 'en';
};

// Create i18n instance
const i18n = createI18n<[MessageSchema], Locale>({
	fallbackLocale: 'en',
	legacy: false, // Use Composition API
	locale: getSavedLocale() || getBrowserLocale(),
	messages,
});

const application = createApp(ApplicationRoot);
application.use(router);
application.use(i18n);
application.mount('#app');
