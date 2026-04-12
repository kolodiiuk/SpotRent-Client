import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccessLogEntry } from '../models/access-log.model';

@Injectable({
  providedIn: 'root'
})
export class AccessLogService {
  private apiUrl = '/api/accesslogs';

  constructor(private http: HttpClient) {}

  getOwnerAccessLogs(): Observable<AccessLogEntry[]> {
    return this.http.get<AccessLogEntry[]>(`${this.apiUrl}/owner`);
  }
}
