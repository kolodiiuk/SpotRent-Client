import { Component, OnInit } from '@angular/core';

import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {SpacesApiService} from '../../services/spaces-api.service';
import {spaceTypeLabels} from "../../models/space-type-labels";
import {SpaceType} from '../../models/space-type';
import {UpdateSpaceRequest} from '../../models/update-space-request';
import {CreateSpaceRequest} from '../../models/create-space-request';
import {AttributeInfo} from '../../models/attribute-info';
import {CreateSpaceAddressRequest} from '../../models/space-address';
import {AttributeValue} from '../../models/attribute-value';

@Component({
  selector: 'owner-owner-space-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './owner-space-form.component.html',
  styleUrl: './owner-space-form.component.css'
})
export class OwnerSpaceFormComponent implements OnInit {
  spaceForm!: FormGroup;
  isEditMode = false;
  spaceId: number | null = null;
  isLoading = false;
  isSaving = false;
  error = '';
  private ownerId: number | null = null;
  availableAttributes: AttributeInfo[] = [];

  // Expose Enum and Labels to template
  spaceTypes = Object.keys(spaceTypeLabels).map(key => ({
    value: Number(key),
    label: spaceTypeLabels[Number(key) as SpaceType]
  }));
  readonly daysOfWeek = [
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
    { value: 0, label: 'Sunday' }
  ];

  getDayLabel(dayOfWeek: number): string {
    return this.daysOfWeek.find((d) => d.value === dayOfWeek)?.label ?? 'Unknown day';
  }

