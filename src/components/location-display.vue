<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useFormat } from '@/composables/use-format';

defineProps<{
	hasStoredLocation: boolean;
	isLoading: boolean;
	locationName: string;
	onForgetLocation: () => void;
	onRefreshLocation: () => void;
}>();

const { t } = useI18n();
const { currentDateTime } = useFormat();
</script>

<template>
	<div class="p-4 border-b border-primary-100 sm:(p-5) dark:(border-gray-700)">
		<h2 class="text-2xl text-gray-800 font-medium dark:(text-gray-100)">
			{{ locationName }}
		</h2>
		<p class="text-base text-gray-600 mt-1 dark:(text-gray-400)">
			{{ currentDateTime }}
		</p>
		<button
			v-if="!isLoading && !hasStoredLocation"
			class="text-base text-white font-medium mt-4 px-4 py-2 rounded-lg bg-primary-600 flex gap-2 items-center hover:(bg-primary-700)"
			:disabled="isLoading"
			@click="onRefreshLocation"
		>
			<span>{{ t('app.location.use') }}</span>
			<span class="i-ri-map-pin2-line" />
		</button>

		<button
			v-if="!isLoading && hasStoredLocation"
			class="text-base text-white font-medium mt-4 px-4 py-2 rounded-lg bg-primary-600 flex gap-2 items-center hover:(bg-primary-700)"
			:disabled="isLoading"
			@click="onForgetLocation"
		>
			<span>{{ t('app.location.forget') }}</span>
			<span class="i-ri-delete-bin-line" />
		</button>

		<div v-if="isLoading" class="mt-4 flex items-center">
			<div class="i-ri-loader-4-line text-xl text-primary-600 mr-2 animate-spin" />
			<span class="text-gray-600 dark:(text-gray-400)">{{ t('app.location.loading') }}</span>
		</div>
	</div>
</template>
