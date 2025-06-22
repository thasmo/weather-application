import de from './de';
import en from './en';

export type MessageSchema = typeof en;

export const messages = {
	de,
	en,
};

export type Locale = keyof typeof messages;
