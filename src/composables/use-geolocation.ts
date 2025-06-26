import { useGeolocation } from '@vueuse/core';
import { ref } from 'vue';

interface LocationData {
	latitude: number;
	longitude: number;
	name: string;
}

interface LocationResponse {
	address: {
		city: string;
		country: string;
	};
}

const getLocationName = async (latitude: number, longitude: number): Promise<string | undefined> => {
	try {
		const response = await fetch(
			`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
			{
				headers: {
					'User-Agent': 'github.com/thasmo/weather-application',
				},
			},
		);

		if (!response.ok) {
			throw new Error('Failed to fetch location data');
		}

		const data = (await response.json()) as LocationResponse;

		return `${data.address.city}, ${data.address.country}`;
	} catch (error) {
		console.error('Error fetching location name:', error);
		return undefined;
	}
};

export function useLocationService() {
	const location = ref<LocationData>({
		latitude: 41.891_93,
		longitude: 12.511_33,
		name: 'Rome, Italy',
	});

	const loading = ref(false);
	const error = ref<string | undefined>(undefined);

	const { coords, isSupported, locatedAt, resume } = useGeolocation({
		immediate: false,
	});

	const useCurrentLocation = async (): Promise<LocationData> => {
		try {
			loading.value = true;
			error.value = undefined;

			if (!isSupported.value) {
				throw new Error('Geolocation is not supported by your browser');
			}

			resume();

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

			const name = await getLocationName(coords.value.latitude, coords.value.longitude);

			location.value = {
				latitude: coords.value.latitude,
				longitude: coords.value.longitude,
				name: name || 'My Location',
			};

			return location.value;
		} catch (error_) {
			console.error('Error getting user location:', error_);
			error.value = error_ instanceof Error ? error_.message : 'Failed to get your location';
			throw error_;
		} finally {
			loading.value = false;
		}
	};

	return {
		error,
		loading,
		location,
		useCurrentLocation,
	};
}
