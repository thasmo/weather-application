import type { Ref } from 'vue';

import { fetchWeatherApi } from 'openmeteo';
import { ref, watch } from 'vue';

export interface CurrentWeather {
	apparent_temperature: number;
	cloud_cover: number;
	is_day: boolean;
	precipitation: number;
	pressure_msl: number;
	rain: number;
	relative_humidity_2m: number;
	temperature_2m: number;
	time: Date;
	weather_code: number;
	wind_direction_10m: number;
	wind_speed_10m: number;
}

export interface DailyForecast {
	precipitation_sum: number[];
	relative_humidity_2m_max: number[];
	relative_humidity_2m_min: number[];
	sunrise: Date[];
	sunset: Date[];
	temperature_2m_max: number[];
	temperature_2m_min: number[];
	time: Date[];
	weather_code: number[];
	wind_speed_10m_max: number[];
}

export interface HourlyForecast {
	is_day: boolean[];
	precipitation: number[];
	precipitation_probability: number[];
	relative_humidity_2m: number[];
	temperature_2m: number[];
	time: Date[];
	weather_code: number[];
	wind_speed_10m: number[];
}

interface LocationData {
	latitude: number;
	longitude: number;
	name: string;
}

interface UseWeatherOptions {
	location: Ref<LocationData>;
}

const roundToOneDecimal = (value: number): number => {
	return Math.round(value * 10) / 10;
};

export function useWeather(options: UseWeatherOptions) {
	const { location } = options;

	const loading = ref(true);
	const error = ref<string | undefined>(undefined);
	const current = ref<CurrentWeather | undefined>(undefined);
	const daily = ref<DailyForecast | undefined>(undefined);
	const hourly = ref<HourlyForecast | undefined>(undefined);

	const fetchWeatherData = async (lat: number, lon: number): Promise<void> => {
		try {
			loading.value = true;
			error.value = undefined;

			const url = 'https://api.open-meteo.com/v1/forecast';
			const parameters = {
				current:
					'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,pressure_msl,is_day',
				daily:
					'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_max,relative_humidity_2m_min,wind_speed_10m_max,sunrise,sunset',
				forecast_days: 7,
				hourly:
					'temperature_2m,precipitation_probability,precipitation,weather_code,relative_humidity_2m,wind_speed_10m,is_day',
				latitude: [lat],
				longitude: [lon],
				timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			};

			const responses = await fetchWeatherApi(url, parameters);
			const response = responses[0];

			if (!response) {
				throw new Error('No weather data received');
			}

			const range = (start: number, stop: number, step: number): number[] =>
				Array.from({ length: (stop - start) / step }, (_, index) => start + index * step);

			const currentData = response.current();
			const dailyData = response.daily();
			const hourlyData = response.hourly();

			if (!currentData || !dailyData || !hourlyData) {
				throw new Error('Incomplete weather data received');
			}

			const processTime = (timeValue: number): Date => {
				return new Date(timeValue * 1000);
			};

			const currentWeatherData: CurrentWeather = {
				apparent_temperature: roundToOneDecimal(currentData.variables(2)?.value() || 0),
				cloud_cover: roundToOneDecimal(currentData.variables(6)?.value() || 0),
				is_day: Boolean(currentData.variables(10)?.value() || 0),
				precipitation: roundToOneDecimal(currentData.variables(3)?.value() || 0),
				pressure_msl: roundToOneDecimal(currentData.variables(9)?.value() || 0),
				rain: roundToOneDecimal(currentData.variables(4)?.value() || 0),
				relative_humidity_2m: roundToOneDecimal(currentData.variables(1)?.value() || 0),
				temperature_2m: roundToOneDecimal(currentData.variables(0)?.value() || 0),
				time: processTime(Number(currentData.time())),
				weather_code: currentData.variables(5)?.value() || 0,
				wind_direction_10m: roundToOneDecimal(currentData.variables(8)?.value() || 0),
				wind_speed_10m: roundToOneDecimal(currentData.variables(7)?.value() || 0),
			};

			const dailyTimes = range(Number(dailyData.time()), Number(dailyData.timeEnd()), dailyData.interval()).map((t) =>
				processTime(t),
			);

			const dailyForecastData: DailyForecast = {
				precipitation_sum: [...(dailyData.variables(3)?.valuesArray() || [])]
					.map(Number)
					.map((value) => roundToOneDecimal(value)),
				relative_humidity_2m_max: [...(dailyData.variables(4)?.valuesArray() || [])]
					.map(Number)
					.map((value) => roundToOneDecimal(value)),
				relative_humidity_2m_min: [...(dailyData.variables(5)?.valuesArray() || [])]
					.map(Number)
					.map((value) => roundToOneDecimal(value)),
				sunrise: [...(dailyData.variables(7)?.valuesArray() || [])]
					.map(Number)
					.map((timeValue) => processTime(timeValue)),
				sunset: [...(dailyData.variables(8)?.valuesArray() || [])]
					.map(Number)
					.map((timeValue) => processTime(timeValue)),
				temperature_2m_max: [...(dailyData.variables(1)?.valuesArray() || [])]
					.map(Number)
					.map((value) => roundToOneDecimal(value)),
				temperature_2m_min: [...(dailyData.variables(2)?.valuesArray() || [])]
					.map(Number)
					.map((value) => roundToOneDecimal(value)),
				time: dailyTimes,
				weather_code: [...(dailyData.variables(0)?.valuesArray() || [])].map(Number),
				wind_speed_10m_max: [...(dailyData.variables(6)?.valuesArray() || [])]
					.map(Number)
					.map((value) => roundToOneDecimal(value)),
			};

			const hourlyTimes = range(Number(hourlyData.time()), Number(hourlyData.timeEnd()), hourlyData.interval()).map(
				(t) => processTime(t),
			);

			const hourlyForecastData: HourlyForecast = {
				is_day: [...(hourlyData.variables(6)?.valuesArray() || [])].map(Number).map((value) => value === 1),
				precipitation: [...(hourlyData.variables(2)?.valuesArray() || [])]
					.map(Number)
					.map((value) => roundToOneDecimal(value)),
				precipitation_probability: [...(hourlyData.variables(1)?.valuesArray() || [])]
					.map(Number)
					.map((value) => roundToOneDecimal(value)),
				relative_humidity_2m: [...(hourlyData.variables(4)?.valuesArray() || [])]
					.map(Number)
					.map((value) => roundToOneDecimal(value)),
				temperature_2m: [...(hourlyData.variables(0)?.valuesArray() || [])]
					.map(Number)
					.map((value) => roundToOneDecimal(value)),
				time: hourlyTimes,
				weather_code: [...(hourlyData.variables(3)?.valuesArray() || [])].map(Number),
				wind_speed_10m: [...(hourlyData.variables(5)?.valuesArray() || [])]
					.map(Number)
					.map((value) => roundToOneDecimal(value)),
			};

			current.value = currentWeatherData;
			daily.value = dailyForecastData;
			hourly.value = hourlyForecastData;

			loading.value = false;
		} catch (error_) {
			console.error('Error fetching weather data:', error_);
			error.value = error_ instanceof Error ? error_.message : 'Failed to fetch weather data';
			loading.value = false;
		}
	};

	watch(
		location,
		(newLocation) => {
			fetchWeatherData(newLocation.latitude, newLocation.longitude);
		},
		{ immediate: true },
	);

	return {
		current,
		daily,
		error,
		hourly,
		loading,
	};
}
