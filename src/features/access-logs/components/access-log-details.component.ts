import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AccessLogEntry, accessTypeLabel } from '../models/access-log.model';
import { AccessLogService } from '../services/access-log.service';
import { LoaderComponent } from '../../../app/shared/components/loader.component';
import { LocalDatePipe, LocalTimePipe } from '../../../app/shared/pipes';

@Component({
  selector: 'access-log-details',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, LoaderComponent, LocalDatePipe, LocalTimePipe],
  templateUrl: 'access-log-details.component.html',
  styleUrl: 'access-log-details.component.css'
})
export class AccessLogDetailsComponent implements OnInit {
  logId: number | null = null;
  listLink = '/user/access-logs';
  log: AccessLogEntry | null = null;
  isLoading = false;
  error = '';

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private accessLogService = inject(AccessLogService);
  private translate = inject(TranslateService);

  ngOnInit(): void {
    this.listLink = this.router.url.startsWith('/owner/') ? '/owner/access-logs' : '/user/access-logs';

    this.route.paramMap.subscribe(params => {
      const rawId = Number(params.get('id'));
      this.logId = Number.isFinite(rawId) && rawId > 0 ? rawId : null;

      if (!this.logId) {
        this.log = null;
        this.error = this.translate.instant('USER_ACCESS_LOGS.ERROR_INVALID_ID');
        return;
      }

      this.loadAccessLog(this.logId);
    });
  }

  loadAccessLog(id: number): void {
    this.isLoading = true;
    this.error = '';
    this.log = null;

    this.accessLogService.getLogById(id).subscribe({
      next: log => {
        this.log = log;
        this.isLoading = false;
      },
      error: err => {
        console.error('Failed to load access log details', err);
        this.error = this.translate.instant('USER_ACCESS_LOGS.ERROR_DETAILS');
        this.isLoading = false;
      }
    });
  }

  getTypeLabel = accessTypeLabel;

  getTypeKey(type: number): string {
    return `ACCESS_TYPE.${this.getTypeLabel(type).toUpperCase().replace(/ /g, '_')}`;
  }
}
