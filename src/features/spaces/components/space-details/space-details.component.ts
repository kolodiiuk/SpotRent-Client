import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, RouterModule } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Observable, catchError, distinctUntilChanged, filter, finalize, map, of, shareReplay, switchMap, tap } from 'rxjs';
import { Space } from '../../models/space.model';
import { SpaceAvailabilityComponent } from './components/space-availability/space-availability.component';
import {SpacesApiService} from '../../services/spaces-api.service';
import {spaceTypeLabels} from "../../models/space-type-labels";

@Component({
  selector: 'space-details',
  standalone: true,
  imports: [RouterModule, SpaceAvailabilityComponent, AsyncPipe],
  templateUrl: './space-details.component.html',
  styleUrl: './space-details.component.css'
})
export class SpaceDetailsComponent implements OnInit {
  spaceId!: number;
  space$!: Observable<Space | null>;
  isLoading = false;
  error = '';
  spaceTypeLabels = spaceTypeLabels;

  constructor(
    private route: ActivatedRoute,
    private spacesApi: SpacesApiService
  ) { }

  ngOnInit() {
    this.space$ = this.route.paramMap.pipe(
      map(params => Number(params.get('id'))),
      filter(id => Number.isInteger(id) && id > 0),
      distinctUntilChanged(),
      tap((id) => {
        this.spaceId = id;
      }),
      switchMap(id => {
        this.isLoading = true;
        this.error = '';

        return this.spacesApi.getSpace(id).pipe(
          catchError((err) => {
            console.error('Failed to load space details', err);
            this.error = 'Failed to load space details. Please try again.';
            return of(null);
          }),
          finalize(() => {
            this.isLoading = false;
          })
        );
      }),
      shareReplay(1)
    );
  }
}
