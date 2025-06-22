<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';

// Apply base styles on mount
onMounted(() => {
	document.documentElement.classList.add('min-h-full');
	document.body.classList.add('min-h-screen', 'leading-normal', 'text-15px');
	document.body.classList.add('text-rendering-optimizeLegibility', 'antialiased');
});
</script>

<template>
	<RouterView />
</template>
