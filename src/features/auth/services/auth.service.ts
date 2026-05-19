import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap, catchError, finalize, tap } from 'rxjs';
import { AuthApiService } from './auth-api.service';
import { AuthStorageService } from './auth-storage.service';
import { User, UserRole } from '../../../app/models';

export interface RegisterPayload {
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  password: string
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly userSubject = new BehaviorSubject<User | null>(null);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new BehaviorSubject<unknown | null>(null);

  user$ = this.userSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  constructor(
    private api: AuthApiService,
    private storage: AuthStorageService
  ) {
    this.storage.sessionCleared$.subscribe(() => {
      this.userSubject.next(null);
    });

    this.initialize();
  }

  private initialize(): void {

    this.loadingSubject.next(true);

    this.api.refreshToken()
      .pipe(
        tap(response => {
          this.storage.setAccessToken(response.token);
          this.storage.setUser(response.user);
          this.userSubject.next(response.user);
        }),
        catchError(() => {
          this.storage.clearSession();
          this.userSubject.next(null);
          return of(null);
        }),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe();
  }

  isAuthenticated(): boolean {

    return this.storage.hasValidToken() && !!this.userSubject.value;
  }

  isLoading(): boolean {

    return this.loadingSubject.value;
  }

  login(email: string, password: string): Observable<void> {

    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.api.login({ email, password }).pipe(
      tap(response => {
        this.storage.setAccessToken(response.token);
        this.storage.setUser(response.user);
        this.userSubject.next(response.user);
      }),
      switchMap(() => of(void 0)),
      catchError(err => {
        this.errorSubject.next(err);
        throw err;
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  logout(): Observable<{ success: boolean; error?: unknown }> {

    this.loadingSubject.next(true);
console.log("heelfdksn");
    return this.api.logout().pipe(
      switchMap(() => of({ success: true })),
      catchError(error => {
        console.error('Logout error:', error);
        return of({ success: false, error });
      }),
      finalize(() => {
        this.storage.clearSession();
        this.userSubject.next(null);
        this.loadingSubject.next(false);
      })
    );
  }

  register(payload: RegisterPayload): Observable<void> {

    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.api.register(payload)
      .pipe(
        catchError(err => {
          this.errorSubject.next(err);
          throw err;
        }),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  getUserRole(): string {

    const user = this.userSubject.value;
    if (!user) {
      return '';
    }

    return UserRole[user.role];
  }

  updateUserState(user: User): void {

    this.storage.setUser(user);
    this.userSubject.next(user);
  }
}
