import { fetchWeatherApi } from 'openmeteo';
import { ref } from 'vue';

interface CurrentWeather {
	apparent_temperature: number;
	cloud_cover: number;
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
	temperature_2m_max: number[];
	temperature_2m_min: number[];
	time: Date[];
	weather_code: number[];
	wind_speed_10m_max: number[];
}

interface HourlyForecast {
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

interface WeatherData {
	current: CurrentWeather;
	daily: DailyForecast;
	hourly: HourlyForecast;
}

/**
 * Gets the user's current geolocation
 */
const getUserLocation = (): Promise<GeolocationPosition> => {
	return new Promise((resolve, reject) => {
		if (!navigator.geolocation) {
			reject(new Error('Geolocation is not supported by your browser'));
			return;
		}

		navigator.geolocation.getCurrentPosition(resolve, reject, {
			enableHighAccuracy: true,
			maximumAge: 0,
			timeout: 5000,
		});
	});
};

/**
 * Rounds a number to one decimal place
 */
const roundToOneDecimal = (value: number): number => {
	return Math.round(value * 10) / 10;
};

export function useWeather() {
	// State variables
	const loading = ref(true);
	const loadingLocation = ref(false);
	const error = ref<string | undefined>(undefined);
	const currentWeather = ref<undefined | WeatherData>(undefined);
	const location = ref<LocationData>({
		latitude: 47.8095, // Salzburg, Austria coordinates
		longitude: 13.055,
		name: 'Salzburg, Austria',
	});

	// Use current location button handler
	const useCurrentLocation = async (): Promise<void> => {
		try {
			loadingLocation.value = true;
			const position = await getUserLocation();

			location.value = {
				latitude: roundToOneDecimal(position.coords.latitude),
				longitude: roundToOneDecimal(position.coords.longitude),
				name: 'Your Location',
			};

			// Try to get location name using reverse geocoding
			try {
				const response = await fetch(
					`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=10`,
				);
				const data = await response.json();
				if (data.address?.city || data.address?.town || data.address?.village) {
					location.value.name = data.address?.city || data.address?.town || data.address?.village;
				}
			} catch (error_) {
				console.error('Error getting location name:', error_);
			}

			await fetchWeatherData(position.coords.latitude, position.coords.longitude);
		} catch (error_) {
			console.error('Error getting user location:', error_);
			error.value = error_ instanceof Error ? error_.message : 'Failed to get your location';
		} finally {
			loadingLocation.value = false;
		}
	};

	// Fetch weather data
	const fetchWeatherData = async (lat: number, lon: number): Promise<void> => {
		try {
			loading.value = true;
			error.value = undefined;

			const url = 'https://api.open-meteo.com/v1/forecast';
			const parameters = {
				current:
					'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,pressure_msl',
				daily:
					'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_max,relative_humidity_2m_min,wind_speed_10m_max',
				forecast_days: 7,
				hourly:
					'temperature_2m,precipitation_probability,precipitation,weather_code,relative_humidity_2m,wind_speed_10m',
				latitude: [lat],
				longitude: [lon],
				timezone: 'auto',
			};

			const responses = await fetchWeatherApi(url, parameters);
			const response = responses[0];

			if (!response) {
				throw new Error('No weather data received');
			}

			// Helper function to create time ranges
			const range = (start: number, stop: number, step: number): number[] =>
				Array.from({ length: (stop - start) / step }, (_, index) => start + index * step);

			// Process the response
			const utcOffsetSeconds = response.utcOffsetSeconds() || 0;
			const current = response.current();
			const daily = response.daily();
			const hourly = response.hourly();

			// Check if required data is available
			if (!current || !daily || !hourly) {
				throw new Error('Incomplete weather data received');
			}

			// Helper to process time values
			const processTime = (timeValue: number): Date => {
				return new Date((timeValue + utcOffsetSeconds) * 1000);
			};

			// Get current weather data - using indices based on the parameters order
			const currentWeatherData: CurrentWeather = {
				apparent_temperature: roundToOneDecimal(current.variables(2)?.value() || 0),
				cloud_cover: roundToOneDecimal(current.variables(6)?.value() || 0),
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

			// Process daily forecast - using the time range approach from the documentation
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

			// Process hourly forecast - using the time range approach from the documentation
			const hourlyTimes = range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map((t) =>
				processTime(t),
			);

			const hourlyForecast: HourlyForecast = {
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

			// Update the reactive state
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

	return {
		currentWeather,
		error,
		fetchWeatherData,
		loading,
		loadingLocation,
		location,
		useCurrentLocation,
	};
}
