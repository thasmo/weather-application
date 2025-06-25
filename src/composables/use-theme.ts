import { useColorMode } from '@vueuse/core';
import { computed, watch } from 'vue';

import { useSettingsStore } from '@/stores/settings-store';

type ColorMode = 'auto' | 'dark' | 'light';

interface ThemeService {
	readonly currentTheme: string;
	readonly updateTheme: (value: 'dark' | 'light' | 'system') => void;
}

export const useThemeService = (): ThemeService => {
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
		set(value: ColorMode) {
			settingsStore.updateTheme(value === 'auto' ? 'system' : value);
		},
	});

	watch(
		currentTheme,
		(newValue) => {
			colorMode.value = newValue;
		},
		{ immediate: true },
	);

	const updateTheme = (value: 'dark' | 'light' | 'system'): void => {
		settingsStore.updateTheme(value);
	};

	return {
		currentTheme,
		updateTheme,
	};
};
