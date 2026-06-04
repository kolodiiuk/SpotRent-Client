import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessLogService } from '../services/access-log.service';
import { AccessLogEntry, accessTypeLabel } from '../models/access-log.model';
import {AuthService} from '../../auth/services/auth.service';
import {filter} from 'rxjs/operators';
import {catchError, Observable, of, switchMap, tap} from 'rxjs';
import {LoaderComponent} from '../../../app/shared/components/loader.component';
import {RouterModule} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LocalDatePipe, LocalTimePipe } from '../../../app/shared/pipes';

@Component({
  selector: 'owner-access-logs',
  standalone: true,
  imports: [CommonModule, LoaderComponent, RouterModule, TranslateModule, LocalDatePipe, LocalTimePipe],
  templateUrl: 'owner-access-logs.component.html'
})
export class OwnerAccessLogsComponent implements OnInit {
  logs$!: Observable<AccessLogEntry[]>;
  isLoading = false;
  private accessLogService = inject(AccessLogService);
  private authService = inject(AuthService);

  ngOnInit() {
    this.isLoading = true;

    this.logs$ = this.authService.user$.pipe(
      filter(user => !!user),
      switchMap(user => this.accessLogService.getOwnerAccessLogs(user!.id)),
      tap(() => this.isLoading = false),
      catchError(err => {
        this.isLoading = false;
        return of([]);
      })
    );
  }

  getTypeLabel = accessTypeLabel;

  getTypeKey(type: number): string {
    return `ACCESS_TYPE.${this.getTypeLabel(type).toUpperCase().replace(/ /g, '_')}`;
  }
}
