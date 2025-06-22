<script setup lang="ts">
import { useDateFormat } from '@vueuse/core';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import ForecastCard from '../components/forecast-card.vue';
import ForecastTile from '../components/forecast-tile.vue';
import LanguageSwitcher from '../components/language-switcher.vue';
import SelectDropdown from '../components/select-dropdown.vue';
import ThemeSwitcher from '../components/theme-switcher.vue';
import ToggleSwitch from '../components/toggle-switch.vue';
import VerticalForecast from '../components/vertical-forecast.vue';
import { useWeather } from '../composables/use-weather';

// State variables
const selectedDayIndex = ref(0); // Add selected day index state
const temperatureUnit = ref<'celsius' | 'fahrenheit'>('celsius'); // Add temperature unit state
const timeFormat = ref<'twelveHour' | 'twentyFourHour'>('twentyFourHour'); // Add time format state
const advancedForecastView = ref(false); // Set simple view as default

// Initialize weather composable
const { currentWeather, error, fetchWeatherData, loading, loadingLocation, location, useCurrentLocation } =
	useWeather();

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

// Format temperature
const formatTemperature = (temperature: number | undefined): string => {
	if (temperature === undefined) return 'N/A';

	// Convert to Fahrenheit if needed
	const temporaryValue = temperatureUnit.value === 'fahrenheit' ? (temperature * 9) / 5 + 32 : temperature;

	// Format with the appropriate unit symbol
	const unitSymbol = temperatureUnit.value === 'fahrenheit' ? '°F' : '°C';
	return `${Math.round(temporaryValue)}${unitSymbol}`;
};

// Get weather description
const { locale, t } = useI18n();
const getWeatherDescription = (code: number): string => {
	return t(`weather.codes.${code}`) || t('weather.na');
};

// Format time based on selected format
const formatTime = (date: Date): string => {
	if (timeFormat.value === 'twentyFourHour') {
		return useDateFormat(date, 'HH:mm', { locales: locale.value }).value;
	} else {
		// For 12-hour format
		const formatString = locale.value.startsWith('de') ? 'h A' : 'h A';
		return useDateFormat(date, formatString, { locales: locale.value }).value;
	}
};

// Format weekday name
const formatWeekday = (date: Date, format: 'long' | 'short' = 'short'): string => {
	const formatString = format === 'long' ? 'dddd' : 'ddd';
	return useDateFormat(date, formatString, { locales: locale.value }).value;
};

// Get current date and time
const currentDateTime = computed(() => {
	const now = new Date();
	const dateFormatted = useDateFormat(now, 'dddd, D MMMM YYYY', { locales: locale.value }).value;
	return `${dateFormatted}, ${formatTime(now)}`;
});

// Get formatted date for selected day
const selectedDayDate = computed((): string => {
	if (!currentWeather.value || !currentWeather.value.daily.time[selectedDayIndex.value]) {
		return '';
	}

	const date = currentWeather.value.daily.time[selectedDayIndex.value];
	return useDateFormat(date, 'dddd, D MMMM YYYY', { locales: locale.value }).value;
});

// Get hourly forecast for selected day
const selectedDayHourlyForecast = computed(() => {
	if (!currentWeather.value) return [];

	const selectedDate = currentWeather.value.daily.time[selectedDayIndex.value];
	const startOfDay = new Date(selectedDate);
	startOfDay.setHours(0, 0, 0, 0);

	const endOfDay = new Date(selectedDate);
	endOfDay.setHours(23, 59, 59, 999);

	// Filter hourly forecast for the selected day
	const hourlyData = currentWeather.value.hourly;
	const filteredHourlyData = hourlyData.time
		.map((time, index) => ({
			humidity: hourlyData.relative_humidity_2m[index],
			precipitation: hourlyData.precipitation[index],
			precipitationProbability: hourlyData.precipitation_probability[index],
			temperature: hourlyData.temperature_2m[index],
			time,
			weatherCode: hourlyData.weather_code[index],
			windSpeed: hourlyData.wind_speed_10m[index],
		}))
		.filter((item) => item.time >= startOfDay && item.time <= endOfDay);

	return filteredHourlyData;
});

// Select a day
const selectDay = (index: number): void => {
	selectedDayIndex.value = index;
};

// Get the label for the forecast view toggle based on current state
const forecastViewLabel = computed((): string => {
	return advancedForecastView.value ? t('weather.forecast.advancedView') : t('weather.forecast.simpleView');
});

