import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { finalize, take } from 'rxjs';

import {SpacesApiService} from '../../../../services/spaces-api.service';
import {SpaceSchedule} from "../../../../models/space-schedule";

@Component({
  selector: 'app-space-availability',
  standalone: true,
  imports: [],
  templateUrl: './space-availability.component.html',
  styleUrl: './space-availability.component.css'
})
export class SpaceAvailabilityComponent implements OnInit, OnChanges {
  @Input() spaceId!: number;
  schedule: SpaceSchedule | null = null;
  isLoading = false;
  error = '';

  constructor(private spacesApi: SpacesApiService) { }

  ngOnInit() {
    if (this.spaceId) {
      this.loadSchedule();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['spaceId'] && !changes['spaceId'].isFirstChange()) {
      this.loadSchedule();
    }
  }

  loadSchedule() {
    this.isLoading = true;
    this.error = '';

    // Default load next 7 days
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 7);

    this.spacesApi.getSpaceSchedule(this.spaceId, start.toISOString(), end.toISOString())
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (res) => {
          this.schedule = res;
        },
        error: (err) => {
          console.error('Failed to load schedule', err);
          this.error = 'Failed to load availability schedule.';
          this.schedule = null;
        }
      });
  }

  formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  }
}
