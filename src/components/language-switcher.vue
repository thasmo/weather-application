<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type { Locale } from '@/locales';

import SelectDropdown from '@/components/select-dropdown.vue';

const { locale, t } = useI18n();

// Available locales with their translated labels
const localeOptions = computed(() => {
	const availableLocales: Locale[] = ['en', 'de'];
	return availableLocales.map((localeOption) => ({
		label: t(`app.language.${localeOption}`),
		value: localeOption,
	}));
});

// Handle locale change
const updateLocale = (value: string): void => {
	locale.value = value as Locale;
	// Save to localStorage for persistence
	localStorage.setItem('userLocale', value);
};
</script>

<template>
	<div class="language-switcher">
		<SelectDropdown
			:model-value="locale"
			:options="localeOptions"
			aria-label="Select language"
			@update:model-value="updateLocale" />
	</div>
</template>
