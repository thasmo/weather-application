import { useMediaQuery } from '@vueuse/core';
import { watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

interface UseResponsiveRoutingOptions {
	readonly route: string;
}

export const useResponsiveRouting = (options: UseResponsiveRoutingOptions): void => {
	const isMobile = useMediaQuery('(max-width: 767px)');
	const router = useRouter();
	const route = useRoute();

	watch(isMobile, async (isMobileNow) => {
		if (!isMobileNow && route.name !== options.route) {
			await router.push({ name: options.route });
		}
	});
};
