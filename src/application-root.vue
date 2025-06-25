<script setup lang="ts">
import { RouterView } from 'vue-router';

import MobileNavigation from '@/components/mobile-navigation.vue';
import { useLocationService } from '@/composables/use-geolocation';
import { useResponsiveRouting } from '@/composables/use-responsive-routing';
import { useThemeService } from '@/composables/use-theme';
import { useWeatherStore } from '@/stores/weather-store';

const { fetch } = useWeatherStore();
const { location } = useLocationService();

useThemeService();

useResponsiveRouting({
	route: 'home',
});

fetch(location.value);
</script>

<template>
	<RouterView />
	<MobileNavigation />
</template>
