<script setup lang="ts">
import { computed } from 'vue';

interface ForecastTileProperties {
	details: WeatherDetail[];
	isActive?: boolean;
	minTemperature?: number;
	temperature: number;
	title: string;
	weatherCode: number;
}

interface WeatherDetail {
	icon: string;
	label: string;
	unit?: string;
	value: number | string;
}

const properties = defineProps<ForecastTileProperties>();

// Weather icon mapping
const weatherCodeToIcon = (code: number): string => {
	// WMO Weather interpretation codes (WW)
	// https://open-meteo.com/en/docs
	if (code === 0) return 'i-custom-clear-day'; // Clear sky
	if (code === 1) return 'i-custom-partly-cloudy-day'; // Mainly clear
	if (code >= 2 && code <= 3) return 'i-custom-cloudy'; // Partly cloudy, overcast
	if (code >= 45 && code <= 48) return 'i-custom-fog'; // Fog
	if (code >= 51 && code <= 55) return 'i-custom-drizzle'; // Drizzle
	if (code >= 56 && code <= 57) return 'i-custom-sleet'; // Freezing Drizzle
	if (code >= 61 && code <= 65) return 'i-custom-rain'; // Rain
	if (code >= 66 && code <= 67) return 'i-custom-sleet'; // Freezing Rain
	if (code >= 71 && code <= 77) return 'i-custom-snow'; // Snow
	if (code >= 80 && code <= 82) return 'i-custom-rain'; // Rain showers
	if (code >= 85 && code <= 86) return 'i-custom-snow'; // Snow showers
	if (code >= 95 && code <= 99) return 'i-custom-thunderstorms'; // Thunderstorm
	return 'i-custom-not-available';
};

const weatherIcon = computed((): string => {
	return weatherCodeToIcon(properties.weatherCode);
});
</script>

<template>
	<div
		class="p-3 rounded-lg flex flex-col gap-2 sm:p-4 sm:gap-3"
		:class="{
			'bg-primary-50 dark:bg-primary-900/20': isActive,
			'hover:bg-gray-50 dark:hover:bg-gray-700/50': !isActive,
		}">
		<!-- Title (day name or time) -->
		<div class="text-base text-gray-800 font-medium text-center sm:text-lg dark:text-gray-200">
			{{ title }}
		</div>

		<!-- Main weather info -->
		<div class="flex items-center justify-between">
			<div class="flex flex-col">
				<span class="text-lg text-gray-800 font-medium font-serif sm:text-xl dark:text-gray-200">
					{{ temperature }}
				</span>
				<span
					v-if="minTemperature !== undefined"
					class="text-sm text-gray-500 font-serif sm:text-base dark:text-gray-400">
					{{ minTemperature }}
				</span>
			</div>
			<div :class="weatherIcon" class="text-4xl text-primary-500 sm:text-5xl dark:text-primary-400"></div>
		</div>

		<!-- Weather details -->
		<div v-if="details && details.length > 0" class="text-xs space-y-1 sm:text-sm sm:space-y-2">
			<div v-for="(detail, index) in details" :key="index" class="flex items-center justify-between">
				<div class="flex items-center">
					<div :class="`${detail.icon} text-sm sm:text-base text-primary-500 mr-1 dark:text-primary-400`"></div>
					<span class="text-gray-600 dark:text-gray-400">{{ detail.label }}</span>
				</div>
				<span class="text-gray-800 font-medium dark:text-gray-300"> {{ detail.value }}{{ detail.unit || '' }} </span>
			</div>
		</div>
	</div>
</template>
