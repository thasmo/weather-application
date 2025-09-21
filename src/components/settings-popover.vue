<script setup lang="ts">
import { Popover } from '@ark-ui/vue/popover';
import { computed, ref } from 'vue';

type PopoverPlacement
	= | 'bottom'
		| 'bottom-end'
		| 'bottom-start'
		| 'left'
		| 'left-end'
		| 'left-start'
		| 'right'
		| 'right-end'
		| 'right-start'
		| 'top'
		| 'top-end'
		| 'top-start';

const properties = withDefaults(
	defineProps<{
		closeOnEscape?: boolean;
		closeOnInteractOutside?: boolean;
		defaultOpen?: boolean;
		isOpen?: boolean;
		modal?: boolean;
		offset?: number;
		placement?: PopoverPlacement;
		portalled?: boolean;
		showArrow?: boolean;
	}>(),
	{
		closeOnEscape: true,
		closeOnInteractOutside: true,
		modal: false,
		offset: 8,
		placement: 'bottom',
		portalled: true,
		showArrow: false,
	},
);

const emit = defineEmits<{
	(event: 'openChange', details: { open: boolean }): void;
}>();

const internalOpen = ref(properties.defaultOpen || false);

const isControlled = computed(() => properties.isOpen !== undefined);
const isOpen = computed(() => (isControlled.value ? properties.isOpen : internalOpen.value));

function handleOpenChange(details: { open: boolean }): void {
	if (!isControlled.value) {
		internalOpen.value = details.open;
	}
	emit('openChange', details);
}

const positioning = computed(() => ({
	middleware: [
		{ name: 'offset', options: { mainAxis: properties.offset } },
		{ name: 'flip', options: {} },
		{ name: 'shift', options: { padding: 8 } },
	],
	placement: properties.placement,
}));
</script>

<template>
	<Popover.Root
		:open="isOpen"
		:default-open="defaultOpen"
		:positioning="positioning"
		:close-on-escape="closeOnEscape"
		:close-on-interact-outside="closeOnInteractOutside"
		:modal="modal"
		:portalled="portalled"
		@open-change="handleOpenChange"
	>
		<Popover.Trigger>
			<slot name="trigger" />
		</Popover.Trigger>

		<Popover.Positioner>
			<Popover.Content class="p-4 border border-gray-200 rounded bg-white z-50 dark:(border-gray-700 bg-gray-800)">
				<template v-if="showArrow">
					<Popover.Arrow>
						<Popover.ArrowTip class="fill-white dark:(fill-gray-800)" />
					</Popover.Arrow>
				</template>

				<div v-if="$slots.title" class="font-bold mb-2">
					<Popover.Title>
						<slot name="title" />
					</Popover.Title>
				</div>

				<div v-if="$slots.description" class="text-sm text-gray-600 mb-3 dark:(text-gray-300)">
					<Popover.Description>
						<slot name="description" />
					</Popover.Description>
				</div>

				<slot />

				<div v-if="$slots.closeTrigger" class="mt-4 flex justify-end">
					<Popover.CloseTrigger>
						<slot name="closeTrigger" />
					</Popover.CloseTrigger>
				</div>
			</Popover.Content>
		</Popover.Positioner>
	</Popover.Root>
</template>
