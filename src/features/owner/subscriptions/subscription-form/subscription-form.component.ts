import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SubscriptionPlanService } from '../../../../app/core/services/subscription-plan.service';
import { Duration, durationLabels } from '../../../../app/core/models/subscription-plan.model';

@Component({
  selector: 'app-subscription-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-3xl mx-auto">
      <div class="mb-8">
        <a routerLink="/owner/subscriptions" class="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 mb-4">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Subscriptions
        </a>
        <h1 class="text-2xl md:text-3xl text-gray-800 font-bold">{{ isEditMode ? 'Edit Plan' : 'Create Subscription Plan' }}</h1>
      </div>

      <div *ngIf="isLoading" class="flex justify-center p-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <div *ngIf="error" class="p-4 mb-6 bg-red-50 text-red-700 rounded-lg font-medium border border-red-100">
        {{ error }}
      </div>

      <form *ngIf="!isLoading" [formGroup]="planForm" (ngSubmit)="onSubmit()" class="bg-white shadow-sm rounded-xl border border-gray-100 p-8 space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Plan Name *</label>
          <input type="text" formControlName="name" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Basic Member">
        </div>

        <div>
           <label class="block text-sm font-medium text-gray-700 mb-1">Description *</label>
           <textarea formControlName="description" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Describe the plan benefits..."></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
            <input type="number" formControlName="price" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" min="0" step="0.01">
          </div>

          <div>
             <label class="block text-sm font-medium text-gray-700 mb-1">Included Hours *</label>
             <input type="number" formControlName="includedHours" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" min="0">
             <p *ngIf="isEditMode" class="text-xs mt-1 text-gray-500">Notice: Cannot edit included hours for existing active plans.</p>
          </div>

          <div class="col-span-1 md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
            <select formControlName="duration" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
              <option *ngFor="let durationType of durations" [value]="durationType.value">{{ durationType.label }}</option>
            </select>
            <p *ngIf="isEditMode" class="text-xs mt-1 text-gray-500">Notice: Cannot edit duration for existing active plans.</p>
          </div>
        </div>

        <div class="pt-6 border-t border-gray-100 flex justify-end gap-4 mt-8">
           <button type="button" routerLink="/owner/subscriptions" class="btn bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 px-6 py-2 rounded-lg font-medium transition-colors">Cancel</button>
           <button type="submit" [disabled]="planForm.invalid || isSaving" class="btn bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors disabled:opacity-50 flex items-center">
             <span *ngIf="isSaving" class="inline-block animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></span>
             {{ isEditMode ? 'Update Plan' : 'Create Plan' }}
           </button>
        </div>
      </form>
    </div>
  `
})
export class SubscriptionFormComponent implements OnInit {
  planForm!: FormGroup;
  isEditMode = false;
  planId: number | null = null;
  isLoading = false;
  isSaving = false;
  error = '';
  
  durations = Object.keys(durationLabels).map(key => ({
    value: Number(key),
    label: durationLabels[Number(key) as Duration]
  }));

  constructor(
    private fb: FormBuilder,
    private planService: SubscriptionPlanService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.createForm();
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.planId = parseInt(id, 10);
        this.loadPlanData();
      }
    });
  }

  createForm() {
    this.planForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      duration: [Duration.Month, Validators.required],
      includedHours: [10, [Validators.required, Validators.min(0)]]
    });
  }

  loadPlanData() {
    if (!this.planId) return;
    this.isLoading = true;
    this.planService.getSubscriptionPlan(this.planId).subscribe({
      next: (plan) => {
        this.planForm.patchValue({
          name: plan.name,
          description: plan.description,
          price: plan.price,
          duration: plan.duration,
          includedHours: plan.includedHours
        });
        
        if (this.isEditMode) {
          this.planForm.get('duration')?.disable();
          this.planForm.get('includedHours')?.disable();
        }
        
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Failed to load plan details.';
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.planForm.invalid) return;

    this.isSaving = true;
    this.error = '';

    const req$ = this.isEditMode && this.planId
       ? this.planService.updateSubscriptionPlan(this.planId, this.planForm.getRawValue())
       : this.planService.createSubscriptionPlan(this.planForm.getRawValue());

    req$.subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/owner/subscriptions']);
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to save plan.';
        this.isSaving = false;
      }
    });
  }
}
