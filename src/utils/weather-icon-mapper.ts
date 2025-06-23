/**
 * Maps weather codes to icon classes based on day/night conditions
 * Using WMO Weather interpretation codes (WW)
 * https://open-meteo.com/en/docs
 */

export const weatherCodeToIcon = (code: number, isDay: boolean): string => {
	// Clear sky
	if (code === 0) return isDay ? 'i-custom-clear-day' : 'i-custom-clear-night';

	// Mainly clear, partly cloudy
	if (code === 1 || code === 2) return isDay ? 'i-custom-partly-cloudy-day' : 'i-custom-partly-cloudy-night';

	// Overcast
	if (code === 3) return isDay ? 'i-custom-overcast-day' : 'i-custom-overcast-night';

	// Fog
	if (code >= 45 && code <= 48) return isDay ? 'i-custom-fog-day' : 'i-custom-fog-night';

	// Drizzle: Light, moderate, dense
	if (code >= 51 && code <= 55) {
		if (code === 51) return isDay ? 'i-custom-partly-cloudy-day-drizzle' : 'i-custom-partly-cloudy-night-drizzle';
		return 'i-custom-drizzle';
	}

	// Freezing Drizzle: Light, dense
	if (code >= 56 && code <= 57) return 'i-custom-sleet';

	// Rain: Slight, moderate, heavy
	if (code >= 61 && code <= 65) {
		if (code === 61) return isDay ? 'i-custom-partly-cloudy-day-rain' : 'i-custom-partly-cloudy-night-rain';
		return 'i-custom-rain';
	}

	// Freezing Rain: Light, heavy
	if (code >= 66 && code <= 67) return 'i-custom-sleet';

	// Snow: Slight, moderate, heavy
	if (code >= 71 && code <= 75) {
		if (code === 71) return isDay ? 'i-custom-partly-cloudy-day-snow' : 'i-custom-partly-cloudy-night-snow';
		return 'i-custom-snow';
	}

	// Snow grains
	if (code === 77) return 'i-custom-snow';

	// Rain showers: Slight, moderate, violent
	if (code >= 80 && code <= 82) {
		if (code === 80) return isDay ? 'i-custom-partly-cloudy-day-rain' : 'i-custom-partly-cloudy-night-rain';
		return 'i-custom-rain';
	}

	// Snow showers: Slight, heavy
	if (code >= 85 && code <= 86) {
		if (code === 85) return isDay ? 'i-custom-partly-cloudy-day-snow' : 'i-custom-partly-cloudy-night-snow';
		return 'i-custom-snow';
	}

	// Thunderstorm: Slight/moderate, with hail
	if (code >= 95 && code <= 99) {
		if (code === 95) return isDay ? 'i-custom-thunderstorms-day' : 'i-custom-thunderstorms-night';
		if (code === 96 || code === 99) return isDay ? 'i-custom-thunderstorms-day' : 'i-custom-thunderstorms-night';
		return 'i-custom-thunderstorms';
	}

	return 'i-custom-not-available';
};
