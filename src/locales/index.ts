import de from '@/locales/de';
import en from '@/locales/en';

export type MessageSchema = typeof en;

export const messages = {
	de,
	en,
};

export type Locale = keyof typeof messages;
