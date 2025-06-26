import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

interface LocationData {
	latitude: number;
	longitude: number;
	name: string;
}

export const useLocationStore = defineStore(
	'location',
	() => {
		const location = ref<LocationData>();

		const saveLocation = (data: LocationData): void => {
			location.value = data;
		};

		const clearLocation = (): void => {
			location.value = undefined;
		};

		const hasLocation = computed(() => !!location.value);

		return {
			clearLocation,
			hasLocation,
			location,
			saveLocation,
		};
	},
	{
		persist: true,
	},
);
