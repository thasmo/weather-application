import { useGeolocation } from '@vueuse/core';
import { ref } from 'vue';

interface LocationData {
	latitude: number;
	longitude: number;
	name: string;
}

const roundToOneDecimal = (value: number): number => {
	return Math.round(value * 10) / 10;
};

export function useLocationService() {
	// State variables
	const location = ref<LocationData>({
		latitude: 47.8095, // Salzburg, Austria coordinates
		longitude: 13.055,
		name: 'Salzburg, Austria',
	});
	const loadingLocation = ref(false);
	const error = ref<string | undefined>(undefined);

	// Initialize VueUse geolocation with immediate: false to prevent automatic location request
	const { coords, isSupported, locatedAt, resume } = useGeolocation({
		immediate: false,
	});

	/**
	 * Gets the user's current geolocation using VueUse
	 */
	const useCurrentLocation = async (): Promise<LocationData> => {
		try {
			loadingLocation.value = true;
			error.value = undefined;

			if (!isSupported.value) {
				throw new Error('Geolocation is not supported by your browser');
			}

			// Start the geolocation request
			resume();

			// Wait for geolocation to be available (max 5 seconds)
			await new Promise<void>((resolve, reject) => {
				const timeout = setTimeout(() => {
					reject(new Error('Geolocation request timed out'));
				}, 5000);

				const checkLocation = setInterval(() => {
					if (locatedAt.value) {
						clearTimeout(timeout);
						clearInterval(checkLocation);
						resolve();
					}
				}, 100);
			});

			// Update location with rounded coordinates
			location.value = {
				latitude: roundToOneDecimal(coords.value.latitude),
				longitude: roundToOneDecimal(coords.value.longitude),
				name: 'My Location',
			};

			return location.value;
		} catch (error_) {
			console.error('Error getting user location:', error_);
			error.value = error_ instanceof Error ? error_.message : 'Failed to get your location';
			throw error_;
		} finally {
			loadingLocation.value = false;
		}
	};

	return {
		error,
		loadingLocation,
		location,
		useCurrentLocation,
	};
}