  constructor(
    private fb: FormBuilder,
    private spacesApi: SpacesApiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.createForm();
    this.loadAttributes();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.spaceId = parseInt(id, 10);
        this.loadSpaceData();
      }
    });
  }

  createForm() {
    this.spaceForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.required],
      spaceType: [SpaceType.Desk, Validators.required],
      room: [''],
      capacity: [1, [Validators.required, Validators.min(1)]],
      areaSqm: [1, [Validators.required, Validators.min(1)]],
      hourlyRate: [0, [Validators.required, Validators.min(0)]],
      addressId: [0, Validators.required],
      building: ['', Validators.required],
      street: ['', Validators.required],
      city: [''],
      region: ['', Validators.required],
      imageUrl: [''],
      isAvailable: [true],
      workingHours: this.fb.array([]),
      attributeValues: this.fb.array([])
    });
  }

  loadSpaceData() {
    if (!this.spaceId) return;
    this.isLoading = true;

    this.spacesApi.getSpace(this.spaceId).subscribe({
      next: (space: any) => {
        this.ownerId = space.ownerId ?? null;
        this.spaceForm.patchValue({
          name: space.name,
          description: space.description,
          spaceType: space.spaceType,
          room: space.room,
          capacity: space.capacity,
          areaSqm: space.areaSqm,
          hourlyRate: space.hourlyRate,
          addressId: space.addressId,
          building: space.address?.building ?? '',
          street: space.address?.street ?? '',
          city: space.address?.city ?? '',
          region: space.address?.region ?? '',
          imageUrl: space.imageUrl,
          isAvailable: space.isAvailable
        });

        this.setWorkingHours(space.workingHours ?? []);
        this.setAttributeValues(space.attributeValues ?? []);
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Failed to load space', err);
        this.error = 'Failed to load space details.';
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.spaceForm.invalid) {
      Object.keys(this.spaceForm.controls).forEach(key => {
        this.spaceForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSaving = true;
    this.error = '';

    const request$ = this.isEditMode && this.spaceId
      ? this.spacesApi.updateSpace(this.spaceId, this.buildUpdatePayload())
      : this.spacesApi.createSpace(this.buildCreatePayload());

    (request$ as any).subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/owner/spaces']);
      },
      error: (err: any) => {
        console.error('Failed to save space', err);
        this.error = 'Failed to save space. Please check the form data and try again.';
        this.isSaving = false;
      }
    });
  }

  private buildUpdatePayload(): UpdateSpaceRequest {
    const formValue = this.spaceForm.value;
    return {
      name: formValue.name,
      description: formValue.description,
      spaceType: formValue.spaceType,
      room: formValue.room,
      capacity: formValue.capacity,
      areaSqm: formValue.areaSqm,
      hourlyRate: formValue.hourlyRate,
      addressId: formValue.addressId > 0 ? formValue.addressId : undefined,
      address: this.buildAddressPayload(),
      imageUrl: formValue.imageUrl,
      isAvailable: formValue.isAvailable,
      ownerId: this.ownerId ?? 0,
      workingHours: formValue.workingHours ?? [],
      attributeValues: this.buildAttributeValuesPayload(formValue.attributeValues ?? [])
    } as UpdateSpaceRequest;
  }

  private buildCreatePayload(): CreateSpaceRequest {
    const formValue = this.spaceForm.value;
    return {
      name: formValue.name,
      description: formValue.description,
      spaceType: formValue.spaceType,
      room: formValue.room,
      capacity: formValue.capacity,
      areaSqm: formValue.areaSqm,
      hourlyRate: formValue.hourlyRate,
      addressId: formValue.addressId > 0 ? formValue.addressId : undefined,
      address: this.buildAddressPayload(),
      imageUrl: formValue.imageUrl,
      isAvailable: formValue.isAvailable,
      createdAt: new Date().toISOString(),
      workingHours: formValue.workingHours ?? [],
      attributeValues: this.buildAttributeValuesPayload(formValue.attributeValues ?? [])
    } as CreateSpaceRequest;
  }

  private buildAddressPayload(): CreateSpaceAddressRequest {
    const formValue = this.spaceForm.value;
    return {
      building: formValue.building,
      street: formValue.street,
      city: formValue.city,
      region: formValue.region
    };
  }

  private buildAttributeValuesPayload(rawAttributeValues: any[]): AttributeValue[] {
    return rawAttributeValues
      .map((raw) => this.normalizeAttributeValue(raw))
      .filter((item): item is AttributeValue => item !== null);
  }

  private normalizeAttributeValue(raw: any): AttributeValue | null {
    const attributeId = Number(raw?.attributeId ?? 0);
    if (!attributeId) {
      return null;
    }

    const type = this.getAttributeTypeById(attributeId);
    const base: AttributeValue = {
      id: raw?.id && raw.id > 0 ? Number(raw.id) : undefined,
      attributeId
    };

    if (type === 'boolean') {
      const boolValue = String(raw?.value).toLowerCase() === 'true';
      return {
        ...base,
        value: boolValue ? 'true' : 'false'
      };
    }

    if (type === 'integer') {
      const min = this.tryParseInt(raw?.minValue);
      const max = this.tryParseInt(raw?.maxValue);
      if (min !== null && max !== null) {
        return {
          ...base,
          value: `${min}-${max}`,
          minValue: min,
          maxValue: max
        };
      }

      const numericValue = this.tryParseInt(raw?.value);
      if (numericValue === null) {
        return null;
      }

      return {
        ...base,
        value: numericValue.toString(),
        minValue: numericValue
      };
    }

    const textValue = String(raw?.value ?? '').trim();
    if (!textValue) {
      return null;
    }

    return {
      ...base,
      value: textValue
    };
  }

  private getAttributeTypeById(attributeId: number): string | null {
    const attribute = this.availableAttributes.find((item) => item.id === attributeId);
    return attribute?.dataType?.toLowerCase() ?? null;
  }

  private tryParseInt(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return null;
    }

    return Math.trunc(parsed);
  }

  private loadAttributes(): void {
    this.spacesApi.getAttributes().subscribe({
      next: (attributes) => {
        this.availableAttributes = attributes;
      },
      error: () => {
        this.availableAttributes = [];
      }
    });
  }

  get workingHoursControls(): FormArray {
    return this.spaceForm.get('workingHours') as FormArray;
  }

  get attributeValuesControls(): FormArray {
    return this.spaceForm.get('attributeValues') as FormArray;
  }

  addWorkingHour(): void {
    this.workingHoursControls.push(this.createWorkingHourGroup());
  }

  removeWorkingHour(index: number): void {
    this.workingHoursControls.removeAt(index);
  }

  addAttributeValue(): void {
    this.attributeValuesControls.push(this.createAttributeValueGroup());
  }

  removeAttributeValue(index: number): void {
    this.attributeValuesControls.removeAt(index);
  }

  onAttributeSelectionChange(index: number): void {
    const control = this.attributeValuesControls.at(index);
    const type = this.getAttributeTypeByIndex(index);
    if (!type) {
      return;
    }

    if (type === 'boolean') {
      control.patchValue({ value: 'false', minValue: null, maxValue: null });
      return;
    }

    if (type === 'integer') {
      control.patchValue({ value: null, minValue: null, maxValue: null });
      return;
    }

    control.patchValue({ minValue: null, maxValue: null });
  }

  getAttributeTypeByIndex(index: number): string | null {
    const attributeId = this.attributeValuesControls.at(index)?.get('attributeId')?.value;
    if (!attributeId || attributeId < 1) {
      return null;
    }

    const attribute = this.availableAttributes.find((item) => item.id === Number(attributeId));
    return attribute?.dataType?.toLowerCase() ?? null;
  }

  private setWorkingHours(workingHours: any[]): void {
    this.workingHoursControls.clear();
    workingHours.forEach((wh) => {
      this.workingHoursControls.push(this.createWorkingHourGroup(wh));
    });
  }

  private setAttributeValues(attributeValues: any[]): void {
    this.attributeValuesControls.clear();
    attributeValues.forEach((av) => {
      this.attributeValuesControls.push(this.createAttributeValueGroup(av));
    });
  }

  private createWorkingHourGroup(workingHour?: any): FormGroup {
    return this.fb.group({
      id: [workingHour?.id ?? 0],
      dayOfWeek: [workingHour?.dayOfWeek ?? 1, Validators.required],
      openTime: [workingHour?.openTime ?? '09:00', Validators.required],
      closeTime: [workingHour?.closeTime ?? '18:00', Validators.required],
      isClosed: [workingHour?.isClosed ?? false]
    });
  }

  private createAttributeValueGroup(attributeValue?: any): FormGroup {
    return this.fb.group({
      id: [attributeValue?.id ?? 0],
      spaceId: [attributeValue?.spaceId ?? 0],
      attributeId: [attributeValue?.attributeId ?? 0, [Validators.required, Validators.min(1)]],
      value: [attributeValue?.value ?? ''],
      minValue: [attributeValue?.minValue ?? null],
      maxValue: [attributeValue?.maxValue ?? null]
    });
  }
}
