<script setup lang="ts">
import { RouterView } from 'vue-router';

import MobileNavigation from '@/components/mobile-navigation.vue';
import { useLocationService } from '@/composables/use-geolocation';
import { useResponsive } from '@/composables/use-responsive';
import { useResponsiveRouting } from '@/composables/use-responsive-routing';
import { useThemeService } from '@/composables/use-theme';
import { useWeatherStore } from '@/stores/weather-store';

const { isMobile } = useResponsive();
const weatherStore = useWeatherStore();
const { location } = useLocationService();

useThemeService();

useResponsiveRouting({
	route: 'home',
});

weatherStore.fetch(location.value);
</script>

<template>
	<RouterView v-if="weatherStore.ready" />
	<MobileNavigation v-if="isMobile" />
</template>
