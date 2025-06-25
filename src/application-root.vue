<script setup lang="ts">
import { RouterView } from 'vue-router';

import MobileNavigation from '@/components/mobile-navigation.vue';
import { useLocationService } from '@/composables/use-geolocation';
import { useThemeService } from '@/composables/use-theme';
import { useWeatherStore } from '@/stores/weather-store';

const { fetch } = useWeatherStore();
const { location } = useLocationService();

// Initialize theme at application root level
useThemeService();

fetch(location.value);
</script>

<template>
	<RouterView />
	<MobileNavigation />
</template>
