<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import LanguageSwitcher from '@/components/language-switcher.vue';
import SelectDropdown from '@/components/select-dropdown.vue';
import SettingsDrawer from '@/components/settings-drawer.vue';
import SettingsPopover from '@/components/settings-popover.vue';
import ThemeSwitcher from '@/components/theme-switcher.vue';

interface SettingsMenuProperties {
	/**
	 * The air pressure unit value
	 */
	readonly airPressureUnit: 'hpa' | 'inHg';
	/**
	 * The precipitation unit value
	 */
	readonly precipitationUnit: 'inches' | 'mm';
	/**
	 * The temperature unit value
	 */
	readonly temperatureUnit: 'celsius' | 'fahrenheit';
	/**
	 * The time format value
	 */
	readonly timeFormat: 'twelveHour' | 'twentyFourHour';
	/**
	 * The wind speed unit value
	 */
	readonly windSpeedUnit: 'kmh' | 'mph' | 'ms';
}

const properties = defineProps<SettingsMenuProperties>();

const emit = defineEmits<{
	/**
	 * Emitted when the air pressure unit changes
	 */
	(event: 'updateAirPressureUnit', value: 'hpa' | 'inHg'): void;
	/**
	 * Emitted when the precipitation unit changes
	 */
	(event: 'updatePrecipitationUnit', value: 'inches' | 'mm'): void;
	/**
	 * Emitted when the temperature unit changes
	 */
	(event: 'updateTemperatureUnit', value: 'celsius' | 'fahrenheit'): void;
	/**
	 * Emitted when the time format changes
	 */
	(event: 'updateTimeFormat', value: 'twelveHour' | 'twentyFourHour'): void;
	/**
	 * Emitted when the wind speed unit changes
	 */
	(event: 'updateWindSpeedUnit', value: 'kmh' | 'mph' | 'ms'): void;
}>();

const { t } = useI18n();
const isOpen = ref(false);
const isMobile = useMediaQuery('(max-width: 767px)');
const isSelectInteracting = ref(false);

const handleAirPressureUnitChange = (value: string): void => {
	emit('updateAirPressureUnit', value as 'hpa' | 'inHg');
};

const handlePrecipitationUnitChange = (value: string): void => {
	emit('updatePrecipitationUnit', value as 'inches' | 'mm');
};

const handleTemperatureUnitChange = (value: string): void => {
	emit('updateTemperatureUnit', value as 'celsius' | 'fahrenheit');
};

const handleTimeFormatChange = (value: string): void => {
	emit('updateTimeFormat', value as 'twelveHour' | 'twentyFourHour');
};

const handleWindSpeedUnitChange = (value: string): void => {
	emit('updateWindSpeedUnit', value as 'kmh' | 'mph' | 'ms');
};

const toggleSettings = (): void => {
	isOpen.value = !isOpen.value;
};

const closeSettings = (): void => {
	isOpen.value = false;
};
</script>

