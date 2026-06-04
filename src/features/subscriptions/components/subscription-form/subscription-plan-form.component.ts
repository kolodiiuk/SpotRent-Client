import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SubscriptionPlanService } from '../../../subscription-plans/services/subsription-plan.service';
import { Duration } from '../../../subscription-plans/models/duration';
import { SubscriptionPlan } from '../../../subscription-plans/models/subscription-plan';
import { LocalDatePipe, LocalTimePipe } from '../../../../app/shared/pipes';

@Component({
  selector: 'app-subscription-plan-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, TranslateModule, LocalDatePipe, LocalTimePipe],
  template: `
    <div class="px-4 py-8 mx-auto sm:px-6 lg:px-8 max-w-3xl w-full">
      <div class="mb-8">
        <a routerLink="/owner/subscription-plans" class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center gap-2 mb-4">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {{ 'OWNER_PLAN_FORM.BACK_TO_PLANS' | translate }}
        </a>
        <h1 class="text-2xl md:text-3xl text-neutral-900 dark:text-neutral-100 font-bold">
          {{ (isEditMode ? 'OWNER_PLAN_FORM.EDIT_TITLE' : 'OWNER_PLAN_FORM.CREATE_TITLE') | translate }}
        </h1>
        <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
          {{ (isEditMode ? 'OWNER_PLAN_FORM.EDIT_SUBTITLE' : 'OWNER_PLAN_FORM.CREATE_SUBTITLE') | translate }}
        </p>
      </div>
    
      @if (infoMessage) {
        <div class="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {{ infoMessage }}
        </div>
      }
    
      @if (error) {
        <div class="mb-6 rounded-lg border border-danger-200 dark:border-danger-800 bg-danger-50 dark:bg-danger-900/20 p-4 text-sm text-danger-700 dark:text-danger-300">
          {{ error }}
        </div>
      }
    
      @if (isLoading) {
        <div class="flex justify-center p-8">
          <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-primary-600"></div>
        </div>
      }
    
      @if (!isLoading) {
        <form [formGroup]="form" (ngSubmit)="save()" class="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white/85 dark:bg-neutral-900/85 p-8 shadow-md backdrop-blur-sm space-y-6">
          <div>
            <label class="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">{{ 'OWNER_PLAN_FORM.PLAN_NAME' | translate }} *</label>
            <input
              type="text"
              formControlName="name"
              class="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-neutral-100 focus:border-primary-500 focus:ring-primary-500"
              [placeholder]="'OWNER_PLAN_FORM.PLAN_NAME_PLACEHOLDER' | translate"
              />
            @if (nameInvalid) {
              <p class="mt-1 text-xs text-danger-600 dark:text-danger-400">{{ 'OWNER_PLAN_FORM.NAME_REQUIRED' | translate }}</p>
            }
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">{{ 'OWNER_SPACE_FORM.DESCRIPTION' | translate }} *</label>
            <textarea
              formControlName="description"
              rows="4"
              class="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-neutral-100 focus:border-primary-500 focus:ring-primary-500"
              [placeholder]="'OWNER_PLAN_FORM.DESCRIPTION_PLACEHOLDER' | translate"
            ></textarea>
            @if (descriptionInvalid) {
              <p class="mt-1 text-xs text-danger-600 dark:text-danger-400">{{ 'OWNER_PLAN_FORM.DESCRIPTION_REQUIRED' | translate }}</p>
            }
          </div>
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label class="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">{{ 'OWNER_PLAN_FORM.PRICE' | translate }} *</label>
              <input
                type="number"
                formControlName="price"
                min="0"
                step="0.01"
                class="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-neutral-100 focus:border-primary-500 focus:ring-primary-500"
                />
              @if (priceInvalid) {
                <p class="mt-1 text-xs text-danger-600 dark:text-danger-400">{{ 'OWNER_PLAN_FORM.PRICE_INVALID' | translate }}</p>
              }
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">{{ 'USER_SUBSCRIPTIONS.INCLUDED_HOURS' | translate }} *</label>
              <input
                type="number"
                formControlName="includedHours"
                min="0"
                class="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2 text-neutral-900 dark:text-neutral-100 focus:border-primary-500 focus:ring-primary-500"
                />
              @if (includedHoursInvalid) {
                <p class="mt-1 text-xs text-danger-600 dark:text-danger-400">{{ 'OWNER_PLAN_FORM.HOURS_INVALID' | translate }}</p>
              }
            </div>
            <div class="md:col-span-2">
              <label class="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">{{ 'SUBSCRIPTION_PLAN_DETAILS.DURATION' | translate }} *</label>
              <select
                formControlName="duration"
                class="w-full rounded-md border border-neutral-300 dark:border-neutral-700 px-4 py-2 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:border-primary-500 focus:ring-primary-500 disabled:bg-neutral-100 dark:disabled:bg-neutral-800"
                >
                @for (option of durationOptions; track option) {
                  <option [ngValue]="option.value">{{ option.key | translate }}</option>
                }
              </select>
              <p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                {{ (isEditMode ? 'OWNER_PLAN_FORM.DURATION_LOCKED' : 'OWNER_PLAN_FORM.DURATION_HINT') | translate }}
              </p>
            </div>
          </div>
          @if (isEditMode && plan) {
            <div class="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 p-4 text-sm text-neutral-700 dark:text-neutral-300">
              <p><span class="font-medium">{{ 'USER_SUBSCRIPTIONS.STATUS' | translate }}:</span> {{ (plan.isActive ? 'COMMON.ACTIVE' : 'COMMON.INACTIVE') | translate }}</p>
              <p><span class="font-medium">{{ 'OWNER_PLAN_FORM.OWNER_ID' | translate }}:</span> {{ plan.ownerId ?? ('COMMON.NOT_AVAILABLE' | translate) }}</p>
              <p><span class="font-medium">{{ 'OWNER_PLAN_FORM.LAST_UPDATED' | translate }}:</span> {{ plan.updatedAt | localDate }} {{ plan.updatedAt | localTime }}</p>
            </div>
          }
          <div class="flex flex-wrap items-center justify-end gap-3 border-t border-neutral-200 dark:border-neutral-700 pt-6">
            <button type="button" routerLink="/owner/subscription-plans" class="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-5 py-2 font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800">
              {{ 'COMMON.CANCEL' | translate }}
            </button>
            @if (isEditMode) {
              @if (plan?.isActive) {
                <button type="button" (click)="deactivate()" class="rounded-lg bg-yellow-50 px-5 py-2 font-medium text-yellow-700 hover:bg-yellow-100">
                  {{ 'OWNER_SUBSCRIPTIONS.DEACTIVATE' | translate }}
                </button>
              } @else {
                <button type="button" (click)="activate()" class="rounded-lg bg-emerald-50 px-5 py-2 font-medium text-emerald-700 hover:bg-emerald-100">
                  {{ 'OWNER_SUBSCRIPTIONS.ACTIVATE' | translate }}
                </button>
              }
            }
            @if (isEditMode) {
              <button type="button" (click)="delete()" class="rounded-lg bg-danger-50 dark:bg-danger-900/30 px-5 py-2 font-medium text-danger-700 dark:text-danger-300 hover:bg-danger-100 dark:hover:bg-danger-900/50">
                {{ 'COMMON.DELETE' | translate }}
              </button>
            }
            <button
              type="submit"
              [disabled]="form.invalid || isSaving"
              class="inline-flex items-center rounded-lg bg-primary-600 px-5 py-2 font-medium text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60">
              @if (isSaving) {
                <span class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              }
              {{ (isEditMode ? 'OWNER_PLAN_FORM.UPDATE_PLAN' : 'OWNER_PLAN_FORM.CREATE_PLAN') | translate }}
            </button>
          </div>
        </form>
      }
    </div>
    `
})
export class SubscriptionPlanForm implements OnInit {
  form: FormGroup;

