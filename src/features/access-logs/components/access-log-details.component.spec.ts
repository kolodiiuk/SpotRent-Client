import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import { LockStatus } from '../../smart-locks/models/device.model';
import { AccessLogEntry, AccessType } from '../models/access-log.model';
import { AccessLogService } from '../services/access-log.service';
import { AccessLogDetailsComponent } from './access-log-details.component';

describe('AccessLogDetailsComponent', () => {
  let fixture: ComponentFixture<AccessLogDetailsComponent>;
  let accessLogService: { getLogById: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    accessLogService = {
      getLogById: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [AccessLogDetailsComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: '4101' }))
          }
        },
        { provide: AccessLogService, useValue: accessLogService }
      ]
    }).compileComponents();
  });

  it('loads access log details from the API', () => {
    accessLogService.getLogById.mockReturnValue(of(accessLog()));

    fixture = TestBed.createComponent(AccessLogDetailsComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(accessLogService.getLogById).toHaveBeenCalledWith(4101);
    expect(compiled.textContent).toContain('USER_ACCESS_LOGS.LOG_TITLE');
    expect(compiled.textContent).toContain('Skyline Focus Room');
    expect(compiled.textContent).toContain('Door A');
  });

  it('shows an error when the API request fails', () => {
    accessLogService.getLogById.mockReturnValue(throwError(() => new Error('boom')));

    fixture = TestBed.createComponent(AccessLogDetailsComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('USER_ACCESS_LOGS.ERROR_DETAILS');
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
    user: { id: 17, firstName: 'Mila', lastName: 'Hrytsenko', email: 'mila@example.com' },
    space: { id: 92, name: 'Skyline Focus Room', ownerId: 9 },
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
