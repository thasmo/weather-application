<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import SettingsContent from '@/components/settings-content.vue';
import SettingsDrawer from '@/components/settings-drawer.vue';
import SettingsPopover from '@/components/settings-popover.vue';

const { t } = useI18n();
const isOpen = ref(false);
const isMobile = useMediaQuery('(max-width: 767px)');
const isSelectInteracting = ref(false);

const toggleSettings = (): void => {
	isOpen.value = !isOpen.value;
};

const closeSettings = (): void => {
	isOpen.value = false;
};
</script>

<template>
	<div>
		<SettingsDrawer
			v-if="isMobile"
			:is-open="isOpen"
			position="bottom"
			size="medium"
			:disable-close="isSelectInteracting"
			@close="closeSettings">
			<template #header>
				<div class="flex items-center justify-between">
					<h2 class="text-xl font-bold">{{ t('app.settings.title') }}</h2>
					<button
						class="p-1 rounded-full transition-colors hover:(bg-gray-200) dark:hover:(bg-gray-700)"
						@click="closeSettings">
						<div class="i-ri-close-line h-5 w-5"></div>
					</button>
				</div>
			</template>

			<div class="py-4">
				<div>
					<h3 class="text-base text-gray-700 font-medium mb-2 dark:(text-gray-300)">
						{{ t('app.settings.title') }}
					</h3>
				</div>
				<SettingsContent />
			</div>
		</SettingsDrawer>

		<button
			v-if="isMobile"
			@click="toggleSettings"
			class="text-sm text-gray-700 font-medium px-3.5 py-2 border rounded-lg bg-white flex transition-all items-center dark:(text-gray-200 border-gray-600 bg-gray-800 hover:border-primary-500) focus:(outline-none border-primary-500 ring-3 ring-primary-500/20) hover:(border-primary-400)"
			:aria-label="t('app.settings.button')">
			<div class="i-ri-settings-3-line mr-2 h-5 w-5"></div>
			<span>{{ t('app.settings.button') }}</span>
		</button>

		<SettingsPopover
			v-if="!isMobile"
			:is-open="isOpen"
			placement="bottom-start"
			:offset="4"
			:show-arrow="true"
			@open-change="(details) => (isOpen = details.open)">
			<template #trigger>
				<button
					class="text-sm text-gray-700 font-medium px-3.5 py-2 border rounded-lg bg-white flex transition-all items-center dark:(text-gray-200 border-gray-600 bg-gray-800 hover:border-primary-500) focus:(outline-none border-primary-500 ring-3 ring-primary-500/20) hover:(border-primary-400)"
					:aria-label="t('app.settings.button')">
					<div class="i-ri-settings-3-line mr-2 h-5 w-5"></div>
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
