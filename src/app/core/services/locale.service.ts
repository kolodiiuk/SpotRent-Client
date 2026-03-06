import { Injectable, signal, computed } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DateOrder, LocaleConfig, SupportedLang, TimeFormat } from '../models/locale.model';

const STORAGE_KEY = 'spotrent_locale';

const DEFAULTS: LocaleConfig = {
    lang: 'en',
    timeFormat: '12h',
    dateOrder: 'mdy',
};

@Injectable({ providedIn: 'root' })
export class LocaleService {
    readonly lang = signal<SupportedLang>(DEFAULTS.lang);
    readonly timeFormat = signal<TimeFormat>(DEFAULTS.timeFormat);
    readonly dateOrder = signal<DateOrder>(DEFAULTS.dateOrder);

    /** Angular DatePipe format string for dates, e.g. "MM/dd/yyyy" or "dd/MM/yyyy" */
    readonly angularDateFormat = computed<string>(() =>
        this.dateOrder() === 'dmy' ? 'dd/MM/yyyy' : 'MM/dd/yyyy'
    );

    /** Angular DatePipe format string for times, e.g. "HH:mm" or "hh:mm a" */
    readonly angularTimeFormat = computed<string>(() =>
        this.timeFormat() === '24h' ? 'HH:mm' : 'hh:mm a'
    );

    /** Combined date + time format string */
    readonly angularDateTimeFormat = computed<string>(() =>
        `${this.angularDateFormat()} ${this.angularTimeFormat()}`
    );

    constructor(private translate: TranslateService) {
        translate.addLangs(['en', 'uk']);
        translate.setDefaultLang('en');

        // Load initial values from storage
        this.loadFromStorage();

        // Explicitly trigger the current language to force the HTTP loader
        const current = this.lang();
        translate.use(current).subscribe({
            next: () => console.log(`[LocaleService] Successfully loaded translations for '${current}'`),
            error: err => console.error(`[LocaleService] Failed to load translations for '${current}':`, err)
        });
    }

    setLang(lang: SupportedLang): void {
        this.lang.set(lang);
        this.translate.use(lang).subscribe({
            next: () => console.log(`[LocaleService] Switched to '${lang}'`),
            error: err => console.error(`[LocaleService] Failed to switch to '${lang}':`, err)
        });
        this.saveToStorage();
    }

    setTimeFormat(fmt: TimeFormat): void {
        this.timeFormat.set(fmt);
        this.saveToStorage();
    }

    setDateOrder(order: DateOrder): void {
        this.dateOrder.set(order);
        this.saveToStorage();
    }

    private saveToStorage(): void {
        const config: LocaleConfig = {
            lang: this.lang(),
            timeFormat: this.timeFormat(),
            dateOrder: this.dateOrder(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    }

    private loadFromStorage(): void {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const config: Partial<LocaleConfig> = JSON.parse(raw);
                this.lang.set(config.lang ?? DEFAULTS.lang);
                this.timeFormat.set(config.timeFormat ?? DEFAULTS.timeFormat);
                this.dateOrder.set(config.dateOrder ?? DEFAULTS.dateOrder);
            }
        } catch {
            // Ignore parse errors — fall back to defaults
        }
        this.translate.use(this.lang());
    }
}
