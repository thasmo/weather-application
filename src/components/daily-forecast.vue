<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type { CurrentWeather } from '@/composables/use-weather.ts';

import ForecastCard from '@/components/forecast-card.vue';
import ForecastTile from '@/components/forecast-tile.vue';
import ToggleSwitch from '@/components/toggle-switch.vue';
import { useFormat } from '@/composables/use-format';

interface DailyForecastProperties {
	advancedView: boolean;
	currentWeather: CurrentWeather;
	selectedDayIndex: number;
}

const properties = defineProps<DailyForecastProperties>();

const emit = defineEmits<{
	(event: 'selectDay', index: number): void;
	(event: 'toggleView', value: boolean): void;
}>();

const { t } = useI18n();
const { formatAirPressure, formatPrecipitation, formatTemperature, formatWeekday, formatWindSpeed } = useFormat();

// Get the label for the forecast view toggle based on current state
const forecastViewLabel = computed((): string => {
	return properties.advancedView ? t('weather.forecast.advancedView') : t('weather.forecast.simpleView');
});

const selectDay = (index: number): void => {
	emit('selectDay', index);
};

const toggleAdvancedView = (value: boolean): void => {
	emit('toggleView', value);
};
</script>

<template>
	<div class="flex-shrink-0">
		<ForecastCard :title="t('weather.forecast.daily')">
			<template #header-actions>
				<div class="flex gap-2 items-center">
					<ToggleSwitch
						:model-value="advancedView"
						:label="forecastViewLabel"
						:aria-label="t('weather.forecast.toggleView')"
						@update:model-value="toggleAdvancedView" />
				</div>
			</template>
			<div class="pb-2 flex gap-4 relative overflow-x-auto">
				<template v-for="(day, index) in currentWeather.daily.time" :key="index">
					<div class="flex-1 flex-shrink-0 min-w-[140px] relative sm:(min-w-[180px])">
						<div
							v-if="index > 0 && selectedDayIndex !== index && selectedDayIndex !== index - 1"
							class="bg-gray-200 h-[100%] w-[1px] left-[-8px] absolute dark:(bg-gray-700)">
						</div>

						<ForecastTile
							:title="formatWeekday(day, 'long')"
							:temperature="currentWeather.daily.temperature_2m_max[index]"
							:min-temperature="currentWeather.daily.temperature_2m_min[index]"
							:weather-code="currentWeather.daily.weather_code[index]"
							:is-active="selectedDayIndex === index"
							:is-day="true"
							:details="
								advancedView
									? [
											{
												icon: 'i-custom-temperature',
												label: t('weather.temperature'),
												value: formatTemperature(currentWeather.daily.temperature_2m_max[index]),
												unit: '',
											},
											{
												icon: 'i-custom-precipitation',
												label: t('weather.precipitation'),
												value: formatPrecipitation(currentWeather.daily.precipitation_sum[index]),
												unit: '',
											},
											{
												icon: '',
												label: t('weather.wind'),
												value: formatWindSpeed(currentWeather.daily.wind_speed_10m_max[index]),
												unit: '',
											},
											...(currentWeather.daily.pressure_msl_mean
												? [
														{
															icon: '',
															label: t('weather.pressure'),
															value: formatAirPressure(currentWeather.daily.pressure_msl_mean[index]),
															unit: '',
														},
													]
												: []),
										]
									: []
							"
							class="cursor-pointer transition-all"
							@click="selectDay(index)" />
					</div>
				</template>
			</div>
		</ForecastCard>
	</div>
</template>
