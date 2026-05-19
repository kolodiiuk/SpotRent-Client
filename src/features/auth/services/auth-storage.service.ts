import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthStorageService {
  private accessToken: string | null = null;
  private user: unknown | null = null;
  private readonly sessionClearedSubject = new Subject<void>();
  readonly sessionCleared$: Observable<void> = this.sessionClearedSubject.asObservable();

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  clearSession(): void {
    this.accessToken = null;
    this.user = null;
    this.sessionClearedSubject.next();
  }

  setUser(user: unknown): void {
    this.user = user;
  }

  getStoredUser<T>(): T | null {
    return (this.user as T) ?? null;
  }

  clearUser(): void {
    this.user = null;
  }

  hasValidToken(): boolean {
    const token = this.getAccessToken();
    if (!token) {
      return false;
    }

    const payload = this.getPayload(token);
    if (!payload) {
      return false;
    }

    const exp = Number(payload['exp']);
    if (!Number.isFinite(exp)) {
      return false;
    }

    return exp * 1000 > Date.now();
  }

  private getPayload(token: string): Record<string, unknown> | null {
    try {
      const parts = token.split('.');
      if (parts.length < 2) {
        return null;
      }

      const base64Url = parts[1];
      const base64 = base64Url
        .replace(/-/g, '+')
        .replace(/_/g, '/')
        .padEnd(base64Url.length + ((4 - (base64Url.length % 4)) % 4), '=');
      return JSON.parse(atob(base64)) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
}
