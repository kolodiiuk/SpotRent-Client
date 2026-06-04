import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { timer } from 'rxjs';
import { debounce, distinctUntilChanged, map } from 'rxjs/operators';
import { SpaceFilterParams } from '../../../../models/space-filter-params';
import { SpaceType } from '../../../../models/space-type';
import { TranslateModule } from '@ngx-translate/core';
import { StringSpaceTypePipe } from '../../../../../../app/shared/pipes';

@Component({
  selector: 'app-space-filter',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, StringSpaceTypePipe],
  templateUrl: './space-filter.component.html',
  styleUrl: './space-filter.component.css'
})
export class SpaceFilterComponent implements OnInit {
  private static readonly FILTERS_STORAGE_KEY = 'spaces.filters';
  private static readonly DEFAULT_FILTERS = {
    spaceType: null,
    city: '',
    minCapacity: null,
    maxCapacity: null,
    minAreaSqm: null,
    maxAreaSqm: null,
    minHourlyRate: null,
    maxHourlyRate: null,
    sort: ''
  };
  private static readonly RANGE_FILTER_KEYS = new Set([
    'minCapacity',
    'maxCapacity',
    'minAreaSqm',
    'maxAreaSqm',
    'minHourlyRate',
    'maxHourlyRate',
  ]);
  private lastRawFilters: Record<string, unknown> = {};
  @Output() filterChanged = new EventEmitter<SpaceFilterParams>();
  filterForm!: FormGroup;
  readonly spaceTypeOptions = Object.values(SpaceType).filter((value) => typeof value === 'number') as SpaceType[];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.filterForm = this.fb.group(SpaceFilterComponent.DEFAULT_FILTERS);

    const restored = this.readStoredFilters();
    const initialValues = this.buildInitialValues(restored);
    this.filterForm.patchValue(initialValues, { emitEvent: false });
    localStorage.setItem(
      SpaceFilterComponent.FILTERS_STORAGE_KEY,
      JSON.stringify(this.filterForm.getRawValue())
    );
    this.lastRawFilters = { ...this.filterForm.getRawValue() };
    this.filterChanged.emit(this.normalizeFilters(this.filterForm.getRawValue()));

    this.filterForm.valueChanges
      .pipe(
        debounce((value) => timer(this.resolveDebounceMs(value as Record<string, unknown>))),
        map((value) => this.normalizeFilters(value)),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
      )
      .subscribe((normalized) => {
        localStorage.setItem(
          SpaceFilterComponent.FILTERS_STORAGE_KEY,
          JSON.stringify(this.filterForm.getRawValue())
        );
        this.filterChanged.emit(normalized);
      });
  }

  private readStoredFilters(): Partial<Record<string, unknown>> | null {
    const saved = localStorage.getItem(SpaceFilterComponent.FILTERS_STORAGE_KEY);
    if (!saved) {
      return null;
    }

    try {
      const parsed = JSON.parse(saved);
      if (!parsed || typeof parsed !== 'object') {
        return null;
      }

      return parsed as Partial<Record<string, unknown>>;
    } catch {
      return null;
    }
  }

  private normalizeFilters(value: Record<string, unknown>): SpaceFilterParams {
    const normalized: SpaceFilterParams = {};
    Object.entries(value).forEach(([key, rawValue]) => {
      if (rawValue === null || rawValue === undefined) {
        return;
      }

      if (typeof rawValue === 'string') {
        const trimmed = rawValue.trim();
        if (trimmed.length === 0) {
          return;
        }
        (normalized as Record<string, unknown>)[key] = trimmed;
        return;
      }

      (normalized as Record<string, unknown>)[key] = rawValue;
    });

    return normalized;
  }

  private buildInitialValues(restored: Partial<Record<string, unknown>> | null): Record<string, unknown> {
    if (!restored) {
      return { ...SpaceFilterComponent.DEFAULT_FILTERS };
    }

    const merged: Record<string, unknown> = {
      ...SpaceFilterComponent.DEFAULT_FILTERS,
      ...restored
    };

    if (typeof merged['city'] !== 'string') {
      merged['city'] = '';
    }

    if (typeof merged['sort'] !== 'string' || !['', 'price-asc', 'price-desc', 'newest'].includes(<string>merged['sort'])) {
      merged['sort'] = '';
    }

    return merged;
  }

  private resolveDebounceMs(nextValue: Record<string, unknown>): number {
    const changedKeys = Object.keys(nextValue).filter(
      (key) => nextValue[key] !== this.lastRawFilters[key]
    );
    this.lastRawFilters = { ...nextValue };

    return changedKeys.some((key) => SpaceFilterComponent.RANGE_FILTER_KEYS.has(key)) ? 500 : 500;
  }
}
