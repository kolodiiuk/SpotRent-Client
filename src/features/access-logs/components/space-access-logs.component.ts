import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AccessLogEntry, AccessType, accessTypeLabel } from '../models/access-log.model';
import { LockStatus } from '../../smart-locks/models/device.model';

@Component({
  selector: 'space-access-logs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: 'space-access-logs.component.html',
  styleUrl: 'space-access-logs.component.css'
})
export class SpaceAccessLogsComponent implements OnInit {
  spaceId: number | null = null;
  logsPreview: AccessLogEntry[] = [
    {
      id: 4101,
      userId: 17,
      spaceId: 92,
      deviceId: 7,
      accessType: AccessType.Entry,
      timestamp: '2026-05-16T07:15:00Z',
      isSuccessful: true,
      errorMessage: null,
      user: { id: 17, firstName: 'Mila', lastName: 'Hrytsenko' },
      space: { id: 92, name: 'Skyline Focus Room' },
      device: {
        id: 7,
        spaceId: 92,
        deviceName: 'Door A',
        status: LockStatus.Locked,
        isOnline: true,
        installedAt: '2026-01-20T12:00:00Z',
        updatedAt: '2026-05-16T07:15:00Z'
      }
    },
    {
      id: 4102,
      userId: 24,
      spaceId: 92,
      deviceId: 7,
      accessType: AccessType.AccessDenied,
      timestamp: '2026-05-16T08:09:00Z',
      isSuccessful: false,
      errorMessage: 'Booking is not active yet.',
      user: { id: 24, firstName: 'Ivan', lastName: 'Petrenko' },
      space: { id: 92, name: 'Skyline Focus Room' },
      device: {
        id: 7,
        spaceId: 92,
        deviceName: 'Door A',
        status: LockStatus.Error,
        isOnline: true,
        installedAt: '2026-01-20T12:00:00Z',
        updatedAt: '2026-05-16T08:09:00Z'
      }
    },
    {
      id: 4103,
      userId: 17,
      spaceId: 92,
      deviceId: 7,
      accessType: AccessType.Exit,
      timestamp: '2026-05-16T10:42:00Z',
      isSuccessful: true,
      errorMessage: null,
      user: { id: 17, firstName: 'Mila', lastName: 'Hrytsenko' },
      space: { id: 92, name: 'Skyline Focus Room' },
      device: {
        id: 7,
        spaceId: 92,
        deviceName: 'Door A',
        status: LockStatus.Locked,
        isOnline: true,
        installedAt: '2026-01-20T12:00:00Z',
        updatedAt: '2026-05-16T10:42:00Z'
      }
    }
  ];

  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const rawId = Number(this.route.snapshot.paramMap.get('spaceId'));
    this.spaceId = Number.isFinite(rawId) && rawId > 0 ? rawId : null;
  }

  getTypeLabel = accessTypeLabel;
}
