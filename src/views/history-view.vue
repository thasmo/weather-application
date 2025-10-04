<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
	<main
		class="flex flex-col min-h-screen from-primary-50 to-primary-100 bg-gradient-to-b dark:(from-gray-900 to-gray-800)"
	>
		<header
			class="p-4 border-b border-primary-100 flex flex-row gap-4 items-start items-center justify-between sm:(p-5) dark:(border-gray-700)"
		>
			<div>
				<h1 class="text-3xl text-gray-800 font-bold md:(text-5xl) sm:(text-4xl) dark:(text-gray-100)">
					{{ t('app.history') }}
				</h1>
			</div>
		</header>

		<div class="p-4 pb-24 flex-1 overflow-auto sm:(p-6) md:(pb-6)">
			<div class="flex flex-col h-full items-center justify-center">
				<div class="i-ri-history-line text-8xl text-primary-300 mb-4 dark:(text-primary-700)" />
				<p class="text-xl text-gray-600 dark:(text-gray-300)">
					{{ t('app.noData') }}
				</p>
			</div>
		</div>
	</main>
</template>
