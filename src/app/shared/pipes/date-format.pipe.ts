import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LocaleService } from '../../services/locale.service';

/**
 * Locale-aware date pipe.
 * Reads the current date order from LocaleService and formats accordingly.
 *
 * Usage: {{ value | localDate }}
 */
@Pipe({
    name: 'localDate',
    standalone: true,
    pure: false, // non-pure so it reacts to locale signal changes
})
export class LocalDatePipe implements PipeTransform {
    private datePipe: DatePipe;

    constructor(private locale: LocaleService) {
        this.datePipe = new DatePipe('en-US');
    }

    transform(value: Date | string | number | null | undefined): string | null {
        if (value == null) return null;
        return this.datePipe.transform(value, this.locale.angularDateFormat()) ?? null;
    }
}
