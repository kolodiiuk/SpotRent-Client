import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { catchError, Observable, of, shareReplay, tap } from 'rxjs';
import { ErrorComponent } from '../../../app/shared/components/error/error.component';
import { LoaderComponent } from '../../../app/shared/components/loader.component';
import { AccessLogEntry, accessTypeLabel } from '../models/access-log.model';
import { AccessLogService } from '../services/access-log.service';
import { LocalDatePipe, LocalTimePipe } from '../../../app/shared/pipes';

@Component({
  selector: 'space-access-logs',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, ErrorComponent, LoaderComponent, LocalDatePipe, LocalTimePipe],
  templateUrl: 'space-access-logs.component.html',
  styleUrl: 'space-access-logs.component.css'
})
export class SpaceAccessLogsComponent implements OnInit {
  spaceId: number | null = null;
  logs$!: Observable<AccessLogEntry[]>;
  isLoading = false;
  error = '';

  private route = inject(ActivatedRoute);
  private accessLogService = inject(AccessLogService);
  private translate = inject(TranslateService);

  ngOnInit(): void {
    const rawId = Number(this.route.snapshot.paramMap.get('spaceId'));
    this.spaceId = Number.isFinite(rawId) && rawId > 0 ? rawId : null;

    if (!this.spaceId) {
      this.error = this.translate.instant('OWNER_ACCESS_LOGS.INVALID_SPACE_ID');
      this.logs$ = of([]);
      return;
    }

    this.loadSpaceAccessLogs();
  }

  loadSpaceAccessLogs(): void {
    if (!this.spaceId) {
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.logs$ = this.accessLogService.getSpaceAccessLogs(this.spaceId).pipe(
      tap(() => {
        this.isLoading = false;
      }),
      catchError((err: unknown) => {
        console.error('Failed to load space access logs', err);
        this.error = this.translate.instant('OWNER_ACCESS_LOGS.ERROR_SPACE_LOGS');
        this.isLoading = false;
        return of([]);
      }),
      shareReplay(1)
    );
  }

  getTypeLabel = accessTypeLabel;

  getTypeKey(type: number): string {
    return `ACCESS_TYPE.${this.getTypeLabel(type).toUpperCase().replace(/ /g, '_')}`;
  }
}
