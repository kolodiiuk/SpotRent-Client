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

    this.initialize();
  }

  private initialize(): void {

    const token = this.storage.getAccessToken();
    const storedUser = this.storage.getStoredUser<User>();

    if (!token) {
      this.userSubject.next(storedUser);
      return;
    }

    this.loadingSubject.next(true);

    this.api.verify()
      .pipe(
        tap(user => {
          this.userSubject.next(user);
          this.storage.setUser(user);
        }),
        catchError(err => {
          this.userSubject.next(storedUser);
          this.errorSubject.next(err);
          return of(null);
        }),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe();
  }

  isAuthenticated(): boolean {

    return !!this.userSubject.value;
  }

  login(email: string, password: string): Observable<void> {

    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.api.login({ email, password }).pipe(
      tap(response => {
        this.storage.setTokens(response.token, response.refreshToken);
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

    const refreshToken = this.storage.getRefreshToken();

    return (refreshToken
      ? this.api.logout(refreshToken).pipe(
        switchMap(() => of({ success: true }))
      )
      : of({ success: true })
    ).pipe(
      catchError(error => {
        console.error('Logout error:', error);
        return of({ success: false, error });
      }),
      finalize(() => {
        this.storage.clearTokens();
        this.storage.clearUser();
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

    this.userSubject.next(user);
  }
}
