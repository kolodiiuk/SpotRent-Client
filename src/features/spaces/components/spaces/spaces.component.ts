import { Component, OnInit } from '@angular/core';
import { catchError, finalize, map, Observable, of, shareReplay, tap } from 'rxjs';

import { SpaceListComponent } from './components/space-list/space-list.component';
import { SpaceFilterComponent } from './components/space-filter/space-filter.component';
import { Space } from '../../models/space.model';
import {SpacesApiService} from '../../services/spaces-api.service';
import {SpaceFilterParams} from "../../models/space-filter-params";
import {AsyncPipe} from '@angular/common';
import {LoaderComponent} from '../../../../app/shared/components/loader.component';

@Component({
  selector: 'spaces',
  standalone: true,
  imports: [SpaceListComponent, SpaceFilterComponent, AsyncPipe, LoaderComponent],
  templateUrl: './spaces.component.html',
  styleUrl: './spaces.component.css'
})
export class SpacesComponent implements OnInit {
  spaces$!: Observable<Space[]>;
  isLoading = false;
  error = '';
  currentFilters: SpaceFilterParams = { limit: 20, offset: 0 };
  totalItems = 0;

  constructor(private spacesApi: SpacesApiService) { }

  ngOnInit() {
    this.loadSpaces();
  }

  loadSpaces() {
    this.isLoading = true;
    this.error = '';
    this.spaces$ = this.spacesApi.filterSpaces(this.currentFilters).pipe(
      tap((res) => {
        this.totalItems = res.totalItems;
      }),
      map((res) => res.items),
      catchError((err) => {
        console.error('Failed to load spaces', err);
        this.error = 'Failed to load spaces. Please try again.';
        this.totalItems = 0;
        return of([]);
      }),
      finalize(() => {
        this.isLoading = false;
      }),
      shareReplay(1)
    );
  }

  onFilterChanged(filters: any) {
    this.currentFilters = { ...this.currentFilters, ...filters };
    this.loadSpaces();
  }
}
