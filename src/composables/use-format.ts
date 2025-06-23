import { useDateFormat } from '@vueuse/core';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

type AirPressureUnit = 'hpa' | 'inHg';
interface FormatOptions {
	initialAirPressureUnit?: AirPressureUnit;
	initialPrecipitationUnit?: PrecipitationUnit;
	initialTemperatureUnit?: TemperatureUnit;
	initialTimeFormat?: TimeFormat;
	initialWindSpeedUnit?: WindSpeedUnit;
}
type PrecipitationUnit = 'inches' | 'mm';
type TemperatureUnit = 'celsius' | 'fahrenheit';
type TimeFormat = 'twelveHour' | 'twentyFourHour';

type WindSpeedUnit = 'kmh' | 'mph' | 'ms';

export const useFormat = (options: FormatOptions = {}) => {
	// State variables with default values
	const timeFormat = ref<TimeFormat>(options.initialTimeFormat || 'twentyFourHour');
	const temperatureUnit = ref<TemperatureUnit>(options.initialTemperatureUnit || 'celsius');
	const windSpeedUnit = ref<WindSpeedUnit>(options.initialWindSpeedUnit || 'kmh');
	const precipitationUnit = ref<PrecipitationUnit>(options.initialPrecipitationUnit || 'mm');
	const airPressureUnit = ref<AirPressureUnit>(options.initialAirPressureUnit || 'hpa');

	const { locale } = useI18n();

	/**
	 * Format temperature based on selected unit
	 */
	const formatTemperature = (temperature: number | undefined): string => {
		if (temperature === undefined) return 'N/A';

		// Convert to Fahrenheit if needed
		const temporaryValue = temperatureUnit.value === 'fahrenheit' ? (temperature * 9) / 5 + 32 : temperature;

		// Format with the appropriate unit symbol
		const unitSymbol = temperatureUnit.value === 'fahrenheit' ? '°F' : '°C';
		return `${Math.round(temporaryValue)}${unitSymbol}`;
	};

	/**
	 * Format wind speed based on selected unit
	 */
	const formatWindSpeed = (speed: number | undefined): string => {
		if (speed === undefined) return 'N/A';

		let convertedSpeed: number;
		let unitSymbol: string;

		// Convert from km/h to the selected unit
		switch (windSpeedUnit.value) {
			case 'mph': {
				// Convert km/h to mph (1 km/h = 0.621371 mph)
				convertedSpeed = speed * 0.621_371;
				unitSymbol = 'mph';
				break;
			}
			case 'ms': {
				// Convert km/h to m/s (1 km/h = 0.277778 m/s)
				convertedSpeed = speed * 0.277_778;
				unitSymbol = 'm/s';
				break;
			}
			default: {
				convertedSpeed = speed;
				unitSymbol = 'km/h';
				break;
			}
		}

		return `${Math.round(convertedSpeed * 10) / 10} ${unitSymbol}`;
	};

	/**
	 * Format precipitation based on selected unit
	 */
	const formatPrecipitation = (precipitation: number | undefined): string => {
		if (precipitation === undefined) return 'N/A';

		let convertedPrecipitation: number;
		let unitSymbol: string;

		// Convert from mm to the selected unit
		switch (precipitationUnit.value) {
			case 'inches': {
				// Convert mm to inches (1 mm = 0.0393701 inches)
				convertedPrecipitation = precipitation * 0.039_370_1;
				unitSymbol = 'inches';
				break;
			}
			default: {
				convertedPrecipitation = precipitation;
				unitSymbol = 'mm';
				break;
			}
		}

		return `${Math.round(convertedPrecipitation * 10) / 10} ${unitSymbol}`;
	};

	/**
	 * Format air pressure based on selected unit
	 */
	const formatAirPressure = (pressure: number | undefined): string => {
		if (pressure === undefined) return 'N/A';

		let convertedPressure: number;
		let unitSymbol: string;

		// Convert from hPa to the selected unit
		switch (airPressureUnit.value) {
			case 'inHg': {
				// Convert hPa to inHg (1 hPa = 0.0295301 inHg)
				convertedPressure = pressure * 0.029_530_1;
				unitSymbol = 'inHg';
				break;
			}
			default: {
				convertedPressure = pressure;
				unitSymbol = 'hPa';
				break;
			}
		}

		return `${Math.round(convertedPressure * 10) / 10} ${unitSymbol}`;
	};

	/**
	 * Format time based on selected format
	 */
	const formatTime = (date: Date): string => {
		if (timeFormat.value === 'twentyFourHour') {
			return useDateFormat(date, 'HH:mm', { locales: locale.value }).value;
		} else {
			// For 12-hour format
			const formatString = locale.value.startsWith('de') ? 'h A' : 'h A';
			return useDateFormat(date, formatString, { locales: locale.value }).value;
		}
	};

	/**
	 * Format weekday name
	 */
	const formatWeekday = (date: Date, format: 'long' | 'short' = 'short'): string => {
		const formatString = format === 'long' ? 'dddd' : 'ddd';
		return useDateFormat(date, formatString, { locales: locale.value }).value;
	};

	/**
	 * Get current date and time formatted
	 */
	const currentDateTime = computed(() => {
		const now = new Date();
		const dateFormatted = useDateFormat(now, 'dddd, D MMMM YYYY', { locales: locale.value }).value;
		return `${dateFormatted}, ${formatTime(now)}`;
	});

	return {
		airPressureUnit,
		currentDateTime,
		formatAirPressure,
		formatPrecipitation,
		// Formatting functions
		formatTemperature,

		formatTime,
		formatWeekday,
		formatWindSpeed,
		precipitationUnit,
		temperatureUnit,
		// Units state
		timeFormat,
		windSpeedUnit,
	};
};
