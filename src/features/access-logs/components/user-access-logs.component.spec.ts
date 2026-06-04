import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of, throwError } from 'rxjs';

import { User } from '../../auth/models/user.model';
import { UserRole } from '../../auth/models/user-role.model';
import { AuthService } from '../../auth/services/auth.service';
import { LockStatus } from '../../smart-locks/models/device.model';
import { AccessLogEntry, AccessType } from '../models/access-log.model';
import { AccessLogService } from '../services/access-log.service';
import { UserAccessLogsComponent } from './user-access-logs.component';

describe('UserAccessLogsComponent', () => {
  let fixture: ComponentFixture<UserAccessLogsComponent>;
  let accessLogService: { getUserAccessLogs: ReturnType<typeof vi.fn> };
  let authService: { user$: Observable<User | null> };

  beforeEach(async () => {
    accessLogService = {
      getUserAccessLogs: vi.fn()
    };
    authService = {
      user$: of({
        id: 17,
        firstName: 'Mila',
        secondName: 'Hrytsenko',
        email: 'mila@example.com',
        phoneNumber: '+380000000000',
        role: UserRole.USER
      })
    };

    await TestBed.configureTestingModule({
      imports: [UserAccessLogsComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: AccessLogService, useValue: accessLogService },
        { provide: AuthService, useValue: authService }
      ]
    }).compileComponents();
  });

  it('loads current user access logs from the API', () => {
    accessLogService.getUserAccessLogs.mockReturnValue(of([accessLog()]));

    fixture = TestBed.createComponent(UserAccessLogsComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(accessLogService.getUserAccessLogs).toHaveBeenCalledWith(17);
    expect(compiled.textContent).toContain('Skyline Focus Room');
    expect(compiled.textContent).toContain('Door A');
    expect(compiled.textContent).not.toContain('USER_ACCESS_LOGS.NO_LOGS');
  });

  it('shows an empty state when the API returns no logs', () => {
    accessLogService.getUserAccessLogs.mockReturnValue(of([]));

    fixture = TestBed.createComponent(UserAccessLogsComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('USER_ACCESS_LOGS.NO_LOGS');
  });

  it('shows a retry-friendly error when the API request fails', () => {
    accessLogService.getUserAccessLogs.mockReturnValue(throwError(() => new Error('boom')));

    fixture = TestBed.createComponent(UserAccessLogsComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('USER_ACCESS_LOGS.ERROR_LOAD');
    expect(compiled.textContent).toContain('COMMON.TRY_AGAIN');
  });
});

function accessLog(): AccessLogEntry {
  return {
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
  };
}
