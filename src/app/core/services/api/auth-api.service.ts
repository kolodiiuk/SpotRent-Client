import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  phoneNumber: string | null;
  firstName: string;
  lastName: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  expiration: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {

  private readonly baseUrl = 'http://localhost:5271/api/auth';

  constructor(private http: HttpClient) {
  }

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, payload);
  }

  googleLogin(token: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/google-login`, { token });
  }

  register(payload: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/register`, payload);
  }

  logout(refreshToken: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/logout`, { refreshToken });
  }

  verify(): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/verify`, {});
  }

  refreshToken(refreshToken: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/refresh`, {
      refreshToken
    });
  }

  createAdmin(payload: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/create-admin`, payload);
  }

  createOwner(payload: RegisterRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/create-owner`, payload);
  }
}
