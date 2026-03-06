import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LocaleService } from '../../core/services/locale.service';

/**
 * Locale-aware time pipe.
 * Reads the current time format (12h/24h) from LocaleService and formats accordingly.
 *
 * Usage: {{ value | localTime }}
 */
@Pipe({
    name: 'localTime',
    standalone: true,
    pure: false, // non-pure so it reacts to locale signal changes
})
export class LocalTimePipe implements PipeTransform {
    private datePipe: DatePipe;

    constructor(private locale: LocaleService) {
        this.datePipe = new DatePipe('en-US');
    }

    transform(value: Date | string | number | null | undefined): string | null {
        if (value == null) return null;
        return this.datePipe.transform(value, this.locale.angularTimeFormat()) ?? null;
    }
}
