import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, RouterModule } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Observable, catchError, distinctUntilChanged, filter, finalize, map, of, shareReplay, switchMap, tap } from 'rxjs';
import { Space } from '../../models/space.model';
import { SpaceAvailabilityComponent } from './components/space-availability/space-availability.component';
import {SpacesApiService} from '../../services/spaces-api.service';
import { TranslateModule } from '@ngx-translate/core';
import { StringSpaceTypePipe } from '../../../../app/shared/pipes/string-space-type.pipe';
import { AttributeValue } from '../../models/attribute-value';
import { LocalBooleanPipe } from '../../../../app/shared/pipes/local-boolean.pipe';
import { LocalDatePipe } from '../../../../app/shared/pipes';
import { BookingFormComponent } from '../../../bookings/components/booking-form/booking-form.component';

@Component({
  selector: 'space-details',
  standalone: true,
  imports: [RouterModule, SpaceAvailabilityComponent, AsyncPipe, TranslateModule, StringSpaceTypePipe, LocalBooleanPipe, LocalDatePipe, BookingFormComponent],
  templateUrl: './space-details.component.html',
  styleUrl: './space-details.component.css'
})
export class SpaceDetailsComponent implements OnInit {
  spaceId!: number;
  space$!: Observable<Space | null>;
  isLoading = false;
  errorKey = '';
  showBookingForm = false;

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
        this.showBookingForm = false;
      }),
      switchMap(id => {
        this.isLoading = true;
        this.errorKey = '';

        return this.spacesApi.getSpace(id).pipe(
          catchError((err) => {
            console.error('Failed to load space details', err);
            this.errorKey = 'SPACE_DETAILS.LOAD_ERROR';
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

  getAddress(space: Space): string {
    const address = space.address;
    if (!address) {
      return '';
    }

    return [address.region, address.city, address.street, address.building]
      .filter((part) => !!part)
      .join(', ');
  }

  getAttributeValue(attributeId: number, values: AttributeValue[] | undefined): string {
    const value = values?.find((item) => item.attributeId === attributeId);
    if (!value) {
      return '';
    }

    if (value.value) {
      return value.value;
    }

    if (value.minValue != null && value.maxValue != null) {
      return `${value.minValue} - ${value.maxValue}`;
    }

    if (value.minValue != null) {
      return `${value.minValue}`;
    }

    if (value.maxValue != null) {
      return `${value.maxValue}`;
    }

    return '';
  }

  getOwnerName(space: Space): string {
    if (!space.ownerDto) {
      return '';
    }

    return `${space.ownerDto.firstName} ${space.ownerDto.lastName}`.trim();
  }

  openBookingForm(): void {
    this.showBookingForm = true;
  }
}
