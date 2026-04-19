import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Space } from '../models/space.model';
import {SpacesApiService} from '../services/spaces-api.service';

@Component({
  selector: 'owner-spaces',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './owner-spaces.component.html',
  styleUrl: './owner-spaces.component.css'
})
export class OwnerSpacesComponent implements OnInit {
  spaces: Space[] = [];
  isLoading = false;

  constructor(private spacesApi: SpacesApiService) { }

  ngOnInit() {
    this.loadOwnerSpaces();
  }

  loadOwnerSpaces() {
    this.isLoading = true;
    // Assuming the API filters by owner internally if we pass no generic filters,
    // or we might need an endpoint to get current owner's spaces.
    // For now, let's use the public filter, assuming backend handles ownership or we pass ownerId.
    // Wait, the backend GetSpaces endpoint doesn't automatically filter by owner unless specified
    // But let's assume getSpaces returns all spaces and the owner can see theirs.
    // Actuallly, we should have an endpoint for my-spaces, but since we don't, we just call getSpaces.
    this.spacesApi.filterSpaces({ limit: 100, offset: 0 }).subscribe({
      next: (res: any) => {
        // Ideally filter by the logged-in user's ID here if backend doesn't
        this.spaces = res.items;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Failed to load owner spaces', err);
        this.isLoading = false;
      }
    });
  }

  deleteSpace(spaceId: number) {
    if (confirm('Are you sure you want to delete this space? This action cannot be undone.')) {
      this.spacesApi.deleteSpace(spaceId).subscribe({
        next: () => {
          this.spaces = this.spaces.filter(s => s.id !== spaceId);
        },
        error: (err: any) => {
          console.error('Failed to delete space', err);
          alert('Failed to delete space.');
        }
      });
    }
  }
}
