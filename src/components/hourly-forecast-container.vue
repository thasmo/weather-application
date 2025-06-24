<script setup lang="ts">
import { useDateFormat } from '@vueuse/core';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type { CurrentWeather, DailyForecast, HourlyForecast } from '@/composables/use-weather.ts';

import ForecastCard from '@/components/forecast-card.vue';
import VerticalForecast from '@/components/vertical-forecast.vue';

const properties = defineProps<{
	current: CurrentWeather;
	daily: DailyForecast;
	hourly: HourlyForecast;
	isAdvancedView: boolean;
	selectedDayIndex: number;
}>();

const { locale } = useI18n();

const selectedDayDate = computed((): string => {
	if (!properties.daily || !properties.daily.time[properties.selectedDayIndex]) {
		return '';
	}

	const date = properties.daily.time[properties.selectedDayIndex];
	return useDateFormat(date, 'dddd, D MMMM YYYY', { locales: locale.value }).value;
});

const hourlyForecastData = computed(() => {
	if (!properties.hourly) return [];

	const selectedDate = new Date(properties.daily.time[properties.selectedDayIndex]);
	const startOfDay = new Date(selectedDate);
	startOfDay.setHours(0, 0, 0, 0);
	const endOfDay = new Date(selectedDate);
	endOfDay.setHours(23, 59, 59, 999);

	return properties.hourly.time
		.map((time: Date | string, index: number) => {
			const hourDate = time instanceof Date ? time : new Date(time);
			if (hourDate >= startOfDay && hourDate <= endOfDay) {
				return {
					airPressure: properties.hourly.pressure_msl?.[index],
					humidity: properties.hourly.relative_humidity_2m[index],
					isDay: properties.hourly.is_day?.[index],
					precipitation: properties.hourly.precipitation[index],
					precipitationProbability: properties.hourly.precipitation_probability[index],
					temperature: properties.hourly.temperature_2m[index],
					time: hourDate,
					weatherCode: properties.hourly.weather_code[index],
					windSpeed: properties.hourly.wind_speed_10m[index],
				};
			}
			return;
		})
		.filter(Boolean);
});
</script>

<template>
	<div class="flex flex-col md:(flex-1 min-h-0)">
		<ForecastCard :title="selectedDayDate" class="flex flex-col md:(h-full)">
			<div class="flex-1 overflow-auto">
				<VerticalForecast :hourly-data="hourlyForecastData" :is-advanced-view="isAdvancedView" />
			</div>
		</ForecastCard>
	</div>
</template>
