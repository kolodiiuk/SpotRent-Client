import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Space } from '../models/space.model';
import {SpacesApiService} from '../services/spaces-api.service';
import {AuthService} from '../../auth/services/auth.service';
import {AuthStorageService} from '../../auth/services/auth-storage.service';
import {User} from '../../auth/models/user.model';
import {PagedSpacesResponse} from '../models/paged-spaces-response';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';

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
  isLoading = false;
  authService = inject(AuthService);
  cdr = inject(ChangeDetectorRef);
  constructor(private spacesApi: SpacesApiService) { }

  ngOnInit() {
    this.loadOwnerSpaces();
  }

  loadOwnerSpaces() {
    this.isLoading = true;
    let owner = -1;
    //todo: fix shit
    this.authService.user$.subscribe({
      next: (user: User | null) => {
        owner = user == null ? -1 : user.id;
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('No user');
      }
    });
    this.spacesApi.filterSpaces({ limit: 100, offset: 0 }).subscribe({
      next: (res: PagedSpacesResponse) => {
        this.spaces = res.items.filter(item => item.ownerId === owner);
        this.isLoading = false;
        this.cdr.detectChanges();
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
