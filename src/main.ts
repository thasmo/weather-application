import 'virtual:uno.css';
import '@unocss/reset/tailwind-compat.css';

import '@/assets/styles.css';

import { createPinia } from 'pinia';
import store from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';

import ApplicationRoot from '@/application-root.vue';
import { type Locale, messages, type MessageSchema } from '@/locales';
import router from '@/router';

const pinia = createPinia();
pinia.use(store);

const i18n = createI18n<[MessageSchema], Locale>({
	fallbackLocale: 'en',
	legacy: false,
	messages,
});

const application = createApp(ApplicationRoot);
application.use(router);
application.use(pinia);
application.use(i18n);
application.mount('#app');
