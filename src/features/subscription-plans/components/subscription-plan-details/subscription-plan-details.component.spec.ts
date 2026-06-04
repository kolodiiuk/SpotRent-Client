import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { UserSubscriptionService } from '../../../subscriptions/services/user-subscription.service';
import { Duration } from '../../models/duration';
import { SubscriptionPlan } from '../../models/subscription-plan';
import { SubscriptionPlanService } from '../../services/subsription-plan.service';
import { SubscriptionPlanDetailsComponent } from './subscription-plan-details.component';

describe('SubscriptionPlanDetailsComponent', () => {
  let fixture: ComponentFixture<SubscriptionPlanDetailsComponent>;
  let component: SubscriptionPlanDetailsComponent;
  let planService: { getPlanDetails: ReturnType<typeof vi.fn> };
  let subscriptionFacade: { createSubscriptionForPlan: ReturnType<typeof vi.fn> };
  let authService: { isAuthenticated: ReturnType<typeof vi.fn> };
  let router: Router;
  let submitSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    planService = {
      getPlanDetails: vi.fn()
    };
    subscriptionFacade = {
      createSubscriptionForPlan: vi.fn()
    };
    authService = {
      isAuthenticated: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [SubscriptionPlanDetailsComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: '5' }))
          }
        },
        { provide: SubscriptionPlanService, useValue: planService },
        { provide: UserSubscriptionService, useValue: subscriptionFacade },
        { provide: AuthService, useValue: authService }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    submitSpy = vi.spyOn(HTMLFormElement.prototype, 'submit').mockImplementation(() => {});
  });

  afterEach(() => {
    submitSpy.mockRestore();
    document.body.querySelectorAll('form[action="https://www.liqpay.ua/api/3/checkout"]').forEach(form => form.remove());
  });

  it('stores the loaded active plan and creates a subscription', () => {
    planService.getPlanDetails.mockReturnValue(of(createPlan(true)));
    authService.isAuthenticated.mockReturnValue(true);
    subscriptionFacade.createSubscriptionForPlan.mockReturnValue(of({
      subscriptionId: 77,
      liqPayPaymentData: null
    }));

    createComponent();
    component.subscribe();

    expect(component.plan?.isActive).toBe(true);
    expect(subscriptionFacade.createSubscriptionForPlan).toHaveBeenCalledWith(5);
    expect(router.navigate).toHaveBeenCalledWith(['/user/subscriptions', 77]);
  });

  it('blocks subscribe for inactive plans', () => {
    planService.getPlanDetails.mockReturnValue(of(createPlan(false)));

    createComponent();
    component.subscribe();

    expect(subscriptionFacade.createSubscriptionForPlan).not.toHaveBeenCalled();
    expect(component.error).toBe('SUBSCRIPTION_PLAN_DETAILS.ERROR_INACTIVE');
  });

  it('redirects to LiqPay when subscription creation requires payment', () => {
    planService.getPlanDetails.mockReturnValue(of(createPlan(true)));
    authService.isAuthenticated.mockReturnValue(true);
    subscriptionFacade.createSubscriptionForPlan.mockReturnValue(of({
      subscriptionId: 88,
      liqPayPaymentData: {
        data: 'encoded-data',
        signature: 'signed-data'
      }
    }));

    createComponent();
    clickSubscribeButton();
    fixture.detectChanges();

    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.pendingLiqPayPayload).toEqual({ data: 'encoded-data', signature: 'signed-data' });
    expect(submitSpy).toHaveBeenCalledTimes(1);

    const form = document.body.querySelector('form[action="https://www.liqpay.ua/api/3/checkout"]') as HTMLFormElement;
    expect(form).not.toBeNull();
    expect(form.method).toBe('post');
    expect(form.acceptCharset).toBe('utf-8');
    expect((form.querySelector('input[name="data"]') as HTMLInputElement).value).toBe('encoded-data');
    expect((form.querySelector('input[name="signature"]') as HTMLInputElement).value).toBe('signed-data');
  });

  it('shows an error when subscription creation fails', () => {
    planService.getPlanDetails.mockReturnValue(of(createPlan(true)));
    authService.isAuthenticated.mockReturnValue(true);
    subscriptionFacade.createSubscriptionForPlan.mockReturnValue(throwError(() => new Error('boom')));

    createComponent();
    component.subscribe();

    expect(component.error).toBe('SUBSCRIPTION_PLAN_DETAILS.ERROR_SUBSCRIBE');
    expect(component.isSubmitting).toBe(false);
  });

  function createComponent(): void {
    fixture = TestBed.createComponent(SubscriptionPlanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  function clickSubscribeButton(): void {
    const buttons = Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];
    buttons[buttons.length - 1].click();
  }

  function createPlan(isActive: boolean): SubscriptionPlan {
    return {
      id: 5,
      name: 'Monthly',
      description: 'Monthly access',
      price: 100,
      duration: Duration.Month,
      includedHours: 20,
      ownerId: 9,
      owner: 'Owner',
      isActive,
      updatedAt: '2026-01-01T10:00:00Z'
    };
  }
});
