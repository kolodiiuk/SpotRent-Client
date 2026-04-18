import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Space,
  CreateSpaceRequest,
  UpdateSpaceRequest,
  SpaceFilterParams,
  PagedSpacesResponse,
  SpaceSchedule,
  SpaceAvailabilityQuery
} from '../models/space.model';

@Injectable({
  providedIn: 'root'
})
export class SpacesApiService {
  private readonly baseUrl = 'http://localhost:5271/api/spaces';

  constructor(private http: HttpClient) { }

  createSpace(payload: CreateSpaceRequest): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(this.baseUrl, payload);
  }

  getSpaces(filters: SpaceFilterParams): Observable<PagedSpacesResponse> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
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
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<SpaceSchedule>(`${this.baseUrl}/${id}/schedule`, { params });
  }

  updateSpace(id: number, payload: UpdateSpaceRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, payload);
  }

  deleteSpace(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
