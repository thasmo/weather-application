import 'virtual:uno.css';
import '@unocss/reset/tailwind-compat.css';
import { createPinia } from 'pinia';
import store from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import type { Locale, MessageSchema } from '@/locales';
import ApplicationRoot from '@/application-root.vue';
import { messages } from '@/locales';
import router from '@/router';

const pinia = createPinia();
pinia.use(store);

const internationalization = createI18n<[MessageSchema], Locale>({
	fallbackLocale: 'en',
	legacy: false,
	messages,
});

const application = createApp(ApplicationRoot);
application.use(router);
application.use(pinia);
application.use(internationalization);
application.mount('#app');
