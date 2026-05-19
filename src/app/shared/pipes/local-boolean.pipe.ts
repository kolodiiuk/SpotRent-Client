import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocaleService } from '../../services/locale.service';

@Pipe({
  name: 'localBoolean',
  standalone: true,
  pure: false
})
export class LocalBooleanPipe implements PipeTransform {
  constructor(
    private readonly translate: TranslateService,
    private readonly locale: LocaleService
  ) {}

  transform(value: boolean | string | number | null | undefined): string {
    this.locale.lang();

    if (typeof value === 'boolean') {
      return this.translate.instant(value ? 'COMMON.YES' : 'COMMON.NO');
    }

    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (normalized === 'true') {
        return this.translate.instant('COMMON.YES');
      }

      if (normalized === 'false') {
        return this.translate.instant('COMMON.NO');
      }
    }

    if (typeof value === 'number' && (value === 0 || value === 1)) {
      return this.translate.instant(value === 1 ? 'COMMON.YES' : 'COMMON.NO');
    }

    return `${value ?? ''}`;
  }
}
