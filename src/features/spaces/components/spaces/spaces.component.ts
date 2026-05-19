import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, map, Observable, of, shareReplay, tap } from 'rxjs';

import { SpaceListComponent } from './components/space-list/space-list.component';
import { SpaceFilterComponent } from './components/space-filter/space-filter.component';
import { Space } from '../../models/space.model';
import {SpacesApiService} from '../../services/spaces-api.service';
import {SpaceFilterParams} from "../../models/space-filter-params";
import {AsyncPipe} from '@angular/common';
import {LoaderComponent} from '../../../../app/shared/components/loader.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'spaces',
  standalone: true,
  imports: [SpaceListComponent, SpaceFilterComponent, AsyncPipe, LoaderComponent, TranslateModule],
  templateUrl: './spaces.component.html',
  styleUrl: './spaces.component.css'
})
export class SpacesComponent implements OnInit {
  spaces$: Observable<Space[]> = of([]);
  isLoading = true;
  error = '';
  currentFilters: SpaceFilterParams = { limit: 20, offset: 0 };
  totalItems = 0;
  private activeRequestId = 0;
  private lastFiltersSignature = '';

  constructor(private spacesApi: SpacesApiService) { }

  ngOnInit() {
    this.lastFiltersSignature = this.createFiltersSignature(this.currentFilters);
    this.loadSpaces();
  }

  loadSpaces() {
    const requestId = ++this.activeRequestId;
    this.isLoading = true;
    this.error = '';
    this.spaces$ = this.spacesApi.filterSpaces(this.currentFilters).pipe(
      tap((res) => {
        this.totalItems = res.totalItems;
      }),
      map((res) => res.items),
      catchError((err) => {
        if (err instanceof HttpErrorResponse && err.status === 0) {
          return of([]);
        }

        console.error('Failed to load spaces', err);
        this.error = 'SPACES_BROWSE.LOAD_ERROR';
        this.totalItems = 0;
        return of([]);
      }),
      finalize(() => {
        if (requestId === this.activeRequestId) {
          this.isLoading = false;
        }
      }),
      shareReplay(1)
    );
  }

  onFilterChanged(filters: SpaceFilterParams) {
    const nextFilters: SpaceFilterParams = {
      ...filters,
      limit: this.currentFilters.limit ?? 20,
      offset: 0
    };

    const nextSignature = this.createFiltersSignature(nextFilters);
    if (nextSignature === this.lastFiltersSignature) {
      return;
    }

    this.lastFiltersSignature = nextSignature;
    this.currentFilters = nextFilters;
    this.loadSpaces();
  }

  private createFiltersSignature(filters: SpaceFilterParams): string {
    const orderedEntries = Object.entries(filters).sort(([a], [b]) => a.localeCompare(b));
    return JSON.stringify(orderedEntries);
  }
}
