import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccessLogEntry } from '../models/access-log.model';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccessLogService {
  private apiUrl = `${environment.serverApiUrl}/access-log`;

  constructor(private http: HttpClient) {}

  getOwnerAccessLogs(): Observable<AccessLogEntry[]> {
    return this.http.get<AccessLogEntry[]>(`${this.apiUrl}/owner`);
  }

  getSpaceAccessLogs(id: number) : Observable<AccessLogEntry[]> {
    return this.http.get<AccessLogEntry[]>(`${this.apiUrl}/space/${id}`);
  }

  // ???
  getOwnerLogs(ownerId: number) : Observable<AccessLogEntry[]> {
    return this.http.get<AccessLogEntry[]>(`${this.apiUrl}/owner/${ownerId}`);
  }

  getUserAccessLogs(userId: number) : Observable<AccessLogEntry[]> {
    return this.http.get<AccessLogEntry[]>(`${this.apiUrl}/user/${userId}`);
  }

  getLogById(id: number) : Observable<AccessLogEntry> {
    return this.http.get<AccessLogEntry>(`${this.apiUrl}/${id}`);
  }
}
