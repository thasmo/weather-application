<script setup lang="ts">
interface HourlyForecastItem {
	humidity: number;
	precipitation: number;
	precipitationProbability: number;
	temperature: number;
	time: Date;
	weatherCode: number;
	windSpeed: number;
}

interface VerticalForecastProperties {
	hourlyData: HourlyForecastItem[];
	isAdvancedView: boolean;
	temperatureFormatter: (temporary: number) => string;
	timeFormatter: (date: Date) => string;
	translationFunction: (key: string) => string;
	weatherCodeToIcon: (code: number) => string;
}

defineProps<VerticalForecastProperties>();

// Determine if an hour is the current hour
const isCurrentHour = (time: Date): boolean => {
	const now = new Date();
	return now.getHours() === time.getHours() && now.toDateString() === time.toDateString();
};
</script>

<template>
	<div class="h-full overflow-y-auto">
		<table class="w-full border-collapse">
			<thead class="bg-white top-0 sticky dark:bg-gray-800">
				<tr class="border-b border-gray-200 dark:border-gray-700">
					<th class="text-gray-700 font-medium px-4 py-3 text-left dark:text-gray-300">
						{{ translationFunction('weather.time') }}
					</th>
					<th class="text-gray-700 font-medium px-4 py-3 text-center dark:text-gray-300">
						{{ translationFunction('weather.temperature_short') }}
					</th>
					<th class="text-gray-700 font-medium px-4 py-3 text-center dark:text-gray-300">
						{{ translationFunction('weather.condition') }}
					</th>
					<th v-if="isAdvancedView" class="text-gray-700 font-medium px-4 py-3 text-center dark:text-gray-300">
						{{ translationFunction('weather.precipitation_short') }}
					</th>
					<th v-if="isAdvancedView" class="text-gray-700 font-medium px-4 py-3 text-center dark:text-gray-300">
						{{ translationFunction('weather.humidity_short') }}
					</th>
					<th v-if="isAdvancedView" class="text-gray-700 font-medium px-4 py-3 text-center dark:text-gray-300">
						{{ translationFunction('weather.wind_short') }}
					</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="(hour, index) in hourlyData"
					:key="index"
					:class="{
						'bg-primary-50 dark:bg-primary-900/20': isCurrentHour(hour.time),
						'border-b border-gray-200 dark:border-gray-700': true,
						'hover:bg-gray-50 dark:hover:bg-gray-700/50': !isCurrentHour(hour.time),
					}">
					<td class="text-gray-800 font-medium px-4 py-3 dark:text-gray-200">
						{{ timeFormatter(hour.time) }}
					</td>
					<td class="px-4 py-3 text-center">
						<span class="text-gray-800 font-medium font-serif dark:text-gray-200">
							{{ temperatureFormatter(hour.temperature) }}
						</span>
					</td>
					<td class="px-4 py-3 text-center">
						<div
							:class="weatherCodeToIcon(hour.weatherCode)"
							class="text-3xl text-primary-500 mx-auto dark:text-primary-400"></div>
					</td>
					<td v-if="isAdvancedView" class="text-gray-800 font-medium px-4 py-3 text-center dark:text-gray-300">
						{{ hour.precipitationProbability }}%
					</td>
					<td v-if="isAdvancedView" class="text-gray-800 font-medium px-4 py-3 text-center dark:text-gray-300">
						{{ hour.humidity }}%
					</td>
					<td v-if="isAdvancedView" class="text-gray-800 font-medium px-4 py-3 text-center dark:text-gray-300">
						{{ hour.windSpeed }} km/h
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
