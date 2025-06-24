<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { useFormat } from '@/composables/use-format';
import { weatherCodeToIcon } from '@/utils/weather-icon-mapper';

const properties = defineProps<{
	details: {
		icon: string;
		label: string;
		unit?: string;
		value: number | string;
	}[];
	isActive?: boolean;
	isDay?: boolean;
	minTemperature?: number;
	temperature: number;
	title: string;
	weatherCode: number;
}>();

const { t } = useI18n();
const { formatTemperature } = useFormat();

const icon = computed((): string | undefined => {
	return weatherCodeToIcon(properties.weatherCode, properties.isDay);
});

const description = computed((): string => {
	return t(`weather.codes.${properties.weatherCode}`);
});
</script>

<template>
	<div
		class="p-3 rounded-lg flex flex-col gap-2 sm:(p-4 gap-3)"
		:class="{
			'bg-primary-50 dark:(bg-primary-900/20)': isActive,
			'hover:(bg-gray-50) dark:hover:(bg-gray-700/50)': !isActive,
		}">
		<div class="text-base text-gray-800 font-medium sm:(text-lg) dark:(text-gray-200)">
			{{ title }}
		</div>

		<div class="flex items-center justify-between">
			<div class="flex flex-col">
				<div v-if="icon" :class="icon" class="text-4xl text-primary-500 sm:(text-5xl) dark:(text-primary-400)"></div>
				<span class="text-xs text-gray-600 sm:(text-sm) dark:(text-gray-400)">{{ description }}</span>
			</div>

			<div class="text-align-end flex flex-col">
				<span class="text-lg text-gray-800 font-medium font-serif sm:(text-xl) dark:(text-gray-200)">
					{{ formatTemperature(temperature) }}
				</span>

				<span
					v-if="minTemperature !== undefined"
					class="text-sm text-gray-500 font-serif sm:(text-base) dark:(text-gray-400)">
					{{ formatTemperature(minTemperature) }}
				</span>
			</div>
		</div>

		<div v-if="details && details.length > 0" class="text-xs space-y-1 sm:(text-sm space-y-2)">
			<div v-for="(detail, index) in details" :key="index" class="flex items-center justify-between">
				<div class="flex items-center">
					<span class="text-gray-600 dark:(text-gray-400)">{{ detail.label }}</span>
				</div>

				<span class="text-gray-800 font-medium dark:(text-gray-300)"> {{ detail.value }}{{ detail.unit || '' }} </span>
			</div>
		</div>
	</div>
</template>
