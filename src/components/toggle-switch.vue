<script setup lang="ts">
import { Switch } from '@ark-ui/vue/switch';
import { computed } from 'vue';

const properties = withDefaults(
	defineProps<{
		ariaLabel?: string;
		disabled?: boolean;
		id?: string;
		label?: string;
		modelValue: boolean;
		name?: string;
	}>(),
	{
		disabled: false,
	},
);

const emit = defineEmits<{
	(event: 'update:modelValue', value: boolean): void;
}>();

const checked = computed({
	get: () => properties.modelValue,
	set: (value: boolean) => emit('update:modelValue', value),
});

function handleChange(event: { checked: boolean }): void {
	emit('update:modelValue', event.checked);
}
</script>

<template>
	<Switch.Root
		:id="id"
		:checked="checked"
		:disabled="disabled"
		:name="name"
		:aria-label="ariaLabel || label"
		class="flex gap-2 items-center"
		@checked-change="handleChange"
	>
		<Switch.Label v-if="label" class="text-sm text-gray-700 font-medium dark:(text-gray-200)">
			{{ label }}
		</Switch.Label>

		<Switch.Control
			class="items-centerh-6 p-2px rounded-full bg-gray-200 inline-flex w-11 ease-in-out relative dark:(bg-gray-700) data-[state=checked]:(bg-primary-600) dark:data-[state=checked]:(bg-primary-500)"
		>
			<Switch.Thumb
				class="rounded-full bg-white h-5 w-5 block pointer-events-none ring-0 ease-in-out data-[state=checked]:(translate-x-[22px])"
			/>
		</Switch.Control>

		<Switch.HiddenInput />
	</Switch.Root>
</template>
