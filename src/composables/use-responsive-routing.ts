import { watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useResponsive } from './use-responsive';

interface UseResponsiveRoutingOptions {
	readonly route: string;
}

export const useResponsiveRouting = (options: UseResponsiveRoutingOptions): void => {
	const { isMobile } = useResponsive();
	const router = useRouter();
	const route = useRoute();

	watch(isMobile, async (isMobileNow) => {
		if (!isMobileNow && route.name !== options.route) {
			await router.push({ name: options.route });
		}
	});
};
