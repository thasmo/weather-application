<script setup lang="ts">
defineProps<{
	title?: string;
}>();
</script>

<template>
	<div class="rounded-xl bg-white overflow-hidden dark:(bg-gray-800)">
		<div v-if="title" class="p-3 bg-primary-50 flex items-center justify-between sm:(p-5) dark:(bg-primary-900/20)">
			<h2 class="text-xl text-gray-800 font-medium sm:(text-2xl) dark:(text-gray-100)">
				{{ title }}
			</h2>
			<slot name="header-actions" />
		</div>

		<div class="p-3 overflow-auto sm:(p-5)">
			<slot />
		</div>
	</div>
</template>
