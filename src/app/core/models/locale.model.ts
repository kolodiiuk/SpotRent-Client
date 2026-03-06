export type SupportedLang = 'en' | 'uk';
export type TimeFormat = '12h' | '24h';
export type DateOrder = 'mdy' | 'dmy';

export interface LocaleConfig {
    lang: SupportedLang;
    timeFormat: TimeFormat;
    dateOrder: DateOrder;
}
