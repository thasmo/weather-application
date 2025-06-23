type WeatherIconMap = Record<number, string>;

const dayIcons: WeatherIconMap = {
	0: 'i-custom-clear-day', // Clear sky
	1: 'i-custom-partly-cloudy-day', // Mainly clear
	2: 'i-custom-partly-cloudy-day', // Partly cloudy
	3: 'i-custom-overcast-day', // Overcast
	45: 'i-custom-fog-day', // Fog
	48: 'i-custom-fog-day', // Depositing rime fog
	51: 'i-custom-partly-cloudy-day-drizzle', // Drizzle: Light
	53: 'i-custom-drizzle', // Drizzle: Moderate
	55: 'i-custom-drizzle', // Drizzle: Dense
	56: 'i-custom-sleet', // Freezing Drizzle: Light
	57: 'i-custom-sleet', // Freezing Drizzle: Dense
	61: 'i-custom-partly-cloudy-day-rain', // Rain: Slight
	63: 'i-custom-rain', // Rain: Moderate
	65: 'i-custom-rain', // Rain: Heavy
	66: 'i-custom-sleet', // Freezing Rain: Light
	67: 'i-custom-sleet', // Freezing Rain: Heavy
	71: 'i-custom-partly-cloudy-day-snow', // Snow fall: Slight
	73: 'i-custom-snow', // Snow fall: Moderate
	75: 'i-custom-snow', // Snow fall: Heavy
	77: 'i-custom-snow', // Snow grains
	80: 'i-custom-partly-cloudy-day-rain', // Rain showers: Slight
	81: 'i-custom-rain', // Rain showers: Moderate
	82: 'i-custom-rain', // Rain showers: Violent
	85: 'i-custom-partly-cloudy-day-snow', // Snow showers: Slight
	86: 'i-custom-snow', // Snow showers: Heavy
	95: 'i-custom-thunderstorms-day', // Thunderstorm: Slight or moderate
	96: 'i-custom-thunderstorms-day', // Thunderstorm with slight hail
	99: 'i-custom-thunderstorms-day', // Thunderstorm with heavy hail
};

const nightIcons: WeatherIconMap = {
	0: 'i-custom-clear-night', // Clear sky
	1: 'i-custom-partly-cloudy-night', // Mainly clear
	2: 'i-custom-partly-cloudy-night', // Partly cloudy
	3: 'i-custom-overcast-night', // Overcast
	45: 'i-custom-fog-night', // Fog
	48: 'i-custom-fog-night', // Depositing rime fog
	51: 'i-custom-partly-cloudy-night-drizzle', // Drizzle: Light
	53: 'i-custom-drizzle', // Drizzle: Moderate
	55: 'i-custom-drizzle', // Drizzle: Dense
	56: 'i-custom-sleet', // Freezing Drizzle: Light
	57: 'i-custom-sleet', // Freezing Drizzle: Dense
	61: 'i-custom-partly-cloudy-night-rain', // Rain: Slight
	63: 'i-custom-rain', // Rain: Moderate
	65: 'i-custom-rain', // Rain: Heavy
	66: 'i-custom-sleet', // Freezing Rain: Light
	67: 'i-custom-sleet', // Freezing Rain: Heavy
	71: 'i-custom-partly-cloudy-night-snow', // Snow fall: Slight
	73: 'i-custom-snow', // Snow fall: Moderate
	75: 'i-custom-snow', // Snow fall: Heavy
	77: 'i-custom-snow', // Snow grains
	80: 'i-custom-partly-cloudy-night-rain', // Rain showers: Slight
	81: 'i-custom-rain', // Rain showers: Moderate
	82: 'i-custom-rain', // Rain showers: Violent
	85: 'i-custom-partly-cloudy-night-snow', // Snow showers: Slight
	86: 'i-custom-snow', // Snow showers: Heavy
	95: 'i-custom-thunderstorms-night', // Thunderstorm: Slight or moderate
	96: 'i-custom-thunderstorms-night', // Thunderstorm with slight hail
	99: 'i-custom-thunderstorms-night', // Thunderstorm with heavy hail
};

export const weatherCodeToIcon = (code: number, isDay: boolean): string => {
	const iconMap = isDay ? dayIcons : nightIcons;
	return iconMap[code] || 'i-custom-not-available';
};
