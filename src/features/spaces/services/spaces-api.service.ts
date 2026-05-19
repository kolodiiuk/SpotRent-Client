import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Space
} from '../models/space.model';
import {environment} from '../../../environments/environment';
import {SpaceFilterParams} from '../models/space-filter-params';
import {UpdateSpaceRequest} from '../models/update-space-request';
import {CreateSpaceRequest} from '../models/create-space-request';
import {SpaceSchedule} from '../models/space-schedule';
import {SpaceAvailabilityQuery} from '../models/space-availability-query';
import {PagedSpacesResponse} from '../models/paged-spaces-response';

@Injectable({
  providedIn: 'root'
})
export class SpacesApiService {
  private readonly baseUrl = `${environment.serverApiUrl}/spaces`;

  constructor(private http: HttpClient) { }

  createSpace(payload: CreateSpaceRequest): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(this.baseUrl, payload);
  }

  filterSpaces(filters: SpaceFilterParams): Observable<PagedSpacesResponse> {
    let params = new HttpParams();
    const safeFilters = { ...filters } as Record<string, unknown>;
    delete safeFilters['attributes'];

    Object.entries(safeFilters).forEach(([key, value]) => {
      if (value != null) {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<PagedSpacesResponse>(this.baseUrl, { params });
  }

  getSpace(id: number): Observable<Space> {
    return this.http.get<Space>(`${this.baseUrl}/${id}`);
  }

  getAvailableSpaces(query: SpaceAvailabilityQuery): Observable<Space[]> {
    let params = new HttpParams()
      .set('startTime', query.startTime)
      .set('endTime', query.endTime)
      .set('city', query.city);

    return this.http.get<Space[]>(`${this.baseUrl}/available`, { params });
  }

  getSpaceSchedule(id: number, startDate?: string, endDate?: string): Observable<SpaceSchedule> {
    let params = new HttpParams();
    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (endDate) {
      params = params.set('endDate', endDate);
    }

    return this.http.get<SpaceSchedule>(`${this.baseUrl}/${id}/schedule`, { params });
  }

  updateSpace(id: number, payload: UpdateSpaceRequest): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}`, payload);
  }

  deleteSpace(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
