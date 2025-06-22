<script setup lang="ts">
import { useColorMode } from '@vueuse/core';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import SelectDropdown from '@/components/select-dropdown.vue';

type ThemeMode = 'auto' | 'dark' | 'light';

const { t } = useI18n();

// Use VueUse's useColorMode directly with configuration
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
		// Call the default handler first
		defaultHandler(mode);

		// Force a repaint to ensure styles are applied
		const htmlElement = document.documentElement;
		const displayValue = htmlElement.style.display;
		htmlElement.style.display = 'none';
		void htmlElement.offsetHeight; // Trigger a reflow
		htmlElement.style.display = displayValue;
	},
	selector: 'html',
	storageKey: 'themeMode',
});

// Convert colorMode value to our ThemeMode type
const currentTheme = computed<ThemeMode>(() => {
	// Handle the empty string case for light mode
	return colorMode.value === '' ? 'light' : (colorMode.value as ThemeMode);
});

// Available themes with their translated labels
const themeOptions = computed(() => {
	const availableThemes: ThemeMode[] = ['auto', 'light', 'dark'];
	return availableThemes.map((theme) => ({
		label: t(`app.theme.${theme}`),
		value: theme,
	}));
});

// Handle theme change
const updateTheme = (value: string): void => {
	colorMode.value = value as ThemeMode;
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
