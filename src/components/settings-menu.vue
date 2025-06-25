<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import SettingsContent from '@/components/settings-content.vue';
import SettingsPopover from '@/components/settings-popover.vue';

const { t } = useI18n();
const isOpen = ref(false);
</script>

<template>
	<div>
		<SettingsPopover
			:is-open="isOpen"
			placement="bottom-start"
			:offset="4"
			:show-arrow="true"
			@open-change="(details) => (isOpen = details.open)">
			<template #trigger>
				<button
					class="text-sm text-gray-700 font-medium px-3.5 py-2 border rounded-lg bg-white flex transition-all items-center dark:(text-gray-200 border-gray-600 bg-gray-800 hover:border-primary-500) focus:(outline-none border-primary-500 ring-3 ring-primary-500/20) hover:(border-primary-400)"
					:aria-label="t('app.settings.button')">
					<span class="i-ri-settings-3-line mr-2 h-5 w-5"></span>
					<span>{{ t('app.settings.button') }}</span>
				</button>
			</template>

			<template #title>
				{{ t('app.settings.title') }}
			</template>

			<SettingsContent />
		</SettingsPopover>
	</div>
</template>
