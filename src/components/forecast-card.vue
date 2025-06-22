<script setup lang="ts">
defineProps<{
	title?: string;
}>();
</script>

<template>
	<div class="rounded-xl bg-white overflow-hidden dark:bg-gray-800">
		<div v-if="title" class="p-5 bg-primary-50 flex items-center justify-between dark:bg-primary-900/20">
			<h2 class="text-2xl text-gray-800 font-medium dark:text-gray-100">{{ title }}</h2>
			<slot name="header-actions"></slot>
		</div>

		<div class="p-5 overflow-auto">
			<slot></slot>
		</div>
	</div>
</template>
