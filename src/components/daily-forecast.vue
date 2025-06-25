<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import type { DailyForecast } from '@/stores/weather-store';

import ForecastCard from '@/components/forecast-card.vue';
import ForecastTile from '@/components/forecast-tile.vue';
import { useFormat } from '@/composables/use-format';
import { useSettingsStore } from '@/stores/settings-store';

defineProps<{
	daily: DailyForecast;
	selectedDayIndex: number;
}>();

const emit = defineEmits<{
	(event: 'selectDay', index: number): void;
}>();

const { t } = useI18n();
const settingsStore = useSettingsStore();
const { formatAirPressure, formatPrecipitation, formatTemperature, formatWeekday, formatWindSpeed } = useFormat();

const selectDay = (index: number): void => {
	emit('selectDay', index);
};
</script>

<template>
	<div class="flex-shrink-0">
		<ForecastCard :title="t('weather.forecast.daily')">
			<div class="pb-2 flex gap-4 relative overflow-x-auto">
				<template v-for="(day, index) in daily.time" :key="index">
					<div class="flex-1 flex-shrink-0 min-w-140px relative sm:(min-w-180px)">
						<div
							v-if="index > 0 && selectedDayIndex !== index && selectedDayIndex !== index - 1"
							class="bg-gray-200 h-100% w-1px left--8px absolute dark:(bg-gray-700)">
						</div>

						<ForecastTile
							:title="formatWeekday(day, 'long')"
							:temperature="daily.temperature_2m_max[index]"
							:min-temperature="daily.temperature_2m_min[index]"
							:weather-code="daily.weather_code[index]"
							:is-active="selectedDayIndex === index"
							:is-day="true"
							:details="
								settingsStore.advancedView
									? [
											{
												icon: 'i-custom-temperature',
												label: t('weather.temperature'),
												value: formatTemperature(daily.temperature_2m_max[index]),
												unit: '',
											},
											{
												icon: 'i-custom-precipitation',
												label: t('weather.precipitation'),
												value: formatPrecipitation(daily.precipitation_sum[index]),
												unit: '',
											},
											{
												icon: '',
												label: t('weather.wind'),
												value: formatWindSpeed(daily.wind_speed_10m_max[index]),
												unit: '',
											},
											...(daily.pressure_msl_mean
												? [
														{
															icon: '',
															label: t('weather.pressure'),
															value: formatAirPressure(daily.pressure_msl_mean[index]),
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