// Initialize with default location
onMounted(async () => {
	await fetchWeatherData(location.value.latitude, location.value.longitude);
});
</script>

<template>
	<main
		class="bg-gradient-to-b flex flex-col min-h-screen from-primary-50 to-primary-100 sm:h-screen md:overflow-hidden dark:from-gray-900 dark:to-gray-800">
		<!-- Header with controls -->
		<header
			class="p-4 border-b border-primary-100 flex flex-col gap-4 items-start justify-between sm:p-5 dark:border-gray-700 sm:flex-row sm:items-center">
			<div>
				<h1 class="text-3xl text-gray-800 font-bold leading-tight md:text-5xl sm:text-4xl dark:text-gray-100">{{
					t('app.title')
				}}</h1>
			</div>

			<div class="flex flex-wrap gap-2 items-center sm:gap-3">
				<!-- Time format selector -->
				<SelectDropdown
					:aria-label="t('app.timeFormat.title')"
					:model-value="timeFormat"
					:options="[
						{ value: 'twentyFourHour', label: t('app.timeFormat.twentyFourHour') },
						{ value: 'twelveHour', label: t('app.timeFormat.twelveHour') },
					]"
					@update:model-value="(value) => (timeFormat = value as 'twentyFourHour' | 'twelveHour')" />

				<!-- Temperature unit selector -->
				<SelectDropdown
					:aria-label="t('app.temperature.title')"
					:model-value="temperatureUnit"
					:options="[
						{ value: 'celsius', label: t('app.temperature.celsius').split(' ')[0] },
						{ value: 'fahrenheit', label: t('app.temperature.fahrenheit').split(' ')[0] },
					]"
					@update:model-value="(value) => (temperatureUnit = value as 'celsius' | 'fahrenheit')" />
				<ThemeSwitcher />
				<LanguageSwitcher />
			</div>
		</header>

		<!-- Loading state -->
		<div v-if="loading" class="flex flex-1 flex-col items-center justify-center">
			<div class="i-custom-cloudy text-8xl text-primary-500 animate-pulse dark:text-primary-400"></div>
			<p class="text-2xl text-gray-600 font-medium mt-6 dark:text-gray-300">{{ t('app.loading') }}</p>
		</div>

		<!-- Error state -->
		<div v-else-if="error" class="m-6 p-6 rounded-xl bg-red-50 dark:bg-red-900/30">
			<div class="flex items-center">
				<div class="i-custom-not-available text-4xl text-red-500 mr-4"></div>
				<h2 class="text-2xl text-red-800 font-medium dark:text-red-300">{{ t('app.error') }}</h2>
			</div>
			<p class="text-lg text-red-700 mt-3 leading-comfortable dark:text-red-300">{{ error }}</p>
		</div>

		<!-- Initial state - no weather data -->
		<div v-else-if="!currentWeather" class="p-4 flex flex-1 flex-col items-center justify-center">
			<div class="p-6 text-center rounded-2xl bg-white max-w-md sm:p-8 dark:bg-gray-800">
				<h1 class="text-3xl text-gray-800 font-bold mb-6 sm:text-4xl dark:text-gray-100">{{ t('app.title') }}</h1>
				<button
					@click="useCurrentLocation"
					class="text-lg text-white font-medium mx-auto mt-4 px-6 py-3 rounded-lg bg-primary-600 flex transition-colors items-center hover:bg-primary-700"
					:disabled="loadingLocation">
					<div class="i-custom-compass text-2xl mr-3"></div>
					<span v-if="loadingLocation">{{ t('app.location.loading') }}</span>
					<span v-else>{{ t('app.location.button') }}</span>
				</button>
			</div>
		</div>

		<!-- Dashboard layout with left sidebar -->
		<div v-else-if="currentWeather" class="flex flex-1 flex-col overflow-auto md:flex-row md:overflow-hidden">
			<!-- Left sidebar with location and current weather -->
			<aside
				class="border-b border-primary-100 bg-white flex flex-col w-full md:border-b-0 md:border-r dark:border-gray-700 dark:bg-gray-800 md:max-w-xs md:overflow-auto">
				<!-- Location information -->
				<div class="p-4 border-b border-primary-100 sm:p-5 dark:border-gray-700">
					<h2 class="text-2xl text-gray-800 font-medium dark:text-gray-100">{{ location.name }}</h2>
					<p class="text-base text-gray-600 mt-1 dark:text-gray-400">{{ currentDateTime }}</p>
					<button
						v-if="!loadingLocation"
						@click="useCurrentLocation"
						class="text-base text-white font-medium mt-4 px-4 py-2 rounded-lg bg-primary-600 flex transition-colors items-center hover:bg-primary-700"
						:disabled="loadingLocation">
						<div class="i-custom-compass text-xl mr-2"></div>
						<span>{{ t('app.location.button') }}</span>
					</button>
				</div>

				<!-- Current weather -->
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
						<div
							:class="weatherCodeToIcon(currentWeather.current.weather_code)"
							class="text-6xl text-primary-500 sm:text-7xl dark:text-primary-400"></div>
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
									{{ currentWeather.current.wind_speed_10m }} km/h
								</div>
							</div>
						</div>

						<div class="flex items-center">
							<div>
								<div class="text-base text-gray-600 dark:text-gray-400">{{ t('weather.pressure') }}</div>
								<div class="text-lg text-gray-800 font-medium font-serif dark:text-gray-200">
									{{ currentWeather.current.pressure_msl }} hPa
								</div>
							</div>
						</div>

						<div class="flex items-center">
							<div>
								<div class="text-base text-gray-600 dark:text-gray-400">{{ t('weather.precipitation') }}</div>
								<div class="text-lg text-gray-800 font-medium font-serif dark:text-gray-200">
									{{ currentWeather.current.precipitation }} mm
								</div>
							</div>
						</div>
					</div>
				</div>
			</aside>

			<!-- Main content area -->
			<div class="p-4 flex-1 overflow-auto sm:p-6">
				<div class="flex flex-col gap-6 h-full">
					<!-- Daily forecast -->
					<div class="flex-shrink-0">
						<ForecastCard :title="t('weather.forecast.daily')">
							<template #header-actions>
								<div class="flex gap-2 items-center">
									<ToggleSwitch
										v-model="advancedForecastView"
										:label="forecastViewLabel"
										:aria-label="t('weather.forecast.toggleView')" />
								</div>
							</template>
							<div class="pb-2 flex relative overflow-x-auto">
								<template v-for="(day, index) in currentWeather.daily.time" :key="index">
									<div class="mx-2 flex-1 flex-shrink-0 min-w-[140px] relative first:ml-0 last:mr-0 sm:min-w-[180px]">
										<!-- Separator between tiles except adjacent to selected tile -->
										<div
											v-if="index > 0 && selectedDayIndex !== index && selectedDayIndex !== index - 1"
											class="bg-gray-200 h-[100%] w-[1px] left-[-8px] absolute dark:bg-gray-700">
										</div>

										<ForecastTile
											:title="formatWeekday(day, 'long')"
											:temperature="formatTemperature(currentWeather.daily.temperature_2m_max[index])"
											:min-temperature="formatTemperature(currentWeather.daily.temperature_2m_min[index])"
											:weather-code="currentWeather.daily.weather_code[index]"
											:is-active="selectedDayIndex === index"
											:details="
												advancedForecastView
													? [
															{
																icon: 'i-custom-precipitation',
																label: t('weather.precipitation'),
																value: currentWeather.daily.precipitation_sum[index],
																unit: ' mm',
															},
															{
																icon: '',
																label: t('weather.humidity'),
																value: currentWeather.daily.relative_humidity_2m_max[index],
																unit: '%',
															},
															{
																icon: '',
																label: t('weather.wind'),
																value: currentWeather.daily.wind_speed_10m_max[index],
																unit: ' km/h',
															},
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

					<!-- Vertical hourly forecast for selected day -->
					<div class="flex flex-col md:flex-1 md:min-h-0">
						<ForecastCard :title="selectedDayDate" class="flex flex-col md:h-full">
							<div class="flex-1 overflow-auto">
								<VerticalForecast
									:hourly-data="selectedDayHourlyForecast"
									:is-advanced-view="advancedForecastView"
									:time-formatter="formatTime"
									:temperature-formatter="formatTemperature"
									:weather-code-to-icon="weatherCodeToIcon"
									:translation-function="t" />
							</div>
						</ForecastCard>
					</div>
				</div>
			</div>
		</div>
	</main>
</template>
