import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpaceListComponent } from './components/space-list/space-list.component';
import { SpaceFilterComponent } from './components/space-filter/space-filter.component';
import { SpacesApiService } from '../../../app/core/services';
import { Space, SpaceFilterParams } from '../../../app/core/models/space.model';

@Component({
  selector: 'spaces',
  standalone: true,
  imports: [CommonModule, SpaceListComponent, SpaceFilterComponent],
  templateUrl: './spaces.component.html',
  styleUrl: './spaces.component.css'
})
export class SpacesComponent implements OnInit {
  spaces: Space[] = [];
  isLoading = false;
  currentFilters: SpaceFilterParams = { limit: 20, offset: 0 };
  totalItems = 0;

  constructor(private spacesApi: SpacesApiService) { }

  ngOnInit() {
    this.loadSpaces();
  }

  loadSpaces() {
    this.isLoading = true;
    this.spacesApi.getSpaces(this.currentFilters).subscribe({
      next: (res) => {
        this.spaces = res.items;
        this.totalItems = res.totalItems;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load spaces', err);
        this.isLoading = false;
      }
    });
  }

  onFilterChanged(filters: any) {
    this.currentFilters = { ...this.currentFilters, ...filters };
    this.loadSpaces();
  }
}
