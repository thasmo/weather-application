<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const isMobile = useMediaQuery('(max-width: 767px)');
const route = useRoute();
const { t } = useI18n();

const currentRoute = computed((): string => route.name as string);
</script>

<template>
	<nav
		v-if="isMobile"
		class="px-2 py-2 border-t border-gray-200 bg-white bottom-0 left-0 right-0 fixed dark:(border-gray-700 bg-gray-800)">
		<div class="flex gap-2 items-center justify-between">
			<router-link
				to="/"
				class="px-4 py-2 rounded-lg flex grow-1 flex-col w-0 transition-colors items-center"
				:class="{
					'text-primary-600 bg-primary-50 dark:(text-primary-400 bg-primary-900/20)': currentRoute === 'home',
					'text-gray-600 hover:(bg-gray-100) dark:(text-gray-300 hover:bg-gray-700)': currentRoute !== 'home',
				}">
				<div class="i-ri-cloud-line text-xl mb-1"></div>
				<span class="text-xs">{{ t('weather.current.title') }}</span>
			</router-link>

			<router-link
				to="/forecast"
				class="px-4 py-2 rounded-lg flex grow-1 flex-col w-0 transition-colors items-center"
				:class="{
					'text-primary-600 bg-primary-50 dark:(text-primary-400 bg-primary-900/20)': currentRoute === 'forecast',
					'text-gray-600 hover:(bg-gray-100) dark:(text-gray-300 hover:bg-gray-700)': currentRoute !== 'forecast',
				}">
				<div class="i-ri-calendar-line text-xl mb-1"></div>
				<span class="text-xs">{{ t('app.forecast') }}</span>
			</router-link>

			<router-link
				to="/history"
				class="px-4 py-2 rounded-lg flex grow-1 flex-col w-0 transition-colors items-center"
				:class="{
					'text-primary-600 bg-primary-50 dark:(text-primary-400 bg-primary-900/20)': currentRoute === 'history',
					'text-gray-600 hover:(bg-gray-100) dark:(text-gray-300 hover:bg-gray-700)': currentRoute !== 'history',
				}">
				<div class="i-ri-history-line text-xl mb-1"></div>
				<span class="text-xs">{{ t('app.history') }}</span>
			</router-link>

			<router-link
				to="/settings"
				class="px-4 py-2 rounded-lg flex grow-1 flex-col w-0 transition-colors items-center"
				:class="{
					'text-primary-600 bg-primary-50 dark:(text-primary-400 bg-primary-900/20)': currentRoute === 'settings',
					'text-gray-600 hover:(bg-gray-100) dark:(text-gray-300 hover:bg-gray-700)': currentRoute !== 'settings',
				}">
				<div class="i-ri-settings-3-line text-xl mb-1"></div>
				<span class="text-xs">{{ t('app.settings.title') }}</span>
			</router-link>
		</div>
	</nav>
</template>
