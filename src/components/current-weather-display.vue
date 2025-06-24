<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type { CurrentWeather } from '@/composables/use-weather.ts';

import { useFormat } from '@/composables/use-format';
import { weatherCodeToIcon } from '@/utils/weather-icon-mapper';

const properties = defineProps<{
	data: CurrentWeather;
}>();

const { t } = useI18n();
const { formatAirPressure, formatPrecipitation, formatTemperature, formatWindSpeed } = useFormat();

const description = computed((): string => {
	return t(`weather.codes.${properties.data.weather_code}`) || t('weather.na');
});

const icon = computed((): string | undefined => {
	return weatherCodeToIcon(properties.data.weather_code, properties.data.is_day);
});
</script>

<template>
	<div class="p-4 flex flex-col sm:p-5">
		<div class="flex items-center justify-between">
			<div class="flex flex-col">
				<span class="text-4xl text-gray-800 font-bold font-serif sm:text-5xl dark:(text-gray-100)">
					{{ formatTemperature(data.temperature_2m) }}
				</span>

				<span class="text-base text-gray-600 font-serif mt-1 dark:(text-gray-400)">
					{{ t('weather.feels_like') }}
					{{ formatTemperature(data.apparent_temperature) }}
				</span>
			</div>

			<div v-if="icon" :class="icon" class="text-4xl text-primary-500 sm:text-5xl dark:(text-primary-400)"></div>
		</div>

		<p class="text-xl text-gray-700 font-medium mt-4 dark:(text-gray-300)">
			{{ description }}
		</p>

		<div class="mt-6 space-y-5">
			<div class="flex items-center">
				<div>
					<div class="text-base text-gray-600 dark:(text-gray-400)">{{ t('weather.humidity') }}</div>
					<div class="text-lg text-gray-800 font-medium font-serif dark:(text-gray-200)">
						{{ data.relative_humidity_2m }}%
					</div>
				</div>
			</div>

			<div class="flex items-center">
				<div>
					<div class="text-base text-gray-600 dark:(text-gray-400)">{{ t('weather.wind') }}</div>
					<div class="text-lg text-gray-800 font-medium font-serif dark:(text-gray-200)">
						{{ formatWindSpeed(data.wind_speed_10m) }}
					</div>
				</div>
			</div>

			<div class="flex items-center">
				<div>
					<div class="text-base text-gray-600 dark:(text-gray-400)">{{ t('weather.pressure') }}</div>
					<div class="text-lg text-gray-800 font-medium font-serif dark:(text-gray-200)">
						{{ formatAirPressure(data.pressure_msl) }}
					</div>
				</div>
			</div>

			<div class="flex items-center">
				<div>
					<div class="text-base text-gray-600 dark:(text-gray-400)">{{ t('weather.precipitation') }}</div>
					<div class="text-lg text-gray-800 font-medium font-serif dark:(text-gray-200)">
						{{ formatPrecipitation(data.precipitation) }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
