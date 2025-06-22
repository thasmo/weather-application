<script setup lang="ts">
import { Switch } from '@ark-ui/vue/switch';
import { computed } from 'vue';

interface Properties {
	/**
	 * Optional aria-label for accessibility
	 */
	ariaLabel?: string;

	/**
	 * Whether the switch is disabled
	 */
	disabled?: boolean;

	/**
	 * Optional ID for the switch
	 */
	id?: string;

	/**
	 * The label for the switch
	 */
	label?: string;

	/**
	 * The controlled checked state of the switch
	 */
	modelValue: boolean;

	/**
	 * Optional name for the switch input
	 */
	name?: string;
}

const properties = withDefaults(defineProps<Properties>(), {
	ariaLabel: undefined,
	disabled: false,
	id: undefined,
	label: undefined,
	name: undefined,
});

const emit = defineEmits<{
	(event: 'update:modelValue', value: boolean): void;
}>();

// Create a computed property for the checked state
const checked = computed({
	get: () => properties.modelValue,
	set: (value: boolean) => emit('update:modelValue', value),
});

// Handle switch change
const handleChange = (event: { checked: boolean }): void => {
	emit('update:modelValue', event.checked);
};
</script>

<template>
	<Switch.Root
		:checked="checked"
		:disabled="disabled"
		:id="id"
		:name="name"
		:aria-label="ariaLabel || label"
		@checked-change="handleChange"
		class="flex gap-2 items-center">
		<Switch.Label v-if="label" class="text-sm text-gray-700 font-medium dark:text-gray-200">
			{{ label }}
		</Switch.Label>

		<Switch.Control
			class="items-centerh-6 p-2px rounded-full bg-gray-200 inline-flex w-11 transition-colors duration-200 ease-in-out relative dark:bg-gray-700 data-[state=checked]:bg-primary-600 dark:data-[state=checked]:bg-primary-500">
			<Switch.Thumb
				class="rounded-full bg-white h-5 w-5 block pointer-events-none ring-0 shadow-md transition-transform duration-200 ease-in-out data-[state=checked]:translate-x-[22px]" />
		</Switch.Control>

		<Switch.HiddenInput />
	</Switch.Root>
</template>
