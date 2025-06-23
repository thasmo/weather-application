<script setup lang="ts">
import { useDateFormat } from '@vueuse/core';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type { CurrentWeather } from '@/composables/use-weather.ts';

import ForecastCard from '@/components/forecast-card.vue';
import VerticalForecast from '@/components/vertical-forecast.vue';
import { useFormat } from '@/composables/use-format';
import { weatherCodeToIcon } from '@/utils/weather-icon-mapper';

interface HourlyForecastContainerProperties {
	currentWeather: CurrentWeather;
	isAdvancedView: boolean;
	selectedDayIndex: number;
}

const properties = defineProps<HourlyForecastContainerProperties>();

const { locale } = useI18n();
const { formatAirPressure, formatPrecipitation, formatTemperature, formatTime, formatWindSpeed } = useFormat();

// Get formatted date for selected day
const selectedDayDate = computed((): string => {
	if (!properties.currentWeather || !properties.currentWeather.daily.time[properties.selectedDayIndex]) {
		return '';
	}

	const date = properties.currentWeather.daily.time[properties.selectedDayIndex];
	return useDateFormat(date, 'dddd, D MMMM YYYY', { locales: locale.value }).value;
});

// Get hourly forecast data from the parent component
const hourlyForecastData = computed(() => {
	if (!properties.currentWeather?.hourly) return [];

	const selectedDate = new Date(properties.currentWeather.daily.time[properties.selectedDayIndex]);
	const startOfDay = new Date(selectedDate);
	startOfDay.setHours(0, 0, 0, 0);
	const endOfDay = new Date(selectedDate);
	endOfDay.setHours(23, 59, 59, 999);

	return properties.currentWeather.hourly.time
		.map((time: Date | string, index: number) => {
			const hourDate = time instanceof Date ? time : new Date(time);
			if (hourDate >= startOfDay && hourDate <= endOfDay) {
				return {
					airPressure: properties.currentWeather.hourly.pressure_msl?.[index],
					humidity: properties.currentWeather.hourly.relative_humidity_2m[index],
					isDay: properties.currentWeather.hourly.is_day?.[index],
					precipitation: properties.currentWeather.hourly.precipitation[index],
					precipitationProbability: properties.currentWeather.hourly.precipitation_probability[index],
					temperature: properties.currentWeather.hourly.temperature_2m[index],
					time: hourDate,
					weatherCode: properties.currentWeather.hourly.weather_code[index],
					windSpeed: properties.currentWeather.hourly.wind_speed_10m[index],
				};
			}
			return;
		})
		.filter(Boolean);
});
</script>

<template>
	<div class="flex flex-col md:flex-1 md:min-h-0">
		<ForecastCard :title="selectedDayDate" class="flex flex-col md:h-full">
			<div class="flex-1 overflow-auto">
				<VerticalForecast
					:hourly-data="hourlyForecastData"
					:is-advanced-view="isAdvancedView"
					:time-formatter="formatTime"
					:temperature-formatter="formatTemperature"
					:weather-code-to-icon="weatherCodeToIcon"
					:wind-speed-formatter="formatWindSpeed"
					:precipitation-formatter="formatPrecipitation"
					:air-pressure-formatter="formatAirPressure" />
			</div>
		</ForecastCard>
	</div>
</template>
