import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccessLogEntry, AccessType, accessTypeLabel } from '../models/access-log.model';
import { LockStatus } from '../../smart-locks/models/device.model';

@Component({
  selector: 'user-access-logs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: 'user-access-logs.component.html',
  styleUrl: 'user-access-logs.component.css'
})
export class UserAccessLogsComponent {
  logsPreview: AccessLogEntry[] = [
    {
      id: 9021,
      userId: 17,
      spaceId: 92,
      deviceId: 7,
      accessType: AccessType.Entry,
      timestamp: '2026-05-12T09:05:00Z',
      isSuccessful: true,
      errorMessage: null,
      user: null,
      space: { id: 92, name: 'Skyline Focus Room' },
      device: {
        id: 7,
        spaceId: 92,
        deviceName: 'Door A',
        status: LockStatus.Locked,
        isOnline: true,
        installedAt: '2026-01-20T12:00:00Z',
        updatedAt: '2026-05-12T09:05:00Z'
      }
    },
    {
      id: 9022,
      userId: 17,
      spaceId: 45,
      deviceId: 3,
      accessType: AccessType.Exit,
      timestamp: '2026-05-12T11:50:00Z',
      isSuccessful: true,
      errorMessage: null,
      user: null,
      space: { id: 45, name: 'North Wing Meeting Pod' },
      device: {
        id: 3,
        spaceId: 45,
        deviceName: 'Hall Gate',
        status: LockStatus.Unlocked,
        isOnline: true,
        installedAt: '2026-02-11T10:20:00Z',
        updatedAt: '2026-05-12T11:50:00Z'
      }
    },
    {
      id: 9023,
      userId: 17,
      spaceId: 45,
      deviceId: 3,
      accessType: AccessType.AccessDenied,
      timestamp: '2026-05-14T07:20:00Z',
      isSuccessful: false,
      errorMessage: 'Subscription inactive',
      user: null,
      space: { id: 45, name: 'North Wing Meeting Pod' },
      device: {
        id: 3,
        spaceId: 45,
        deviceName: 'Hall Gate',
        status: LockStatus.Error,
        isOnline: true,
        installedAt: '2026-02-11T10:20:00Z',
        updatedAt: '2026-05-14T07:20:00Z'
      }
    }
  ];

  getTypeLabel = accessTypeLabel;
}
