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

interface DailyForecast {
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

interface HourlyForecast {
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

interface WeatherData {
	current: CurrentWeather;
	daily: DailyForecast;
	hourly: HourlyForecast;
}

const roundToOneDecimal = (value: number): number => {
	return Math.round(value * 10) / 10;
};

export function useWeather(options: UseWeatherOptions) {
	const { location } = options;

	const loading = ref(true);
	const error = ref<string | undefined>(undefined);
	const currentWeather = ref<undefined | WeatherData>(undefined);

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
				timezone: 'auto',
			};

			const responses = await fetchWeatherApi(url, parameters);
			const response = responses[0];

			if (!response) {
				throw new Error('No weather data received');
			}

			const range = (start: number, stop: number, step: number): number[] =>
				Array.from({ length: (stop - start) / step }, (_, index) => start + index * step);

			const utcOffsetSeconds = response.utcOffsetSeconds() || 0;
			const current = response.current();
			const daily = response.daily();
			const hourly = response.hourly();

			if (!current || !daily || !hourly) {
				throw new Error('Incomplete weather data received');
			}

			const processTime = (timeValue: number): Date => {
				return new Date((timeValue + utcOffsetSeconds) * 1000);
			};

			const currentWeatherData: CurrentWeather = {
				apparent_temperature: roundToOneDecimal(current.variables(2)?.value() || 0),
				cloud_cover: roundToOneDecimal(current.variables(6)?.value() || 0),
				is_day: Boolean(current.variables(10)?.value() || 0),
				precipitation: roundToOneDecimal(current.variables(3)?.value() || 0),
				pressure_msl: roundToOneDecimal(current.variables(9)?.value() || 0),
				rain: roundToOneDecimal(current.variables(4)?.value() || 0),
				relative_humidity_2m: roundToOneDecimal(current.variables(1)?.value() || 0),
				temperature_2m: roundToOneDecimal(current.variables(0)?.value() || 0),
				time: processTime(Number(current.time())),
				weather_code: current.variables(5)?.value() || 0,
				wind_direction_10m: roundToOneDecimal(current.variables(8)?.value() || 0),
				wind_speed_10m: roundToOneDecimal(current.variables(7)?.value() || 0),
			};

			const dailyTimes = range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map((t) =>
				processTime(t),
			);

			const dailyForecast: DailyForecast = {
				precipitation_sum: [...(daily.variables(3)?.valuesArray() || [])]
					.map(Number)
					.map((value) => roundToOneDecimal(value)),
				relative_humidity_2m_max: [...(daily.variables(4)?.valuesArray() || [])]
					.map(Number)
					.map((value) => roundToOneDecimal(value)),
				relative_humidity_2m_min: [...(daily.variables(5)?.valuesArray() || [])]
					.map(Number)
					.map((value) => roundToOneDecimal(value)),
				sunrise: [...(daily.variables(7)?.valuesArray() || [])].map(Number).map((timeValue) => processTime(timeValue)),
				sunset: [...(daily.variables(8)?.valuesArray() || [])].map(Number).map((timeValue) => processTime(timeValue)),
				temperature_2m_max: [...(daily.variables(1)?.valuesArray() || [])]
					.map(Number)
					.map((value) => roundToOneDecimal(value)),
				temperature_2m_min: [...(daily.variables(2)?.valuesArray() || [])]
					.map(Number)
					.map((value) => roundToOneDecimal(value)),
				time: dailyTimes,
				weather_code: [...(daily.variables(0)?.valuesArray() || [])].map(Number),
				wind_speed_10m_max: [...(daily.variables(6)?.valuesArray() || [])]
					.map(Number)
					.map((value) => roundToOneDecimal(value)),
			};

			const hourlyTimes = range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map((t) =>
				processTime(t),
			);

			const hourlyForecast: HourlyForecast = {
				is_day: [...(hourly.variables(6)?.valuesArray() || [])].map(Number).map((value) => value === 1),
				precipitation: [...(hourly.variables(2)?.valuesArray() || [])]
					.map(Number)
					.map((value) => roundToOneDecimal(value)),
				precipitation_probability: [...(hourly.variables(1)?.valuesArray() || [])]
					.map(Number)
					.map((value) => roundToOneDecimal(value)),
				relative_humidity_2m: [...(hourly.variables(4)?.valuesArray() || [])]
					.map(Number)
					.map((value) => roundToOneDecimal(value)),
				temperature_2m: [...(hourly.variables(0)?.valuesArray() || [])]
					.map(Number)
					.map((value) => roundToOneDecimal(value)),
				time: hourlyTimes,
				weather_code: [...(hourly.variables(3)?.valuesArray() || [])].map(Number),
				wind_speed_10m: [...(hourly.variables(5)?.valuesArray() || [])]
					.map(Number)
					.map((value) => roundToOneDecimal(value)),
			};

			currentWeather.value = {
				current: currentWeatherData,
				daily: dailyForecast,
				hourly: hourlyForecast,
			};

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
		currentWeather,
		error,
		fetchWeatherData,
		loading,
	};
}
