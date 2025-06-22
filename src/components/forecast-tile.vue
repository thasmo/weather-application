<script setup lang="ts">
import { computed } from 'vue';

interface ForecastTileProperties {
	details: WeatherDetail[];
	isActive?: boolean;
	isDay?: boolean;
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
const weatherCodeToIcon = (code: number, isDay: boolean = true): string => {
	// WMO Weather interpretation codes (WW)
	// https://open-meteo.com/en/docs

	// Clear sky
	if (code === 0) return isDay ? 'i-custom-clear-day' : 'i-custom-clear-night';

	// Mainly clear
	if (code === 1) return isDay ? 'i-custom-partly-cloudy-day' : 'i-custom-partly-cloudy-night';

	// Partly cloudy
	if (code === 2) return isDay ? 'i-custom-partly-cloudy-day' : 'i-custom-partly-cloudy-night';

	// Overcast
	if (code === 3) return isDay ? 'i-custom-overcast-day' : 'i-custom-overcast-night';

	// Fog
	if (code >= 45 && code <= 48) return isDay ? 'i-custom-fog-day' : 'i-custom-fog-night';

	// Drizzle: Light, moderate, dense
	if (code >= 51 && code <= 55) {
		if (code === 51) return isDay ? 'i-custom-partly-cloudy-day-drizzle' : 'i-custom-partly-cloudy-night-drizzle';
		return 'i-custom-drizzle';
	}

	// Freezing Drizzle: Light, dense
	if (code >= 56 && code <= 57) return 'i-custom-sleet';

	// Rain: Slight, moderate, heavy
	if (code >= 61 && code <= 65) {
		if (code === 61) return isDay ? 'i-custom-partly-cloudy-day-rain' : 'i-custom-partly-cloudy-night-rain';
		return 'i-custom-rain';
	}

	// Freezing Rain: Light, heavy
	if (code >= 66 && code <= 67) return 'i-custom-sleet';

	// Snow: Slight, moderate, heavy
	if (code >= 71 && code <= 75) {
		if (code === 71) return isDay ? 'i-custom-partly-cloudy-day-snow' : 'i-custom-partly-cloudy-night-snow';
		return 'i-custom-snow';
	}

	// Snow grains
	if (code === 77) return 'i-custom-snow';

	// Rain showers: Slight, moderate, violent
	if (code >= 80 && code <= 82) {
		if (code === 80) return isDay ? 'i-custom-partly-cloudy-day-rain' : 'i-custom-partly-cloudy-night-rain';
		return 'i-custom-rain';
	}

	// Snow showers: Slight, heavy
	if (code >= 85 && code <= 86) {
		if (code === 85) return isDay ? 'i-custom-partly-cloudy-day-snow' : 'i-custom-partly-cloudy-night-snow';
		return 'i-custom-snow';
	}

	// Thunderstorm: Slight/moderate, with hail
	if (code >= 95 && code <= 99) {
		if (code === 95) return isDay ? 'i-custom-thunderstorms-day' : 'i-custom-thunderstorms-night';
		if (code === 96 || code === 99)
			return isDay ? 'i-custom-thunderstorms-day-hail' : 'i-custom-thunderstorms-night-hail';
		return 'i-custom-thunderstorms';
	}

	return 'i-custom-not-available';
};

const weatherIcon = computed((): string => {
	return weatherCodeToIcon(properties.weatherCode, properties.isDay !== false);
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
