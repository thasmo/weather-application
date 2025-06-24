import { useDateFormat } from '@vueuse/core';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { useSettingsStore } from '@/stores/settings-store';

export const useFormat = () => {
	const settingsStore = useSettingsStore();
	const { locale } = useI18n();

	const formatTemperature = (temperature: number | undefined): string => {
		if (temperature === undefined) return 'N/A';

		const temporaryValue = settingsStore.temperatureUnit === 'fahrenheit' ? (temperature * 9) / 5 + 32 : temperature;

		const unitSymbol = settingsStore.temperatureUnit === 'fahrenheit' ? '°F' : '°C';
		return `${Math.round(temporaryValue)}${unitSymbol}`;
	};

	const formatWindSpeed = (speed: number | undefined): string => {
		if (speed === undefined) return 'N/A';

		let convertedSpeed: number;
		let unitSymbol: string;

		switch (settingsStore.windSpeedUnit) {
			case 'mph': {
				convertedSpeed = speed * 0.621_371;
				unitSymbol = 'mph';
				break;
			}
			case 'ms': {
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

	const formatPrecipitation = (precipitation: number | undefined): string => {
		if (precipitation === undefined) return 'N/A';

		let convertedPrecipitation: number;
		let unitSymbol: string;

		switch (settingsStore.precipitationUnit) {
			case 'inches': {
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

	const formatAirPressure = (pressure: number | undefined): string => {
		if (pressure === undefined) return 'N/A';

		let convertedPressure: number;
		let unitSymbol: string;

		switch (settingsStore.airPressureUnit) {
			case 'inHg': {
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

	const formatTime = (date: Date): string => {
		if (settingsStore.timeFormat === 'twentyFourHour') {
			return useDateFormat(date, 'HH:mm', { locales: locale.value }).value;
		} else {
			const formatString = locale.value.startsWith('de') ? 'h A' : 'h A';
			return useDateFormat(date, formatString, { locales: locale.value }).value;
		}
	};

	const formatWeekday = (date: Date, format: 'long' | 'short' = 'short'): string => {
		const formatString = format === 'long' ? 'dddd' : 'ddd';
		return useDateFormat(date, formatString, { locales: locale.value }).value;
	};

	const currentDateTime = computed(() => {
		const now = new Date();
		const dateFormatted = useDateFormat(now, 'dddd, D MMMM YYYY', { locales: locale.value }).value;
		return `${dateFormatted}, ${formatTime(now)}`;
	});

	return {
		currentDateTime,
		formatAirPressure,
		formatPrecipitation,
		formatTemperature,
		formatTime,
		formatWeekday,
		formatWindSpeed,
	};
};
