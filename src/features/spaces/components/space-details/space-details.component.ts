import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Space, spaceTypeLabels } from '../../models/space.model';
import { SpaceAvailabilityComponent } from './components/space-availability/space-availability.component';
import {SpacesApiService} from '../../services/spaces-api.service';

@Component({
  selector: 'space-details',
  standalone: true,
  imports: [CommonModule, RouterModule, SpaceAvailabilityComponent],
  templateUrl: './space-details.component.html',
  styleUrl: './space-details.component.css'
})
export class SpaceDetailsComponent implements OnInit {
  spaceId!: number;
  space: Space | null = null;
  isLoading = false;
  error = '';
  spaceTypeLabels = spaceTypeLabels;

  constructor(
    private route: ActivatedRoute,
    private spacesApi: SpacesApiService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      if (idStr) {
        this.spaceId = parseInt(idStr, 10);
        this.loadSpace();
      }
    });
  }

  loadSpace() {
    this.isLoading = true;
    this.error = '';
    this.spacesApi.getSpace(this.spaceId).subscribe({
      next: (res) => {
        this.space = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load space details', err);
        this.error = 'Failed to load space details. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
