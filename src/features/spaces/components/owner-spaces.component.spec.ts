import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { OwnerSpacesComponent } from './owner-spaces.component';
import { SpacesApiService } from '../services/spaces-api.service';
import { Space } from '../models/space.model';
import { SpaceType } from '../models/space-type';

describe('OwnerSpacesComponent', () => {
  let fixture: ComponentFixture<OwnerSpacesComponent>;
  let component: OwnerSpacesComponent;
  let spacesApi: { getOwnerSpaces: ReturnType<typeof vi.fn>; deleteSpace: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    spacesApi = {
      getOwnerSpaces: vi.fn(),
      deleteSpace: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [OwnerSpacesComponent],
      providers: [
        provideRouter([]),
        { provide: SpacesApiService, useValue: spacesApi }
      ]
    }).compileComponents();
  });

  it('loads owner spaces successfully', () => {
    spacesApi.getOwnerSpaces.mockReturnValue(of([createSpace(11, 'Main Desk')]));

    fixture = TestBed.createComponent(OwnerSpacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(spacesApi.getOwnerSpaces).toHaveBeenCalledTimes(1);
    expect(component.loadState).toBe('success');
    expect(component.spaces).toHaveLength(1);
    expect(fixture.nativeElement.textContent).toContain('Main Desk');
  });

  it('shows empty state when owner has no spaces', () => {
    spacesApi.getOwnerSpaces.mockReturnValue(of([]));

    fixture = TestBed.createComponent(OwnerSpacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.loadState).toBe('empty');
    expect(component.spaces).toEqual([]);
    expect(fixture.nativeElement.textContent).toContain('No spaces created yet');
  });

  it('shows error state when owner spaces request fails', () => {
    spacesApi.getOwnerSpaces.mockReturnValue(throwError(() => new Error('boom')));

    fixture = TestBed.createComponent(OwnerSpacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.loadState).toBe('error');
    expect(component.errorMessage).toBe('Failed to load your spaces. Please try again.');
    expect(fixture.nativeElement.textContent).toContain('Could not load spaces');
  });

  function createSpace(id: number, name: string): Space {
    return {
      id,
      name,
      description: 'desc',
      spaceType: SpaceType.Desk,
      capacity: 4,
      areaSqm: 12,
      hourlyRate: 20,
      addressId: 1,
      isAvailable: true,
      createdAt: '2026-01-01T10:00:00Z',
      ownerId: 99,
      ownerDto: null,
      workingHours: []
    };
  }
});
