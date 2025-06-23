/**
 * Utility functions for weather data processing and calculations
 */

/**
 * Determines if it's currently daytime based on sunrise and sunset times
 */
export const isDaytimeFromWeatherData = (currentWeather: any): boolean => {
	if (!currentWeather?.current) {
		return false;
	}

	// Get current date and time
	const now = new Date();
	const currentDate = now.toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

	// Method 1: Check if we have is_day data in the hourly forecast for the current hour
	if (currentWeather.hourly?.is_day) {
		// Find the closest hourly data point to current time
		const currentHour = now.getHours();
		const hourlyTimes = currentWeather.hourly.time;

		for (const [index, hourTime] of hourlyTimes.entries()) {
			const hourDate = hourTime instanceof Date ? hourTime : new Date(hourTime);

			if (hourDate.getDate() === now.getDate() && hourDate.getHours() === currentHour) {
				// Found the current hour's data - use the is_day flag
				return currentWeather.hourly.is_day[index] === 1;
			}
		}
	}

	// Method 2: Compare with sunrise/sunset times if hourly data isn't available
	// Find today's sunrise and sunset times
	const todayIndex = currentWeather.daily.time.findIndex((date: Date | string) => {
		const dateString = date instanceof Date ? date.toISOString().split('T')[0] : String(date).split('T')[0];
		return dateString === currentDate;
	});

	if (todayIndex === -1) {
		// Fallback: assume daytime between 6 AM and 6 PM
		const currentHour = now.getHours();
		return currentHour >= 6 && currentHour < 18;
	}

	const sunrise = currentWeather.daily.sunrise[todayIndex];
	const sunset = currentWeather.daily.sunset[todayIndex];

	// Make sure sunrise and sunset are Date objects
	const sunriseDate = sunrise instanceof Date ? sunrise : new Date(sunrise);
	const sunsetDate = sunset instanceof Date ? sunset : new Date(sunset);

	// Check if current time is between sunrise and sunset
	return now >= sunriseDate && now < sunsetDate;
};

/**
 * Determines if a specific day is currently in daytime
 */
export const isDayForDailyForecast = (currentWeather: any, dayIndex: number, isDaytime: boolean): boolean => {
	if (!currentWeather?.daily) {
		return true; // Default to day if no data
	}

	// For today, use current time to determine day/night
	const now = new Date();
	const today = now.toISOString().split('T')[0];
	const forecastDay = currentWeather.daily.time[dayIndex].toISOString().split('T')[0];

	// If it's today, use current time to check if it's daytime
	if (forecastDay === today) {
		return isDaytime;
	}

	// For future days, use midday (12:00) as the reference time for the icon
	return true;
};

/**
 * Get hourly forecast for selected day
 */
export const getHourlyForecastForDay = (currentWeather: any, selectedDayIndex: number): any[] => {
	if (!currentWeather?.hourly) return [];

	const selectedDate = new Date(currentWeather.daily.time[selectedDayIndex]);
	const startOfDay = new Date(selectedDate);
	startOfDay.setHours(0, 0, 0, 0);
	const endOfDay = new Date(selectedDate);
	endOfDay.setHours(23, 59, 59, 999);

	// For simplicity, let's use the API's is_day flag directly
	// This is more reliable as it's calculated by the weather service
	return currentWeather.hourly.time
		.map((time: Date | string, index: number) => {
			const hourDate = time instanceof Date ? time : new Date(time);
			if (hourDate >= startOfDay && hourDate <= endOfDay) {
				return {
					airPressure: currentWeather.hourly.pressure_msl?.[index],
					humidity: currentWeather.hourly.relative_humidity_2m[index],
					isDay: currentWeather.hourly.is_day?.[index] === 1,
					precipitation: currentWeather.hourly.precipitation[index],
					precipitationProbability: currentWeather.hourly.precipitation_probability[index],
					temperature: currentWeather.hourly.temperature_2m[index],
					time: hourDate,
					weatherCode: currentWeather.hourly.weather_code[index],
					windSpeed: currentWeather.hourly.wind_speed_10m[index],
				};
			}
			return;
		})
		.filter(Boolean);
};
