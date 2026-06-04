import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Space } from '../models/space.model';
import { SpacesApiService } from '../services/spaces-api.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';
import { catchError, of, tap } from 'rxjs';

type OwnerSpacesLoadState = 'loading' | 'success' | 'empty' | 'error';

@Component({
  selector: 'owner-spaces',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './owner-spaces.component.html',
  styleUrl: './owner-spaces.component.css'
})
export class OwnerSpacesComponent implements OnInit {
  readonly faBuilding = faBuilding;
  spaces: Space[] = [];
  loadState: OwnerSpacesLoadState = 'loading';
  errorMessage: string | null = null;

  constructor(private spacesApi: SpacesApiService) { }

  get isLoading(): boolean {
    return this.loadState === 'loading';
  }

  ngOnInit(): void {
    this.loadOwnerSpaces();
  }

  loadOwnerSpaces(): void {
    this.loadState = 'loading';
    this.errorMessage = null;

    this.spacesApi.getOwnerSpaces().pipe(
      tap((spaces) => {
        this.spaces = spaces;
        this.loadState = spaces.length > 0 ? 'success' : 'empty';
      }),
      catchError((err: unknown) => {
        console.error('Failed to load owner spaces', err);
        this.spaces = [];
        this.errorMessage = 'Failed to load your spaces. Please try again.';
        this.loadState = 'error';
        return of([]);
      })
    ).subscribe();
  }

  deleteSpace(spaceId: number): void {
    if (confirm('Are you sure you want to delete this space? This action cannot be undone.')) {
      this.spacesApi.deleteSpace(spaceId).subscribe({
        next: () => {
          this.spaces = this.spaces.filter(s => s.id !== spaceId);
          if (this.spaces.length === 0) {
            this.loadState = 'empty';
          }
        },
        error: (err: any) => {
          console.error('Failed to delete space', err);
          alert('Failed to delete space.');
        }
      });
    }
  }
}