<template>
	<div>
		<!-- Mobile: Drawer from bottom -->
		<SettingsDrawer
			v-if="isMobile"
			:is-open="isOpen"
			position="bottom"
			size="medium"
			:disable-close="isSelectInteracting"
			@close="closeSettings">
			<template #header>
				<div class="flex items-center justify-between">
					<h2 class="text-xl font-bold">{{ t('app.settings.title') }}</h2>
					<button
						class="p-1 rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
						@click="closeSettings">
						<div class="i-ri-close-line h-5 w-5"></div>
					</button>
				</div>
			</template>

			<div class="py-4">
				<div class="flex flex-col gap-4 min-w-60">
					<div>
						<h3 class="text-base text-gray-700 font-medium mb-2 dark:text-gray-300">
							{{ t('app.settings.title') }}
						</h3>
					</div>

					<div class="space-y-4">
						<div class="flex flex-col gap-1">
							<label class="text-sm text-gray-600 dark:text-gray-400">
								{{ t('app.timeFormat.title') }}
							</label>
							<SelectDropdown
								:aria-label="t('app.timeFormat.title')"
								:model-value="properties.timeFormat"
								:options="[
									{ value: 'twentyFourHour', label: t('app.timeFormat.twentyFourHour') },
									{ value: 'twelveHour', label: t('app.timeFormat.twelveHour') },
								]"
								@update:model-value="handleTimeFormatChange" />
						</div>

						<div class="flex flex-col gap-1">
							<label class="text-sm text-gray-600 dark:text-gray-400">
								{{ t('app.temperature.title') }}
							</label>
							<SelectDropdown
								:aria-label="t('app.temperature.title')"
								:model-value="properties.temperatureUnit"
								:options="[
									{ value: 'celsius', label: t('app.temperature.celsius').split(' ')[0] },
									{ value: 'fahrenheit', label: t('app.temperature.fahrenheit').split(' ')[0] },
								]"
								@update:model-value="handleTemperatureUnitChange" />
						</div>

						<div class="flex flex-col gap-1">
							<label class="text-sm text-gray-600 dark:text-gray-400">
								{{ t('app.windSpeed.title') }}
							</label>
							<SelectDropdown
								:aria-label="t('app.windSpeed.title')"
								:model-value="properties.windSpeedUnit"
								:options="[
									{ value: 'kmh', label: t('app.windSpeed.kmh').split(' ')[0] },
									{ value: 'mph', label: t('app.windSpeed.mph').split(' ')[0] },
									{ value: 'ms', label: t('app.windSpeed.ms').split(' ')[0] },
								]"
								@update:model-value="handleWindSpeedUnitChange" />
						</div>

						<div class="flex flex-col gap-1">
							<label class="text-sm text-gray-600 dark:text-gray-400">
								{{ t('app.precipitation.title') }}
							</label>
							<SelectDropdown
								:aria-label="t('app.precipitation.title')"
								:model-value="properties.precipitationUnit"
								:options="[
									{ value: 'mm', label: t('app.precipitation.mm').split(' ')[0] },
									{ value: 'inches', label: t('app.precipitation.inches').split(' ')[0] },
								]"
								@update:model-value="handlePrecipitationUnitChange" />
						</div>

						<div class="flex flex-col gap-1">
							<label class="text-sm text-gray-600 dark:text-gray-400">
								{{ t('app.airPressure.title') }}
							</label>
							<SelectDropdown
								:aria-label="t('app.airPressure.title')"
								:model-value="properties.airPressureUnit"
								:options="[
									{ value: 'hpa', label: t('app.airPressure.hpa').split(' ')[0] },
									{ value: 'inHg', label: t('app.airPressure.inHg').split(' ')[0] },
								]"
								@update:model-value="handleAirPressureUnitChange" />
						</div>

						<div class="flex flex-col gap-1">
							<label class="text-sm text-gray-600 dark:text-gray-400">
								{{ t('app.theme.title') }}
							</label>
							<ThemeSwitcher />
						</div>

						<div class="flex flex-col gap-1">
							<label class="text-sm text-gray-600 dark:text-gray-400">
								{{ t('app.language.title') }}
							</label>
							<LanguageSwitcher />
						</div>
					</div>
				</div>
			</div>
		</SettingsDrawer>

		<!-- Mobile: Settings button -->
		<button
			v-if="isMobile"
			@click="toggleSettings"
			class="text-sm text-gray-700 font-medium px-3.5 py-2 border border-gray-300 rounded-lg bg-white flex transition-all items-center dark:text-gray-200 focus:outline-none dark:border-gray-600 focus:border-primary-500 hover:border-primary-400 dark:bg-gray-800 focus:ring-3 focus:ring-primary-500/20 dark:hover:border-primary-500"
			:aria-label="t('app.settings.button')">
			<div class="i-ri-settings-3-line mr-2 h-5 w-5"></div>
			<span>{{ t('app.settings.button') }}</span>
		</button>

		<!-- Desktop: Popover -->
		<SettingsPopover
			v-if="!isMobile"
			:is-open="isOpen"
			placement="bottom-start"
			:offset="4"
			:show-arrow="true"
			@open-change="(details) => (isOpen = details.open)">
			<template #trigger>
				<!-- Desktop: Settings button inside popover trigger -->
				<button
					class="text-sm text-gray-700 font-medium px-3.5 py-2 border border-gray-300 rounded-lg bg-white flex transition-all items-center dark:text-gray-200 focus:outline-none dark:border-gray-600 focus:border-primary-500 hover:border-primary-400 dark:bg-gray-800 focus:ring-3 focus:ring-primary-500/20 dark:hover:border-primary-500"
					:aria-label="t('app.settings.button')">
					<div class="i-ri-settings-3-line mr-2 h-5 w-5"></div>
					<span>{{ t('app.settings.button') }}</span>
				</button>
			</template>

			<template #title>
				{{ t('app.settings.title') }}
			</template>

			<div class="flex flex-col gap-4 min-w-60">
				<div class="space-y-4">
					<div class="flex flex-col gap-1">
						<label class="text-sm text-gray-600 dark:text-gray-400">
							{{ t('app.timeFormat.title') }}
						</label>
						<SelectDropdown
							:aria-label="t('app.timeFormat.title')"
							:model-value="properties.timeFormat"
							:options="[
								{ value: 'twentyFourHour', label: t('app.timeFormat.twentyFourHour') },
								{ value: 'twelveHour', label: t('app.timeFormat.twelveHour') },
							]"
							@update:model-value="handleTimeFormatChange" />
					</div>

					<div class="flex flex-col gap-1">
						<label class="text-sm text-gray-600 dark:text-gray-400">
							{{ t('app.temperature.title') }}
						</label>
						<SelectDropdown
							:aria-label="t('app.temperature.title')"
							:model-value="properties.temperatureUnit"
							:options="[
								{ value: 'celsius', label: t('app.temperature.celsius').split(' ')[0] },
								{ value: 'fahrenheit', label: t('app.temperature.fahrenheit').split(' ')[0] },
							]"
							@update:model-value="handleTemperatureUnitChange" />
					</div>

					<div class="flex flex-col gap-1">
						<label class="text-sm text-gray-600 dark:text-gray-400">
							{{ t('app.windSpeed.title') }}
						</label>
						<SelectDropdown
							:aria-label="t('app.windSpeed.title')"
							:model-value="properties.windSpeedUnit"
							:options="[
								{ value: 'kmh', label: t('app.windSpeed.kmh').split(' ')[0] },
								{ value: 'mph', label: t('app.windSpeed.mph').split(' ')[0] },
								{ value: 'ms', label: t('app.windSpeed.ms').split(' ')[0] },
							]"
							@update:model-value="handleWindSpeedUnitChange" />
					</div>

					<div class="flex flex-col gap-1">
						<label class="text-sm text-gray-600 dark:text-gray-400">
							{{ t('app.precipitation.title') }}
						</label>
						<SelectDropdown
							:aria-label="t('app.precipitation.title')"
							:model-value="properties.precipitationUnit"
							:options="[
								{ value: 'mm', label: t('app.precipitation.mm').split(' ')[0] },
								{ value: 'inches', label: t('app.precipitation.inches').split(' ')[0] },
							]"
							@update:model-value="handlePrecipitationUnitChange" />
					</div>

					<div class="flex flex-col gap-1">
						<label class="text-sm text-gray-600 dark:text-gray-400">
							{{ t('app.airPressure.title') }}
						</label>
						<SelectDropdown
							:aria-label="t('app.airPressure.title')"
							:model-value="properties.airPressureUnit"
							:options="[
								{ value: 'hpa', label: t('app.airPressure.hpa').split(' ')[0] },
								{ value: 'inHg', label: t('app.airPressure.inHg').split(' ')[0] },
							]"
							@update:model-value="handleAirPressureUnitChange" />
					</div>

					<div class="flex flex-col gap-1">
						<label class="text-sm text-gray-600 dark:text-gray-400">
							{{ t('app.theme.title') }}
						</label>
						<ThemeSwitcher />
					</div>

					<div class="flex flex-col gap-1">
						<label class="text-sm text-gray-600 dark:text-gray-400">
							{{ t('app.language.title') }}
						</label>
						<LanguageSwitcher />
					</div>
				</div>
			</div>
		</SettingsPopover>
	</div>
</template>
