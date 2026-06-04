import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { catchError, filter, Observable, of, shareReplay, switchMap, tap } from 'rxjs';
import { ErrorComponent } from '../../../app/shared/components/error/error.component';
import { LoaderComponent } from '../../../app/shared/components/loader.component';
import { AuthService } from '../../auth/services/auth.service';
import { AccessLogEntry, accessTypeLabel } from '../models/access-log.model';
import { AccessLogService } from '../services/access-log.service';
import { LocalDatePipe, LocalTimePipe } from '../../../app/shared/pipes';

@Component({
  selector: 'user-access-logs',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, ErrorComponent, LoaderComponent, LocalDatePipe, LocalTimePipe],
  templateUrl: 'user-access-logs.component.html',
  styleUrl: 'user-access-logs.component.css'
})
export class UserAccessLogsComponent implements OnInit {
  logs$!: Observable<AccessLogEntry[]>;
  isLoading = false;
  error = '';

  private accessLogService = inject(AccessLogService);
  private authService = inject(AuthService);
  private translate = inject(TranslateService);

  ngOnInit(): void {
    this.loadUserAccessLogs();
  }

  loadUserAccessLogs(): void {
    this.isLoading = true;
    this.error = '';

    this.logs$ = this.authService.user$.pipe(
      filter(user => !!user),
      switchMap(user => this.accessLogService.getUserAccessLogs(user!.id)),
      tap(() => {
        this.isLoading = false;
      }),
      catchError((err: unknown) => {
        console.error('Failed to load user access logs', err);
        this.error = this.translate.instant('USER_ACCESS_LOGS.ERROR_LOAD');
        this.isLoading = false;
        return of([]);
      }),
      shareReplay(1)
    );
  }

  getDeniedCount(logs: AccessLogEntry[]): number {
    return logs.filter(log => !log.isSuccessful).length;
  }

  getActiveSpaceCount(logs: AccessLogEntry[]): number {
    return new Set(logs.map(log => log.spaceId).filter(spaceId => spaceId != null)).size;
  }

  getTypeLabel = accessTypeLabel;

  getTypeKey(type: number): string {
    return `ACCESS_TYPE.${this.getTypeLabel(type).toUpperCase().replace(/ /g, '_')}`;
  }
}
