import { defineStore } from 'pinia';
import { ref } from 'vue';

type AirPressureUnit = 'hpa' | 'inHg';
type PrecipitationUnit = 'inches' | 'mm';
type TemperatureUnit = 'celsius' | 'fahrenheit';
type ThemeMode = 'dark' | 'light' | 'system';
type TimeFormat = 'twelveHour' | 'twentyFourHour';
type WindSpeedUnit = 'kmh' | 'mph' | 'ms';

export const useSettingsStore = defineStore(
	'settings',
	() => {
		const timeFormat = ref<TimeFormat>('twentyFourHour');
		const temperatureUnit = ref<TemperatureUnit>('celsius');
		const windSpeedUnit = ref<WindSpeedUnit>('kmh');
		const precipitationUnit = ref<PrecipitationUnit>('mm');
		const airPressureUnit = ref<AirPressureUnit>('hpa');
		const theme = ref<ThemeMode>('system');
		const locale = ref<string>('en');

		const updateTimeFormat = (value: TimeFormat): void => {
			timeFormat.value = value;
		};

		const updateTemperatureUnit = (value: TemperatureUnit): void => {
			temperatureUnit.value = value;
		};

		const updateWindSpeedUnit = (value: WindSpeedUnit): void => {
			windSpeedUnit.value = value;
		};

		const updatePrecipitationUnit = (value: PrecipitationUnit): void => {
			precipitationUnit.value = value;
		};

		const updateAirPressureUnit = (value: AirPressureUnit): void => {
			airPressureUnit.value = value;
		};

		const updateTheme = (value: ThemeMode): void => {
			theme.value = value;
		};

		const updateLocale = (value: string): void => {
			locale.value = value;
		};

		return {
			airPressureUnit,
			locale,
			precipitationUnit,
			temperatureUnit,
			theme,
			timeFormat,
			updateAirPressureUnit,
			updateLocale,
			updatePrecipitationUnit,
			updateTemperatureUnit,
			updateTheme,
			updateTimeFormat,
			updateWindSpeedUnit,
			windSpeedUnit,
		};
	},
	{
		persist: true,
	},
);
