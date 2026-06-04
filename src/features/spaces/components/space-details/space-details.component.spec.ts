import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { BookingService } from '../../../bookings/services/booking.service';
import { SpaceType } from '../../models/space-type';
import { Space } from '../../models/space.model';
import { SpacesApiService } from '../../services/spaces-api.service';
import { SpaceDetailsComponent } from './space-details.component';

describe('SpaceDetailsComponent', () => {
  let fixture: ComponentFixture<SpaceDetailsComponent>;
  let spacesApi: {
    getSpace: ReturnType<typeof vi.fn>;
    getSpaceSchedule: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    spacesApi = {
      getSpace: vi.fn(),
      getSpaceSchedule: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [SpaceDetailsComponent, TranslateModule.forRoot()],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: '12' }))
          }
        },
        { provide: SpacesApiService, useValue: spacesApi },
        { provide: BookingService, useValue: { createBooking: vi.fn() } }
      ]
    }).compileComponents();
  });

  it('shows the booking form when the available space book button is clicked', () => {
    spacesApi.getSpace.mockReturnValue(of(createSpace(true)));
    spacesApi.getSpaceSchedule.mockReturnValue(of({ spaceId: 12, bookings: [] }));

    fixture = TestBed.createComponent(SpaceDetailsComponent);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button[aria-expanded="false"]') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.showBookingForm).toBe(true);
    expect(fixture.nativeElement.querySelector('booking-form')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('input[formcontrolname="spaceId"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('input[formcontrolname="startTime"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('input[formcontrolname="endTime"]')).not.toBeNull();
  });

  it('keeps the book button disabled when the space is unavailable', () => {
    spacesApi.getSpace.mockReturnValue(of(createSpace(false)));
    spacesApi.getSpaceSchedule.mockReturnValue(of({ spaceId: 12, bookings: [] }));

    fixture = TestBed.createComponent(SpaceDetailsComponent);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button[aria-expanded="false"]') as HTMLButtonElement;

    expect(button.disabled).toBe(true);
    expect(fixture.nativeElement.querySelector('booking-form')).toBeNull();
  });

  function createSpace(isAvailable: boolean): Space {
    return {
      id: 12,
      name: 'Main Desk',
      description: 'Desk near the window',
      spaceType: SpaceType.Desk,
      capacity: 1,
      areaSqm: 6,
      hourlyRate: 20,
      addressId: 1,
      address: {
        city: 'Kyiv',
        street: 'Khreshchatyk',
        building: '1'
      },
      isAvailable,
      createdAt: '2026-01-01T10:00:00Z',
      ownerId: 5,
      ownerDto: null,
      workingHours: [],
      attributes: [],
      attributeValues: []
    };
  }
});
