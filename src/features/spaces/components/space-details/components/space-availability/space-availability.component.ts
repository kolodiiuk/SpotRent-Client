import { Component, Input } from '@angular/core';
import {catchError, finalize, Observable, of, take, timeout} from 'rxjs';

import {SpacesApiService} from '../../../../services/spaces-api.service';
import {SpaceSchedule} from "../../../../models/space-schedule";
import { TranslateModule } from '@ngx-translate/core';
import { LocalDatePipe, LocalTimePipe } from '../../../../../../app/shared/pipes';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-space-availability',
  standalone: true,
  imports: [TranslateModule, LocalDatePipe, LocalTimePipe, AsyncPipe],
  templateUrl: './space-availability.component.html',
  styleUrl: './space-availability.component.css'
})
export class SpaceAvailabilityComponent {
  private _spaceId: number | null = null;
  schedule$!: Observable<null | SpaceSchedule>;

  @Input()
  set spaceId(value: number | null | undefined) {
    const nextId = value != null ? Number(value) : null;
    if (!nextId || nextId <= 0 || this._spaceId === nextId) {
      return;
    }

    this._spaceId = nextId;
    this.loadSchedule();
  }

  get spaceId(): number | null {
    return this._spaceId;
  }

  schedule: SpaceSchedule | null = null;
  isLoading = false;
  error = '';

  constructor(private spacesApi: SpacesApiService) { }

  loadSchedule() {
    if (!this.spaceId) {
      return;
    }

    this.isLoading = true;
    this.error = '';

    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 7);

    this.schedule$ = this.spacesApi.getSpaceSchedule(this.spaceId, start.toISOString(), end.toISOString())
      .pipe(
        take(1),
        timeout(15000),
        catchError((err) => {
          this.error = 'SPACE_DETAILS.SCHEDULE_LOAD_ERROR';
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      );
  }
}
