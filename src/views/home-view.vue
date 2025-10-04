<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import CurrentWeatherDisplay from '@/components/current-weather-display.vue';
import DailyForecast from '@/components/daily-forecast.vue';
import HourlyForecastContainer from '@/components/hourly-forecast-container.vue';
import LocationDisplay from '@/components/location-display.vue';
import SettingsMenu from '@/components/settings-menu.vue';
import { useLocationService } from '@/composables/use-geolocation';
import { useResponsive } from '@/composables/use-responsive';
import { useSettingsStore } from '@/stores/settings-store';
import { useWeatherStore } from '@/stores/weather-store';

const { t } = useI18n();

const selectedDayIndex = ref(0);
const settingsStore = useSettingsStore();
const weatherStore = useWeatherStore();
const { isMobile } = useResponsive();

const { current, daily, hourly } = storeToRefs(weatherStore);
const { forgetLocation, hasStoredLocation, loading, location, useCurrentLocation } = useLocationService();

async function handleLocationUpdate(): Promise<void> {
	try {
		const updatedLocation = await useCurrentLocation();
		await weatherStore.fetch(updatedLocation);
	}
	catch (error) {
		console.error('Error updating location:', error);
	}
}

function handleForgetLocation(): void {
	forgetLocation();
	weatherStore.fetch(location.value);
}
</script>

<template>
	<main
		class="flex flex-col min-h-screen from-primary-50 to-primary-100 bg-gradient-to-b sm:(h-screen) md:(overflow-hidden) dark:(from-gray-900 to-gray-800)"
	>
		<header
			class="p-4 border-b border-primary-100 flex flex-row gap-4 items-start items-center justify-between sm:(p-5) dark:(border-gray-700)"
		>
			<div>
				<h1 class="text-3xl text-gray-800 font-bold md:(text-5xl) sm:(text-4xl) dark:(text-gray-100)">
					{{
						t('app.title')
					}}
				</h1>
			</div>

			<div class="flex-wrap gap-2 hidden items-center md:flex sm:(gap-3)">
				<SettingsMenu />
			</div>
		</header>

		<div class="flex flex-1 flex-col overflow-auto md:(flex-row overflow-hidden)">
			<aside
				class="border-primary-100 flex flex-col w-full md:(border-b-0 border-r max-w-xs overflow-auto) dark:(border-gray-700)"
			>
				<LocationDisplay
					:location-name="location.name"
					:is-loading="loading"
					:has-stored-location="hasStoredLocation"
					:on-refresh-location="handleLocationUpdate"
					:on-forget-location="handleForgetLocation"
				/>

				<CurrentWeatherDisplay :data="current" />
			</aside>

			<div v-if="!isMobile" class="p-4 pb-15 flex-1 overflow-auto sm:(p-6) md:(pb-6)">
				<div class="flex flex-col gap-6 h-full">
					<DailyForecast
						:daily="daily"
						:selected-day-index="selectedDayIndex"
						:advanced-view="settingsStore.advancedView"
						@select-day="(index) => (selectedDayIndex = index)"
					/>

					<HourlyForecastContainer
						:current="current"
						:daily="daily"
						:hourly="hourly"
						:selected-day-index="selectedDayIndex"
						:is-advanced-view="settingsStore.advancedView"
					/>
				</div>
			</div>
		</div>
	</main>
</template>
