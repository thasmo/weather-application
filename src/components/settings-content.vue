<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import LanguageSwitcher from '@/components/language-switcher.vue';
import SelectDropdown from '@/components/select-dropdown.vue';
import ThemeSwitcher from '@/components/theme-switcher.vue';
import ToggleSwitch from '@/components/toggle-switch.vue';
import { useSettingsStore } from '@/stores/settings-store';

const settingsStore = useSettingsStore();
const { t } = useI18n();

const handleAirPressureUnitChange = (value: string): void => {
	settingsStore.updateAirPressureUnit(value as 'hpa' | 'inHg');
};

const handlePrecipitationUnitChange = (value: string): void => {
	settingsStore.updatePrecipitationUnit(value as 'inches' | 'mm');
};

const handleTemperatureUnitChange = (value: string): void => {
	settingsStore.updateTemperatureUnit(value as 'celsius' | 'fahrenheit');
};

const handleTimeFormatChange = (value: string): void => {
	settingsStore.updateTimeFormat(value as 'twelveHour' | 'twentyFourHour');
};

const handleWindSpeedUnitChange = (value: string): void => {
	settingsStore.updateWindSpeedUnit(value as 'kmh' | 'mph' | 'ms');
};

const handleAdvancedViewChange = (value: boolean): void => {
	settingsStore.updateAdvancedView(value);
};
</script>

<template>
	<div class="flex flex-col gap-4 min-w-60">
		<div class="space-y-4">
			<div class="flex flex-col gap-1">
				<label class="text-sm text-gray-600 dark:(text-gray-400)">
					{{ t('app.timeFormat.title') }}
				</label>
				<SelectDropdown
					:aria-label="t('app.timeFormat.title')"
					:model-value="settingsStore.timeFormat"
					:options="[
						{ value: 'twentyFourHour', label: t('app.timeFormat.twentyFourHour') },
						{ value: 'twelveHour', label: t('app.timeFormat.twelveHour') },
					]"
					@update:model-value="handleTimeFormatChange" />
			</div>

			<div class="flex flex-col gap-1">
				<label class="text-sm text-gray-600 dark:(text-gray-400)">
					{{ t('app.temperature.title') }}
				</label>
				<SelectDropdown
					:aria-label="t('app.temperature.title')"
					:model-value="settingsStore.temperatureUnit"
					:options="[
						{ value: 'celsius', label: t('app.temperature.celsius').split(' ')[0] },
						{ value: 'fahrenheit', label: t('app.temperature.fahrenheit').split(' ')[0] },
					]"
					@update:model-value="handleTemperatureUnitChange" />
			</div>

			<div class="flex flex-col gap-1">
				<label class="text-sm text-gray-600 dark:(text-gray-400)">
					{{ t('weather.forecast.viewMode') }}
				</label>
				<ToggleSwitch
					:model-value="settingsStore.advancedView"
					:label="settingsStore.advancedView ? t('weather.forecast.advancedView') : t('weather.forecast.simpleView')"
					:aria-label="t('weather.forecast.toggleView')"
					@update:model-value="handleAdvancedViewChange" />
			</div>

			<div class="flex flex-col gap-1">
				<label class="text-sm text-gray-600 dark:(text-gray-400)">
					{{ t('app.windSpeed.title') }}
				</label>
				<SelectDropdown
					:aria-label="t('app.windSpeed.title')"
					:model-value="settingsStore.windSpeedUnit"
					:options="[
						{ value: 'kmh', label: t('app.windSpeed.kmh').split(' ')[0] },
						{ value: 'mph', label: t('app.windSpeed.mph').split(' ')[0] },
						{ value: 'ms', label: t('app.windSpeed.ms').split(' ')[0] },
					]"
					@update:model-value="handleWindSpeedUnitChange" />
			</div>

			<div class="flex flex-col gap-1">
				<label class="text-sm text-gray-600 dark:(text-gray-400)">
					{{ t('app.precipitation.title') }}
				</label>
				<SelectDropdown
					:aria-label="t('app.precipitation.title')"
					:model-value="settingsStore.precipitationUnit"
					:options="[
						{ value: 'mm', label: t('app.precipitation.mm').split(' ')[0] },
						{ value: 'inches', label: t('app.precipitation.inches').split(' ')[0] },
					]"
					@update:model-value="handlePrecipitationUnitChange" />
			</div>

			<div class="flex flex-col gap-1">
				<label class="text-sm text-gray-600 dark:(text-gray-400)">
					{{ t('app.airPressure.title') }}
				</label>
				<SelectDropdown
					:aria-label="t('app.airPressure.title')"
					:model-value="settingsStore.airPressureUnit"
					:options="[
						{ value: 'hpa', label: t('app.airPressure.hpa').split(' ')[0] },
						{ value: 'inHg', label: t('app.airPressure.inHg').split(' ')[0] },
					]"
					@update:model-value="handleAirPressureUnitChange" />
			</div>

			<div class="flex flex-col gap-1">
				<label class="text-sm text-gray-600 dark:(text-gray-400)">
					{{ t('app.theme.title') }}
				</label>
				<ThemeSwitcher />
			</div>

			<div class="flex flex-col gap-1">
				<label class="text-sm text-gray-600 dark:(text-gray-400)">
					{{ t('app.language.title') }}
				</label>
				<LanguageSwitcher />
			</div>
		</div>
	</div>
</template>
