import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { catchError, Observable, of, shareReplay, tap } from 'rxjs';
import { ErrorComponent } from '../../../app/shared/components/error/error.component';
import { LoaderComponent } from '../../../app/shared/components/loader.component';
import { AccessLogEntry, accessTypeLabel } from '../models/access-log.model';
import { AccessLogService } from '../services/access-log.service';

@Component({
  selector: 'space-access-logs',
  standalone: true,
  imports: [CommonModule, RouterModule, ErrorComponent, LoaderComponent],
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

  ngOnInit(): void {
    const rawId = Number(this.route.snapshot.paramMap.get('spaceId'));
    this.spaceId = Number.isFinite(rawId) && rawId > 0 ? rawId : null;

    if (!this.spaceId) {
      this.error = 'Invalid or missing space id in route.';
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
        this.error = 'Failed to load space access logs. Please try again.';
        this.isLoading = false;
        return of([]);
      }),
      shareReplay(1)
    );
  }

  getTypeLabel = accessTypeLabel;
}
