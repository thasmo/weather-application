import type { Ref } from 'vue';
import { useMediaQuery } from '@vueuse/core';

interface ResponsiveBreakpoints {
	isMobile: Ref<boolean>;
}

export function useResponsive(): Readonly<ResponsiveBreakpoints> {
	const isMobile = useMediaQuery('(max-width: 767px)');

	return {
		isMobile,
	};
}
