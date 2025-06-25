<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type {
	CurrentWeather,
	DailyForecast as DailyForecastType,
	HourlyForecast as HourlyForecastType,
} from '@/stores/weather-store';

import DailyForecast from '@/components/daily-forecast.vue';
import HourlyForecastContainer from '@/components/hourly-forecast-container.vue';
import { useLocationService } from '@/composables/use-geolocation';
import { useSettingsStore } from '@/stores/settings-store';
import { useWeatherStore } from '@/stores/weather-store';

const { t } = useI18n();

const selectedDayIndex = ref(0);
const settingsStore = useSettingsStore();
const weatherStore = useWeatherStore();

const { error: locationError } = useLocationService();

// Use computed properties to maintain reactivity with the store
const weatherError = computed(() => weatherStore.error);
const loading = computed(() => weatherStore.loading);
const current = computed<CurrentWeather | undefined>(() => weatherStore.current);
const daily = computed<DailyForecastType | undefined>(() => weatherStore.daily);
const hourly = computed<HourlyForecastType | undefined>(() => weatherStore.hourly);
</script>

<template>
	<main
		class="bg-gradient-to-b flex flex-col min-h-screen from-primary-50 to-primary-100 dark:(from-gray-900 to-gray-800)">
		<header
			class="p-4 border-b border-primary-100 flex flex-row gap-4 items-start items-center justify-between sm:(p-5) dark:(border-gray-700)">
			<div>
				<h1 class="text-3xl text-gray-800 font-bold leading-tight md:(text-5xl) sm:(text-4xl) dark:(text-gray-100)">
					{{ t('app.forecast') }}
				</h1>
			</div>
		</header>

		<div class="p-4 pb-24 flex-1 overflow-auto sm:(p-6) md:(pb-6)">
			<div v-if="loading" class="flex flex-col h-full items-center justify-center">
				<div class="i-custom-cloudy text-8xl text-primary-500 animate-pulse dark:(text-primary-400)"></div>
				<p class="text-2xl text-gray-600 font-medium mt-6 dark:(text-gray-300)">{{ t('app.loading') }}</p>
			</div>

			<div v-else-if="weatherError || locationError" class="m-6 p-6 rounded-xl bg-red-50 dark:(bg-red-900/30)">
				<div class="flex items-center">
					<div class="i-custom-not-available text-4xl text-red-500 mr-4"></div>
					<h2 class="text-2xl text-red-800 font-medium dark:(text-red-300)">{{ t('app.error') }}</h2>
				</div>
				<p class="text-lg text-red-700 mt-3 leading-comfortable dark:(text-red-300)">
					{{ weatherError || locationError }}
				</p>
			</div>

			<div v-else-if="!daily || !hourly" class="flex flex-col h-full items-center justify-center">
				<div class="i-ri-calendar-line text-8xl text-primary-300 mb-4 dark:(text-primary-700)"></div>
				<p class="text-xl text-gray-600 dark:(text-gray-300)">{{ t('app.noData') }}</p>
			</div>

			<div v-else class="flex flex-col gap-6">
				<DailyForecast
					:daily="daily"
					:selected-day-index="selectedDayIndex"
					@select-day="(index) => (selectedDayIndex = index)" />

				<HourlyForecastContainer
					:current="current"
					:daily="daily"
					:hourly="hourly"
					:selected-day-index="selectedDayIndex"
					:is-advanced-view="settingsStore.advancedView" />
			</div>
		</div>
	</main>
</template>
