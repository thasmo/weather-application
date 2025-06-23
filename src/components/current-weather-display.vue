<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { useFormat } from '../composables/use-format';
import ForecastTile from './forecast-tile.vue';

interface CurrentWeatherProperties {
	currentWeather: any;
	isDaytime: boolean;
}

const properties = defineProps<CurrentWeatherProperties>();

const { t } = useI18n();
const { formatAirPressure, formatPrecipitation, formatTemperature, formatWindSpeed } = useFormat();

// Get weather description
const getWeatherDescription = (code: number): string => {
	return t(`weather.codes.${code}`) || t('weather.na');
};
</script>

<template>
	<div class="p-4 flex flex-col sm:p-5">
		<div class="flex items-center justify-between">
			<div class="flex flex-col">
				<span class="text-4xl text-gray-800 font-bold font-serif sm:text-5xl dark:text-gray-100">
					{{ formatTemperature(currentWeather.current.temperature_2m) }}
				</span>
				<span class="text-base text-gray-600 font-serif mt-1 dark:text-gray-400">
					{{ t('weather.feels_like') }}
					{{ formatTemperature(currentWeather.current.apparent_temperature) }}
				</span>
			</div>
			<ForecastTile
				:weather-code="currentWeather.current.weather_code"
				:is-day="isDaytime"
				class="!p-0 !rounded-none !bg-transparent" />
		</div>

		<p class="text-xl text-gray-700 font-medium mt-4 dark:text-gray-300">
			{{ getWeatherDescription(currentWeather.current.weather_code) }}
		</p>

		<!-- Weather details -->
		<div class="mt-6 space-y-5">
			<div class="flex items-center">
				<div>
					<div class="text-base text-gray-600 dark:text-gray-400">{{ t('weather.humidity') }}</div>
					<div class="text-lg text-gray-800 font-medium font-serif dark:text-gray-200">
						{{ currentWeather.current.relative_humidity_2m }}%
					</div>
				</div>
			</div>

			<div class="flex items-center">
				<div>
					<div class="text-base text-gray-600 dark:text-gray-400">{{ t('weather.wind') }}</div>
					<div class="text-lg text-gray-800 font-medium font-serif dark:text-gray-200">
						{{ formatWindSpeed(currentWeather.current.wind_speed_10m) }}
					</div>
				</div>
			</div>

			<div class="flex items-center">
				<div>
					<div class="text-base text-gray-600 dark:text-gray-400">{{ t('weather.pressure') }}</div>
					<div class="text-lg text-gray-800 font-medium font-serif dark:text-gray-200">
						{{ formatAirPressure(currentWeather.current.pressure_msl) }}
					</div>
				</div>
			</div>

			<div class="flex items-center">
				<div>
					<div class="text-base text-gray-600 dark:text-gray-400">{{ t('weather.precipitation') }}</div>
					<div class="text-lg text-gray-800 font-medium font-serif dark:text-gray-200">
						{{ formatPrecipitation(currentWeather.current.precipitation) }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
