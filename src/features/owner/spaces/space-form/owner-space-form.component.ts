import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SpacesApiService } from '../../../../app/core/services';
import { SpaceType, spaceTypeLabels } from '../../../../app/core/models/space.model';

@Component({
  selector: 'owner-space-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
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

  // Expose Enum and Labels to template
  spaceTypes = Object.keys(spaceTypeLabels).map(key => ({
    value: Number(key),
    label: spaceTypeLabels[Number(key) as SpaceType]
  }));

  constructor(
    private fb: FormBuilder,
    private spacesApi: SpacesApiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.createForm();

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
      addressId: [1, Validators.required], // Hardcoded for simplicity during demo unless an autocomplete is added
      imageUrl: [''],
      isAvailable: [true]
    });
  }

  loadSpaceData() {
    if (!this.spaceId) return;
    this.isLoading = true;

    this.spacesApi.getSpace(this.spaceId).subscribe({
      next: (space: any) => {
        this.spaceForm.patchValue({
          name: space.name,
          description: space.description,
          spaceType: space.spaceType,
          room: space.room,
          capacity: space.capacity,
          areaSqm: space.areaSqm,
          hourlyRate: space.hourlyRate,
          addressId: space.addressId,
          imageUrl: space.imageUrl,
          isAvailable: space.isAvailable
        });
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
    const payload = this.spaceForm.value;

    const request$ = this.isEditMode && this.spaceId
      ? this.spacesApi.updateSpace(this.spaceId, payload)
      : this.spacesApi.createSpace(payload);

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
}
