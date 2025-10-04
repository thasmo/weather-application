<script setup lang="ts">
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Locale } from '@/locales';
import SelectDropdown from '@/components/select-dropdown.vue';
import { useSettingsStore } from '@/stores/settings-store';

const { locale, t } = useI18n();
const settingsStore = useSettingsStore();

watch(
	() => settingsStore.locale,
	(newLocale) => {
		if (newLocale && newLocale !== locale.value) {
			locale.value = newLocale as Locale;
		}
	},
	{ immediate: true },
);

watch(
	locale,
	(newLocale) => {
		if (newLocale !== settingsStore.locale) {
			settingsStore.updateLocale(newLocale);
		}
	},
	{ immediate: true },
);

const localeOptions = computed(() => {
	const availableLocales: Locale[] = ['en', 'de'];
	return availableLocales.map(localeOption => ({
		label: t(`app.language.${localeOption}`),
		value: localeOption,
	}));
});

function updateLocale(value: string): void {
	settingsStore.updateLocale(value);
	locale.value = value as Locale;
}
</script>

<template>
	<div class="language-switcher">
		<SelectDropdown
			:model-value="locale"
			:options="localeOptions"
			aria-label="Select language"
			@update:model-value="updateLocale"
		/>
	</div>
</template>
