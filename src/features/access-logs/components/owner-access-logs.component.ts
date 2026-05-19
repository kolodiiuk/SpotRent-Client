import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AccessLogService } from '../services/access-log.service';
import { AccessLogEntry, accessTypeLabel } from '../models/access-log.model';
import {AuthService} from '../../auth/services/auth.service';
import {User} from '../../auth/models/user.model';
import {filter} from 'rxjs/operators';
import {catchError, Observable, of, switchMap, tap} from 'rxjs';
import {LoaderComponent} from '../../../app/shared/components/loader.component';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'owner-access-logs',
  standalone: true,
  imports: [CommonModule, DatePipe, LoaderComponent, RouterModule],
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
}
