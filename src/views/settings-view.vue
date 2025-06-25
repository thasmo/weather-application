<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import SettingsContent from '@/components/settings-content.vue';

const { t } = useI18n();
</script>

<template>
	<main
		class="bg-gradient-to-b flex flex-col min-h-screen from-primary-50 to-primary-100 dark:(from-gray-900 to-gray-800)">
		<header
			class="p-4 border-b border-primary-100 flex flex-row gap-4 items-start items-center justify-between sm:(p-5) dark:(border-gray-700)">
			<div>
				<h1 class="text-3xl text-gray-800 font-bold leading-tight md:(text-5xl) sm:(text-4xl) dark:(text-gray-100)">
					{{ t('app.settings.title') }}
				</h1>
			</div>
		</header>

		<div class="p-4 pb-24 flex-1 overflow-auto sm:(p-6) md:(pb-6)">
			<div class="flex flex-col gap-6">
				<div class="p-5 rounded-xl bg-white shadow-sm dark:(bg-gray-800)">
					<SettingsContent />
				</div>
			</div>
		</div>
	</main>
</template>
