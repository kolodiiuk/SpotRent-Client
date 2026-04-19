import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SubscriptionPlanService } from '../../../subscription-plans/services/subsription-plan.service';
import { durationLabels } from '../../../subscription-plans/models/duration-labels';
import { Duration } from '../../../subscription-plans/models/duration';
import { SubscriptionPlan } from '../../../subscription-plans/models/subscription-plan';

@Component({
  selector: 'app-subscription-plan-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="px-4 py-8 mx-auto sm:px-6 lg:px-8 max-w-3xl w-full">
      <div class="mb-8">
        <a routerLink="/owner/subscription-plans" class="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 mb-4">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Subscription Plans
        </a>
        <h1 class="text-2xl md:text-3xl text-gray-800 font-bold">
          {{ isEditMode ? 'Edit Subscription Plan' : 'Create Subscription Plan' }}
        </h1>
        <p class="mt-2 text-sm text-gray-600">
          {{ isEditMode ? 'Update pricing and description for your plan.' : 'Create a new plan for your spaces.' }}
        </p>
      </div>

      <div *ngIf="infoMessage" class="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        {{ infoMessage }}
      </div>

      <div *ngIf="error" class="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {{ error }}
      </div>

      <div *ngIf="isLoading" class="flex justify-center p-8">
        <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>

      <form *ngIf="!isLoading" [formGroup]="form" (ngSubmit)="save()" class="rounded-xl border border-gray-100 bg-white p-8 shadow-sm space-y-6">
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">Plan Name *</label>
          <input
            type="text"
            formControlName="name"
            class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g. Flex Starter"
          />
          <p *ngIf="nameInvalid" class="mt-1 text-xs text-red-600">Plan name is required.</p>
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">Description *</label>
          <textarea
            formControlName="description"
            rows="4"
            class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Describe the discount and included benefits"
          ></textarea>
          <p *ngIf="descriptionInvalid" class="mt-1 text-xs text-red-600">Description is required.</p>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">Price ($) *</label>
            <input
              type="number"
              formControlName="price"
              min="0"
              step="0.01"
              class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <p *ngIf="priceInvalid" class="mt-1 text-xs text-red-600">Price must be 0 or greater.</p>
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">Included Hours *</label>
            <input
              type="number"
              formControlName="includedHours"
              min="0"
              class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
            <p *ngIf="includedHoursInvalid" class="mt-1 text-xs text-red-600">Included hours must be 0 or greater.</p>
          </div>

          <div class="md:col-span-2">
            <label class="mb-1 block text-sm font-medium text-gray-700">Duration *</label>
            <select
              formControlName="duration"
              class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option *ngFor="let option of durationOptions" [ngValue]="option.value">{{ option.label }}</option>
            </select>
            <p class="mt-1 text-xs text-gray-500">
              {{ isEditMode ? 'Duration cannot be changed for an existing plan.' : 'Choose the plan duration.' }}
            </p>
          </div>
        </div>

        <div *ngIf="isEditMode && plan" class="rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
          <p><span class="font-medium">Status:</span> {{ plan.isActive ? 'Active' : 'Inactive' }}</p>
          <p><span class="font-medium">Owner ID:</span> {{ plan.ownerId ?? 'N/A' }}</p>
          <p><span class="font-medium">Last updated:</span> {{ plan.updatedAt | date:'medium' }}</p>
        </div>

        <div class="flex flex-wrap items-center justify-end gap-3 border-t border-gray-100 pt-6">
          <button type="button" routerLink="/owner/subscription-plans" class="rounded-lg border border-gray-200 bg-white px-5 py-2 font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button *ngIf="isEditMode" type="button" (click)="deactivate()" class="rounded-lg bg-yellow-50 px-5 py-2 font-medium text-yellow-700 hover:bg-yellow-100">
            Deactivate
          </button>
          <button *ngIf="isEditMode" type="button" (click)="delete()" class="rounded-lg bg-red-50 px-5 py-2 font-medium text-red-700 hover:bg-red-100">
            Delete
          </button>
          <button
            type="submit"
            [disabled]="form.invalid || isSaving"
            class="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
            <span *ngIf="isSaving" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            {{ isEditMode ? 'Update Plan' : 'Create Plan' }}
          </button>
        </div>
      </form>
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
  durationOptions = Object.keys(durationLabels).map((key) => {
    const value = Number(key) as Duration;
    return { value, label: durationLabels[value] };
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private planService: SubscriptionPlanService
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
        this.error = 'Failed to load subscription plan details.';
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
          name: request.name || null,
          description: request.description || null,
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
        this.error = 'Failed to save subscription plan.';
        this.isSaving = false;
      }
    });
  }

  deactivate(): void {
    if (!this.planId) {
      return;
    }

    if (!confirm('Deactivate this subscription plan?')) {
      return;
    }

    this.planService.deactivatePlan(this.planId).subscribe({
      next: () => this.router.navigate(['/owner/subscription-plans']),
      error: (err) => {
        console.error('Failed to deactivate subscription plan', err);
        this.error = 'Failed to deactivate subscription plan.';
      }
    });
  }

  delete(): void {
    if (!this.planId) {
      return;
    }

    if (!confirm('Delete this subscription plan permanently?')) {
      return;
    }

    this.planService.deletePlan(this.planId).subscribe({
      next: () => this.router.navigate(['/owner/subscription-plans']),
      error: (err) => {
        console.error('Failed to delete subscription plan', err);
        this.error = 'Failed to delete subscription plan.';
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
}
