<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import CurrentWeatherDisplay from '@/components/current-weather-display.vue';
import DailyForecast from '@/components/daily-forecast.vue';
import HourlyForecastContainer from '@/components/hourly-forecast-container.vue';
import LocationDisplay from '@/components/location-display.vue';
import SettingsMenu from '@/components/settings-menu.vue';
import { useLocationService } from '@/composables/use-geolocation';
import { useWeather } from '@/composables/use-weather';
import { useSettingsStore } from '@/stores/settings-store';

const { t } = useI18n();

const selectedDayIndex = ref(0);
const settingsStore = useSettingsStore();
const isMobile = useMediaQuery('(max-width: 767px)');

const { error: locationError, loadingLocation, location, useCurrentLocation } = useLocationService();

const { current, daily, error: weatherError, hourly, loading } = useWeather({ location });

const handleLocationUpdate = async (): Promise<void> => {
	try {
		await useCurrentLocation();
	} catch (error) {
		console.error('Error updating location:', error);
	}
};
</script>

<template>
	<main
		class="bg-gradient-to-b flex flex-col min-h-screen from-primary-50 to-primary-100 sm:(h-screen) md:(overflow-hidden) dark:(from-gray-900 to-gray-800)">
		<header
			class="p-4 border-b border-primary-100 flex flex-row gap-4 items-start items-center justify-between sm:(p-5) dark:(border-gray-700)">
			<div>
				<h1 class="text-3xl text-gray-800 font-bold leading-tight md:(text-5xl) sm:(text-4xl) dark:(text-gray-100)">{{
					t('app.title')
				}}</h1>
			</div>

			<div class="flex-wrap gap-2 hidden items-center md:flex sm:(gap-3)">
				<SettingsMenu />
			</div>
		</header>

		<div v-if="loading" class="flex flex-1 flex-col items-center justify-center">
			<div class="i-custom-cloudy text-8xl text-primary-500 animate-pulse dark:(text-primary-400)"></div>
			<p class="text-2xl text-gray-600 font-medium mt-6 dark:(text-gray-300)">{{ t('app.loading') }}</p>
		</div>

		<div v-else-if="weatherError || locationError" class="m-6 p-6 rounded-xl bg-red-50 dark:(bg-red-900/30)">
			<div class="flex items-center">
				<div class="i-custom-not-available text-4xl text-red-500 mr-4"></div>
				<h2 class="text-2xl text-red-800 font-medium dark:(text-red-300)">{{ t('app.error') }}</h2>
			</div>
			<p class="text-lg text-red-700 mt-3 leading-comfortable dark:(text-red-300)">{{
				weatherError || locationError
			}}</p>
		</div>

		<div v-else-if="!current || !daily || !hourly" class="p-4 flex flex-1 flex-col items-center justify-center">
			<div class="p-6 text-center rounded-2xl bg-white max-w-md sm:(p-8) dark:(bg-gray-800)">
				<h1 class="text-3xl text-gray-800 font-bold mb-6 sm:(text-4xl) dark:(text-gray-100)">{{ t('app.title') }}</h1>
				<button
					@click="handleLocationUpdate"
					class="text-lg text-white font-medium mx-auto mt-4 px-6 py-3 rounded-lg bg-primary-600 flex transition-colors items-center hover:(bg-primary-700)"
					:disabled="loadingLocation">
					<div class="i-custom-compass text-2xl mr-3"></div>
					<span v-if="loadingLocation">{{ t('app.location.loading') }}</span>
					<span v-else>{{ t('app.location.button') }}</span>
				</button>
			</div>
		</div>

		<div v-else class="flex flex-1 flex-col overflow-auto md:(flex-row overflow-hidden)">
			<aside
				class="border-primary-100 flex flex-col w-full md:(border-b-0 border-r max-w-xs overflow-auto) dark:(border-gray-700)">
				<LocationDisplay
					:location-name="location.name"
					:is-loading="loadingLocation"
					:on-refresh-location="handleLocationUpdate" />

				<CurrentWeatherDisplay :data="current" />
			</aside>

			<div class="p-4 pb-15 flex-1 overflow-auto sm:(p-6) md:(pb-6)">
				<div v-if="!isMobile" class="flex flex-col gap-6 h-full">
					<DailyForecast
						:daily="daily"
						:selected-day-index="selectedDayIndex"
						:advanced-view="settingsStore.advancedView"
						@select-day="(index) => (selectedDayIndex = index)" />

					<HourlyForecastContainer
						:current="current"
						:daily="daily"
						:hourly="hourly"
						:selected-day-index="selectedDayIndex"
						:is-advanced-view="settingsStore.advancedView" />
				</div>
			</div>
		</div>
	</main>
</template>
