import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocaleService } from '../../services/locale.service';
import { SpaceType } from '../../../features/spaces/models/space-type';

@Pipe({
  name: 'stringSpaceType',
  standalone: true,
  pure: false,
})
export class StringSpaceTypePipe implements PipeTransform {
  constructor(
    private readonly translate: TranslateService,
    private readonly locale: LocaleService
  ) {}

  transform(value: SpaceType | number | null | undefined): string {
    if (value == null) {
      return this.translate.instant('SPACE_TYPE.NONE');
    }

    this.locale.lang();

    switch (Number(value)) {
      case SpaceType.None:
        return this.translate.instant('SPACE_TYPE.NONE');
      case SpaceType.Desk:
        return this.translate.instant('SPACE_TYPE.DESK');
      case SpaceType.Coworking:
        return this.translate.instant('SPACE_TYPE.COWORKING');
      case SpaceType.PrivateOffice:
        return this.translate.instant('SPACE_TYPE.PRIVATE_OFFICE');
      case SpaceType.ConferenceRoom:
        return this.translate.instant('SPACE_TYPE.CONFERENCE_ROOM');
      case SpaceType.PhotoShoot:
        return this.translate.instant('SPACE_TYPE.PHOTO_SHOOT');
      case SpaceType.Workshop:
        return this.translate.instant('SPACE_TYPE.WORKSHOP');
      default:
        return this.translate.instant('SPACE_TYPE.UNKNOWN');
    }
  }
}
