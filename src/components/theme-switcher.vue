<script setup lang="ts">
import { useColorMode } from '@vueuse/core';
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import SelectDropdown from '@/components/select-dropdown.vue';
import { useSettingsStore } from '@/stores/settings-store';

const { t } = useI18n();
const settingsStore = useSettingsStore();

const colorMode = useColorMode({
	attribute: 'class',
	disableTransition: false,
	emitAuto: true,
	modes: {
		auto: 'auto',
		dark: 'dark',
		light: '',
	},
	onChanged: (mode, defaultHandler) => {
		defaultHandler(mode);

		const htmlElement = document.documentElement;
		const displayValue = htmlElement.style.display;
		htmlElement.style.display = 'none';
		void htmlElement.offsetHeight;
		htmlElement.style.display = displayValue;
	},
	selector: 'html',
	storageKey: 'themeMode',
});

const currentTheme = computed({
	get() {
		return settingsStore.theme === 'system' ? 'auto' : settingsStore.theme;
	},
	set(value: string) {
		settingsStore.updateTheme(value === 'auto' ? 'system' : (value as 'dark' | 'light'));
	},
});

watch(
	currentTheme,
	(newValue) => {
		colorMode.value = newValue;
	},
	{ immediate: true },
);

const themeOptions = computed(() => {
	return [
		{ label: t('app.theme.auto'), value: 'auto' },
		{ label: t('app.theme.light'), value: 'light' },
		{ label: t('app.theme.dark'), value: 'dark' },
	];
});

const updateTheme = (value: string): void => {
	currentTheme.value = value;
};
</script>

<template>
	<div class="theme-switcher">
		<SelectDropdown
			:model-value="currentTheme"
			:options="themeOptions"
			aria-label="Select theme"
			@update:model-value="updateTheme" />
	</div>
</template>