  plan: SubscriptionPlan | null = null;
  planId: number | null = null;
  isEditMode = false;
  isLoading = false;
  isSaving = false;
  error = '';
  infoMessage = '';
  durationOptions = [
    Duration.Week,
    Duration.TwoWeeks,
    Duration.Month,
    Duration.ThreeMonths
  ].map((value) => ({ value, key: this.getDurationKey(value) }));

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private planService: SubscriptionPlanService,
    private translate: TranslateService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      includedHours: [0, [Validators.required, Validators.min(0)]],
      duration: [Duration.Month, Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (!id) {
        this.isEditMode = false;
        this.planId = null;
        this.plan = null;
        this.infoMessage = '';
        this.form.reset({
          name: '',
          description: '',
          price: 0,
          includedHours: 0,
          duration: Duration.Month
        });
        this.form.get('duration')?.enable({ emitEvent: false });
        this.form.get('includedHours')?.enable({ emitEvent: false });
        return;
      }

      this.isEditMode = true;
      this.planId = Number(id);
      this.form.get('duration')?.disable({ emitEvent: false });
      this.form.get('includedHours')?.disable({ emitEvent: false });
      this.loadPlan();
    });
  }

  loadPlan(): void {
    if (!this.planId) {
      return;
    }

    this.isLoading = true;
    this.error = '';
    this.planService.getPlanDetails(this.planId).subscribe({
      next: (plan) => {
        this.plan = plan;
        this.form.patchValue({
          name: plan.name,
          description: plan.description,
          price: plan.price,
          includedHours: plan.includedHours,
          duration: plan.duration
        });
        this.form.get('duration')?.disable({ emitEvent: false });
        this.form.get('includedHours')?.disable({ emitEvent: false });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load subscription plan', err);
        this.error = this.translate.instant('OWNER_PLAN_FORM.ERROR_LOAD');
        this.isLoading = false;
      }
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.error = '';
    this.infoMessage = '';

    const payload = this.form.getRawValue();
    const request = {
      name: payload.name?.trim() ?? '',
      description: payload.description?.trim() ?? '',
      price: Number(payload.price),
      duration: payload.duration as Duration,
      includedHours: Number(payload.includedHours)
    };

    const action$ = this.isEditMode && this.planId
      ? this.planService.updatePlan(this.planId, {
          name: request.name,
          description: request.description,
          price: request.price
        })
      : this.planService.createPlan(request);

    action$.subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/owner/subscription-plans']);
      },
      error: (err) => {
        console.error('Failed to save subscription plan', err);
        this.error = this.translate.instant('OWNER_PLAN_FORM.ERROR_SAVE');
        this.isSaving = false;
      }
    });
  }

  deactivate(): void {
    if (!this.planId) {
      return;
    }

    if (!confirm(this.translate.instant('OWNER_SUBSCRIPTIONS.CONFIRM_DEACTIVATE'))) {
      return;
    }

    this.planService.deactivatePlan(this.planId).subscribe({
      next: () => this.router.navigate(['/owner/subscription-plans']),
      error: (err) => {
        console.error('Failed to deactivate subscription plan', err);
        this.error = this.translate.instant('OWNER_SUBSCRIPTIONS.ERROR_DEACTIVATE');
      }
    });
  }

  activate(): void {
    if (!this.planId) {
      return;
    }

    if (!confirm(this.translate.instant('OWNER_SUBSCRIPTIONS.CONFIRM_ACTIVATE'))) {
      return;
    }

    this.planService.activatePlan(this.planId).subscribe({
      next: () => this.router.navigate(['/owner/subscription-plans']),
      error: (err) => {
        console.error('Failed to activate subscription plan', err);
        this.error = this.translate.instant('OWNER_SUBSCRIPTIONS.ERROR_ACTIVATE');
      }
    });
  }

  delete(): void {
    if (!this.planId) {
      return;
    }

    if (!confirm(this.translate.instant('OWNER_SUBSCRIPTIONS.CONFIRM_DELETE'))) {
      return;
    }

    this.planService.deletePlan(this.planId).subscribe({
      next: () => this.router.navigate(['/owner/subscription-plans']),
      error: (err) => {
        console.error('Failed to delete subscription plan', err);
        this.error = this.translate.instant('OWNER_SUBSCRIPTIONS.ERROR_DELETE');
      }
    });
  }

  get nameInvalid(): boolean {
    const control = this.form.get('name');
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  get descriptionInvalid(): boolean {
    const control = this.form.get('description');
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  get priceInvalid(): boolean {
    const control = this.form.get('price');
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  get includedHoursInvalid(): boolean {
    const control = this.form.get('includedHours');
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  private getDurationKey(duration: Duration): string {
    switch (duration) {
      case Duration.Week:
        return 'SUBSCRIPTION_DURATION.WEEK';
      case Duration.TwoWeeks:
        return 'SUBSCRIPTION_DURATION.TWO_WEEKS';
      case Duration.Month:
        return 'SUBSCRIPTION_DURATION.MONTH';
      case Duration.ThreeMonths:
        return 'SUBSCRIPTION_DURATION.THREE_MONTHS';
      default:
        return 'SUBSCRIPTION_DURATION.UNKNOWN';
    }
  }
}
