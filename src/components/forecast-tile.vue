<script setup lang="ts">
import { computed } from 'vue';

import { weatherCodeToIcon } from '@/utils/weather-icon-mapper';

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

const weatherIcon = computed((): string => {
	return weatherCodeToIcon(properties.weatherCode, properties.isDay ?? true);
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
