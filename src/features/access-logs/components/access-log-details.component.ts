import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AccessLogEntry, AccessType, accessTypeLabel } from '../models/access-log.model';
import { LockStatus } from '../../smart-locks/models/device.model';

@Component({
  selector: 'access-log-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: 'access-log-details.component.html',
  styleUrl: 'access-log-details.component.css'
})
export class AccessLogDetailsComponent implements OnInit {
  logId: number | null = null;
  listLink = '/user/access-logs';
  previewLog: AccessLogEntry = {
    id: 9023,
    userId: 17,
    spaceId: 45,
    deviceId: 3,
    accessType: AccessType.AccessDenied,
    timestamp: '2026-05-14T07:20:00Z',
    isSuccessful: false,
    errorMessage: 'Subscription inactive',
    user: { id: 17, firstName: 'Mila', lastName: 'Hrytsenko', email: 'mila@example.com' },
    space: { id: 45, name: 'North Wing Meeting Pod', ownerId: 9 },
    device: {
      id: 3,
      spaceId: 45,
      deviceName: 'Hall Gate',
      status: LockStatus.Error,
      isOnline: true,
      installedAt: '2026-02-11T10:20:00Z',
      updatedAt: '2026-05-14T07:20:00Z'
    }
  };

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    this.listLink = this.router.url.startsWith('/owner/') ? '/owner/access-logs' : '/user/access-logs';

    const rawId = Number(this.route.snapshot.paramMap.get('id'));
    this.logId = Number.isFinite(rawId) && rawId > 0 ? rawId : null;

    if (this.logId) {
      this.previewLog = { ...this.previewLog, id: this.logId };
    }
  }

  getTypeLabel = accessTypeLabel;
}
