<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import DailyForecast from '@/components/daily-forecast.vue';
import HourlyForecastContainer from '@/components/hourly-forecast-container.vue';
import { useSettingsStore } from '@/stores/settings-store';
import { useWeatherStore } from '@/stores/weather-store';

const { t } = useI18n();

const selectedDayIndex = ref(0);
const settingsStore = useSettingsStore();
const weatherStore = useWeatherStore();

const { daily, hourly } = storeToRefs(weatherStore);
</script>

<template>
	<main
		class="bg-gradient-to-b flex flex-col min-h-screen from-primary-50 to-primary-100 dark:(from-gray-900 to-gray-800)">
		<header
			class="p-4 border-b border-primary-100 flex flex-row gap-4 items-start items-center justify-between sm:(p-5) dark:(border-gray-700)">
			<div>
				<h1 class="text-3xl text-gray-800 font-bold md:(text-5xl) sm:(text-4xl) dark:(text-gray-100)">
					{{ t('app.forecast') }}
				</h1>
			</div>
		</header>

		<div class="p-4 pb-24 flex-1 overflow-auto sm:(p-6) md:(pb-6)" v-if="daily && hourly">
			<div class="flex flex-col gap-6">
				<DailyForecast
					:daily="daily"
					:selected-day-index="selectedDayIndex"
					@select-day="(index) => (selectedDayIndex = index)" />

				<HourlyForecastContainer
					:daily="daily"
					:hourly="hourly"
					:selected-day-index="selectedDayIndex"
					:is-advanced-view="settingsStore.advancedView" />
			</div>
		</div>
	</main>
</template>
