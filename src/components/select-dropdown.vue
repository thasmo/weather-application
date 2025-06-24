<script setup lang="ts">
import { createListCollection, Select } from '@ark-ui/vue/select';
import { computed, ref, watch } from 'vue';

const properties = withDefaults(
	defineProps<{
		ariaLabel?: string;
		modelValue: string;
		options: {
			label: string;
			value: string;
		}[];
	}>(),
	{
		ariaLabel: 'Select an option',
	},
);

const emit = defineEmits<{
	(event: 'update:modelValue', value: string): void;
}>();

const value = ref<string[]>([properties.modelValue]);

watch(
	() => properties.modelValue,
	(newValue) => {
		if (newValue !== value.value[0]) {
			value.value = [newValue];
		}
	},
	{ immediate: true },
);

watch(
	value,
	(newValue) => {
		if (newValue[0] !== properties.modelValue) {
			emit('update:modelValue', newValue[0]);
		}
	},
	{ deep: true },
);

const collection = computed(() => {
	return createListCollection({
		items: properties.options.map((option) => option.value),
	});
});

const getOptionLabel = (value: string): string => {
	const option = properties.options.find((opt) => opt.value === value);
	return option ? option.label : '';
};

const currentLabel = computed(() => {
	return getOptionLabel(properties.modelValue);
});
</script>

<template>
	<Select.Root v-model="value" :collection="collection" :aria-label="ariaLabel">
		<Select.Control>
			<Select.Trigger
				class="text-sm text-gray-700 font-medium px-3.5 py-2 border border-gray-300 rounded-lg bg-white flex w-full cursor-pointer transition-all items-center justify-between dark:(text-gray-200 border-gray-600 bg-gray-800) focus:(outline-none border-primary-500 ring-3 ring-primary-500/20) hover:(border-primary-400) dark:hover:(border-primary-500)">
				<Select.ValueText placeholder="Select an option" class="text-left flex-grow">
					{{ currentLabel }}
				</Select.ValueText>
				<Select.Indicator class="text-gray-500 ml-2 flex-shrink-0 dark:(text-gray-400)">
					<div class="i-ri-arrow-drop-down-line h-5 w-5"></div>
				</Select.Indicator>
			</Select.Trigger>
		</Select.Control>
		<Teleport to="body">
			<Select.Positioner>
				<Select.Content
					class="mt-1 border border-gray-300 rounded-lg bg-white min-w-180px z-50 overflow-hidden dark:(border-gray-600 bg-gray-800)">
					<Select.ItemGroup>
						<Select.Item
							v-for="option in properties.options"
							:key="option.value"
							:item="option.value"
							@click.stop
							@mousedown.stop
							class="text-sm text-gray-700 font-medium px-4 py-2.5 flex cursor-pointer items-center justify-between dark:(text-gray-200) hover:(bg-primary-50) dark:hover:(bg-primary-900/20)">
							<Select.ItemText class="text-left">{{ option.label }}</Select.ItemText>
							<Select.ItemIndicator class="text-primary-600 ml-2 dark:(text-primary-400)">
								<div class="i-ri-check-line h-5 w-5"></div>
							</Select.ItemIndicator>
						</Select.Item>
					</Select.ItemGroup>
				</Select.Content>
			</Select.Positioner>
		</Teleport>
		<Select.HiddenSelect />
	</Select.Root>
</template>
