<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

type DrawerPosition = 'bottom' | 'left' | 'right';
interface DrawerProperties {
	/**
	 * Whether to close the drawer when pressing escape key
	 * @default true
	 */
	readonly closeOnEsc?: boolean;
	/**
	 * Whether to close the drawer when clicking outside
	 * @default true
	 */
	readonly closeOnOutsideClick?: boolean;
	/**
	 * Whether to disable closing the drawer entirely
	 * @default false
	 */
	readonly disableClose?: boolean;
	/**
	 * Whether to show an overlay behind the drawer
	 * @default true
	 */
	readonly hasOverlay?: boolean;
	/**
	 * Controls the visibility of the drawer
	 */
	readonly isOpen: boolean;
	/**
	 * Position of the drawer on desktop
	 * @default 'right'
	 */
	readonly position?: DrawerPosition;
	/**
	 * Size of the drawer
	 * @default 'medium'
	 */
	readonly size?: DrawerSize;
}

type DrawerSize = 'large' | 'medium' | 'small';

const properties = withDefaults(defineProps<DrawerProperties>(), {
	closeOnEsc: true,
	closeOnOutsideClick: true,
	disableClose: false,
	hasOverlay: true,
	position: 'right',
	size: 'medium',
});

const emit = defineEmits<{
	/**
	 * Emitted when the drawer should close
	 */
	(event: 'close'): void;
}>();

const isMobile = ref(false);
const drawerRef = ref<HTMLDivElement | null>(null);

const updateIsMobile = (): void => {
	isMobile.value = window.innerWidth < 768;
};

const handleEscKey = (event: KeyboardEvent): void => {
	if (properties.closeOnEsc && !properties.disableClose && properties.isOpen && event.key === 'Escape') {
		emit('close');
	}
};

const handleOutsideClick = (event: MouseEvent): void => {
	if (
		properties.closeOnOutsideClick &&
		!properties.disableClose &&
		properties.isOpen &&
		drawerRef.value &&
		!drawerRef.value.contains(event.target as Node)
	) {
		emit('close');
	}
};

const drawerClasses = computed(() => {
	const positionClasses = {
		bottom: 'bottom-0 left-0 right-0',
		left: isMobile.value ? 'bottom-0 left-0 right-0' : 'top-0 bottom-0 left-0',
		right: isMobile.value ? 'bottom-0 left-0 right-0' : 'top-0 bottom-0 right-0',
	};

	const sizeClasses = {
		large: isMobile.value ? 'max-h-[90vh] min-h-[10rem]' : properties.position === 'bottom' ? 'h-2/3' : 'w-96',
		medium: isMobile.value ? 'max-h-[80vh] min-h-[8rem]' : properties.position === 'bottom' ? 'h-1/2' : 'w-80',
		small: isMobile.value ? 'max-h-[70vh] min-h-[6rem]' : properties.position === 'bottom' ? 'h-1/3' : 'w-64',
	};

	const transformClasses = {
		bottom: 'translate-y-full',
		left: isMobile.value ? 'translate-y-full' : '-translate-x-full',
		right: isMobile.value ? 'translate-y-full' : 'translate-x-full',
	};

	return {
		position: positionClasses[isMobile.value ? 'bottom' : properties.position],
		size: sizeClasses[properties.size],
		transform: properties.isOpen ? '' : transformClasses[isMobile.value ? 'bottom' : properties.position],
	};
});

onMounted(() => {
	updateIsMobile();
	window.addEventListener('resize', updateIsMobile);
	if (properties.closeOnEsc) {
		document.addEventListener('keydown', handleEscKey);
	}
	if (properties.closeOnOutsideClick) {
		document.addEventListener('mousedown', handleOutsideClick);
	}
});

onBeforeUnmount(() => {
	window.removeEventListener('resize', updateIsMobile);
	document.removeEventListener('keydown', handleEscKey);
	document.removeEventListener('mousedown', handleOutsideClick);
});
</script>

<template>
	<div class="drawer-container">
		<!-- Backdrop overlay -->
		<div
			v-if="hasOverlay && isOpen"
			class="bg-black/50 transition-opacity duration-300 inset-0 fixed z-40"
			:class="{ 'opacity-0': !isOpen, 'opacity-100': isOpen }"></div>

		<!-- Drawer panel -->
		<div
			ref="drawerRef"
			class="bg-white shadow-lg transition-transform duration-300 ease-in-out fixed z-50 overflow-auto dark:bg-gray-800"
			:class="[drawerClasses.position, drawerClasses.size, drawerClasses.transform, isOpen ? 'visible' : 'invisible']">
			<div class="p-4">
				<slot name="header"></slot>
			</div>
			<div class="px-4 pb-4">
				<slot></slot>
			</div>
			<div class="p-4">
				<slot name="footer"></slot>
			</div>
		</div>
	</div>
</template>
