<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { useFormat } from '@/composables/use-format';

defineProps<{
	isLoading: boolean;
	locationName: string;
	onRefreshLocation: () => void;
}>();

const { t } = useI18n();
const { currentDateTime } = useFormat();
</script>

<template>
	<div class="p-4 border-b border-primary-100 sm:(p-5) dark:(border-gray-700)">
		<h2 class="text-2xl text-gray-800 font-medium dark:(text-gray-100)">{{ locationName }}</h2>
		<p class="text-base text-gray-600 mt-1 dark:(text-gray-400)">{{ currentDateTime }}</p>
		<button
			v-if="!isLoading"
			@click="onRefreshLocation"
			class="text-base text-white font-medium mt-4 px-4 py-2 rounded-lg bg-primary-600 flex transition-colors items-center hover:(bg-primary-700)"
			:disabled="isLoading">
			<span class="i-custom-compass text-xl mr-2"></span>
			<span>{{ t('app.location.button') }}</span>
		</button>
	</div>
</template>
