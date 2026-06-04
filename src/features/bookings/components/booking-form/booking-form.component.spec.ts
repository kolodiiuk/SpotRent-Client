import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { BookingFormComponent } from './booking-form.component';
import { BookingService } from '../../services/booking.service';
import { BookingCreationResponse } from '../../models/booking.model';

describe('BookingFormComponent', () => {
  let fixture: ComponentFixture<BookingFormComponent>;
  let component: BookingFormComponent;
  let bookingService: { createBooking: ReturnType<typeof vi.fn> };
  let router: { navigate: ReturnType<typeof vi.fn> };
  let submitSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    bookingService = {
      createBooking: vi.fn()
    };
    router = {
      navigate: vi.fn().mockResolvedValue(true)
    };

    await TestBed.configureTestingModule({
      imports: [BookingFormComponent, TranslateModule.forRoot()],
      providers: [
        { provide: BookingService, useValue: bookingService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookingFormComponent);
    component = fixture.componentInstance;
    component.defaultSpaceId = 12;
    fixture.detectChanges();
    submitSpy = vi.spyOn(HTMLFormElement.prototype, 'submit').mockImplementation(() => {});
  });

  afterEach(() => {
    submitSpy?.mockRestore();
    document.body.querySelectorAll('form[action="https://www.liqpay.ua/api/3/checkout"]').forEach(form => form.remove());
  });

  it('does not call the API when the form is invalid', () => {
    component.form.patchValue({
      startTime: '',
      endTime: ''
    });

    component.onSubmit();

    expect(bookingService.createBooking).not.toHaveBeenCalled();
    expect(component.submitState).toBe('invalid');
    expect(component.submitMessage).toBe('BOOKING_FORM.ERROR_REQUIRED_TIMES');
  });

  it('does not expose space id or space availability fields', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).not.toContain('Space ID');
    expect(compiled.textContent).not.toContain('Space Availability');
    expect(compiled.querySelector('input[formControlName="spaceId"]')).toBeNull();
  });

  it('creates a subscription-covered booking and navigates to details', () => {
    const response: BookingCreationResponse = {
      bookingId: 42,
      liqPayPaymentData: null
    };
    bookingService.createBooking.mockReturnValue(of(response));
    setValidForm();

    component.onSubmit();

    expect(bookingService.createBooking).toHaveBeenCalledWith({
      spaceId: 12,
      startTime: expect.any(String),
      endTime: expect.any(String)
    });
    expect(component.submitState).toBe('subscription-covered');
    expect(component.pendingLiqPayPayload).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/user/my-bookings', 42]);
  });

  it('shows selected times using the configured local date and time format', () => {
    component.locale.dateOrder.set('dmy');
    component.locale.timeFormat.set('24h');
    component.form.patchValue({
      startTime: '2099-02-03T10:00',
      endTime: '2099-02-03T12:30'
    });

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('03/02/2099');
    expect(compiled.textContent).toContain('10:00');
    expect(compiled.textContent).toContain('12:30');
  });

  it('redirects to LiqPay when payment data is returned', () => {
    const response: BookingCreationResponse = {
      bookingId: 7,
      liqPayPaymentData: {
        data: 'encoded-data',
        signature: 'signed-data'
      }
    };
    bookingService.createBooking.mockReturnValue(of(response));
    setValidForm();

    component.onSubmit();
    fixture.detectChanges();

    expect(component.submitState).toBe('payment-required');
    expect(component.pendingLiqPayPayload).toEqual(response.liqPayPaymentData);
    expect(router.navigate).not.toHaveBeenCalled();
    expect(submitSpy).toHaveBeenCalledTimes(1);

    const form = document.body.querySelector('form[action="https://www.liqpay.ua/api/3/checkout"]') as HTMLFormElement;
    expect(form).not.toBeNull();
    expect(form.method).toBe('post');
    expect(form.acceptCharset).toBe('utf-8');
    expect((form.querySelector('input[name="data"]') as HTMLInputElement).value).toBe('encoded-data');
    expect((form.querySelector('input[name="signature"]') as HTMLInputElement).value).toBe('signed-data');
  });

  it('maps API failures to readable messages', () => {
    bookingService.createBooking.mockReturnValue(throwError(() => new HttpErrorResponse({
      status: 500,
      error: 'Space with id 12 is not available'
    })));
    setValidForm();

    component.onSubmit();

    expect(component.submitState).toBe('api-error');
    expect(component.submitMessage).toBe('Space with id 12 is not available');
    expect(component.isSubmitting).toBe(false);
  });

  it('guards against duplicate submissions while a request is pending', () => {
    const pendingResponse = new Subject<BookingCreationResponse>();
    bookingService.createBooking.mockReturnValue(pendingResponse.asObservable());
    setValidForm();

    component.onSubmit();
    component.onSubmit();

    expect(bookingService.createBooking).toHaveBeenCalledTimes(1);
    expect(component.isSubmitting).toBe(true);
    pendingResponse.next({ bookingId: 18, liqPayPaymentData: null });
    pendingResponse.complete();
    expect(component.isSubmitting).toBe(false);
  });

  function setValidForm(): void {
    component.defaultSpaceId = 12;
    component.form.patchValue({
      startTime: '2099-01-01T10:00',
      endTime: '2099-01-01T12:00'
    });
  }
});
