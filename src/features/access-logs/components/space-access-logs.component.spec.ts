import { ComponentFixture, TestBed } from '@angular/core/testing';
import { convertToParamMap, provideRouter, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { LockStatus } from '../../smart-locks/models/device.model';
import { AccessLogEntry, AccessType } from '../models/access-log.model';
import { AccessLogService } from '../services/access-log.service';
import { SpaceAccessLogsComponent } from './space-access-logs.component';

describe('SpaceAccessLogsComponent', () => {
  let fixture: ComponentFixture<SpaceAccessLogsComponent>;
  let accessLogService: { getSpaceAccessLogs: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    accessLogService = {
      getSpaceAccessLogs: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [SpaceAccessLogsComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ spaceId: '92' })
            }
          }
        },
        { provide: AccessLogService, useValue: accessLogService }
      ]
    }).compileComponents();
  });

  it('loads space access logs from the API', () => {
    accessLogService.getSpaceAccessLogs.mockReturnValue(of([accessLog()]));

    fixture = TestBed.createComponent(SpaceAccessLogsComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(accessLogService.getSpaceAccessLogs).toHaveBeenCalledWith(92);
    expect(compiled.textContent).toContain('Showing access records for space #92');
    expect(compiled.textContent).toContain('Door A');
    expect(compiled.textContent).toContain('Mila Hrytsenko');
  });

  it('shows an empty state when the API returns no logs', () => {
    accessLogService.getSpaceAccessLogs.mockReturnValue(of([]));

    fixture = TestBed.createComponent(SpaceAccessLogsComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('No access logs recorded for this space.');
  });

  it('shows a retry-friendly error when the API request fails', () => {
    accessLogService.getSpaceAccessLogs.mockReturnValue(throwError(() => new Error('boom')));

    fixture = TestBed.createComponent(SpaceAccessLogsComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Failed to load space access logs. Please try again.');
    expect(compiled.textContent).toContain('Try again');
  });
});

function accessLog(): AccessLogEntry {
  return {
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
  };
}
