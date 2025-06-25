<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import SelectDropdown from '@/components/select-dropdown.vue';
import { useThemeService } from '@/composables/use-theme';

const { t } = useI18n();
const { currentTheme, updateTheme } = useThemeService();

const themeOptions = computed(() => {
	return [
		{ label: t('app.theme.auto'), value: 'auto' },
		{ label: t('app.theme.light'), value: 'light' },
		{ label: t('app.theme.dark'), value: 'dark' },
	];
});
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
